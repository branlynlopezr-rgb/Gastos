import type { Transaction } from '../src/types/transaction.js'
import { CATEGORY_ICONS } from '../src/types/transaction.js'

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7)
}

function formatDisplayDate(dateStr: string, createdAt: string): string {
  const date = new Date(`${dateStr}T12:00:00`)
  const created = new Date(createdAt.includes('T') ? createdAt : `${createdAt.replace(' ', 'T')}Z`)
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const hours = created.getHours().toString().padStart(2, '0')
  const mins = created.getMinutes().toString().padStart(2, '0')
  return `${day} ${month} ${year}, ${hours}:${mins}`
}

function sumByType(transactions: Transaction[], type: 'expense' | 'income', month?: string) {
  return transactions
    .filter((t) => t.type === type && (!month || monthKey(t.date) === month))
    .reduce((acc, t) => acc + t.amount, 0)
}

function percentChange(current: number, previous: number): number | undefined {
  if (current === 0 && previous === 0) return undefined
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

export function buildDashboardSummary(transactions: Transaction[]) {
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const previousMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`

  const totalIncome = sumByType(transactions, 'income')
  const totalExpense = sumByType(transactions, 'expense')
  const balance = totalIncome - totalExpense

  const incomeThisMonth = sumByType(transactions, 'income', currentMonth)
  const expenseThisMonth = sumByType(transactions, 'expense', currentMonth)
  const incomePrevMonth = sumByType(transactions, 'income', previousMonth)
  const expensePrevMonth = sumByType(transactions, 'expense', previousMonth)

  const netRevenue = incomeThisMonth - expenseThisMonth
  const spendingLimit = { spent: expenseThisMonth, limit: 5500 }

  const chartMonths = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (7 - i), 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const profit = sumByType(transactions, 'income', key)
    const loss = sumByType(transactions, 'expense', key)
    return {
      month: MONTH_LABELS[d.getMonth()],
      profit: profit || 0,
      loss: loss || 0,
    }
  }).map((m) => ({
    ...m,
    profit: m.profit || 0,
    loss: m.loss || 0,
  }))

  const maxChart = Math.max(...chartMonths.map((m) => m.profit + m.loss), 1)
  const chartNormalized = chartMonths.map((m) => ({
    month: m.month,
    profit: Math.round((m.profit / maxChart) * 70) || 0,
    loss: Math.round((m.loss / maxChart) * 70) || 0,
  }))

  const recentActivities = transactions.slice(0, 10).map((t) => ({
    id: t.id,
    orderId: `TX_${String(t.id).padStart(6, '0')}`,
    title: t.description,
    category: t.category,
    icon: CATEGORY_ICONS[t.category] ?? '📋',
    price: t.amount,
    status: 'completed' as const,
    date: formatDisplayDate(t.date, t.created_at),
    type: t.type,
  }))

  return {
    balance,
    totalIncome: incomeThisMonth,
    totalExpense: expenseThisMonth,
    netRevenue,
    earnings: incomeThisMonth,
    spendingLimit,
    chartMonths: chartNormalized,
    recentActivities,
    balanceChangePercent: percentChange(
      incomeThisMonth - expenseThisMonth,
      incomePrevMonth - expensePrevMonth,
    ),
    quickStats: [
      {
        id: 'earnings',
        label: 'Ganancias totales',
        value: incomeThisMonth,
        change: percentChange(incomeThisMonth, incomePrevMonth),
        variant: 'primary' as const,
      },
      {
        id: 'spending',
        label: 'Gastos totales',
        value: expenseThisMonth,
        change: percentChange(expenseThisMonth, expensePrevMonth),
        variant: 'default' as const,
      },
      {
        id: 'income',
        label: 'Ingresos totales',
        value: incomeThisMonth,
        change: percentChange(incomeThisMonth, incomePrevMonth),
        variant: 'default' as const,
      },
      {
        id: 'revenue',
        label: 'Ingresos netos',
        value: netRevenue,
        change: percentChange(netRevenue, incomePrevMonth - expensePrevMonth),
        variant: 'default' as const,
      },
    ],
  }
}
