import cors from 'cors'
import express from 'express'
import {
  clearAllTransactions,
  createTransaction,
  deleteTransactionById,
  getDashboard,
  getHealth,
  getTransactions,
  HttpError,
} from './handlers.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  res.json(await getHealth())
})

app.get('/api/transactions', async (_req, res) => {
  res.json(await getTransactions())
})

app.get('/api/dashboard', async (_req, res) => {
  res.json(await getDashboard())
})

app.post('/api/transactions', async (req, res) => {
  try {
    const transaction = await createTransaction(req.body)
    res.status(201).json(transaction)
  } catch (err) {
    handleError(res, err)
  }
})

app.delete('/api/transactions', async (_req, res) => {
  res.json(await clearAllTransactions())
})

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    res.json(await deleteTransactionById(id))
  } catch (err) {
    handleError(res, err)
  }
})

function handleError(res: express.Response, err: unknown) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message })
    return
  }
  console.error(err)
  res.status(500).json({
    error: err instanceof Error ? err.message : 'Error interno del servidor',
  })
}

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`)
  console.log(`Base de datos local: data/gastos.db`)
})
