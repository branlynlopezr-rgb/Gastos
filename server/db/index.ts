import type { DbAdapter } from './types.js'
import { createLocalDb } from './local.js'
import { createTursoDb } from './turso.js'

let adapter: DbAdapter | null = null

/** Vercel = Turso. Local = SQLite en archivo. */
export async function getDb(): Promise<DbAdapter> {
  if (adapter) return adapter

  if (process.env.TURSO_DATABASE_URL) {
    adapter = await createTursoDb()
  } else if (process.env.VERCEL) {
    throw new Error(
      'Configura TURSO_DATABASE_URL y TURSO_AUTH_TOKEN en Vercel → Settings → Environment Variables.',
    )
  } else {
    adapter = await createLocalDb()
  }

  return adapter
}

export async function resetDbCache() {
  adapter = null
}
