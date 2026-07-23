const express    = require('express')
const router     = express.Router()
const auth       = require('../middleware/auth')      // vérifie connexion
const isAdmin    = require('../middleware/isAdmin')   // vérifie rôle admin
const { createPoll, getAllPolls, getPollById, deletePoll } = require('../controllers/pollsController')

// GET /api/polls → liste tous les sondages (tout le monde peut voir)
router.get('/', getAllPolls)

// GET /api/polls/:id → détail d'un sondage (tout le monde peut voir)
router.get('/:id', getPollById)

// POST /api/polls → créer un sondage (admin connecté seulement)
// auth vérifie d'abord que tu es connecté, isAdmin vérifie que tu es admin
router.post('/', auth, isAdmin, createPoll)

// DELETE /api/polls/:id → supprimer (admin seulement)
router.delete('/:id', auth, isAdmin, deletePoll)

module.exports = router