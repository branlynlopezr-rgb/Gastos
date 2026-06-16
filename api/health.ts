import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getHealth } from '../server/handlers.js'
import { methodNotAllowed, sendError } from './_lib/http.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res)
  }
  try {
    res.status(200).json(await getHealth())
  } catch (err) {
    sendError(res, err)
  }
}
