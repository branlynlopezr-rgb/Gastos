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

interface DataContextValue {
  dashboard: DashboardSummary | null
  transactions: Transaction[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [dash, txs] = await Promise.all([
        api.getDashboard(),
        api.getTransactions(),
      ])
      setDashboard(dash)
      setTransactions(txs)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo conectar con la base de datos. ¿Está corriendo el servidor?',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <DataContext.Provider
      value={{ dashboard, transactions, loading, error, refresh }}
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
