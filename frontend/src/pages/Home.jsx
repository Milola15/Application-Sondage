import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllPolls } from '../services/api'

const Home = () => {
  // polls = tableau des sondages venant de l'API
  const [polls, setPolls]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const navigate = useNavigate()

  // useEffect = s'exécute une seule fois au chargement de la page
  // C'est ici qu'on appelle l'API pour récupérer les sondages
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await getAllPolls()
        setPolls(response.data)
      } catch (err) {
        setError('Erreur lors du chargement des sondages')
      } finally {
        setLoading(false)
      }
    }
    fetchPolls()
  }, []) // [] = s'exécute une seule fois, pas à chaque re-rendu

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-400 text-sm">Chargement des sondages...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-800 mb-1">
          Sondages disponibles
        </h1>
        <p className="text-sm text-gray-500">
          Participez aux sondages et faites entendre votre voix.
        </p>
      </div>

      {/* Aucun sondage */}
      {polls.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-sm">Aucun sondage disponible pour le moment.</p>
        </div>
      ) : (
        /* Grille de cartes */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {polls.map((poll) => (
            <div
              key={poll.id}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-violet-300 transition-colors"
            >
              {/* Badge + icône */}
              <div className="flex items-center justify-between mb-3">
                <span className="bg-violet-50 text-violet-700 text-xs px-2 py-1 rounded-full">
                  Actif
                </span>
                <span className="text-gray-300 text-lg">📊</span>
              </div>

              {/* Titre */}
              <h2 className="text-sm font-medium text-gray-800 mb-1">
                {poll.title}
              </h2>

              {/* Description */}
              <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                {poll.description || 'Aucune description'}
              </p>

              {/* Footer carte */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {poll.total_votes} vote{poll.total_votes !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => navigate(`/polls/${poll.id}`)}
                  className="bg-violet-500 hover:bg-violet-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                >
                  Voter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home