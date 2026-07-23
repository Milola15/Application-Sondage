import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'

// Pages
import Home       from './pages/Home'
import Login      from './pages/Login'
import Register   from './pages/Register'
import PollDetail from './pages/PollDetail'
import Results    from './pages/Results'
import Admin      from './pages/Admin'

// -----------------------------------------------
// Route protégée — redirige si pas connecté
// -----------------------------------------------
const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

// -----------------------------------------------
// Route admin — redirige si pas admin
// -----------------------------------------------
const AdminRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'admin') return <Navigate to="/" />
  return children
}

// -----------------------------------------------
// Structure principale de l'app
// -----------------------------------------------
const AppContent = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          {/* Page publique */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Pages protégées — connecté obligatoire */}
          <Route path="/" element={
            <PrivateRoute><Home /></PrivateRoute>
          } />
          <Route path="/polls/:id" element={
            <PrivateRoute><PollDetail /></PrivateRoute>
          } />
          <Route path="/polls/:id/results" element={
            <PrivateRoute><Results /></PrivateRoute>
          } />

          {/* Page admin uniquement */}
          <Route path="/admin" element={
            <AdminRoute><Admin /></AdminRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}

const App = () => {
  return (
    // AuthProvider entoure toute l'app pour partager
    // les infos de connexion sur toutes les pages
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App