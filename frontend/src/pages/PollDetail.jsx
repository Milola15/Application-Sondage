import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPollById, vote } from '../services/api'

const PollDetail = () => {
  const [poll, setPoll]               = useState(null)
  const [selectedOption, setSelected] = useState(null) // option choisie
  const [loading, setLoading]         = useState(true)
  const [voting, setVoting]           = useState(false)
  const [error, setError]             = useState('')
  const [success, setSuccess]         = useState('')

  // useParams récupère l'id dans l'URL /polls/4 → id = "4"
  const { id } = useParams()
  const navigate = useNavigate()

  // Charger le sondage au démarrage
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await getPollById(id)
        setPoll(response.data)
      } catch (err) {
        setError('Sondage introuvable')
      } finally {
        setLoading(false)
      }
    }
    fetchPoll()
  }, [id])

  const handleVote = async () => {
    if (!selectedOption) {
      setError('Veuillez sélectionner une option')
      return
    }

    setVoting(true)
    setError('')

    try {
      await vote(id, selectedOption)
      setSuccess('Vote enregistré avec succès !')

      // Rediriger vers les résultats après 1.5 secondes
      setTimeout(() => navigate(`/polls/${id}/results`), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du vote')
    } finally {
      setVoting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-400 text-sm">Chargement...</p>
      </div>
    )
  }

  if (!poll) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
        Sondage introuvable.
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
        {/* Titre */}
        <h1 className="text-xl font-medium text-gray-800 mb-1">
          {poll.title}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {poll.description || 'Aucune description'}
        </p>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {/* Options */}
        <div className="flex flex-col gap-3 mb-6">
          {poll.options.map((option) => (
            <div
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`border rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer transition-all ${
                selectedOption === option.id
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 hover:border-violet-300'
              }`}
            >
              {/* Radio button custom */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedOption === option.id
                  ? 'border-violet-500'
                  : 'border-gray-300'
              }`}>
                {selectedOption === option.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                )}
              </div>

              <span className={`text-sm ${
                selectedOption === option.id
                  ? 'text-violet-700 font-medium'
                  : 'text-gray-700'
              }`}>
                {option.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bouton voter */}
        <button
          onClick={handleVote}
          disabled={voting || !selectedOption}
          className="w-full bg-violet-500 hover:bg-violet-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {voting ? 'Envoi du vote...' : 'Valider mon vote'}
        </button>

        {/* Lien résultats */}
        <button
          onClick={() => navigate(`/polls/${id}/results`)}
          className="w-full text-center text-sm text-violet-600 hover:text-violet-800 mt-3 bg-transparent border-none cursor-pointer"
        >
          Voir les résultats sans voter →
        </button>
      </div>
    </div>
  )
}

export default PollDetail