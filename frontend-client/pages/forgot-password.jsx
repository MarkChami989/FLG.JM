import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from './api.js'
import './login.css'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.auth.forgot({ email })
      navigate('/reset-verify', { state: { email } })
    } catch (err) {
      setError(err.message || 'Could not send reset code')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="bg"></div>
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>

      <div className="wrapper">
        <div className="card">
          <div className="corner tl"></div>
          <div className="corner tr"></div>
          <div className="corner bl"></div>
          <div className="corner br"></div>

          <div className="brand">
            <div className="brand-name">Fusion Luxury</div>
            <div className="brand-title">GAME</div>
          </div>

          <div className="divider-line"></div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrap">
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m2 7 10 6 10-6" />
                  </svg>
                </span>
              </div>
            </div>

            {error && (
              <div style={{ color: '#f87171', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{error}</div>
            )}

            <button className="btn-login" type="submit" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Reset Code'}
            </button>

            <button className="btn-create" type="button" style={{ marginTop: 16 }} onClick={() => navigate('/login')}>← Back to Sign In</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
