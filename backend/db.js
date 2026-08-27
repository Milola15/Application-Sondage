const mysql = require('mysql2')
require('dotenv').config()

let pool

if (process.env.DATABASE_URL) {
  // Connexion Railway via URL complète
  pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
  })
} else {
  // Connexion locale
  pool = mysql.createPool({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
}

module.exports = pool.promise()