import { TrendingDown, TrendingUp } from 'lucide-react'
import type { DashboardSummary } from '@/types/transaction'
import { EMPTY_DASHBOARD } from '@/data/dashboard'
import { formatCurrency, formatPercent } from '@/utils/format'

interface QuickStatsGridProps {
  stats?: DashboardSummary['quickStats']
}

export function QuickStatsGrid({
  stats = EMPTY_DASHBOARD.quickStats,
}: QuickStatsGridProps) {
  return (
    <div className="grid h-full min-h-[320px] grid-cols-2 gap-5">
      {stats.map((stat, index) => {
        const isPrimary = stat.variant === 'primary'
        const hasChange = stat.change !== undefined
        const isPositive = (stat.change ?? 0) >= 0

        return (
          <div
            key={stat.id}
            style={{ animationDelay: `${index * 80}ms` }}
            className={[
              'flex min-h-[140px] flex-col justify-between rounded-[1.25rem] p-5 transition-all sm:p-6',
              isPrimary
                ? 'bg-vh-primary text-white shadow-vh-soft hover:shadow-vh-hover hover:-translate-y-0.5'
                : 'vh-card vh-card-interactive',
            ].join(' ')}
          >
            <p
              className={[
                'text-xs font-medium sm:text-sm',
                isPrimary ? 'text-white/80' : 'text-vh-muted',
              ].join(' ')}
            >
              {stat.label}
            </p>
            <div className="mt-4">
              <p
                className={[
                  'text-2xl font-bold sm:text-3xl',
                  isPrimary ? 'text-white' : 'text-vh-text',
                ].join(' ')}
              >
                {formatCurrency(stat.value, 'USD', true)}
              </p>
              {hasChange && !isPrimary && (
                <div
                  className={[
                    'mt-2 inline-flex items-center gap-1 text-xs font-medium',
                    isPositive ? 'text-vh-success' : 'text-vh-danger',
                  ].join(' ')}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  {formatPercent(stat.change!)}
                </div>
              )}
              {isPrimary && !hasChange && (
                <p className="mt-2 text-xs text-white/70">Sin datos este mes</p>
              )}
              {isPrimary && hasChange && (
                <p className="mt-2 text-xs text-white/80">
                  {formatPercent(stat.change!)} este mes
                </p>
              )}
              {!isPrimary && !hasChange && stat.value === 0 && (
                <p className="mt-2 text-xs text-vh-muted">Sin registros</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
