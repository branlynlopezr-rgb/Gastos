import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  clearAllTransactions,
  createTransaction,
  getTransactions,
} from '../../server/handlers.js'
import { methodNotAllowed, sendError } from '../_lib/http.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    switch (req.method) {
      case 'GET':
        return res.status(200).json(await getTransactions())
      case 'POST':
        return res.status(201).json(await createTransaction(req.body))
      case 'DELETE':
        return res.status(200).json(await clearAllTransactions())
      default:
        return methodNotAllowed(res)
    }
  } catch (err) {
    sendError(res, err)
  }
}
