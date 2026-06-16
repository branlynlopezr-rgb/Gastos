import { ArrowDownLeft, ArrowUpRight, ChevronDown, TrendingDown, TrendingUp } from 'lucide-react'
import { EMPTY_DASHBOARD } from '@/data/dashboard'
import { formatCurrency, formatPercent } from '@/utils/format'

interface BalanceCardProps {
  total?: number
  changePercent?: number
}

export function BalanceCard({
  total = 0,
  changePercent,
}: BalanceCardProps) {
  const currency = EMPTY_DASHBOARD.balance.currency
  const hasTrend = changePercent !== undefined && changePercent !== 0

  return (
    <div className="vh-card vh-card-interactive flex h-full flex-col p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-vh-muted">Balance total</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-vh-text sm:text-4xl">
            {formatCurrency(total ?? 0, currency)}
          </p>
          {hasTrend ? (
            <div
              className={[
                'mt-3 inline-flex items-center gap-1 text-sm font-medium',
                changePercent >= 0 ? 'text-vh-success' : 'text-vh-danger',
              ].join(' ')}
            >
              {changePercent >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{formatPercent(changePercent)} respecto al mes anterior</span>
            </div>
          ) : (
            <p className="mt-3 text-sm text-vh-muted">
              Sin movimientos registrados aún
            </p>
          )}
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-xl border border-vh-border bg-vh-bg px-3 py-2 text-sm font-medium text-vh-text transition-all hover:border-vh-primary/40 active:scale-95"
        >
          {currency}
          <ChevronDown className="h-4 w-4 text-vh-muted" />
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-vh-dark px-4 py-3.5 text-sm font-medium text-white transition-all hover:bg-black active:scale-[0.98]"
        >
          <ArrowUpRight className="h-4 w-4" />
          Transferir
        </button>
        <button
          type="button"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-vh-border bg-vh-surface px-4 py-3.5 text-sm font-medium text-vh-text transition-all hover:bg-vh-bg active:scale-[0.98]"
        >
          <ArrowDownLeft className="h-4 w-4" />
          Solicitar
        </button>
      </div>

      <div className="mt-8 border-t border-vh-border pt-6">
        <p className="mb-4 text-sm font-medium text-vh-text">Billeteras</p>
        <div className="flex min-h-[80px] items-center justify-center rounded-xl border border-dashed border-vh-border bg-vh-bg/50 px-4 py-6 text-center">
          <p className="text-sm text-vh-muted">
            Sin billeteras configuradas
          </p>
        </div>
      </div>
    </div>
  )
}
