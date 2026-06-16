-- ============================================================
-- Gastos - VitalHood | Supabase (PostgreSQL)
-- Ejecuta este archivo en: Supabase → SQL Editor → New query
-- ============================================================

-- 1) Tabla principal de movimientos (gastos e ingresos)
CREATE TABLE IF NOT EXISTS public.transactions (
  id          BIGSERIAL PRIMARY KEY,
  type        TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT 'General',
  date        DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2) Índices para consultas del dashboard
CREATE INDEX IF NOT EXISTS idx_transactions_date
  ON public.transactions (date DESC);

CREATE INDEX IF NOT EXISTS idx_transactions_type
  ON public.transactions (type);

CREATE INDEX IF NOT EXISTS idx_transactions_created_at
  ON public.transactions (created_at DESC);

-- 3) Comentarios (opcional, ayuda en el panel de Supabase)
COMMENT ON TABLE public.transactions IS 'Gastos e ingresos - VitalHood';
COMMENT ON COLUMN public.transactions.type IS 'expense = gasto | income = ingreso';

-- 4) Seguridad: Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- La API en Vercel usa service_role (bypass RLS).
-- Esta política permite lectura pública solo si usas anon_public desde el cliente:
DROP POLICY IF EXISTS "anon_read_transactions" ON public.transactions;
CREATE POLICY "anon_read_transactions"
  ON public.transactions
  FOR SELECT
  TO anon
  USING (true);

-- Solo service_role puede insertar/actualizar/borrar (desde tu API serverless)
DROP POLICY IF EXISTS "service_all_transactions" ON public.transactions;
CREATE POLICY "service_all_transactions"
  ON public.transactions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5) Verificación (debe devolver 0 filas al inicio)
SELECT COUNT(*) AS total_movimientos FROM public.transactions;
