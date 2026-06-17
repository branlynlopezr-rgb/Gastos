# Handoff — Gastos VitalHood (para continuar en otro chat de Cursor)

> **Instrucción para el agente:** Lee este archivo completo antes de tocar código. El usuario (Branlyn) trabaja en Windows, prefiere respuestas en **español**, UI en español, y no hacer commits/push salvo que lo pida explícitamente.

---

## 1. Qué es el proyecto

Dashboard demo de **gestión de gastos e ingresos** llamado **Gastos - VitalHood**. UI inspirada en diseño tipo Finexy. App funcional con base de datos en producción (Supabase) y deploy en Vercel.

- **GitHub:** `https://github.com/branlynlopezr-rgb/Gastos`
- **Vercel proyecto:** `gastosvitalhood`
- **Rama principal:** `main` (sincronizada con `origin/main` al momento de escribir este doc)

---

## 2. Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4, Lucide icons |
| API local | Express en puerto **3001** (`npm run server`) |
| API producción | Vercel Serverless Functions en carpeta `api/` |
| BD local | SQLite con `sql.js` → `data/gastos.db` |
| BD producción | **Supabase (PostgreSQL)** vía `@supabase/supabase-js` |
| Auth actual | **Demo** (localStorage), **NO** Supabase Auth real aún |

---

## 3. Dónde se quedó el usuario (estado actual)

### ✅ Completado

1. **Dashboard completo** — balance, stats, gráfico ingresos, límite de gasto, tarjetas, tabla actividad reciente.
2. **Dark mode** + responsive móvil (Sidebar desktop, tabs en TopBar, MobileNav abajo).
3. **CRUD de movimientos** — formulario en pestaña **Gestionar** (`ManagePage`), guarda en BD.
4. **Deploy Vercel + Supabase** — producción guarda y lee de Supabase (variables configuradas).
5. **Variables de entorno** — código lee nombres exactos de Vercel (case-sensitive en Linux).
6. **Pantalla de login/registro (demo)** — diseño dos columnas (gradiente + formulario), sin ruta `/login`.
7. **Cerrar sesión** — menú desplegable en avatar del **TopBar** (arriba derecha) + icono en Sidebar desktop.
8. **Datos en cero** — sin mock data; dashboard muestra USD 0 si no hay movimientos.

### ⏳ Pendiente (próximos pasos naturales)

1. **Supabase Auth real** — reemplazar `AuthProvider` demo por login/registro con Supabase.
2. **Seguridad API** — hoy `/api/*` es **pública** (cualquiera con la URL puede leer/escribir/borrar). Prioridad alta.
3. **Multiusuario** — agregar `user_id` a `transactions` + RLS por usuario en Supabase.
4. **Ruta explícita `/login`** — usuario preguntó si conviene; no implementado (hoy auth está en `/` cuando no hay sesión).
5. **Pestañas placeholder** — Actividad, Programa, Cuenta, Reportes aún son “Próximamente”.
6. **OAuth social** — botones Google/Facebook/Behance son demo con aviso; no conectados.

---

## 4. Variables de entorno (CRÍTICO)

En **Vercel → Settings → Environment Variables** el usuario las tiene así (nombres exactos):

| Nombre en Vercel | Uso |
|------------------|-----|
| **`Link`** | Project URL Supabase (`https://xxx.supabase.co`) |
| **`service_role`** | JWT service_role (empieza con `eyJ...`) |
| **`Anon_Public`** | anon key (reservada para auth cliente futuro) |

**No usar** `link` minúscula — en Linux no coincide.

Lectura centralizada en: `server/db/env.ts`

Local: copiar `.env.example` → `.env.local` con los mismos nombres.

Verificar producción: `https://TU-APP.vercel.app/api/health`  
Respuesta esperada: `{ "ok": true, "db": "supabase", "supabase": { "ok": true, ... } }`

---

## 5. Autenticación (estado actual — DEMO)

| Aspecto | Detalle |
|---------|---------|
| Componente | `src/pages/AuthPage.tsx` |
| Contexto | `src/context/AuthProvider.tsx` |
| Storage key | `vh-auth-demo` en `localStorage` |
| URL | **Raíz `/`** — no hay React Router ni `/login` |
| Flujo | Si `!isAuthenticated` → `AuthPage`; si sí → dashboard |
| Login demo | Cualquier email válido + contraseña ≥ 6 caracteres |
| Logout | TopBar → clic avatar → **Cerrar sesión**; o Sidebar (solo desktop) |
| Persistencia | Sesión sobrevive recargas hasta logout o borrar `vh-auth-demo` |

