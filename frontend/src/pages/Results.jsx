import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getResults, getPollById } from '../services/api'

const Results = () => {
  const [results, setResults] = useState(null)
  const [poll, setPoll]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // On récupère en même temps le sondage et ses résultats
        const [pollRes, resultsRes] = await Promise.all([
          getPollById(id),
          getResults(id)
        ])
        setPoll(pollRes.data)
        setResults(resultsRes.data)
      } catch (err) {
        setError('Erreur lors du chargement des résultats')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-400 text-sm">Chargement des résultats...</p>
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
    <div className="max-w-xl mx-auto">
      {/* Bouton retour */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 bg-transparent border-none cursor-pointer"
      >
        ← Retour aux sondages
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        {/* En-tête */}
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl font-medium text-gray-800">
            Résultats du sondage
          </h1>
          <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
            {results.totalVotes} vote{results.totalVotes !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-6">{poll?.title}</p>

        {/* Résultats */}
        <div className="flex flex-col gap-4">
          {results.results.map((option, index) => (
            <div key={option.id}>
              {/* Label + pourcentage */}
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {option.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {option.total_votes} vote{option.total_votes !== 1 ? 's' : ''}
                  </span>
                  <span className="text-sm font-medium text-violet-600">
                    {option.pourcentage}%
                  </span>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    // Plus le index est grand, plus la couleur est claire
                    width: `${option.pourcentage}%`,
                    backgroundColor: index === 0
                      ? '#7F77DD'  // 1er : violet foncé
                      : index === 1
                      ? '#AFA9EC'  // 2ème : violet moyen
                      : index === 2
                      ? '#CECBF6'  // 3ème : violet clair
                      : '#EEEDFE'  // autres : très clair
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Aucun vote */}
        {results.totalVotes === 0 && (
          <p className="text-center text-sm text-gray-400 mt-4">
            Aucun vote pour le moment.
          </p>
        )}

        {/* Bouton voter */}
        <button
          onClick={() => navigate(`/polls/${id}`)}
          className="w-full mt-6 border border-violet-300 text-violet-600 hover:bg-violet-50 py-2.5 rounded-lg text-sm font-medium transition-colors bg-transparent cursor-pointer"
        >
          Voter pour ce sondage
        </button>
      </div>
    </div>
  )
}

export default Results