import { useMemo, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { OverviewPage } from '@/pages/OverviewPage'
import { ManagePage } from '@/pages/ManagePage'
import { AuthPage } from '@/pages/AuthPage'
import { useAuth } from '@/context/AuthProvider'
import type { NavTab } from '@/config/navigation'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="vh-card flex min-h-[320px] animate-vh-fade-up flex-col items-center justify-center gap-3 p-10 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-vh-muted">
        Próximamente
      </p>
      <h2 className="text-2xl font-semibold text-vh-text">{title}</h2>
      <p className="max-w-md text-sm text-vh-muted">
        Esta sección se diseñará en una fase posterior del demo.
      </p>
    </div>
  )
}

export default function App() {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState<NavTab>('overview')
  const greeting = useMemo(() => getGreeting(), [])

  if (!isAuthenticated) {
    return <AuthPage />
  }

  const content = (() => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewPage
            greeting={greeting}
            onNavigate={setActiveTab}
          />
        )
      case 'activity':
        return <PlaceholderPage title="Actividad" />
      case 'manage':
        return <ManagePage />
      case 'program':
        return <PlaceholderPage title="Programa" />
      case 'account':
        return <PlaceholderPage title="Cuenta" />
      case 'reports':
        return <PlaceholderPage title="Reportes" />
    }
  })()

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div key={activeTab} className="animate-vh-fade-up">
        {content}
      </div>
    </AppLayout>
  )
}
