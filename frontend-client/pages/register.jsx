import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from './api.js'
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

function Register() {
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dob, setDob] = useState('')
  const [phoneCode, setPhoneCode] = useState('+961')
  const [phoneNum, setPhoneNum] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const score = strengthScore(password)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.auth.register({
        username,
        email,
        password,
        phone: phoneNum ? `${phoneCode} ${phoneNum}` : '',
        dob,
      })
      navigate('/verify', { state: { email } })
    } catch (err) {
      setError(err.message || 'Registration failed')
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
              <svg width="38" height="27" viewBox="0 0 42 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="cg2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#f0abfc" />
                  </linearGradient>
                </defs>
                <path d="M6 8 C6 4 9 2 13 2 L16 2 L17 8 L25 8 L26 2 L29 2 C33 2 36 4 36 8 L38 18 C39.5 24 37 28 33 28 C30 28 28 26 26 22 L16 22 C14 26 12 28 9 28 C5 28 2.5 24 4 18 Z"
                  fill="url(#cg2)" opacity="0.15" stroke="url(#cg2)" strokeWidth="1.4" />
                <rect x="9" y="13" width="2" height="6" rx="1" fill="url(#cg2)" />
                <rect x="7" y="15" width="6" height="2" rx="1" fill="url(#cg2)" />
                <circle cx="30" cy="13" r="1.4" fill="#a855f7" />
                <circle cx="33" cy="15.5" r="1.4" fill="#ec4899" />
                <circle cx="30" cy="18" r="1.4" fill="#60a5fa" />
                <circle cx="27" cy="15.5" r="1.4" fill="#34d399" />
                <circle cx="15" cy="18" r="3" stroke="url(#cg2)" strokeWidth="1.2" fill="rgba(168,85,247,.2)" />
                <circle cx="25" cy="12" r="3" stroke="url(#cg2)" strokeWidth="1.2" fill="rgba(168,85,247,.2)" />
                <path d="M13 2 Q14 0 17 0 L25 0 Q28 0 29 2" stroke="url(#cg2)" strokeWidth="1.2" fill="none" />
                <circle cx="19.5" cy="15" r="1" fill="url(#cg2)" opacity=".7" />
                <circle cx="22.5" cy="15" r="1" fill="url(#cg2)" opacity=".7" />
              </svg>
            </div>
            <div className="brand-name">Fusion Luxury</div>
            <div className="brand-title">GAME</div>
            <div className="page-label">Create Account</div>
          </div>

          <div className="steps">
            <div className="step active"></div>
            <div className="step active"></div>
            <div className="step"></div>
          </div>

          <div className="divider-line"></div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="form-group full">
                <label htmlFor="username">Username</label>
                <div className="input-wrap">
                  <input id="username" type="text" placeholder="Choose a username" value={username} onChange={(e) => setUsername(e.target.value)} />
                  <span className="input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="form-group full">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrap">
                  <input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <span className="input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m2 7 10 6 10-6" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="form-group full">
                <label htmlFor="password">Password</label>
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

              <div className="form-group">
                <label htmlFor="birthday">Date of Birth</label>
                <div className="input-wrap">
                  <input id="birthday" type="date" style={{ paddingLeft: 14 }} value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
              </div>

              <div className="form-group full">
                <label>Phone Number</label>
                <div className="phone-wrap">
                  <select className="phone-code" title="Country code" value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)}>
                    <option>+961</option>
                    <option>+1</option>
                    <option>+44</option>
                    <option>+971</option>
                    <option>+966</option>
                    <option>+33</option>
                    <option>+49</option>
                    <option>+90</option>
                  </select>
                  <div className="input-wrap" style={{ flex: 1 }}>
                    <input className="phone-num" type="tel" placeholder="00 000 000" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
                    <span className="input-icon" style={{ left: 10 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {error && (
              <div style={{ color: '#f87171', fontSize: 13, textAlign: 'center', marginTop: 8 }}>{error}</div>
            )}

            <button className="btn-verify" type="submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Verify'}
            </button>
          </form>

          <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); navigate('/login') }}>
            ← Already have an account? Sign In
          </a>

          <p className="terms">
            By creating an account you agree to our
            <a href="#" onClick={(e) => e.preventDefault()}> Terms of Service</a> &amp; <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.<br />
            18+ only · Play responsibly.
          </p>
        </div>
      </div>
    </>
  )
}

export default Register