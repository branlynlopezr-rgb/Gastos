import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { CreateTransactionInput, Transaction } from '../../src/types/transaction.js'
import type { DbAdapter } from './types.js'

function getSupabaseEnv() {
  const url = process.env.link ?? process.env.SUPABASE_URL
  const serviceKey = process.env.service_role ?? process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'Faltan variables link y service_role en Vercel (Supabase).',
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

let client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!client) {
    const { url, serviceKey } = getSupabaseEnv()
    client = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return client
}

export function hasSupabaseCredentials(): boolean {
  const url = process.env.link ?? process.env.SUPABASE_URL
  const serviceKey = process.env.service_role ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  return Boolean(url && serviceKey)
}

export async function createSupabaseDb(): Promise<DbAdapter> {
  const supabase = getClient()

  return {
    async getAllTransactions() {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .order('id', { ascending: false })

      if (error) throw new Error(`Supabase: ${error.message}`)
      return (data ?? []).map((row) => mapRow(row as Record<string, unknown>))
    },

    async getTransactionById(id: number) {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) throw new Error(`Supabase: ${error.message}`)
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

      if (error) throw new Error(`Supabase: ${error.message}`)
      return mapRow(data as Record<string, unknown>)
    },

    async deleteTransaction(id: number) {
      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (error) throw new Error(`Supabase: ${error.message}`)
      return true
    },

    async clearAllTransactions() {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .neq('id', 0)

      if (error) throw new Error(`Supabase: ${error.message}`)
    },
  }
}
