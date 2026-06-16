import { useMemo, useState } from 'react'
import { Filter, MoreHorizontal, Search } from 'lucide-react'
import type { DashboardSummary } from '@/types/transaction'
import {
  EMPTY_DASHBOARD,
  STATUS_LABELS,
  type Activity,
  type ActivityStatus,
} from '@/data/dashboard'
import { formatCurrency } from '@/utils/format'

const STATUS_STYLES: Record<
  ActivityStatus,
  { dot: string; text: string }
> = {
  completed: { dot: 'bg-vh-success', text: 'text-vh-success' },
  pending: { dot: 'bg-vh-danger', text: 'text-vh-danger' },
  in_progress: { dot: 'bg-vh-warning', text: 'text-amber-600 dark:text-amber-400' },
}

type ActivityItem = Activity | DashboardSummary['recentActivities'][number]

function ActivityCard({ item }: { item: ActivityItem }) {
  const statusStyle = STATUS_STYLES[item.status]
  const isExpense = 'type' in item && item.type === 'expense'

  return (
    <article className="rounded-xl border border-vh-border bg-vh-bg p-4 transition-colors hover:border-vh-primary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-vh-surface text-lg shadow-vh-card">
            {item.icon}
          </span>
          <div>
            <p className="font-medium text-vh-text">{item.title}</p>
            <p className="text-xs text-vh-muted">{item.category}</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Más opciones"
          className="rounded-lg p-1 text-vh-muted transition-colors hover:bg-vh-surface hover:text-vh-text"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="font-mono text-xs text-vh-muted">{item.orderId}</span>
        <span
          className={[
            'font-semibold',
            isExpense ? 'text-vh-danger' : 'text-vh-text',
          ].join(' ')}
        >
          {isExpense ? '-' : ''}
          {formatCurrency(item.price)}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusStyle.text}`}
        >
          <span className={`h-2 w-2 rounded-full ${statusStyle.dot}`} />
          {STATUS_LABELS[item.status]}
        </span>
        <span className="text-xs text-vh-muted">{item.date}</span>
      </div>
    </article>
  )
}

interface RecentActivitiesTableProps {
  activities?: ActivityItem[]
}

export function RecentActivitiesTable({
  activities = EMPTY_DASHBOARD.activities,
}: RecentActivitiesTableProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return activities
    return activities.filter(
      (item) =>
        item.orderId.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    )
  }, [activities, query])

  return (
    <div className="vh-card flex flex-col p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-vh-text">
          Actividad reciente
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-52">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-vh-muted" />
            <input
              type="search"
              placeholder="Buscar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-vh-border bg-vh-bg py-2.5 pl-9 pr-3 text-sm text-vh-text outline-none transition-colors placeholder:text-vh-muted focus:border-vh-primary"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-vh-border px-3 py-2.5 text-sm font-medium text-vh-text transition-all hover:bg-vh-bg active:scale-95"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtrar</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {filtered.length === 0 ? (
          <p className="py-12 text-center text-sm text-vh-muted">
            No hay actividad registrada. Ve a Gestionar para agregar movimientos.
          </p>
        ) : (
          filtered.map((item) => (
            <ActivityCard key={item.id} item={item} />
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-vh-border text-xs text-vh-muted">
              <th className="pb-4 pr-4 font-medium">
                <input type="checkbox" className="rounded border-vh-border" />
              </th>
              <th className="pb-4 pr-4 font-medium">ID pedido</th>
              <th className="pb-4 pr-4 font-medium">Actividad</th>
              <th className="pb-4 pr-4 font-medium">Precio</th>
              <th className="pb-4 pr-4 font-medium">Estado</th>
              <th className="pb-4 pr-4 font-medium">Fecha</th>
              <th className="pb-4 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-vh-muted">
                  No hay actividad registrada. Ve a Gestionar para agregar movimientos.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
              const statusStyle = STATUS_STYLES[item.status]
              const isExpense = 'type' in item && item.type === 'expense'

              return (
                <tr
                  key={item.id}
                  className="border-b border-vh-border/70 transition-colors last:border-0 hover:bg-vh-bg/50"
                >
                  <td className="py-4 pr-4">
                    <input type="checkbox" className="rounded border-vh-border" />
                  </td>
                  <td className="py-4 pr-4 font-medium text-vh-text">
                    {item.orderId}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vh-bg text-base">
                        {item.icon}
                      </span>
                      <div>
                        <p className="font-medium text-vh-text">{item.title}</p>
                        <p className="text-xs text-vh-muted">{item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td
                    className={[
                      'py-4 pr-4 font-semibold',
                      isExpense ? 'text-vh-danger' : 'text-vh-text',
                    ].join(' ')}
                  >
                    {isExpense ? '-' : ''}
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusStyle.text}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${statusStyle.dot}`}
                      />
                      {STATUS_LABELS[item.status]}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-vh-muted">{item.date}</td>
                  <td className="py-4">
                    <button
                      type="button"
                      aria-label="Más opciones"
                      className="rounded-lg p-1 text-vh-muted transition-colors hover:bg-vh-bg hover:text-vh-text"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )
            })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
