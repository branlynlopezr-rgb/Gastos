export type TransactionType = 'expense' | 'income'

export interface Transaction {
  id: number
  type: TransactionType
  amount: number
  description: string
  category: string
  date: string
  created_at: string
}

export interface CreateTransactionInput {
  type: TransactionType
  amount: number
  description: string
  category: string
  date: string
}

export interface DashboardSummary {
  balance: number
  balanceChangePercent?: number
  totalIncome: number
  totalExpense: number
  netRevenue: number
  earnings: number
  spendingLimit: { spent: number; limit: number }
  chartMonths: { month: string; profit: number; loss: number }[]
  recentActivities: {
    id: number
    orderId: string
    title: string
    category: string
    icon: string
    price: number
    status: 'completed' | 'pending' | 'in_progress'
    date: string
    type: TransactionType
  }[]
  quickStats: {
    id: string
    label: string
    value: number
    change?: number
    variant: 'primary' | 'default'
  }[]
}

export const CATEGORY_ICONS: Record<string, string> = {
  General: '📋',
  Comida: '🍽️',
  Transporte: '🚗',
  Salud: '🏥',
  Entretenimiento: '🎬',
  Compras: '🛒',
  Servicios: '💡',
  Salario: '💼',
  Freelance: '💻',
  Inversiones: '📈',
  Otros: '📦',
}

export const EXPENSE_CATEGORIES = [
  'General',
  'Comida',
  'Transporte',
  'Salud',
  'Entretenimiento',
  'Compras',
  'Servicios',
  'Otros',
]

export const INCOME_CATEGORIES = [
  'Salario',
  'Freelance',
  'Inversiones',
  'General',
  'Otros',
]
