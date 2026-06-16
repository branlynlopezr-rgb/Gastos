import type { CreateTransactionInput, Transaction } from '../../src/types/transaction.js'
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
        'Base de datos no configurada. Agrega TURSO_DATABASE_URL y TURSO_AUTH_TOKEN en Vercel → Settings → Environment Variables.',
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

export function hasTursoCredentials(): boolean {
  const url = process.env.TURSO_DATABASE_URL
  if (!url) return false
  if (url.startsWith('libsql://') || url.startsWith('https://')) {
    return Boolean(process.env.TURSO_AUTH_TOKEN)
  }
  return true
}
