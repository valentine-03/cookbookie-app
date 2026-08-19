import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icon from './Icon'

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><Icon name="menu_book" /></div>
          <div className="logo">CookBookie</div>
        </div>
        <nav aria-label="Main navigation">
          <NavLink to="/" end className="nav-link"><Icon name="dashboard" /> <span>Dashboard</span></NavLink>
          <NavLink to="/recipes" className="nav-link"><Icon name="skillet" /> <span>My Recipes</span></NavLink>
          <NavLink to="/add" className="nav-link"><Icon name="add_circle" /> <span>Add Recipe</span></NavLink>
          <NavLink to="/nutrition-guide" className="nav-link"><Icon name="nutrition" /> <span>Nutrition Guide</span></NavLink>
          <NavLink to="/settings" className="nav-link"><Icon name="account_circle" /> <span>Account</span></NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="user-email" title={user?.email}>{user?.email}</div>
          <button className="logout-link" onClick={handleSignOut}><Icon name="logout" /> Log out</button>
        </div>
      </aside>
      <main className="main-content">
        <div className="mobile-topbar">
          <div className="logo">CookBookie</div>
          <button className="icon-button" aria-label="Open account" onClick={() => navigate('/settings')}><Icon name="account_circle" /></button>
        </div>
        {children}
      </main>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {[
          ['/', 'dashboard', 'Dashboard'],
          ['/recipes', 'skillet', 'My Recipes'],
          ['/add', 'add_circle', 'Add Recipe'],
          ['/nutrition-guide', 'nutrition', 'Nutrition Guide'],
        ].map(([to, icon, label]) => (
          <NavLink key={to} to={to} end={to === '/'} className={location.pathname === to ? 'mobile-nav-link active' : 'mobile-nav-link'}>
            <Icon name={icon} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}