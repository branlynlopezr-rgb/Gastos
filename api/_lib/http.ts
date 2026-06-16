import type { VercelRequest, VercelResponse } from '@vercel/node'
import { HttpError } from '../server/handlers.js'

export function sendError(res: VercelResponse, err: unknown) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message })
    return
  }
  console.error(err)
  res.status(500).json({
    error: err instanceof Error ? err.message : 'Error interno del servidor',
  })
}

export function methodNotAllowed(res: VercelResponse) {
  res.status(405).json({ error: 'Método no permitido' })
}

export type ApiHandler = (
  req: VercelRequest,
  res: VercelResponse,
) => Promise<void>
