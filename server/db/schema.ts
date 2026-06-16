export const CREATE_TRANSACTIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('expense', 'income')),
    amount REAL NOT NULL CHECK(amount > 0),
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`
