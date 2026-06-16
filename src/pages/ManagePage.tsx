import { useState, type FormEvent } from 'react'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { api } from '@/api/client'
import { useData } from '@/context/DataProvider'
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type CreateTransactionInput,
  type TransactionType,
} from '@/types/transaction'
import { formatCurrency } from '@/utils/format'

const TYPE_LABELS: Record<TransactionType, string> = {
  expense: 'Gasto',
  income: 'Ingreso',
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function ManagePage() {
  const { transactions, loading, error, dbWarning, refresh } = useData()
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [type, setType] = useState<TransactionType>('expense')
  const [form, setForm] = useState<Omit<CreateTransactionInput, 'type'>>({
    amount: 0,
    description: '',
    category: 'General',
    date: todayISO(),
  })

  const categories =
    type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSuccess(null)

    if (!form.description.trim()) {
      setFormError('Escribe una descripción.')
      return
    }
    if (!form.amount || form.amount <= 0) {
      setFormError('El monto debe ser mayor a 0.')
      return
    }

    setSubmitting(true)
    try {
      await api.createTransaction({ type, ...form, amount: Number(form.amount) })
      setSuccess(
        type === 'expense'
          ? '¡Gasto registrado correctamente!'
          : '¡Ingreso registrado correctamente!',
      )
      setForm({
        amount: 0,
        description: '',
        category: type === 'expense' ? 'General' : 'Salario',
        date: todayISO(),
      })
      await refresh()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar este registro?')) return
    try {
      await api.deleteTransaction(id)
      await refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-vh-text sm:text-3xl">
          Registrar movimientos
        </h1>
        <p className="mt-2 text-sm text-vh-muted sm:text-base">
          Sube tus gastos e ingresos. Se guardan en tu base de datos Supabase.
        </p>
      </header>

      {dbWarning && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          {dbWarning}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-vh-danger/30 bg-vh-danger/10 px-4 py-3 text-sm text-vh-danger">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Formulario */}
        <div className="vh-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-vh-text">Nuevo registro</h2>

          <div className="mt-5 flex gap-2 rounded-xl bg-vh-bg p-1">
            {(['expense', 'income'] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setType(t)
                  setForm((f) => ({
                    ...f,
                    category: t === 'expense' ? 'General' : 'Salario',
                  }))
                }}
                className={[
                  'flex-1 rounded-lg py-2.5 text-sm font-medium transition-all',
                  type === t
                    ? t === 'expense'
                      ? 'bg-vh-danger text-white shadow-vh-soft'
                      : 'bg-vh-success text-white shadow-vh-soft'
                    : 'text-vh-muted hover:text-vh-text',
                ].join(' ')}
              >
                {t === 'expense' ? 'Gasto' : 'Ingreso'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-vh-text">Descripción</span>
              <input
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder={
                  type === 'expense'
                    ? 'Ej: Supermercado, gasolina...'
                    : 'Ej: Salario, freelance...'
                }
                className="rounded-xl border border-vh-border bg-vh-bg px-4 py-3 text-sm text-vh-text outline-none transition-colors focus:border-vh-primary"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-vh-text">Monto (USD)</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount || ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      amount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0.00"
                  className="rounded-xl border border-vh-border bg-vh-bg px-4 py-3 text-sm text-vh-text outline-none transition-colors focus:border-vh-primary"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-vh-text">Fecha</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  className="rounded-xl border border-vh-border bg-vh-bg px-4 py-3 text-sm text-vh-text outline-none transition-colors focus:border-vh-primary"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-vh-text">Categoría</span>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="rounded-xl border border-vh-border bg-vh-bg px-4 py-3 text-sm text-vh-text outline-none transition-colors focus:border-vh-primary"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            {formError && (
              <p className="text-sm text-vh-danger">{formError}</p>
            )}
            {success && (
              <p className="text-sm text-vh-success">{success}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-vh-primary px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-vh-primary-hover active:scale-[0.98] disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {type === 'expense' ? 'Registrar gasto' : 'Registrar ingreso'}
            </button>
          </form>
        </div>

        {/* Lista */}
        <div className="vh-card flex flex-col p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-vh-text">
            Historial ({transactions.length})
          </h2>

          {loading ? (
            <div className="flex flex-1 items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-vh-muted" />
            </div>
          ) : transactions.length === 0 ? (
            <p className="py-16 text-center text-sm text-vh-muted">
              Aún no hay registros. Agrega tu primer gasto o ingreso.
            </p>
          ) : (
            <ul className="mt-5 flex max-h-[480px] flex-col gap-3 overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-vh-border bg-vh-bg px-4 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-vh-text">
                      {tx.description}
                    </p>
                    <p className="mt-0.5 text-xs text-vh-muted">
                      {TYPE_LABELS[tx.type]} · {tx.category} · {tx.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        'whitespace-nowrap text-sm font-semibold',
                        tx.type === 'income'
                          ? 'text-vh-success'
                          : 'text-vh-danger',
                      ].join(' ')}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(tx.id)}
                      aria-label="Eliminar"
                      className="rounded-lg p-1.5 text-vh-muted transition-colors hover:bg-vh-danger/10 hover:text-vh-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
