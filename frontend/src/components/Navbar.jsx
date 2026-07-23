import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }

  // Initiales de l'utilisateur pour l'avatar
  const initiales = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : '?'

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
          <span className="text-white text-sm font-bold">P</span>
        </div>
        <span className="font-medium text-gray-800 text-base">PollsApp</span>
      </Link>

      {/* Partie droite */}
      {user ? (
        <div className="flex items-center gap-4">
          {/* Lien dashboard si admin */}
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className="text-sm text-violet-600 hover:text-violet-800 no-underline"
            >
              Dashboard
            </Link>
          )}

          {/* Nom + avatar */}
          <span className="text-sm text-gray-500">{user.name}</span>
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-medium">
            {initiales}
          </div>

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer"
          >
            Déconnexion
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-600 no-underline hover:text-gray-800">
            Connexion
          </Link>
          <Link
            to="/register"
            className="text-sm bg-violet-500 text-white px-4 py-2 rounded-lg no-underline hover:bg-violet-600"
          >
            S'inscrire
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar