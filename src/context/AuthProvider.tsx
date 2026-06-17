import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'vh-auth-demo'

export type AuthMode = 'login' | 'signup'

interface AuthUser {
  email: string
  name: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  loginDemo: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

function nameFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim()
  if (!local) return 'Usuario'
  return local.charAt(0).toUpperCase() + local.slice(1)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())

  const loginDemo = useCallback((email: string) => {
    const nextUser = { email, name: nameFromEmail(email) }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loginDemo,
      logout,
    }),
    [user, loginDemo, logout],
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
