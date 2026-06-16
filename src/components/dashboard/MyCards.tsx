import { CreditCard, Plus } from 'lucide-react'

export function MyCards() {
  return (
    <div className="vh-card p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-vh-text">Mis tarjetas</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl border border-vh-border px-3 py-1.5 text-sm font-medium text-vh-text transition-all hover:bg-vh-bg active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Agregar
        </button>
      </div>

      <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-vh-border bg-vh-bg/50 py-10 text-center">
        <CreditCard className="h-10 w-10 text-vh-muted/50" />
        <p className="text-sm font-medium text-vh-muted">Sin tarjetas registradas</p>
        <p className="max-w-xs text-xs text-vh-muted">
          Conecta tus métodos de pago cuando configures tu cuenta.
        </p>
      </div>
    </div>
  )
}
