import { createClient } from '@supabase/supabase-js'
import type { CreateTransactionInput, Transaction } from '../../src/types/transaction.js'
import {
  getSupabaseServiceRole,
  getSupabaseUrl,
} from './env.js'
import type { DbAdapter } from './types.js'

export { hasSupabaseCredentials } from './env.js'

export function getSupabaseConfig() {
  const url = getSupabaseUrl()
  const serviceKey = getSupabaseServiceRole()

  if (!url || !serviceKey) {
    throw new Error(
      'Faltan variables Link y service_role en Vercel. Revisa Settings → Environment Variables y haz Redeploy.',
    )
  }

  if (!url.startsWith('https://') || !url.includes('supabase')) {
    throw new Error(
      `Link debe ser la Project URL de Supabase (https://xxx.supabase.co). Valor actual empieza con: ${url.slice(0, 30)}...`,
    )
  }

  if (!serviceKey.startsWith('eyJ')) {
    throw new Error(
      'service_role debe ser la clave JWT service_role de Supabase (empieza con eyJ...). ¿Pegaste la contraseña de la BD por error?',
    )
  }

  return { url, serviceKey }
}

function mapRow(row: Record<string, unknown>): Transaction {
  const date = String(row.date)
  const createdAt = String(row.created_at)

  return {
    id: Number(row.id),
    type: row.type as Transaction['type'],
    amount: Number(row.amount),
    description: String(row.description),
    category: String(row.category),
    date: date.includes('T') ? date.slice(0, 10) : date,
    created_at: createdAt,
  }
}

export async function pingSupabase(): Promise<{ ok: boolean; detail?: string }> {
  try {
    const { url, serviceKey } = getSupabaseConfig()
    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { count, error } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })

    if (error) {
      if (
        error.message.includes('does not exist') ||
        error.message.includes('schema cache')
      ) {
        return {
          ok: false,
          detail:
            'La tabla transactions no existe. Ejecuta supabase/schema.sql en el SQL Editor de Supabase.',
        }
      }
      return { ok: false, detail: error.message }
    }

    return { ok: true, detail: `Conectado. Movimientos: ${count ?? 0}` }
  } catch (err) {
    return {
      ok: false,
      detail: err instanceof Error ? err.message : 'Error de conexión',
    }
  }
}

export async function createSupabaseDb(): Promise<DbAdapter> {
  const { url, serviceKey } = getSupabaseConfig()
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  return {
    async getAllTransactions() {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .order('id', { ascending: false })

      if (error) throw new Error(formatSupabaseError(error.message))
      return (data ?? []).map((row) => mapRow(row as Record<string, unknown>))
    },

    async getTransactionById(id: number) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) throw new Error(formatSupabaseError(error.message))
      return data ? mapRow(data as Record<string, unknown>) : undefined
    },

    async createTransaction(input: CreateTransactionInput) {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          type: input.type,
          amount: input.amount,
          description: input.description,
          category: input.category,
          date: input.date,
        })
        .select('*')
        .single()

      if (error) throw new Error(formatSupabaseError(error.message))
      return mapRow(data as Record<string, unknown>)
    },

    async deleteTransaction(id: number) {
      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (error) throw new Error(formatSupabaseError(error.message))
      return true
    },

    async clearAllTransactions() {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .neq('id', 0)

      if (error) throw new Error(formatSupabaseError(error.message))
    },
  }
}

function formatSupabaseError(message: string): string {
  if (message.includes('does not exist') || message.includes('schema cache')) {
    return 'Tabla transactions no existe. Ejecuta el SQL de supabase/schema.sql en Supabase.'
  }
  if (message.includes('Invalid API key') || message.includes('JWT')) {
    return 'Clave service_role inválida. Copia la service_role key desde Supabase → Settings → API.'
  }
  return `Supabase: ${message}`
}
