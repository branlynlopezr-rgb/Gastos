# Gastos - VitalHood

Dashboard de gestión de gastos con **base de datos SQLite** local.

## Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS 4
- **Backend:** Express + SQLite (sql.js, sin compilación nativa)
- **BD:** archivo local `data/gastos.db`

## Inicio rápido

### 1. Instalar dependencias

```cmd
npm install
```

### 2. Iniciar todo (API + frontend)

```cmd
npm run dev:all
```

O en **dos terminales**:

```cmd
npm run server
npm run dev
```

Abre **http://localhost:5173**

## Registrar gastos e ingresos

1. Ve a la pestaña **Gestionar** (o clic en **Registrar gasto / ingreso** en Resumen)
2. Elige **Gasto** o **Ingreso**
3. Completa descripción, monto, fecha y categoría
4. Clic en **Registrar**

Los datos se guardan en SQLite y el **Resumen** se actualiza automáticamente.

## API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/transactions` | Listar movimientos |
| POST | `/api/transactions` | Crear gasto/ingreso |
| DELETE | `/api/transactions/:id` | Eliminar movimiento |
| GET | `/api/dashboard` | Resumen para el dashboard |

## Estructura

```
server/           → API Express + SQLite
data/gastos.db    → Base de datos (se crea automáticamente)
src/
  pages/ManagePage.tsx    → Formulario de registro
  context/DataProvider.tsx → Conexión frontend ↔ API
  components/dashboard/   → Tarjetas del resumen
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Solo frontend |
| `npm run server` | Solo API (puerto 3001) |
| `npm run dev:all` | Frontend + API juntos |

## Nota PowerShell

Si `npm` falla por política de scripts, usa:

```powershell
.\npm.cmd run dev:all
```
