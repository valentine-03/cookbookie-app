import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'
import AddRecipe from './pages/AddRecipe'
import NutritionGuide from './pages/NutritionGuide'
import Contact from './pages/Contact'
import Settings from './pages/Settings'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <div className="page-loading">Loading…</div>

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />

      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/recipes" element={<ProtectedRoute><Layout><Recipes /></Layout></ProtectedRoute>} />
      <Route path="/recipes/:id" element={<ProtectedRoute><Layout><RecipeDetail /></Layout></ProtectedRoute>} />
      <Route path="/add" element={<ProtectedRoute><Layout><AddRecipe /></Layout></ProtectedRoute>} />
      <Route path="/nutrition-guide" element={<ProtectedRoute><Layout><NutritionGuide /></Layout></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><Layout><Contact /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
      <Route path="/account" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
    </Routes>
  )
}