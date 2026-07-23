const db = require('../db')

// -----------------------------------------------
// VOTER
// Appelée quand React envoie POST /api/votes/:pollId
// -----------------------------------------------
const vote = async (req, res) => {
  try {
    const pollId   = req.params.pollId  // id du sondage depuis l'URL
    const optionId = req.body.optionId  // option choisie envoyée par React
    const userId   = req.user.id        // id de l'utilisateur connecté

    // Vérifier que l'option appartient bien à ce sondage
    // (sécurité : éviter qu'on vote pour une option d'un autre sondage)
    const [options] = await db.query(
      'SELECT id FROM options WHERE id = ? AND poll_id = ?',
      [optionId, pollId]
    )
    if (options.length === 0) {
      return res.status(400).json({ message: 'Option invalide pour ce sondage' })
    }

    // Insérer le vote
    // Si l'utilisateur a déjà voté, MySQL va bloquer grâce à la contrainte
    // UNIQUE(user_id, poll_id) qu'on a mise dans init.sql
    await db.query(
      'INSERT INTO votes (user_id, poll_id, option_id) VALUES (?, ?, ?)',
      [userId, pollId, optionId]
    )

    res.status(201).json({ message: 'Vote enregistré avec succès' })

  } catch (error) {
    // Code 'ER_DUP_ENTRY' = MySQL dit que l'utilisateur a déjà voté
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Vous avez déjà voté pour ce sondage' })
    }
    console.error('Erreur vote:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

// -----------------------------------------------
// RÉSULTATS D'UN SONDAGE
// Appelée quand React envoie GET /api/votes/:pollId/results
// -----------------------------------------------
const getResults = async (req, res) => {
  try {
    const pollId = req.params.pollId

    // Compter les votes par option avec COUNT et GROUP BY
    // C'est exactement la requête demandée dans le challenge !
    const [results] = await db.query(`
      SELECT 
        o.id,
        o.label,
        COUNT(v.id) AS total_votes
      FROM options o
      LEFT JOIN votes v ON v.option_id = o.id
      WHERE o.poll_id = ?
      GROUP BY o.id, o.label
    `, [pollId])

    // Calculer le total général pour faire les pourcentages
    const totalVotes = results.reduce((sum, r) => sum + Number(r.total_votes), 0)

    // Ajouter le pourcentage à chaque option
    // Formule : (votes de l'option / total) × 100
    const resultatsAvecPourcentage = results.map(r => ({
      ...r,
      pourcentage: totalVotes > 0
        ? Math.round((Number(r.total_votes) / totalVotes) * 100)
        : 0
    }))

    res.json({ 
      pollId, 
      totalVotes, 
      results: resultatsAvecPourcentage 
    })

  } catch (error) {
    console.error('Erreur résultats:', error)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports = { vote, getResults }