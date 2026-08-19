import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = ['General feedback', 'Bug report', 'Feature request']

export default function Contact() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: '', email: user?.email || '', category: CATEGORIES[0], message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.message.trim()) {
      setError('Please write a message before sending.')
      return
    }
    setBusy(true)
    setError('')
    const { error } = await supabase.from('feedback').insert([{
      user_id: user?.id ?? null,
      name: form.name.trim() || null,
      email: form.email.trim() || null,
      category: form.category,
      message: form.message.trim(),
    }])
    setBusy(false)
    if (error) {
      setError(error.message)
    } else {
      setSubmitted(true)
      setForm({ name: '', email: user?.email || '', category: CATEGORIES[0], message: '' })
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Contact &amp; Feedback</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', maxWidth: 480 }}>
        Found a bug, or have an idea for CookBookie? Let me know below.
      </p>
      <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
        <div className="form-group">
          <label htmlFor="name">Your name</label>
          <input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Jamie Rivera" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="jamie@example.com" />
        </div>
        <div className="form-group">
          <label htmlFor="category">What's this about?</label>
          <select id="category" value={form.category} onChange={(e) => update('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="Tell me what's on your mind…" />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button className="btn-primary" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button>
      </form>
      {submitted && <div className="contact-success" style={{ display: 'block' }}>Thanks — your message has been sent.</div>}
    </div>
  )
}