import type { DbAdapter } from './types.js'
import { createEmptyDb, hasTursoCredentials } from './empty.js'

let adapter: DbAdapter | null = null

export async function getDb(): Promise<DbAdapter> {
  if (adapter) return adapter

  if (hasTursoCredentials()) {
    const { createTursoDb } = await import('./turso.js')
    adapter = await createTursoDb()
  } else if (process.env.VERCEL) {
    adapter = createEmptyDb()
  } else {
    const { createLocalDb } = await import('./local.js')
    adapter = await createLocalDb()
  }

  return adapter
}

export async function resetDbCache() {
  adapter = null
}

export function getDbStatus() {
  if (hasTursoCredentials()) return 'turso'
  if (process.env.VERCEL) return 'none'
  return 'local'
}
