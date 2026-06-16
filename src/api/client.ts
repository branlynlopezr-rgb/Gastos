import type {
  CreateTransactionInput,
  DashboardSummary,
  Transaction,
} from '@/types/transaction'

const API = '/api'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Error ${res.status}`)
  }

  return res.json()
}

export const api = {
  getDashboard: () => request<DashboardSummary>('/dashboard'),
  getTransactions: () => request<Transaction[]>('/transactions'),
  createTransaction: (data: CreateTransactionInput) =>
    request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  clearAllTransactions: () =>
    request<{ ok: boolean }>('/transactions', { method: 'DELETE' }),
  deleteTransaction: (id: number) =>
    request<{ ok: boolean }>(`/transactions/${id}`, { method: 'DELETE' }),
}
