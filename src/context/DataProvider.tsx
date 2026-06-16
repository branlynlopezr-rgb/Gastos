import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { api } from '@/api/client'
import type { DashboardSummary, Transaction } from '@/types/transaction'
import { EMPTY_DASHBOARD } from '@/data/dashboard'

interface DataContextValue {
  dashboard: DashboardSummary | null
  transactions: Transaction[]
  loading: boolean
  error: string | null
  dbWarning: string | null
  refresh: () => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

const IS_PRODUCTION =
  typeof window !== 'undefined' &&
  !window.location.hostname.includes('localhost')

export function DataProvider({ children }: { children: ReactNode }) {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dbWarning, setDbWarning] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    setDbWarning(null)
    try {
      const health = await api.getHealth().catch(() => null)

      if (health && !health.ok && health.message) {
        setError(health.message)
        setDashboard({
          balance: 0,
          totalIncome: 0,
          totalExpense: 0,
          netRevenue: 0,
          earnings: 0,
          spendingLimit: EMPTY_DASHBOARD.spendingLimit,
          chartMonths: EMPTY_DASHBOARD.chartMonths,
          recentActivities: [],
          quickStats: EMPTY_DASHBOARD.quickStats,
        })
        setTransactions([])
        return
      }

      if (health?.db === 'none') {
        setDbWarning(
          'Base de datos no configurada. Agrega link y service_role de Supabase en Vercel → Environment Variables, luego redeploy.',
        )
        setDashboard({
          balance: 0,
          totalIncome: 0,
          totalExpense: 0,
          netRevenue: 0,
          earnings: 0,
          spendingLimit: EMPTY_DASHBOARD.spendingLimit,
          chartMonths: EMPTY_DASHBOARD.chartMonths,
          recentActivities: [],
          quickStats: EMPTY_DASHBOARD.quickStats,
        })
        setTransactions([])
        return
      }

      const [dash, txs] = await Promise.all([
        api.getDashboard(),
        api.getTransactions(),
      ])
      setDashboard(dash)
      setTransactions(txs)
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'No se pudo conectar con la API'

      if (IS_PRODUCTION) {
        setError(
          `Error de API en producción: ${msg}. Verifica el deploy en Vercel y las variables link / service_role de Supabase.`,
        )
      } else {
        setError(`${msg}. Ejecuta: npm run dev:all`)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <DataContext.Provider
      value={{ dashboard, transactions, loading, error, dbWarning, refresh }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData debe usarse dentro de DataProvider')
  return ctx
}
