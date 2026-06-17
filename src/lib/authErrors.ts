const ERROR_MAP: Record<string, string> = {
  'Invalid login credentials': 'Correo o contraseña incorrectos.',
  'Email not confirmed': 'Confirma tu correo antes de iniciar sesión.',
  'User already registered': 'Ya existe una cuenta con este correo.',
  'Password should be at least 6 characters':
    'La contraseña debe tener al menos 6 caracteres.',
  'Signup requires a valid password': 'Introduce una contraseña válida.',
  'Unable to validate email address: invalid format': 'Introduce un correo válido.',
  'For security purposes, you can only request this once every 60 seconds':
    'Espera un minuto antes de volver a solicitar el enlace.',
}

export function translateAuthError(message: string): string {
  const trimmed = message.trim()
  if (!trimmed) return 'Ocurrió un error. Inténtalo de nuevo.'

  for (const [key, value] of Object.entries(ERROR_MAP)) {
    if (trimmed.includes(key)) return value
  }

  if (/rate limit/i.test(trimmed)) {
    return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.'
  }

  return trimmed
}
