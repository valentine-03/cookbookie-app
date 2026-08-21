import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

// This hook is the "API layer" for the whole app. Every recipe CRUD
export function useRecipes() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchRecipes = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id) // Filters recipes by the logged-in user's ID
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setRecipes(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (user) fetchRecipes()
  }, [user, fetchRecipes])

  async function addRecipe(recipe) {
    if (!user) return { error: { message: 'User not authenticated' } }

    const { data, error } = await supabase
      .from('recipes')
      .insert([{ ...recipe, user_id: user.id }])
      .select()
    if (error) return { error }
    setRecipes((prev) => [data[0], ...prev])
    return { data: data[0] }
  }

  async function deleteRecipe(id) {
    if (!user) return { error: { message: 'User not authenticated' } }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) return { error }
    setRecipes((prev) => prev.filter((r) => r.id !== id))
    return {}
  }

  async function updateRecipe(id, updates) {
    if (!user) return { error: { message: 'User not authenticated' } }

    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()

    if (error) return { error }
    setRecipes((prev) => prev.map((r) => (r.id === id ? data[0] : r)))
    return { data: data[0] }
  }

  return { recipes, loading, error, addRecipe, deleteRecipe, updateRecipe, refetch: fetchRecipes }
}