# Gastos - VitalHood

Dashboard de gestión de gastos. React + Vercel + **Supabase (PostgreSQL)**.

## Variables en Vercel

| Variable | Valor (Supabase → Settings → API) |
|----------|-----------------------------------|
| `link` | Project URL (`https://xxx.supabase.co`) |
| `service_role` | service_role secret key |
| `anon_public` | anon public key (reservado para auth futuro) |

## SQL — crear tablas en Supabase

1. Abre **Supabase → SQL Editor → New query**
2. Copia y ejecuta el contenido de [`supabase/schema.sql`](supabase/schema.sql)
3. Debe mostrar `total_movimientos = 0`

## Desarrollo local

Crea `.env.local` con las mismas variables y:

```cmd
npm install
npm run dev:all
```

O solo frontend (si la API está en Vercel):

```cmd
npm run dev
```

## Deploy

```cmd
git push origin main
```

Vercel redeploy automático. Verifica: `https://tu-app.vercel.app/api/health` → `"db": "supabase"`

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev:all` | Frontend + API local |
| `npm run build` | Build producción |
| `npm run db:reset` | Limpiar SQLite local (solo dev) |
