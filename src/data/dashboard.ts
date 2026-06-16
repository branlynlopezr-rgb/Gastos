export interface Wallet {
  code: string
  label: string
  amount: number
  active: boolean
  flag: string
}

export interface QuickStat {
  id: string
  label: string
  value: number
  change?: number
  variant: 'primary' | 'default'
}

export interface ChartMonth {
  month: string
  profit: number
  loss: number
}

export type ActivityStatus = 'completed' | 'pending' | 'in_progress'

export interface Activity {
  id: string
  orderId: string
  title: string
  category: string
  icon: string
  price: number
  status: ActivityStatus
  date: string
}

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export function getEmptyChartMonths(): ChartMonth[] {
  const now = new Date()
  return Array.from({ length: 8 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (7 - i), 1)
    return { month: MONTH_LABELS[d.getMonth()], profit: 0, loss: 0 }
  })
}

/** Valores iniciales vacíos — sin datos demo */
export const EMPTY_DASHBOARD = {
  balance: { total: 0, changePercent: 0, currency: 'USD' as const },
  wallets: [] as Wallet[],
  quickStats: [
    { id: 'earnings', label: 'Ganancias totales', value: 0, variant: 'primary' as const },
    { id: 'spending', label: 'Gastos totales', value: 0, variant: 'default' as const },
    { id: 'income', label: 'Ingresos totales', value: 0, variant: 'default' as const },
    { id: 'revenue', label: 'Ingresos netos', value: 0, variant: 'default' as const },
  ] satisfies QuickStat[],
  chartMonths: getEmptyChartMonths(),
  spendingLimit: { spent: 0, limit: 5500 },
  activities: [] as Activity[],
}

export const STATUS_LABELS: Record<ActivityStatus, string> = {
  completed: 'Completado',
  pending: 'Pendiente',
  in_progress: 'En progreso',
}
