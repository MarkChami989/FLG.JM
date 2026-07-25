import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from './api.js'
import './login.css'
import './register.css'

const STRENGTH_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e']

function strengthScore(val) {
  let score = 0
  if (val.length >= 8) score++
  if (/[A-Z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++
  return score
}

function ResetPassword() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const code = location.state?.code || ''
  const [showPwd, setShowPwd] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const score = strengthScore(password)

  useEffect(() => {
    if (!email || !code) navigate('/forgot-password')
  }, [email, code, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.auth.forgotReset({ email, code, password })
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Could not reset password')
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
              <label htmlFor="password">New Password</label>
              <div className="input-wrap">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <button className="eye-btn" type="button" onClick={() => setShowPwd((s) => !s)} aria-label="Show/hide">
                  {showPwd ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="strength-bar">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} style={{ background: i < score ? STRENGTH_COLORS[score - 1] : 'rgba(255,255,255,.1)' }}></span>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 20 }}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrap">
                <input
                  id="confirmPassword"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
              </div>
            </div>

            {error && (
              <div style={{ color: '#f87171', fontSize: 13, textAlign: 'center', marginTop: 12 }}>{error}</div>
            )}

            <button className="btn-login" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save New Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default ResetPassword
