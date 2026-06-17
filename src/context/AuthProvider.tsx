import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { translateAuthError } from '@/lib/authErrors'
import { getSupabaseClient, isSupabaseAuthConfigured } from '@/lib/supabase'

const DEMO_STORAGE_KEY = 'vh-auth-demo'

export type AuthMode = 'login' | 'signup'

export interface AuthUser {
  email: string
  name: string
}

interface AuthResult {
  ok: boolean
  error?: string
  needsEmailConfirmation?: boolean
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  authConfigured: boolean
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string) => Promise<AuthResult>
  resetPassword: (email: string) => Promise<AuthResult>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function nameFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim()
  if (!local) return 'Usuario'
  return local.charAt(0).toUpperCase() + local.slice(1)
}

function userFromSession(session: Session | null): AuthUser | null {
  const email = session?.user.email?.trim()
  if (!session || !email) return null

  const metaName = session.user.user_metadata?.full_name as string | undefined
  const name = metaName?.trim() || nameFromEmail(email)
  return { email, name }
}

function readDemoUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()

    if (!supabase) {
      setUser(readDemoUser())
      setIsLoading(false)
      return
    }

    let mounted = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setUser(userFromSession(session))
        setIsLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(userFromSession(session))
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const supabase = getSupabaseClient()

    if (!supabase) {
      const nextUser = { email, name: nameFromEmail(email) }
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(nextUser))
      setUser(nextUser)
      return { ok: true }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { ok: false, error: translateAuthError(error.message) }
    }

    setUser(userFromSession(data.session))
    return { ok: true }
  }, [])

  const signUp = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const supabase = getSupabaseClient()

    if (!supabase) {
      const nextUser = { email, name: nameFromEmail(email) }
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(nextUser))
      setUser(nextUser)
      return { ok: true }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    })

    if (error) {
      return { ok: false, error: translateAuthError(error.message) }
    }

    if (data.session) {
      setUser(userFromSession(data.session))
      return { ok: true }
    }

    return { ok: true, needsEmailConfirmation: true }
  }, [])

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return {
        ok: false,
        error: 'Configura Supabase Auth (Link + Anon_Public) para recuperar contraseña.',
      }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    })

    if (error) {
      return { ok: false, error: translateAuthError(error.message) }
    }

    return { ok: true }
  }, [])

  const logout = useCallback(async () => {
    const supabase = getSupabaseClient()

    if (supabase) {
      await supabase.auth.signOut()
    }

    localStorage.removeItem(DEMO_STORAGE_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      authConfigured: isSupabaseAuthConfigured,
      signIn,
      signUp,
      resetPassword,
      logout,
    }),
    [user, isLoading, signIn, signUp, resetPassword, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return ctx
}
