const express = require('express')
const router  = express.Router()
const auth    = require('../middleware/auth') // il faut être connecté pour voter
const { vote, getResults } = require('../controllers/votesController')

// POST /api/votes/:pollId → voter pour un sondage (connecté obligatoire)
router.post('/:pollId', auth, vote)

// GET /api/votes/:pollId/results → voir les résultats (tout le monde)
router.get('/:pollId/results', getResults)

module.exports = router