**Archivos auth:**
```
src/pages/AuthPage.tsx
src/context/AuthProvider.tsx
src/components/auth/AuthBrandPanel.tsx
src/components/auth/SocialAuthButtons.tsx
src/components/auth/VitalHoodLogo.tsx
```

**Provider tree** (`src/main.tsx`):
```
ThemeProvider → AuthProvider → DataProvider → App
```

---

## 6. Seguridad (contexto importante)

- `service_role` solo en servidor Vercel ✅
- API **sin autenticación** ❌ — riesgo si URL es pública
- `DELETE /api/transactions` borra **todos** los movimientos sin auth ❌
- RLS en Supabase existe pero la API con `service_role` **bypass** RLS
- Política `anon_read_transactions` en schema permite lectura anon si alguien tiene la clave

Recomendación acordada con el usuario: implementar **Supabase Auth + RLS por usuario** como siguiente fase de seguridad.

---

## 7. Estructura del repo

```
src/                          # Frontend React
  App.tsx                     # Auth gate + tabs (overview, manage, etc.)
  main.tsx
  index.css                   # Tailwind + utilidades vh-* + estilos auth
  pages/
    AuthPage.tsx              # Login/registro demo
    OverviewPage.tsx          # Dashboard principal
    ManagePage.tsx            # CRUD gastos/ingresos
  context/
    AuthProvider.tsx          # Sesión demo
    DataProvider.tsx          # Fetch dashboard + transactions
    ThemeProvider.tsx         # Dark/light mode
  components/
    auth/                     # UI login
    dashboard/                # BalanceCard, IncomeChart, etc.
    layout/                   # AppLayout, Sidebar, TopBar, MobileNav
  api/client.ts               # fetch a /api/*
  config/navigation.ts        # NAV_TABS, SIDEBAR_ITEMS
  types/transaction.ts

server/                       # Lógica compartida local + Vercel
  index.ts                    # Express local :3001
  handlers.ts                 # getHealth, CRUD, dashboard
  dashboard.ts                # Agregaciones
  db/
    index.ts                  # Elige supabase / empty / local
    env.ts                    # Lectura vars Link, service_role, Anon_Public
    supabase.ts               # Adapter Supabase
    local.ts                    # SQLite (import dinámico)
    empty.ts                  # Fallback Vercel sin BD

api/                          # Vercel serverless
  health.ts
  dashboard.ts
  transactions/index.ts       # GET, POST, DELETE (clear all)
  transactions/[id].ts        # DELETE por id
  _lib/http.ts

supabase/schema.sql           # Tabla public.transactions + RLS
vercel.json                   # Build Vite + rewrites SPA + includeFiles server/**
```

---

## 8. Base de datos

### Tabla `public.transactions` (Supabase)

