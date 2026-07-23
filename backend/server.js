const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes  = require('./routes/auth')
const pollsRoutes = require('./routes/polls')
const votesRoutes = require('./routes/votes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth',  authRoutes)
app.use('/api/polls', pollsRoutes)
app.use('/api/votes', votesRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})