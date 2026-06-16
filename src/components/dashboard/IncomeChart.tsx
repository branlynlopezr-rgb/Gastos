import type { DashboardSummary } from '@/types/transaction'
import { EMPTY_DASHBOARD } from '@/data/dashboard'

const MAX_BAR_HEIGHT = 140

interface IncomeChartProps {
  months?: DashboardSummary['chartMonths']
}

export function IncomeChart({
  months = EMPTY_DASHBOARD.chartMonths,
}: IncomeChartProps) {
  const hasData = months.some((m) => m.profit > 0 || m.loss > 0)
  const maxTotal = Math.max(...months.map((m) => m.profit + m.loss), 1)

  return (
    <div className="vh-card vh-card-interactive flex h-full min-h-[380px] flex-col p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-vh-text">Ingresos totales</h2>
          <p className="mt-1 text-sm text-vh-muted">
            Consulta tus ingresos en un periodo determinado.
          </p>
        </div>
        {hasData && (
          <div className="flex shrink-0 items-center gap-4 text-xs text-vh-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-vh-primary" />
              Ganancia
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-vh-dark" />
              Pérdida
            </span>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
          <p className="text-sm font-medium text-vh-muted">Sin datos para mostrar</p>
          <p className="max-w-xs text-xs text-vh-muted">
            Registra ingresos y gastos en Gestionar para ver el gráfico.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-1 items-end justify-between gap-2 px-1 sm:gap-4">
          {months.map((month, index) => {
            const total = month.profit + month.loss || 1
            const barHeight = (total / maxTotal) * MAX_BAR_HEIGHT
            const profitHeight = (month.profit / total) * barHeight
            const lossHeight = barHeight - profitHeight

            return (
              <div
                key={`${month.month}-${index}`}
                className="group flex flex-1 flex-col items-center gap-3"
              >
                <div
                  className="flex w-full max-w-[40px] flex-col justify-end overflow-hidden rounded-lg"
                  style={{ height: MAX_BAR_HEIGHT }}
                >
                  <div
                    className="vh-bar-segment w-full bg-vh-dark"
                    style={{
                      height: lossHeight,
                      animationDelay: `${index * 70}ms`,
                    }}
                  />
                  <div
                    className="vh-bar-segment w-full bg-vh-primary"
                    style={{
                      height: profitHeight,
                      animationDelay: `${index * 70 + 40}ms`,
                    }}
                  />
                </div>
                <span className="text-[10px] font-medium text-vh-muted transition-colors group-hover:text-vh-text sm:text-xs">
                  {month.month}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
