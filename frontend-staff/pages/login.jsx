import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [status, setStatus] = useState('idle') // idle | error | authenticating | success
  const [busy, setBusy] = useState(false)

  function handleLogin() {
    const u = username.trim()
    const p = password

    if (!u || !p) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 1800)
      return
    }

    setStatus('authenticating')
    setBusy(true)
    setTimeout(() => {
      setStatus('success')
      setTimeout(() => navigate('/verify'), 800)
    }, 1200)
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Enter') handleLogin()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  const btnBg =
    status === 'error' ? 'linear-gradient(135deg,#EF4444,#991b1b)' :
    status === 'success' ? 'linear-gradient(135deg,#10B981,#065f46)' :
    undefined
  const btnText =
    status === 'error' ? 'Fill in both fields' :
    status === 'authenticating' ? 'Authenticating…' :
    status === 'success' ? '✓ Welcome Back' :
    'Sign In'

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="grid-overlay"></div>

      <div className="auth-page">
        <div className="auth-card">
          <div className="card-corners"></div>

          <div className="logo-wrap">
            <svg className="ps-logo" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="50%" stopColor="#D946EF" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <path d="M8 26 C8 20 13 16 18 16 L21 16 L21 48 C17 48 8 42 8 36 Z" fill="url(#lg1)" opacity="0.9" />
              <path d="M56 26 C56 20 51 16 46 16 L43 16 L43 48 C47 48 56 42 56 36 Z" fill="url(#lg1)" opacity="0.9" />
              <rect x="21" y="14" width="22" height="4" rx="2" fill="url(#lg1)" />
              <rect x="21" y="44" width="22" height="4" rx="2" fill="url(#lg1)" />
              <rect x="13" y="28" width="3" height="9" rx="1.5" fill="rgba(255,255,255,0.8)" />
              <rect x="10" y="31" width="9" height="3" rx="1.5" fill="rgba(255,255,255,0.8)" />
              <circle cx="46" cy="28" r="2" fill="#10B981" />
              <circle cx="50" cy="32" r="2" fill="#EF4444" />
              <circle cx="46" cy="36" r="2" fill="#06B6D4" />
              <rect x="42" y="30" width="4" height="4" rx="0.5" fill="#F59E0B" transform="rotate(45 44 32)" />
              <rect x="27" y="28" width="10" height="7" rx="3" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              <circle cx="23" cy="38" r="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
              <circle cx="41" cy="38" r="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
              <rect x="14" y="13" width="10" height="3" rx="1.5" fill="url(#lg1)" opacity="0.7" />
              <rect x="40" y="13" width="10" height="3" rx="1.5" fill="url(#lg1)" opacity="0.7" />
            </svg>
            <div>
              <div className="brand-sub">Fusion Luxury Game</div>
            </div>
          </div>

          <div className="section-title">Staff Sign In</div>

          <div className="field">
            <label htmlFor="username">Username</label>
            <div className="input-wrap">
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <input
                type={showPwd ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <button className="eye-btn" type="button" onClick={() => setShowPwd((s) => !s)} aria-label="Toggle password">
                {showPwd ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="forgot-wrap">
            <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
          </div>

          <button className="btn-login" type="button" onClick={handleLogin} disabled={busy} style={{ background: btnBg }}>
            <span>{btnText}</span>
          </button>

          <div className="divider"><span>•</span></div>

          <div className="footer-note">
            Staff Only &nbsp;·&nbsp; Contact support to get access
            <br />If any issue, call the admin
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
