import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setBusy(true)
    const { error } = await signUp(email, password)
    setBusy(false)
    if (error) {
      setError(error.message)
    } else {
      // If "Confirm email" is on in Supabase, there's no session yet.
      setMessage('Check your email to confirm your account, then log in.')
      setTimeout(() => navigate('/login'), 2500)
    }
  }

  return (
    <div className="form-card">
      <h2 style={{ marginBottom: '1.25rem' }}>Create your account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="error-text">{error}</p>}
        {message && <p style={{ color: 'var(--orange)', fontSize: '0.85rem' }}>{message}</p>}
        <button className="btn-primary" type="submit" disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}
