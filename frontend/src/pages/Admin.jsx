import { useState, useEffect } from 'react'
import { getAllPolls, createPoll, deletePoll } from '../services/api'

const Admin = () => {
  const [polls, setPolls]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')

  // État du formulaire de création
  const [title, setTitle]         = useState('')
  const [description, setDesc]    = useState('')
  const [options, setOptions]     = useState(['', '']) // minimum 2 options
  const [creating, setCreating]   = useState(false)
  const [showForm, setShowForm]   = useState(false)  // afficher/cacher le form

  // Charger les sondages au démarrage
  useEffect(() => {
    fetchPolls()
  }, [])

  const fetchPolls = async () => {
    try {
      const response = await getAllPolls()
      setPolls(response.data)
    } catch (err) {
      setError('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  // Modifier une option dans le tableau
  const handleOptionChange = (index, value) => {
    const newOptions = [...options] // copie du tableau
    newOptions[index] = value       // modifie l'option à l'index
    setOptions(newOptions)
  }

  // Ajouter une nouvelle option vide
  const addOption = () => {
    setOptions([...options, ''])
  }

  // Supprimer une option (minimum 2)
  const removeOption = (index) => {
    if (options.length <= 2) return
    setOptions(options.filter((_, i) => i !== index))
  }

  // Créer un sondage
  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Filtrer les options vides
    const filledOptions = options.filter(o => o.trim() !== '')
    if (filledOptions.length < 2) {
      setError('Ajoutez au moins 2 options')
      return
    }

    setCreating(true)
    try {
      await createPoll({
        title,
        description,
        options: filledOptions
      })
      setSuccess('Sondage créé avec succès !')
      // Réinitialiser le formulaire
      setTitle('')
      setDesc('')
      setOptions(['', ''])
      setShowForm(false)
      // Recharger la liste
      fetchPolls()
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création')
    } finally {
      setCreating(false)
    }
  }

  // Supprimer un sondage
  const handleDelete = async (pollId) => {
    if (!window.confirm('Supprimer ce sondage ?')) return
    try {
      await deletePoll(pollId)
      setSuccess('Sondage supprimé')
      // Mettre à jour la liste sans recharger
      setPolls(polls.filter(p => p.id !== pollId))
    } catch (err) {
      setError('Erreur lors de la suppression')
    }
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-gray-800 mb-1">
            Dashboard admin
          </h1>
          <p className="text-sm text-gray-500">
            Gérez les sondages de l'application.
          </p>
        </div>
        <span className="bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full">
          Admin
        </span>
      </div>

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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total sondages</p>
          <p className="text-2xl font-medium text-gray-800">{polls.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Total votes</p>
          <p className="text-2xl font-medium text-gray-800">
            {polls.reduce((sum, p) => sum + Number(p.total_votes), 0)}
          </p>
        </div>
      </div>

      {/* Bouton nouveau sondage */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-violet-500 hover:bg-violet-600 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border-none cursor-pointer"
        >
          + {showForm ? 'Annuler' : 'Nouveau sondage'}
        </button>
      </div>

      {/* Formulaire création */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-base font-medium text-gray-800 mb-4">
            Créer un sondage
          </h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Titre</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Quel framework préférez-vous ?"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Description (optionnelle)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Une courte description..."
                rows={2}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Options de vote
              </label>
              <div className="flex flex-col gap-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                    />
                    {/* Bouton supprimer option */}
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer text-lg"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Ajouter une option */}
              <button
                type="button"
                onClick={addOption}
                className="text-sm text-violet-600 hover:text-violet-800 mt-2 bg-transparent border-none cursor-pointer"
              >
                + Ajouter une option
              </button>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="bg-violet-500 hover:bg-violet-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 border-none cursor-pointer"
            >
              {creating ? 'Création...' : 'Créer le sondage'}
            </button>
          </form>
        </div>
      )}

      {/* Liste des sondages */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* En-tête tableau */}
        <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
          <span className="text-xs font-medium text-gray-500">Sondage</span>
          <span className="text-xs font-medium text-gray-500 text-center">Votes</span>
          <span className="text-xs font-medium text-gray-500 text-right">Action</span>
        </div>

        {/* Lignes */}
        {loading ? (
          <p className="text-center text-sm text-gray-400 py-6">Chargement...</p>
        ) : polls.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">
            Aucun sondage créé.
          </p>
        ) : (
          polls.map((poll) => (
            <div
              key={poll.id}
              className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-gray-100 items-center last:border-0"
            >
              <span className="text-sm text-gray-700 truncate">{poll.title}</span>
              <span className="text-sm text-gray-500 text-center">
                {poll.total_votes}
              </span>
              <div className="flex justify-end">
                <button
                  onClick={() => handleDelete(poll.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Admin