import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

// This hook is the "API layer" for the whole app. Every recipe CRUD
// operation goes through here, calling Supabase's auto-generated REST
// API under the hood via the supabase-js client.
export function useRecipes() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchRecipes = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setRecipes(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (user) fetchRecipes()
  }, [user, fetchRecipes])

  async function addRecipe(recipe) {
    const { data, error } = await supabase
      .from('recipes')
      .insert([{ ...recipe, user_id: user.id }])
      .select()
    if (error) return { error }
    setRecipes((prev) => [data[0], ...prev])
    return { data: data[0] }
  }

  async function deleteRecipe(id) {
    const { error } = await supabase.from('recipes').delete().eq('id', id)
    if (error) return { error }
    setRecipes((prev) => prev.filter((r) => r.id !== id))
    return {}
  }

  async function updateRecipe(id, updates) {
    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
    if (error) return { error }
    setRecipes((prev) => prev.map((r) => (r.id === id ? data[0] : r)))
    return { data: data[0] }
  }

  return { recipes, loading, error, addRecipe, deleteRecipe, updateRecipe, refetch: fetchRecipes }
}
