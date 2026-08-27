import axios from 'axios'

// L'adresse de base de notre backend Express
// Toutes les requêtes commenceront par cette URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

// -----------------------------------------------
// INTERCEPTEUR — ajout automatique du token
// -----------------------------------------------
// Avant chaque requête, on vérifie si un token
// existe dans le localStorage et on l'ajoute
// automatiquement dans le Header
// Comme ça on n'a pas besoin de le faire manuellement
// dans chaque page
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// -----------------------------------------------
// FONCTIONS AUTH
// -----------------------------------------------

// Inscription
export const register = (data) => API.post('/auth/register', data)

// Connexion
export const login = (data) => API.post('/auth/login', data)

// -----------------------------------------------
// FONCTIONS SONDAGES
// -----------------------------------------------

// Récupérer tous les sondages
export const getAllPolls = () => API.get('/polls')

// Récupérer un sondage par son id
export const getPollById = (id) => API.get(`/polls/${id}`)

// Créer un sondage (admin seulement)
export const createPoll = (data) => API.post('/polls', data)

// Supprimer un sondage (admin seulement)
export const deletePoll = (id) => API.delete(`/polls/${id}`)

// -----------------------------------------------
// FONCTIONS VOTES
// -----------------------------------------------

// Voter pour une option
export const vote = (pollId, optionId) => 
  API.post(`/votes/${pollId}`, { optionId })

// Récupérer les résultats d'un sondage
export const getResults = (pollId) => API.get(`/votes/${pollId}/results`)