import type { CreateTransactionInput, Transaction } from '../../src/types/transaction.js'

export interface DbAdapter {
  getAllTransactions(): Promise<Transaction[]>
  getTransactionById(id: number): Promise<Transaction | undefined>
  createTransaction(input: CreateTransactionInput): Promise<Transaction>
  deleteTransaction(id: number): Promise<boolean>
  clearAllTransactions(): Promise<void>
}

export function rowToTransaction(row: Record<string, unknown>): Transaction {
  return {
    id: Number(row.id),
    type: row.type as Transaction['type'],
    amount: Number(row.amount),
    description: String(row.description),
    category: String(row.category),
    date: String(row.date),
    created_at: String(row.created_at),
  }
}
