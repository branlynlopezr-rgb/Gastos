import type { CreateTransactionInput } from '../../src/types/transaction.js'
import type { DbAdapter } from './types.js'

/** Solo lectura vacía cuando no hay BD configurada en Vercel */
export function createEmptyDb(): DbAdapter {
  return {
    async getAllTransactions() {
      return []
    },
    async getTransactionById() {
      return undefined
    },
    async createTransaction(_input: CreateTransactionInput) {
      throw new Error(
        'Base de datos no configurada. Agrega link y service_role (Supabase) en Vercel y haz Redeploy.',
      )
    },
    async deleteTransaction() {
      throw new Error('Base de datos no configurada en Vercel.')
    },
    async clearAllTransactions() {
      throw new Error('Base de datos no configurada en Vercel.')
    },
  }
}

export function hasSupabaseCredentials(): boolean {
  const url = process.env.link?.trim() ?? process.env.SUPABASE_URL?.trim()
  const key =
    process.env.service_role?.trim() ??
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  return Boolean(url && key)
}
