import type { VercelRequest, VercelResponse } from '@vercel/node'
import { deleteTransactionById } from '../../server/handlers.js'
import { methodNotAllowed, sendError } from '../_lib/http.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    return methodNotAllowed(res)
  }
  try {
    const id = Number(req.query.id)
    if (!id) {
      return res.status(400).json({ error: 'ID inválido' })
    }
    res.status(200).json(await deleteTransactionById(id))
  } catch (err) {
    sendError(res, err)
  }
}
