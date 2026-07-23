const jwt = require('jsonwebtoken')

// Ce middleware est un "gardien" : il vérifie que l'utilisateur est connecté
// Il sera placé devant les routes qui nécessitent d'être connecté
const authMiddleware = (req, res, next) => {

  // Le token est envoyé dans le header de la requête sous cette forme :
  // Authorization: Bearer eyJhbGc...
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // on prend juste le token

  // Si pas de token → l'utilisateur n'est pas connecté
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé, token manquant' })
  }

  try {
    // Vérifier que le token est valide et non expiré
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Stocker les infos de l'utilisateur dans req.user
    // pour que les controllers puissent y accéder
    req.user = decoded

    // Passer à la suite (route suivante)
    next()

  } catch (error) {
    res.status(403).json({ message: 'Token invalide ou expiré' })
  }
}

module.exports = authMiddleware