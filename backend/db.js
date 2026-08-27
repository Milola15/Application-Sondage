const mysql = require('mysql2')
require('dotenv').config()

let pool

// Si DATABASE_URL existe (Railway), on l'utilise directement
// Sinon on utilise les variables séparées (local)
if (process.env.DATABASE_URL) {
  pool = mysql.createPool(process.env.DATABASE_URL)
} else {
  pool = mysql.createPool({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
}

module.exports = pool.promise()