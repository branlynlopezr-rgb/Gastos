import { createClient } from '@libsql/client'
import type { CreateTransactionInput, Transaction } from '../../src/types/transaction.js'
import { CREATE_TRANSACTIONS_TABLE } from './schema.js'
import { type DbAdapter, rowToTransaction } from './types.js'

export async function createTursoDb(): Promise<DbAdapter> {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url || !authToken) {
    throw new Error(
      'Faltan TURSO_DATABASE_URL y TURSO_AUTH_TOKEN en las variables de entorno.',
    )
  }

  const client = createClient({ url, authToken })
  await client.execute(CREATE_TRANSACTIONS_TABLE)

  return {
    async getAllTransactions() {
      const result = await client.execute(
        'SELECT * FROM transactions ORDER BY date DESC, id DESC',
      )
      return result.rows.map((row) =>
        rowToTransaction(row as unknown as Record<string, unknown>),
      )
    },

    async getTransactionById(id: number) {
      const result = await client.execute({
        sql: 'SELECT * FROM transactions WHERE id = ?',
        args: [id],
      })
      const row = result.rows[0]
      return row
        ? rowToTransaction(row as unknown as Record<string, unknown>)
        : undefined
    },

    async createTransaction(input: CreateTransactionInput) {
      const result = await client.execute({
        sql: `INSERT INTO transactions (type, amount, description, category, date)
              VALUES (?, ?, ?, ?, ?)
              RETURNING *`,
        args: [
          input.type,
          input.amount,
          input.description,
          input.category,
          input.date,
        ],
      })
      return rowToTransaction(
        result.rows[0] as unknown as Record<string, unknown>,
      )
    },

    async deleteTransaction(id: number) {
      await client.execute({
        sql: 'DELETE FROM transactions WHERE id = ?',
        args: [id],
      })
      return true
    },

    async clearAllTransactions() {
      await client.execute('DELETE FROM transactions')
    },
  }
}
