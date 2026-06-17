function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1877F2]" aria-hidden>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  )
}

function BehanceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#1769FF]" aria-hidden>
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-2.297-5.564-5.625 0-3.25 2.305-5.692 5.427-5.692 3.414 0 5.411 2.162 5.411 5.675 0 .325-.027.637-.072.937H15.97c.104 1.031 1.037 1.918 2.7 1.918 1.221 0 2.075-.563 2.377-1.453h3.679zM15.973 11.989c-.024-1.045-.766-1.958-2.024-1.958-1.416 0-2.089 1.166-2.087 1.958h4.111zM9.632 5.214c-1.621-.008-3.055.583-4.039 2.178l3.459 1.457c.583-1.109 2.026-1.213 2.582-.274.553.938-.274 1.457-.953 1.684l-.01.004c-1.788.675-3.711 2.986-3.093 5.122.725 2.523 3.528 3.871 6.473 2.902 1.448-.507 2.427-1.666 2.777-2.756h-3.524c-.437.986-1.585 1.031-2.072.104-.325-.595-.178-1.279.427-1.775C11.3 14.25 14.478 13.3 14.478 9.71c0-2.69-1.947-4.496-4.846-4.496zM0 5.214v13.572h5.826c2.648-.004 4.554-1.637 4.559-4.086 0-2.523-1.864-3.789-3.638-4.104 1.713-.326 2.856-1.792 2.856-3.677 0-2.162-1.792-3.705-4.603-3.705H0zm3.831 2.143h1.305c1.083 0 1.768.571 1.768 1.509 0 .938-.685 1.509-1.768 1.509H3.831V7.357zm0 6.857h1.491c1.305 0 2.162.637 2.162 1.666 0 1.029-.857 1.666-2.162 1.666H3.831v-3.332z" />
    </svg>
  )
}

interface SocialAuthButtonsProps {
  onDemoClick: (provider: string) => void
}

export function SocialAuthButtons({ onDemoClick }: SocialAuthButtonsProps) {
  const providers = [
    { id: 'behance', label: 'Continuar con Behance', icon: <BehanceIcon /> },
    { id: 'google', label: 'Continuar con Google', icon: <GoogleIcon /> },
    { id: 'facebook', label: 'Continuar con Facebook', icon: <FacebookIcon /> },
  ]

  return (
    <div className="flex items-center justify-center gap-3">
      {providers.map((provider) => (
        <button
          key={provider.id}
          type="button"
          title={provider.label}
          aria-label={provider.label}
          onClick={() => onDemoClick(provider.id)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm active:scale-95"
        >
          {provider.icon}
        </button>
      ))}
    </div>
  )
}
