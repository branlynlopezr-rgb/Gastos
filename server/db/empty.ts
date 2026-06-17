import type { CreateTransactionInput } from '../../src/types/transaction.js'
import { hasSupabaseCredentials } from './env.js'
import type { DbAdapter } from './types.js'

export { hasSupabaseCredentials } from './env.js'

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
        'Base de datos no configurada. Agrega Link y service_role (Supabase) en Vercel y haz Redeploy.',
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

