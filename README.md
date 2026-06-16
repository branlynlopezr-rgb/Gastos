# Gastos - VitalHood

Dashboard de gestión de gastos. Frontend React + API serverless + SQLite (local) / Turso (producción).

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + Vite + Tailwind CSS 4 |
| API local | Express (puerto 3001) |
| API producción | Vercel Serverless Functions (`/api`) |
| BD local | SQLite (`data/gastos.db`) |
| BD producción | [Turso](https://turso.tech) (SQLite en la nube) |

---

## Desarrollo local

```cmd
npm install
npm run dev:all
```

Abre **http://localhost:5173**

---

## Deploy en Vercel + GitHub

### 1. Subir código a GitHub

```cmd
git add .
git commit -m "Preparar deploy Vercel"
git push origin main
```

Repositorio: `https://github.com/branlynlopezr-rgb/Gastos`

### 2. Importar en Vercel

1. Entra a [vercel.com](https://vercel.com) → **Add New Project**
2. Importa el repo **Gastos** desde GitHub
3. Vercel detecta **Vite** automáticamente (usa `vercel.json`)
4. **Deploy** (el frontend funcionará; la API necesita Turso)

### 3. Crear base de datos Turso (gratis)

1. Crea cuenta en [turso.tech](https://turso.tech)
2. Crea una base de datos nueva (ej: `gastos-vitalhood`)
3. Copia **Database URL** y **Auth Token**

### 4. Variables de entorno en Vercel

En tu proyecto Vercel → **Settings → Environment Variables**:

| Variable | Valor |
|----------|-------|
| `TURSO_DATABASE_URL` | `libsql://tu-db.turso.io` |
| `TURSO_AUTH_TOKEN` | token de Turso |

Aplica a **Production**, **Preview** y **Development**. Luego **Redeploy**.

### 5. Verificar

- Frontend: `https://tu-proyecto.vercel.app`
- API health: `https://tu-proyecto.vercel.app/api/health`
- Dashboard: `https://tu-proyecto.vercel.app/api/dashboard`

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Solo frontend |
| `npm run server` | Solo API local |
| `npm run dev:all` | Frontend + API local |
| `npm run build` | Build producción |
| `npm run db:reset` | Limpiar BD local |

---

## Estructura

```
api/                 → Serverless functions (Vercel)
server/              → Lógica API + adaptadores BD
src/                 → Frontend React
vercel.json          → Config deploy
data/gastos.db       → BD local (no se sube a Git)
```

---

## Notas

- **Local:** usa SQLite en archivo, sin configuración extra.
- **Vercel:** requiere Turso (SQLite serverless). Sin esas variables, la API devuelve error explicativo.
- Cuando conectes otra BD (PostgreSQL, etc.), reemplaza `server/db/turso.ts`.
