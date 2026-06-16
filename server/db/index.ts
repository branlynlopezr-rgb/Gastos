import type { DbAdapter } from './types.js'
import { createEmptyDb, hasSupabaseCredentials } from './empty.js'

let adapter: DbAdapter | null = null

export async function getDb(): Promise<DbAdapter> {
  if (adapter) return adapter

  if (hasSupabaseCredentials()) {
    const { createSupabaseDb } = await import('./supabase.js')
    adapter = await createSupabaseDb()
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
  if (hasSupabaseCredentials()) return 'supabase'
  if (process.env.VERCEL) return 'none'
  return 'local'
}
