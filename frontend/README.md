# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

# 📊 PollsApp — Application de Sondage et de Vote

Challenge 13 — ITF Girls Dev | Niveau Débutant → Intermédiaire

---

## 📌 Description

PollsApp est une application web fullstack permettant aux utilisateurs de participer à des sondages en ligne.
Elle permet la création de sondages, l'enregistrement des votes et l'affichage des résultats sous forme de pourcentages.

---

## 🛠️ Technologies utilisées

### Backend
- **Node.js** — environnement d'exécution JavaScript
- **Express.js** — framework backend pour l'API REST
- **MySQL** — base de données relationnelle
- **bcrypt** — hashage des mots de passe
- **jsonwebtoken** — authentification par token JWT
- **dotenv** — gestion des variables d'environnement
- **cors** — autorisation des requêtes cross-origin

### Frontend
- **React** — bibliothèque JavaScript pour l'interface utilisateur
- **Vite** — outil de build rapide
- **Tailwind CSS** — framework CSS utilitaire
- **Axios** — client HTTP pour les appels API
- **React Router DOM** — navigation entre les pages

---

## 📁 Structure du projet

```
polls-app/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      # Logique inscription et connexion
│   │   ├── pollsController.js     # Logique CRUD des sondages
│   │   └── votesController.js     # Logique vote et résultats
│   ├── middleware/
│   │   ├── auth.js                # Vérification du token JWT
│   │   └── isAdmin.js             # Vérification du rôle admin
│   ├── routes/
│   │   ├── auth.js                # Routes /api/auth
│   │   ├── polls.js               # Routes /api/polls
│   │   └── votes.js               # Routes /api/votes
│   ├── db.js                      # Connexion MySQL
│   ├── server.js                  # Point d'entrée du serveur
│   ├── .env                       # Variables d'environnement (non versionné)
│   └── init.sql                   # Script de création de la base de données
│
└── frontend/
    └── src/
        ├── components/
        │   └── Navbar.jsx         # Barre de navigation
        ├── context/
        │   └── AuthContext.jsx    # Contexte d'authentification global
        ├── pages/
        │   ├── Login.jsx          # Page de connexion
        │   ├── Register.jsx       # Page d'inscription
        │   ├── Home.jsx           # Liste des sondages
        │   ├── PollDetail.jsx     # Voter pour un sondage
        │   ├── Results.jsx        # Résultats d'un sondage
        │   └── Admin.jsx          # Dashboard administrateur
        ├── services/
        │   └── api.js             # Centralisation des appels API
        └── App.jsx                # Routes et structure de l'application
```

---

## ⚙️ Installation et lancement

### Prérequis
- Node.js v18+
- MySQL (WAMP ou XAMPP)
- Git

### 1. Cloner le projet

```bash
git clone https://github.com/Milola15/polls-app.git
cd polls-app
```

### 2. Configurer la base de données

1. Démarrer WAMP/XAMPP et s'assurer que MySQL tourne
2. Ouvrir phpMyAdmin : http://localhost/phpmyadmin
3. Aller dans l'onglet **SQL** et coller le contenu de `backend/init.sql`
4. Cliquer sur **Exécuter**

### 3. Configurer le backend

```bash
cd backend
npm install
```

Créer un fichier `.env` dans le dossier `backend/` :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=talkia_polls
JWT_SECRET=monsecretjwt2024
PORT=5000
```

Lancer le serveur backend :

```bash
node server.js
```

Le serveur démarre sur **http://localhost:5000**

### 4. Configurer le frontend

```bash
cd ../frontend
npm install
npm run dev
```

L'application démarre sur **http://localhost:5173**

---

## 🔑 Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@polls.com | admin123 |
| Utilisateur | alice@example.com | *(à créer via l'inscription)* |

---

## 🌐 API REST

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | /api/auth/register | Inscription | Non |
| POST | /api/auth/login | Connexion | Non |
| GET | /api/polls | Liste des sondages | Non |
| GET | /api/polls/:id | Détail d'un sondage | Non |
| POST | /api/polls | Créer un sondage | Admin |
| DELETE | /api/polls/:id | Supprimer un sondage | Admin |
| POST | /api/votes/:pollId | Voter | Connecté |
| GET | /api/votes/:pollId/results | Résultats | Non |

---

## ✅ Fonctionnalités

### Obligatoires
- [x] Création de sondages avec plusieurs options
- [x] Affichage de la liste des sondages
- [x] Participation au vote (une seule fois par sondage)
- [x] Affichage des résultats avec pourcentages et barres de progression

### Bonus
- [x] Authentification (inscription, connexion, JWT)
- [x] Dashboard administrateur (créer, supprimer, voir les stats)

---

## 🗄️ Structure de la base de données

```sql
users    (id, name, email, password, role, created_at)
polls    (id, title, description, created_by, expires_at, created_at)
options  (id, poll_id, label)
votes    (id, user_id, poll_id, option_id, voted_at)
         UNIQUE(user_id, poll_id) -- 1 seul vote par sondage
```

---

## 👩‍💻 Auteure

Développé par **Milola** dans le cadre du Challenge 13 — ITF Girls Dev 2026
