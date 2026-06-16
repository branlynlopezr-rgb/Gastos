import {
  Calendar,
  LayoutDashboard,
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

interface MobileNavProps {
  activeItem?: SidebarItem
}

export function MobileNav({ activeItem = 'dashboard' }: MobileNavProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-vh-border bg-vh-surface/95 px-2 py-2 backdrop-blur-md md:hidden"
      aria-label="Navegación móvil"
    >
      {SIDEBAR_ITEMS.slice(0, 4).map((item) => {
        const Icon = ICONS[item.id]
        const isActive = item.id === activeItem

        return (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            className={[
              'flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-all active:scale-95',
              isActive ? 'text-vh-primary' : 'text-vh-muted',
            ].join(' ')}
          >
            <Icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 2} />
            <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
          </button>
        )
      })}

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
        className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-vh-muted transition-all active:scale-95"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
        <span className="text-[10px] font-medium">Tema</span>
      </button>
    </nav>
  )
}
