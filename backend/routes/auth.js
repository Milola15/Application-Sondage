const express = require('express')
const router  = express.Router()

// On importe les fonctions du controller
const { register, login } = require('../controllers/authController')

// Quand React envoie POST /api/auth/register → appelle la fonction register
router.post('/register', register)

// Quand React envoie POST /api/auth/login → appelle la fonction login
router.post('/login', login)

module.exports = router