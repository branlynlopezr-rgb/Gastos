/** Lee variables de entorno probando varios nombres (Vercel es case-sensitive en Linux). */
export function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim()
    if (value) return value
  }
  return undefined
}

/** Nombres exactos en tu Vercel: Link, service_role, Anon_Public */
export function getSupabaseUrl(): string | undefined {
  return readEnv(
    'Link',
    'link',
    'LINK',
    'SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
  )
}

export function getSupabaseServiceRole(): string | undefined {
  return readEnv(
    'service_role',
    'SERVICE_ROLE',
    'SUPABASE_SERVICE_ROLE_KEY',
  )
}

export function getSupabaseAnonKey(): string | undefined {
  return readEnv(
    'Anon_Public',
    'anon_public',
    'ANON_PUBLIC',
    'SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  )
}

export function hasSupabaseCredentials(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseServiceRole())
}
