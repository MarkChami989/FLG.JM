import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../src/auth.jsx'
import { api } from './api.js'
import './login.css'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [showPwd, setShowPwd] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!username || !password) {
      setError('Please enter your username and password.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const client = await api.auth.login({ username, password })
      login(client)
      navigate(location.state?.from || '/')
    } catch (err) {
      setError(err.message || 'Invalid username or password.')
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
            <div className="logo-icon">
              <svg width="42" height="30" viewBox="0 0 42 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#f0abfc" />
                  </linearGradient>
                </defs>
                <path d="M6 8 C6 4 9 2 13 2 L16 2 L17 8 L25 8 L26 2 L29 2 C33 2 36 4 36 8
                         L38 18 C39.5 24 37 28 33 28 C30 28 28 26 26 22 L16 22
                         C14 26 12 28 9 28 C5 28 2.5 24 4 18 Z"
                  fill="url(#cg)" opacity="0.15" stroke="url(#cg)" strokeWidth="1.4" />
                <rect x="9" y="13" width="2" height="6" rx="1" fill="url(#cg)" />
                <rect x="7" y="15" width="6" height="2" rx="1" fill="url(#cg)" />
                <circle cx="30" cy="13" r="1.4" fill="#a855f7" />
                <circle cx="33" cy="15.5" r="1.4" fill="#ec4899" />
                <circle cx="30" cy="18" r="1.4" fill="#60a5fa" />
                <circle cx="27" cy="15.5" r="1.4" fill="#34d399" />
                <circle cx="15" cy="18" r="3" stroke="url(#cg)" strokeWidth="1.2" fill="rgba(168,85,247,.2)" />
                <circle cx="25" cy="12" r="3" stroke="url(#cg)" strokeWidth="1.2" fill="rgba(168,85,247,.2)" />
                <path d="M13 2 Q14 0 17 0 L25 0 Q28 0 29 2" stroke="url(#cg)" strokeWidth="1.2" fill="none" />
                <circle cx="19.5" cy="15" r="1" fill="url(#cg)" opacity=".7" />
                <circle cx="22.5" cy="15" r="1" fill="url(#cg)" opacity=".7" />
              </svg>
            </div>
            <div className="brand-name">Fusion Luxury</div>
            <div className="brand-title">GAME</div>
          </div>

          <div className="divider-line"></div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrap">
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <button className="eye-btn" type="button" onClick={() => setShowPwd((s) => !s)} aria-label="Show/hide password">
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
              <div className="forgot-wrap">
                <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
              </div>
            </div>

            {error && (
              <div style={{ color: '#f87171', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>{error}</div>
            )}

            <button className="btn-login" type="submit" disabled={submitting}>
              {submitting ? 'Signing In…' : 'Sign In'}
            </button>

            <button className="btn-create" type="button" onClick={() => navigate('/register')}>Create Account</button>
          </form>

          <p className="footer-note">18+ · Play responsibly · © 2026 Fusion Luxury Game</p>
        </div>
      </div>
    </>
  )
}

export default Login