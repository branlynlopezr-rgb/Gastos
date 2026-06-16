import {
  Calendar,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  Settings,
  Shield,
  Sun,
  Users,
} from 'lucide-react'
import { useTheme } from '@/context/ThemeProvider'
import { SIDEBAR_ITEMS, type SidebarItem } from '@/config/navigation'

const ICONS = {
  dashboard: LayoutDashboard,
  calendar: Calendar,
  messages: MessageSquare,
  security: Shield,
  users: Users,
  settings: Settings,
} as const

interface SidebarProps {
  activeItem?: SidebarItem
}

export function Sidebar({ activeItem = 'dashboard' }: SidebarProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className="hidden w-[72px] shrink-0 flex-col items-center border-r border-vh-border bg-vh-surface py-5 transition-colors md:flex">
      <button
        type="button"
        onClick={toggleTheme}
        className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-vh-bg text-vh-muted transition-all hover:scale-105 hover:text-vh-text active:scale-95"
        aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
        title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </button>

      <nav className="flex flex-1 flex-col items-center gap-2" aria-label="Navegación principal">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = ICONS[item.id]
          const isActive = item.id === activeItem

          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'flex h-11 w-11 items-center justify-center rounded-xl transition-all',
                isActive
                  ? 'bg-vh-dark text-white shadow-vh-soft'
                  : 'text-vh-muted hover:scale-105 hover:bg-vh-bg hover:text-vh-text active:scale-95',
              ].join(' ')}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 2} />
            </button>
          )
        })}
      </nav>

      <div className="mt-4 flex flex-col items-center gap-2">
        <button
          type="button"
          title="Ayuda"
          aria-label="Ayuda"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-vh-muted transition-all hover:scale-105 hover:bg-vh-bg hover:text-vh-text active:scale-95"
        >
          <CircleHelp className="h-5 w-5" />
        </button>
        <button
          type="button"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-vh-muted transition-all hover:scale-105 hover:bg-red-500/10 hover:text-vh-danger active:scale-95"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </aside>
  )
}
