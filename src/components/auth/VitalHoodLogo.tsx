interface VitalHoodLogoProps {
  className?: string
  size?: number
}

export function VitalHoodLogo({ className = '', size = 28 }: VitalHoodLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M16 2L18.2 13.8L30 16L18.2 18.2L16 30L13.8 18.2L2 16L13.8 13.8L16 2Z"
        fill="currentColor"
      />
      <path
        d="M16 8L17.1 14.9L24 16L17.1 17.1L16 24L14.9 17.1L8 16L14.9 14.9L16 8Z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  )
}
