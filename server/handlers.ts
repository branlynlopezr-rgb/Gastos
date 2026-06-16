import type { CreateTransactionInput } from '../../src/types/transaction.js'
import { buildDashboardSummary } from '../dashboard.js'
import { getDb } from '../db/index.js'

export async function getHealth() {
  return { ok: true, message: 'API Gastos - VitalHood activa' }
}

export async function getTransactions() {
  const db = await getDb()
  return db.getAllTransactions()
}

export async function getDashboard() {
  const db = await getDb()
  const transactions = await db.getAllTransactions()
  return buildDashboardSummary(transactions)
}

export async function createTransaction(body: Partial<CreateTransactionInput>) {
  if (!body.type || !['expense', 'income'].includes(body.type)) {
    throw new HttpError(400, 'Tipo inválido. Use "expense" o "income".')
  }
  if (!body.amount || body.amount <= 0) {
    throw new HttpError(400, 'El monto debe ser mayor a 0.')
  }
  if (!body.description?.trim()) {
    throw new HttpError(400, 'La descripción es obligatoria.')
  }
  if (!body.date) {
    throw new HttpError(400, 'La fecha es obligatoria.')
  }

  const db = await getDb()
  return db.createTransaction({
    type: body.type,
    amount: Number(body.amount),
    description: body.description.trim(),
    category: body.category?.trim() || 'General',
    date: body.date,
  })
}

export async function deleteTransactionById(id: number) {
  const db = await getDb()
  const existing = await db.getTransactionById(id)
  if (!existing) {
    throw new HttpError(404, 'Transacción no encontrada.')
  }
  await db.deleteTransaction(id)
  return { ok: true }
}

export async function clearAllTransactions() {
  const db = await getDb()
  await db.clearAllTransactions()
  return { ok: true, message: 'Base de datos limpiada' }
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}
