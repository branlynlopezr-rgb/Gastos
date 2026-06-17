import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.Link?.trim()
const anonKey = import.meta.env.Anon_Public?.trim()

export const isSupabaseAuthConfigured = Boolean(url && anonKey)

let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseAuthConfigured) return null
  if (!client) {
    client = createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return client
}
