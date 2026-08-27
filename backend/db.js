const mysql = require('mysql2')
require('dotenv').config()

let pool

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'trouvée' : 'introuvable')

if (process.env.DATABASE_URL) {
  pool = mysql.createPool(process.env.DATABASE_URL)
} else {
  pool = mysql.createPool({
    host:     process.env.DB_HOST || process.env.MYSQLHOST,
    user:     process.env.DB_USER || process.env.MYSQLUSER,
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
    database: process.env.DB_NAME || process.env.MYSQLDATABASE,
    port:     process.env.MYSQLPORT || 3306,
  })
}

module.exports = pool.promise()