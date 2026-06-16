import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MobileNav } from './MobileNav'
import type { NavTab } from '@/config/navigation'

interface AppLayoutProps {
  children: ReactNode
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

export function AppLayout({ children, activeTab, onTabChange }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-vh-bg transition-colors">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar activeTab={activeTab} onTabChange={onTabChange} />
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 sm:px-6 md:pb-6 lg:px-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
