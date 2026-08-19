import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useRecipes } from '../hooks/useRecipes'
import { CATEGORY_STYLE } from '../lib/categoryStyles'
import Icon from '../components/Icon'

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack']

export default function Recipes() {
  const { recipes, loading, error, deleteRecipe } = useRecipes()
  const [searchParams, setSearchParams] = useSearchParams()
  const [actionError, setActionError] = useState('')
  const activeCategory = searchParams.get('category') || 'All'
  const navigate = useNavigate()
  const filtered = activeCategory === 'All' ? recipes : recipes.filter((r) => r.category === activeCategory)

  async function handleDelete(e, id, title) {
    e.stopPropagation()
    if (!window.confirm(`Delete "${title}"?`)) return
    const result = await deleteRecipe(id)
    if (result.error) setActionError(result.error.message)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Your personal collection</p>
          <h1>My Recipes</h1>
        </div>
        <Link to="/add" className="btn-primary"><Icon name="add" /> Add Recipe</Link>
      </div>
      <div className="category-filters" aria-label="Filter recipes by category">
        {CATEGORIES.map((category) => (
          <button key={category} className={`filter-chip ${activeCategory === category ? 'active' : ''}`} onClick={() => setSearchParams(category === 'All' ? {} : { category })}>
            {category}
          </button>
        ))}
      </div>
      {(error || actionError) && <p className="error-banner">{error || actionError}</p>}
      {loading && <p className="page-loading">Loading your recipes...</p>}
      {!loading && !filtered.length && <div className="empty-state"><Icon name="menu_book" /><strong>No recipes here yet.</strong><span>Try a different category or add a new recipe.</span><Link to="/add" className="btn-primary">Add a recipe</Link></div>}
      <div className="recipe-grid">
        {filtered.map((recipe) => {
          const style = CATEGORY_STYLE[recipe.category] || CATEGORY_STYLE.Lunch
          return (
            <article key={recipe.id} className="recipe-card" onClick={() => navigate(`/recipes/${recipe.id}`)}>
              <div className="recipe-card-image" style={recipe.image_url ? {} : { background: style.color }}>
                {recipe.image_url ? <img src={recipe.image_url} alt={recipe.title} /> : <img src={style.image} alt="" />}
                <button className="card-delete" aria-label={`Delete ${recipe.title}`} onClick={(event) => handleDelete(event, recipe.id, recipe.title)}><Icon name="delete" /></button>
              </div>
              <div className="recipe-card-body">
                <div className="recipe-card-title">{recipe.title}</div>
                <div className="recipe-card-meta">{recipe.category || 'Recipe'} <span>·</span> {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}