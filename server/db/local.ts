import initSqlJs, { type Database } from 'sql.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CreateTransactionInput, Transaction } from '../../src/types/transaction.js'
import { CREATE_TRANSACTIONS_TABLE } from './schema.js'
import { type DbAdapter, rowToTransaction } from './types.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '..', '..', 'data')
const dbPath = path.join(dataDir, 'gastos.db')

export async function createLocalDb(): Promise<DbAdapter> {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  const wasmDir = path.join(__dirname, '..', '..', 'node_modules', 'sql.js', 'dist')
  const SQL = await initSqlJs({
    locateFile: (file) => path.join(wasmDir, file),
  })

  let db: Database
  if (fs.existsSync(dbPath)) {
    db = new SQL.Database(fs.readFileSync(dbPath))
  } else {
    db = new SQL.Database()
  }

  db.run(CREATE_TRANSACTIONS_TABLE)

  function persist() {
    fs.writeFileSync(dbPath, Buffer.from(db.export()))
  }

  function rowsFromExec(sql: string, params: unknown[] = []) {
    const stmt = db.prepare(sql)
    stmt.bind(params)
    const rows: Transaction[] = []
    while (stmt.step()) {
      rows.push(rowToTransaction(stmt.getAsObject() as Record<string, unknown>))
    }
    stmt.free()
    return rows
  }

  return {
    async getAllTransactions() {
      return rowsFromExec(
        'SELECT * FROM transactions ORDER BY date DESC, id DESC',
      )
    },

    async getTransactionById(id: number) {
      const rows = rowsFromExec(
        'SELECT * FROM transactions WHERE id = ?',
        [id],
      )
      return rows[0]
    },

    async createTransaction(input: CreateTransactionInput) {
      db.run(
        `INSERT INTO transactions (type, amount, description, category, date)
         VALUES (?, ?, ?, ?, ?)`,
        [input.type, input.amount, input.description, input.category, input.date],
      )
      persist()
      const id = db.exec('SELECT last_insert_rowid() as id')[0]?.values[0]?.[0] as number
      return (await this.getTransactionById(id))!
    },

    async deleteTransaction(id: number) {
      db.run('DELETE FROM transactions WHERE id = ?', [id])
      persist()
      return true
    },

    async clearAllTransactions() {
      db.run('DELETE FROM transactions')
      db.run('DELETE FROM sqlite_sequence WHERE name = "transactions"')
      persist()
    },
  }
}

export { dbPath }
