import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from './api.js'
import './verify.css'

function Verify() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [status, setStatus] = useState('idle') // idle | error | success
  const [errorMsg, setErrorMsg] = useState('')
  const [countdown, setCountdown] = useState(0)
  const inputRefs = useRef([])

  useEffect(() => {
    if (!email) navigate('/register')
  }, [email, navigate])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const id = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(id)
  }, [countdown])

  function handleChange(i, e) {
    const val = e.target.value.replace(/\D/g, '').slice(-1)
    setOtp((prev) => {
      const next = [...prev]
      next[i] = val
      return next
    })
    setStatus('idle')
    if (val && i < 5) inputRefs.current[i + 1]?.focus()
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      setOtp((prev) => {
        const next = [...prev]
        next[i - 1] = ''
        return next
      })
      inputRefs.current[i - 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '')
    const chars = [...paste].slice(0, 6)
    setOtp((prev) => {
      const next = [...prev]
      chars.forEach((ch, idx) => { next[idx] = ch })
      return next
    })
    const nextIdx = Math.min(chars.length, 5)
    inputRefs.current[nextIdx]?.focus()
  }

  async function submitOTP() {
    const code = otp.join('')
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 600)
      return
    }
    try {
      await api.auth.verify({ email, code })
    } catch (err) {
      setErrorMsg(err.message || 'Invalid code')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 600)
      return
    }
    setStatus('success')
    setTimeout(() => navigate('/login'), 800)
  }

  async function startResend(e) {
    e.preventDefault()
    if (countdown > 0) return
    try {
      await api.auth.resend({ email })
      setCountdown(30)
    } catch (err) {
      setErrorMsg(err.message || 'Could not resend code')
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

          <div className="logo-icon" style={{ margin: '0 auto 12px' }}>
            <svg width="38" height="27" viewBox="0 0 42 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cg3" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#f0abfc" />
                </linearGradient>
              </defs>
              <path d="M6 8 C6 4 9 2 13 2 L16 2 L17 8 L25 8 L26 2 L29 2 C33 2 36 4 36 8 L38 18 C39.5 24 37 28 33 28 C30 28 28 26 26 22 L16 22 C14 26 12 28 9 28 C5 28 2.5 24 4 18 Z"
                fill="url(#cg3)" opacity="0.15" stroke="url(#cg3)" strokeWidth="1.4" />
              <rect x="9" y="13" width="2" height="6" rx="1" fill="url(#cg3)" />
              <rect x="7" y="15" width="6" height="2" rx="1" fill="url(#cg3)" />
              <circle cx="30" cy="13" r="1.4" fill="#a855f7" />
              <circle cx="33" cy="15.5" r="1.4" fill="#ec4899" />
              <circle cx="30" cy="18" r="1.4" fill="#60a5fa" />
              <circle cx="27" cy="15.5" r="1.4" fill="#34d399" />
              <circle cx="15" cy="18" r="3" stroke="url(#cg3)" strokeWidth="1.2" fill="rgba(168,85,247,.2)" />
              <circle cx="25" cy="12" r="3" stroke="url(#cg3)" strokeWidth="1.2" fill="rgba(168,85,247,.2)" />
              <path d="M13 2 Q14 0 17 0 L25 0 Q28 0 29 2" stroke="url(#cg3)" strokeWidth="1.2" fill="none" />
              <circle cx="19.5" cy="15" r="1" fill="url(#cg3)" opacity=".7" />
              <circle cx="22.5" cy="15" r="1" fill="url(#cg3)" opacity=".7" />
            </svg>
          </div>
          <div className="brand-name">Fusion Luxury</div>
          <div className="brand-title">GAME</div>

          <div className="steps" style={{ marginTop: 16 }}>
            <div className="step active"></div>
            <div className="step active"></div>
            <div className="step active"></div>
          </div>

          <div className="divider-line"></div>

          <div className="verify-ring">✉️</div>

          <div className="verify-title">Verify Your Account</div>
          <div className="verify-sub">
            We sent a 6-digit code to<br />
            <span>{email}</span>
          </div>
          {status === 'error' && errorMsg && (
            <div style={{ color: '#f87171', fontSize: 13, textAlign: 'center', marginTop: 4 }}>{errorMsg}</div>
          )}

          <div className="otp-wrap">
            {otp.map((val, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                className={`otp-box${val ? ' filled' : ''}${status === 'error' ? ' error' : ''}${status === 'success' ? ' success' : ''}`}
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]"
                autoComplete={i === 0 ? 'one-time-code' : undefined}
                value={val}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          <button className="btn-verify" onClick={submitOTP}>⚡ &nbsp;Verify</button>

          <div className="resend-wrap">
            Didn't receive the code?
            <a
              href="#"
              id="resendBtn"
              onClick={startResend}
              style={countdown > 0 ? { pointerEvents: 'none', opacity: .4 } : undefined}
            >
              Resend Code
            </a>
            <span id="countdown">{countdown > 0 ? ` (${countdown}s)` : ''}</span>
          </div>

          <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); navigate('/register') }}>
            ← Back to Register
          </a>
        </div>
      </div>
    </>
  )
}

export default Verify
