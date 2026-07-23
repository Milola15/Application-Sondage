import { createContext, useContext, useState, useEffect } from 'react'

// Créer le contexte — c'est comme une boîte partagée
// accessible depuis n'importe quelle page
const AuthContext = createContext()

// AuthProvider = le composant qui entoure toute l'application
// et donne accès à la boîte partagée
export const AuthProvider = ({ children }) => {

  // user = les infos de l'utilisateur connecté (null si pas connecté)
  const [user, setUser] = useState(null)

  // Au démarrage de l'app, on vérifie si un token
  // existe déjà dans localStorage (si l'utilisateur
  // était déjà connecté avant)
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Fonction appelée après une connexion réussie
  // Elle sauvegarde le token et les infos dans localStorage
  const loginUser = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  // Fonction appelée quand l'utilisateur se déconnecte
  // Elle supprime tout du localStorage
  const logoutUser = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    // On met à disposition user, loginUser et logoutUser
    // pour toutes les pages de l'application
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personnalisé pour utiliser le contexte facilement
// Au lieu d'écrire useContext(AuthContext) partout,
// on écrit juste useAuth()
export const useAuth = () => useContext(AuthContext)