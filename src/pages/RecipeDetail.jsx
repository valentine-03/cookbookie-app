import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { CATEGORY_STYLE } from '../lib/categoryStyles'
import Icon from '../components/Icon'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recipes, loading, error, deleteRecipe } = useRecipes()
  const recipe = recipes.find((item) => item.id === id)

  useEffect(() => {
    if (!recipe) return
    const recent = JSON.parse(localStorage.getItem('cookbookie-recent') || '[]').filter((recentId) => recentId !== recipe.id)
    localStorage.setItem('cookbookie-recent', JSON.stringify([recipe.id, ...recent].slice(0, 8)))
    window.dispatchEvent(new Event('cookbookie:recent-updated'))
  }, [recipe])

  async function handleDelete() {
    if (!window.confirm(`Delete "${recipe.title}"?`)) return
    const result = await deleteRecipe(id)
    if (result.error) return
    navigate('/recipes')
  }

  if (loading) return <p className="page-loading">Loading recipe...</p>
  if (error) return <p className="error-banner">{error}</p>
  if (!recipe) return <div className="empty-state"><Icon name="search_off" /><strong>Recipe not found.</strong><button className="btn-primary" onClick={() => navigate('/recipes')}>Back to recipes</button></div>
  const style = CATEGORY_STYLE[recipe.category] || CATEGORY_STYLE.Lunch
  const hasNutrition = recipe.calories || recipe.protein || recipe.carbs || recipe.fat

  return (
    <div className="recipe-detail-page">
      <button className="btn-back" onClick={() => navigate(-1)}><Icon name="arrow_back" /> Back</button>
      <div className="recipe-detail-hero" style={recipe.image_url ? {} : { backgroundColor: style.color }}>{recipe.image_url ? <img src={recipe.image_url} alt={recipe.title} /> : <img src={style.image} alt="" />}</div>
      <div className="recipe-detail-header"><div><p className="eyebrow">{recipe.category || 'Recipe'}</p><h1>{recipe.title}</h1></div><button className="btn-danger" onClick={handleDelete}><Icon name="delete" /> Delete</button></div>
      <div className="recipe-detail-meta"><span><Icon name="timer" /> Prep {recipe.prep_time || 0} min</span><span><Icon name="local_fire_department" /> Cook {recipe.cook_time || 0} min</span></div>
      {hasNutrition && <div className="nutrition-badges">{recipe.calories && <span className="nutrition-badge">{recipe.calories} kcal</span>}{recipe.protein && <span className="nutrition-badge">{recipe.protein}g protein</span>}{recipe.carbs && <span className="nutrition-badge">{recipe.carbs}g carbs</span>}{recipe.fat && <span className="nutrition-badge">{recipe.fat}g fat</span>}</div>}
      <div className="detail-columns"><section className="detail-section"><h2>Ingredients</h2><ul>{(recipe.ingredients || []).map((ingredient, index) => <li key={index}>{ingredient}</li>)}</ul></section><section className="detail-section"><h2>Instructions</h2><ol>{(recipe.instructions || []).map((step, index) => <li key={index}><span>{index + 1}</span>{step}</li>)}</ol></section></div>
    </div>
  )
}