/**
 * Elimina la base de datos local SQLite (solo desarrollo).
 * Ejecutar: npm run db:reset
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'data', 'gastos.db')

for (const file of [dbPath, `${dbPath}-wal`, `${dbPath}-shm`]) {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
    console.log(`Eliminado: ${file}`)
  }
}

console.log('')
console.log('Base de datos local limpiada.')
console.log('Reinicia el servidor: npm run dev:all')
console.log('')
