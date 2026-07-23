// Ce middleware vérifie que l'utilisateur connecté est bien un admin
// Il doit toujours être utilisé APRÈS authMiddleware
const isAdmin = (req, res, next) => {

  // req.user a été rempli par authMiddleware juste avant
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' })
  }

  // Si c'est bien un admin, on continue
  next()
}

module.exports = isAdmin