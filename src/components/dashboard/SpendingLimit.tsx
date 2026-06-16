import type { DashboardSummary } from '@/types/transaction'
import { EMPTY_DASHBOARD } from '@/data/dashboard'
import { formatCurrency } from '@/utils/format'

interface SpendingLimitProps {
  data?: DashboardSummary['spendingLimit']
}

export function SpendingLimit({
  data = EMPTY_DASHBOARD.spendingLimit,
}: SpendingLimitProps) {
  const { spent, limit } = data
  const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0

  return (
    <div className="vh-card p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-vh-text">
          Límite de gasto mensual
        </h2>
        <span className="text-sm font-medium text-vh-muted">
          {Math.round(percent)}% usado
        </span>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-vh-bg">
        <div
          className="h-full rounded-full bg-vh-primary transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-4 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
        <span className="text-vh-muted">
          <span className="font-semibold text-vh-text">
            {formatCurrency(spent)}
          </span>{' '}
          gastados de
        </span>
        <span className="font-semibold text-vh-text">
          {formatCurrency(limit)}
        </span>
      </div>
    </div>
  )
}