```sql
id          BIGSERIAL PRIMARY KEY
type        TEXT NOT NULL CHECK (type IN ('expense', 'income'))
amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0)
description TEXT NOT NULL
category    TEXT NOT NULL DEFAULT 'General'
date        DATE NOT NULL
created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

SQL completo + políticas RLS: `supabase/schema.sql`

### Selección de BD (`server/db/index.ts`)

1. Si hay `Link` + `service_role` → **Supabase**
2. Si `VERCEL` sin credenciales → **empty** (API devuelve vacío / error al escribir)
3. Si local sin Vercel → **SQLite** (`data/gastos.db`)

---

## 9. API endpoints

| Método | Ruta | Acción |
|--------|------|--------|
| GET | `/api/health` | Estado API + ping Supabase |
| GET | `/api/dashboard` | Resumen agregado |
| GET | `/api/transactions` | Listar movimientos |
| POST | `/api/transactions` | Crear movimiento |
| DELETE | `/api/transactions` | **Borrar todos** (peligroso, sin auth) |
| DELETE | `/api/transactions/:id` | Borrar uno |

Frontend consume todo vía `src/api/client.ts`.

---

## 10. Navegación UI

Tabs principales (`NAV_TABS` en `src/config/navigation.ts`):

| Tab ID | Label | Estado |
|--------|-------|--------|
| `overview` | Resumen | ✅ Funcional |
| `activity` | Actividad | Placeholder |
| `manage` | Gestionar | ✅ CRUD |
| `program` | Programa | Placeholder |
| `account` | Cuenta | Placeholder |
| `reports` | Reportes | Placeholder |

No hay React Router — navegación por `useState<NavTab>` en `App.tsx`.

---

## 11. Scripts npm

```cmd
npm run dev          # Solo frontend (Vite :5173)
npm run server       # Solo API local (:3001)
npm run dev:all      # Frontend + API (recomendado local)
npm run build        # tsc + vite build
npm run db:reset     # Limpiar SQLite local
npm run preview      # Preview build
```

---

## 12. Desarrollo en Windows (problemas conocidos)

- Usuario en **PowerShell** — `&&` puede fallar; usar `;` o CMD.
- Si `npm` no reconoce: usar `.\npm.cmd` o scripts `instalar.bat` / `iniciar.bat`.
- Proyecto en **OneDrive** puede dar problemas con `node_modules`.
- PowerShell execution policy — preferir CMD o `npm.cmd` del proyecto.

---

## 13. Diseño / convenciones

- UI en **español**.
- Clases utilitarias: `vh-card`, `vh-bg`, `vh-primary` (#ff6b35 naranja en dashboard).
- Auth usa paleta **indigo/violeta** (distinta al dashboard).
- Dark mode vía clase `.dark` en `<html>` (`ThemeProvider`).
- Animaciones: `animate-vh-fade-up`, `vh-stagger`.
- Preferir cambios mínimos y reutilizar patrones existentes.
- No crear commits salvo que el usuario lo pida.

---

## 14. Errores ya resueltos (no reintroducir)

1. Variables Vercel `Link` vs `link` — resuelto en `server/db/env.ts`.
2. Error 500 Vercel por `sql.js` — `local.ts` se importa dinámicamente solo en dev.
3. Import roto `api/_lib/http.ts` — path correcto `../../server/handlers.js`.
4. Turso descartado — migrado a Supabase; `server/db/turso.ts` existe pero no se usa.
5. Login no visible — auth en `/` sin ruta separada; logout ahora en menú TopBar.

---

## 15. Commits recientes (referencia)

```
d96995b login cerrar sesion
5619f80 login
397a3c4 atter supabase
c2979af supabase 2.0
c7a06e3 Supabase
```

---

## 16. Próxima tarea sugerida (cuando el usuario continúe)

El usuario quería **más seguridad** y empezó el **login**. El diseño demo ya está. Lo lógico es:

### Fase A — Supabase Auth
- Instalar/configurar auth en Supabase (email/password o Google).
- Reemplazar `AuthProvider` demo por cliente Supabase con `Anon_Public`.
- Pantallas login/registro conectadas a Supabase (mantener diseño actual de `AuthPage`).
- Proteger rutas: sin sesión → auth; con sesión → dashboard.

### Fase B — Datos por usuario
- Migración SQL: `ALTER TABLE transactions ADD COLUMN user_id UUID REFERENCES auth.users(id)`.
- Actualizar RLS: solo `auth.uid() = user_id`.
- API: verificar JWT del usuario en cada request; dejar de usar `service_role` para CRUD normal (o usar RLS con token de usuario).

### Fase C — Endurecimiento
- Quitar o proteger `DELETE /api/transactions` (clear all).
- Rate limiting en API.
- Opcional: ruta `/login` con React Router.

---

## 17. Cómo probar auth hoy (demo)

1. Abrir app (local o Vercel).
2. Si entra directo al dashboard → avatar arriba derecha → **Cerrar sesión**.
3. O incógnito / borrar `localStorage` key `vh-auth-demo`.
4. Login: email cualquiera + contraseña 6+ chars → entra al dashboard.

---

## 18. Archivos clave para editar según tarea

| Tarea | Archivos |
|-------|----------|
| Auth real Supabase | `AuthProvider.tsx`, `AuthPage.tsx`, `server/db/supabase.ts`, `supabase/schema.sql` |
| Proteger API | `api/**/*.ts`, `server/handlers.ts`, nuevo middleware auth |
| UI dashboard | `src/pages/OverviewPage.tsx`, `src/components/dashboard/*` |
| CRUD | `ManagePage.tsx`, `server/handlers.ts` |
| Env vars | `server/db/env.ts`, `.env.example` |
| Deploy | `vercel.json`, push a `main` |

---

*Documento generado para handoff entre chats de Cursor. Actualizar este archivo si se completan fases importantes.*
