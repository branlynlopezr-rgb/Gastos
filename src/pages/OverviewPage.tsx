import { Loader2, Plus } from 'lucide-react'
import { useAuth } from '@/context/AuthProvider'
import { useData } from '@/context/DataProvider'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { IncomeChart } from '@/components/dashboard/IncomeChart'
import { MyCards } from '@/components/dashboard/MyCards'
import { QuickStatsGrid } from '@/components/dashboard/QuickStatsGrid'
import { RecentActivitiesTable } from '@/components/dashboard/RecentActivitiesTable'
import { SpendingLimit } from '@/components/dashboard/SpendingLimit'
import type { NavTab } from '@/config/navigation'

interface OverviewPageProps {
  greeting: string
  onNavigate?: (tab: NavTab) => void
}

export function OverviewPage({ greeting, onNavigate }: OverviewPageProps) {
  const { user } = useAuth()
  const firstName = user?.name.split(' ')[0] ?? 'Usuario'
  const { dashboard, loading, error, dbWarning } = useData()

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-10">
      <header className="animate-vh-fade-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-vh-text sm:text-3xl">
              {greeting}, {firstName}
            </h1>
            <p className="mt-2 text-sm text-vh-muted sm:text-base">
              Mantente al día con tus tareas, monitorea el progreso y revisa el
              estado de tus gastos.
            </p>
          </div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('manage')}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-vh-primary px-5 py-3 text-sm font-semibold text-white shadow-vh-soft transition-all hover:bg-vh-primary-hover active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Registrar gasto / ingreso
            </button>
          )}
        </div>
      </header>

      {dbWarning && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-700 dark:text-amber-300">
          {dbWarning}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-vh-danger/30 bg-vh-danger/10 px-5 py-4 text-sm text-vh-danger">
          {error}
        </div>
      )}

      {loading && !dashboard ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-vh-muted" />
        </div>
      ) : (
        <>
          <section className="vh-stagger grid gap-6 xl:grid-cols-12 xl:gap-8">
            <div className="xl:col-span-5">
              <BalanceCard
                total={dashboard?.balance}
                changePercent={dashboard?.balanceChangePercent}
              />
            </div>
            <div className="xl:col-span-3">
              <QuickStatsGrid stats={dashboard?.quickStats} />
            </div>
            <div className="xl:col-span-4">
              <IncomeChart months={dashboard?.chartMonths} />
            </div>
          </section>

          <section className="vh-stagger grid gap-6 xl:grid-cols-12 xl:gap-8">
            <div className="flex flex-col gap-6 xl:col-span-5">
              <SpendingLimit data={dashboard?.spendingLimit} />
              <MyCards />
            </div>
            <div className="xl:col-span-7">
              <RecentActivitiesTable
                activities={dashboard?.recentActivities}
              />
            </div>
          </section>
        </>
      )}
    </div>
  )
}
