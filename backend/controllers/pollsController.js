const db = require('../db') // connexion à MySQL

// -----------------------------------------------
// CRÉER UN SONDAGE
// Appelée quand React envoie POST /api/polls
// Réservée aux admins
// -----------------------------------------------
const createPoll = async (req, res) => {
  try {
    // On récupère le titre, la description et les options envoyés par React
    const { title, description, options } = req.body

    // Vérifications de base
    if (!title || !options || options.length < 2) {
      return res.status(400).json({ 
        message: 'Titre et au moins 2 options sont obligatoires' 
      })
    }

    // Insérer le sondage dans la table polls
    // req.user.id = l'id de l'admin connecté (mis par authMiddleware)
    const [result] = await db.query(
      'INSERT INTO polls (title, description, created_by) VALUES (?, ?, ?)',
      [title, description || null, req.user.id]
    )

    const pollId = result.insertId // l'id du sondage qu'on vient de créer

    // Insérer chaque option dans la table options
    // options = ['Python', 'JavaScript', 'PHP', 'Java']
    for (const label of options) {
      await db.query(
        'INSERT INTO options (poll_id, label) VALUES (?, ?)',
        [pollId, label]
      )
    }

    res.status(201).json({ 
      message: 'Sondage créé avec succès', 
      pollId 
    })

  } catch (error) {
    console.error('Erreur création sondage:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// -----------------------------------------------
// LISTE DE TOUS LES SONDAGES
// Appelée quand React envoie GET /api/polls
// -----------------------------------------------
const getAllPolls = async (req, res) => {
  try {
    // On récupère tous les sondages avec le nombre de votes de chacun
    // COUNT(v.id) compte les votes, LEFT JOIN inclut les sondages sans votes
    const [polls] = await db.query(`
      SELECT 
        p.id,
        p.title,
        p.description,
        p.created_at,
        COUNT(v.id) AS total_votes
      FROM polls p
      LEFT JOIN votes v ON v.poll_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `)

    res.json(polls)

  } catch (error) {
    console.error('Erreur liste sondages:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// -----------------------------------------------
// DÉTAIL D'UN SONDAGE
// Appelée quand React envoie GET /api/polls/:id
// -----------------------------------------------
const getPollById = async (req, res) => {
  try {
    const pollId = req.params.id // l'id dans l'URL ex: /api/polls/3

    // Récupérer le sondage
    const [polls] = await db.query(
      'SELECT * FROM polls WHERE id = ?', [pollId]
    )

    // Si le sondage n'existe pas
    if (polls.length === 0) {
      return res.status(404).json({ message: 'Sondage introuvable' })
    }

    // Récupérer les options de ce sondage
    const [options] = await db.query(
      'SELECT * FROM options WHERE poll_id = ?', [pollId]
    )

    // Renvoyer le sondage avec ses options
    res.json({ ...polls[0], options })

  } catch (error) {
    console.error('Erreur détail sondage:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// -----------------------------------------------
// SUPPRIMER UN SONDAGE (admin seulement)
// Appelée quand React envoie DELETE /api/polls/:id
// -----------------------------------------------
const deletePoll = async (req, res) => {
  try {
    const pollId = req.params.id

    // Grâce aux FOREIGN KEY avec ON DELETE CASCADE dans le SQL,
    // supprimer le sondage supprime aussi ses options et ses votes
    await db.query('DELETE FROM polls WHERE id = ?', [pollId])

    res.json({ message: 'Sondage supprimé avec succès' })

  } catch (error) {
    console.error('Erreur suppression sondage:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { createPoll, getAllPolls, getPollById, deletePoll }