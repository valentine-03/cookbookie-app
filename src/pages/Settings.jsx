import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Icon from '../components/Icon'

export default function Settings() {
  const { user, updateProfile, signOut } = useAuth()
  const { theme, setTheme, themes } = useTheme()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name || '')
  const [weeklyEmails, setWeeklyEmails] = useState(user?.user_metadata?.weekly_emails ?? true)
  const [saved, setSaved] = useState('')
  const [error, setError] = useState('')

  useEffect(() => setDisplayName(user?.user_metadata?.display_name || ''), [user])

  async function saveProfile(event) {
    event.preventDefault()
    setError('')
    const result = await updateProfile({ display_name: displayName.trim() })
    if (result.error) setError(result.error.message)
    else {
      setSaved('Profile saved')
      setTimeout(() => setSaved(''), 1800)
    }
  }

  async function updatePreference(value) {
    setWeeklyEmails(value)
    const result = await updateProfile({ weekly_emails: value })
    if (result.error) setError(result.error.message)
  }

  async function handleSignOut() {
    const result = await signOut()
    if (result?.error) setError(result.error.message)
    else navigate('/login')
  }

  return (
    <div className="settings-page">
      <div className="page-header"><div><p className="eyebrow">Make CookBookie yours</p><h1>Account</h1></div></div>
      <form className="settings-panel" onSubmit={saveProfile}>
        <div className="settings-panel-heading"><span className="settings-icon"><Icon name="person" /></span><div><h2>Your profile</h2><p>This is how CookBookie greets you.</p></div></div>
        <div className="form-group"><label htmlFor="display-name">Display name</label><input id="display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" /></div>
        <div className="settings-row subtle"><div><div className="settings-row-label">Account email</div><div className="settings-row-hint">{user?.email}</div></div><Icon name="verified" /></div>
        <div className="form-actions"><button className="btn-primary" type="submit">Save profile <Icon name="check" /></button></div>
      </form>

      <section className="settings-panel">
        <div className="settings-panel-heading"><span className="settings-icon"><Icon name="palette" /></span><div><h2>Theme variation</h2><p>The original palette is the default. Try a gentle variation anytime.</p></div></div>
        <div className="theme-options">
          {themes.map((option) => (
            <button type="button" key={option.id} className={`theme-option ${theme === option.id ? 'selected' : ''} theme-${option.id}`} onClick={() => setTheme(option.id)}>
              <span className="theme-swatch"><i /><i /><i /></span><span><strong>{option.label}</strong><small>{option.description}</small></span>{theme === option.id && <Icon name="check_circle" />}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-panel">
        <div className="settings-panel-heading"><span className="settings-icon"><Icon name="tune" /></span><div><h2>Preferences</h2><p>Small choices that follow your account.</p></div></div>
        <div className="settings-row"><div><div className="settings-row-label">Email me weekly recipe ideas</div><div className="settings-row-hint">Saved to your account and available across devices.</div></div><label className="toggle"><input type="checkbox" checked={weeklyEmails} onChange={(e) => updatePreference(e.target.checked)} /><span className="toggle-track" /></label></div>
      </section>

      {error && <p className="error-banner" role="alert">{error}</p>}
      {saved && <p className="success-banner">{saved}</p>}
      <section className="settings-panel danger-panel"><div><h2>Log out</h2><p>You'll need to sign back in to see your recipes.</p></div><button className="btn-danger" onClick={handleSignOut}><Icon name="logout" /> Log out</button></section>
    </div>
  )
}