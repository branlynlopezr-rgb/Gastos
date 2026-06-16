export type NavTab =
  | 'overview'
  | 'activity'
  | 'manage'
  | 'program'
  | 'account'
  | 'reports'

export type SidebarItem =
  | 'dashboard'
  | 'calendar'
  | 'messages'
  | 'security'
  | 'users'
  | 'settings'

export interface NavTabConfig {
  id: NavTab
  label: string
}

export interface SidebarItemConfig {
  id: SidebarItem
  label: string
}

export const NAV_TABS: NavTabConfig[] = [
  { id: 'overview', label: 'Resumen' },
  { id: 'activity', label: 'Actividad' },
  { id: 'manage', label: 'Gestionar' },
  { id: 'program', label: 'Programa' },
  { id: 'account', label: 'Cuenta' },
  { id: 'reports', label: 'Reportes' },
]

export const SIDEBAR_ITEMS: SidebarItemConfig[] = [
  { id: 'dashboard', label: 'Panel' },
  { id: 'calendar', label: 'Calendario' },
  { id: 'messages', label: 'Mensajes' },
  { id: 'security', label: 'Seguridad' },
  { id: 'users', label: 'Usuarios' },
  { id: 'settings', label: 'Configuración' },
]

export const DEMO_USER = {
  name: 'Tu cuenta',
  email: 'pendiente@vitalhood.com',
  initials: 'VH',
}
