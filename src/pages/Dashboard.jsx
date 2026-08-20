import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useRecipes } from '../hooks/useRecipes'
import { CATEGORY_STYLE } from '../lib/categoryStyles'
import Icon from '../components/Icon'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert']

function displayName(user) {
  return user?.user_metadata?.display_name?.trim() || user?.email?.split('@')[0] || 'friend'
}

export default function Dashboard() {
  const { user } = useAuth()
  const { recipes, loading, error } = useRecipes()
  const [now, setNow] = useState(new Date())
  const [recentIds, setRecentIds] = useState(() => JSON.parse(localStorage.getItem('cookbookie-recent') || '[]'))

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const refresh = () => setRecentIds(JSON.parse(localStorage.getItem('cookbookie-recent') || '[]'))
    window.addEventListener('cookbookie:recent-updated', refresh)
    return () => window.removeEventListener('cookbookie:recent-updated', refresh)
  }, [])

  const recent = recentIds
    .map((id) => recipes.find((recipe) => recipe.id === id))
    .filter(Boolean)
    .slice(0, 3)
  const shownRecent = recent.length ? recent : recipes.slice(0, 3)
  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  const date = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="dashboard-page">
      <header className="page-intro">
        <div>
          <p className="eyebrow">Your kitchen, your collection</p>
          <h1>Welcome back, {displayName(user)}!</h1>
          <p className="intro-copy">What are we cooking today?</p>
        </div>
        <Link to="/settings" className="profile-chip" aria-label="Open account settings">
          <span className="profile-avatar">{displayName(user).slice(0, 1).toUpperCase()}</span>
          <span className="profile-chip-text">Account</span>
          <Icon name="chevron_right" />
        </Link>
      </header>

      <div className="dashboard-grid">
        <section className="dashboard-main">
          <div className="date-widget">
            <div className="date-widget-icon"><Icon name="wb_sunny" /></div>
            <div>
              <p>Today is</p>
              <div className="date-widget-time">{time}</div>
              <div className="date-widget-date">{date}</div>
            </div>
          </div>

          <div className="section-heading">
            <div>
              <p className="eyebrow">Find your next favorite</p>
              <h2>Recipe Categories</h2>
            </div>
            <Link to="/recipes" className="text-link">See all <Icon name="arrow_forward" /></Link>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((category) => {
              const style = CATEGORY_STYLE[category]
              return (
                <Link key={category} to={`/recipes?category=${category}`} className="category-card">
                  <div className="category-image" style={{ backgroundColor: style.color }}>
                    <img src={style.image} alt={`${category} category illustration`} />
                  </div>
                  <span>{category}</span>
                  <Icon name="north_east" className="category-arrow" />
                </Link>
              )
            })}
          </div>

          <div className="section-heading recently-heading">
            <div>
              <p className="eyebrow">Your cooking trail</p>
              <h2>Recently Viewed</h2>
            </div>
            <Link to="/recipes" className="text-link">My recipes <Icon name="arrow_forward" /></Link>
          </div>
          {error && <p className="error-banner">{error}</p>}
          {loading && <p className="page-loading">Loading your recipes...</p>}
          {!loading && !shownRecent.length && (
            <div className="empty-state">
              <Icon name="menu_book" />
              <strong>Your recipe shelf is ready.</strong>
              <span>Save your first recipe and it will appear here.</span>
              <Link to="/add" className="btn-primary">Add a recipe</Link>
            </div>
          )}
          <div className="recipe-grid compact-grid">
            {shownRecent.map((recipe) => {
              const style = CATEGORY_STYLE[recipe.category] || CATEGORY_STYLE.Lunch
              return (
                <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="recipe-card">
                  <div className="recipe-card-image" style={recipe.image_url ? {} : { background: style.color }}>
                    {recipe.image_url ? <img src={recipe.image_url} alt={recipe.title} /> : <img src={style.image} alt="" />}
                  </div>
                  <div className="recipe-card-body">
                    <div className="recipe-card-title">{recipe.title}</div>
                    <div className="recipe-card-meta">{recipe.category || 'Recipe'}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <aside className="quick-add-card">
          <div className="quick-add-icon"><Icon name="add_circle" /></div>
          <p className="eyebrow">Have something in mind?</p>
          <h2>Quick Add Recipe</h2>
          <p>Capture the idea now, then fill in the details when you are ready.</p>
          <Link to="/add" className="btn-submit">Open full recipe form <Icon name="arrow_forward" /></Link>
          <div className="quick-add-note"><Icon name="lock" /> Saved to your account</div>
        </aside>
      </div>
    </div>
  )
}