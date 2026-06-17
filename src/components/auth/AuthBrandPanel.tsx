import { VitalHoodLogo } from './VitalHoodLogo'

export function AuthBrandPanel() {
  return (
    <div className="relative flex min-h-[220px] flex-col justify-between overflow-hidden p-8 sm:min-h-0 sm:p-10 lg:p-12">
      <div
        className="absolute inset-0 bg-[linear-gradient(145deg,#1e3a8a_0%,#4338ca_38%,#7c3aed_68%,#c4b5fd_100%)]"
        aria-hidden
      />
      <div
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-indigo-900/30 blur-3xl"
        aria-hidden
      />

      <VitalHoodLogo className="relative text-white" size={32} />

      <div className="relative mt-auto pt-10">
        <p className="text-sm font-medium text-white/80">Empieza fácilmente</p>
        <h2 className="mt-2 max-w-xs text-2xl font-bold leading-snug tracking-tight text-white sm:text-[1.65rem]">
          Tu centro personal para claridad y control de tus finanzas
        </h2>
      </div>
    </div>
  )
}
