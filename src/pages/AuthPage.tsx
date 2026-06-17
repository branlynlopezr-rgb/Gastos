import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { AuthBrandPanel } from '@/components/auth/AuthBrandPanel'
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons'
import { VitalHoodLogo } from '@/components/auth/VitalHoodLogo'
import { useAuth, type AuthMode } from '@/context/AuthProvider'

const COPY: Record<
  AuthMode,
  { title: string; subtitle: string; submit: string; toggle: string; toggleAction: string }
> = {
  login: {
    title: 'Inicia sesión',
    subtitle:
      'Accede a tus gastos, ingresos y reportes en un solo lugar — claro y siempre disponible.',
    submit: 'Entrar',
    toggle: '¿No tienes cuenta?',
    toggleAction: 'Regístrate',
  },
  signup: {
    title: 'Crea tu cuenta',
    subtitle:
      'Accede a tus gastos, ingresos y reportes cuando quieras — todo fluyendo en un solo lugar.',
    submit: 'Comenzar',
    toggle: '¿Ya tienes cuenta?',
    toggleAction: 'Inicia sesión',
  },
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function AuthPage() {
  const { loginDemo } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [socialNotice, setSocialNotice] = useState<string | null>(null)

  const copy = COPY[mode]

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSocialNotice(null)

    if (!isValidEmail(email.trim())) {
      setError('Introduce un correo válido.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 650))
    loginDemo(email.trim().toLowerCase())
    setSubmitting(false)
  }

  function handleSocial(provider: string) {
    setError(null)
    setSocialNotice(
      `Demo: inicio con ${provider} estará disponible cuando conectemos Supabase Auth.`,
    )
  }

  function toggleMode() {
    setMode((current) => (current === 'login' ? 'signup' : 'login'))
    setError(null)
    setSocialNotice(null)
  }

  return (
    <div className="auth-shell flex min-h-full items-center justify-center px-4 py-8 sm:px-6">
      <div className="animate-vh-fade-up w-full max-w-[980px] overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_80px_-12px_rgba(67,56,202,0.18)]">
        <div className="grid lg:grid-cols-[42%_58%]">
          <AuthBrandPanel />

          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <VitalHoodLogo className="text-indigo-600" size={30} />

            <div className="mt-8">
              <h1 className="text-[1.75rem] font-bold tracking-tight text-slate-900 sm:text-3xl">
                {copy.title}
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500 sm:text-[0.95rem]">
                {copy.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="auth-email"
                  className="mb-2 block text-sm font-semibold text-slate-900"
                >
                  Tu correo
                </label>
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                />
              </div>

              <div>
                <label
                  htmlFor="auth-password"
                  className="mb-2 block text-sm font-semibold text-slate-900"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
              )}

              <button type="submit" disabled={submitting} className="auth-submit">
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Un momento…
                  </>
                ) : (
                  copy.submit
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm text-slate-400">o continúa con</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <SocialAuthButtons onDemoClick={handleSocial} />

            {socialNotice && (
              <p className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-center text-sm text-indigo-700">
                {socialNotice}
              </p>
            )}

            <p className="mt-8 text-center text-sm text-slate-500">
              {copy.toggle}{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
              >
                {copy.toggleAction}
              </button>
            </p>

            <p className="mt-4 text-center text-xs text-slate-400">
              Modo demo — cualquier correo y contraseña (6+ caracteres) entra al dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
