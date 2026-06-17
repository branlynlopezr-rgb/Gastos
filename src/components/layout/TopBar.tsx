import type { ReactNode } from 'react'
import { Bell, ChevronDown, Info, Moon, Search, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeProvider'
import { useAuth } from '@/context/AuthProvider'
import { NAV_TABS, type NavTab } from '@/config/navigation'

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

interface TopBarProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

export function TopBar({ activeTab, onTabChange }: TopBarProps) {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const displayName = user?.name ?? 'Usuario'
  const displayEmail = user?.email ?? ''
  const initials = user ? initialsFromName(user.name) : 'VH'

  return (
    <header className="sticky top-0 z-20 border-b border-vh-border bg-vh-bg/90 backdrop-blur-md transition-colors">
      <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vh-primary text-sm font-bold text-white shadow-vh-soft">
            VH
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold leading-tight text-vh-text">
              Gastos
            </p>
            <p className="truncate text-xs text-vh-muted">VitalHood</p>
          </div>
        </div>

        <nav
          className="hidden items-center gap-1 rounded-full bg-vh-surface p-1 shadow-vh-card xl:flex"
          aria-label="Secciones"
        >
          {NAV_TABS.map((tab) => {
            const isActive = tab.id === activeTab

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95',
                  isActive
                    ? 'bg-vh-dark text-white shadow-vh-soft'
                    : 'text-vh-muted hover:text-vh-text',
                ].join(' ')}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <IconButton label="Buscar">
            <Search className="h-5 w-5" />
          </IconButton>
          <IconButton label="Notificaciones" className="hidden sm:flex">
            <Bell className="h-5 w-5" />
          </IconButton>
          <IconButton label="Información" className="hidden sm:flex">
            <Info className="h-5 w-5" />
          </IconButton>
          <IconButton
            label={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
            className="md:hidden"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </IconButton>

          <button
            type="button"
            className="ml-1 flex items-center gap-2 rounded-2xl bg-vh-surface px-2 py-1.5 shadow-vh-card transition-all hover:shadow-vh-soft active:scale-[0.98] sm:gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-vh-primary/15 text-sm font-semibold text-vh-primary">
              {initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight text-vh-text">
                {displayName}
              </p>
              <p className="text-xs text-vh-muted">{displayEmail}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-vh-muted sm:block" />
          </button>
        </div>
      </div>

      <nav
        className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-3 sm:px-6 xl:hidden"
        aria-label="Secciones móvil"
      >
        {NAV_TABS.map((tab) => {
          const isActive = tab.id === activeTab

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={[
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95',
                isActive
                  ? 'bg-vh-dark text-white shadow-vh-soft'
                  : 'bg-vh-surface text-vh-muted',
              ].join(' ')}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}

function IconButton({
  label,
  children,
  className = '',
  onClick,
}: {
  label: string
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-xl text-vh-muted transition-all hover:bg-vh-surface hover:text-vh-text active:scale-95 ${className}`}
    >
      {children}
    </button>
  )
}
