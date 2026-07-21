import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './verify.css'

function Verify() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [status, setStatus] = useState('idle') // idle | verifying | success | error
  const [btnText, setBtnText] = useState('Verify Code')
  const [seconds, setSeconds] = useState(30)
  const [resendBusy, setResendBusy] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (seconds <= 0) return
    const id = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [seconds > 0])

  const complete = otp.every((v) => v)

  function handleChange(i, e) {
    const val = e.target.value.replace(/\D/g, '')
    const ch = val ? val[val.length - 1] : ''
    setOtp((prev) => {
      const next = [...prev]
      next[i] = ch
      return next
    })
    setStatus('idle')
    if (ch && i < 5) inputRefs.current[i + 1]?.focus()
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
    if (e.key === 'ArrowLeft' && i > 0) inputRefs.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < 5) inputRefs.current[i + 1]?.focus()
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6)
    setOtp((prev) => {
      const next = [...prev]
      pasted.split('').forEach((ch, i) => { next[i] = ch })
      return next
    })
    const nextIdx = Math.min(pasted.length, 5)
    inputRefs.current[nextIdx]?.focus()
  }

  function verifyCode() {
    const code = otp.join('')
    setStatus('verifying')
    setBtnText('Verifying…')

    setTimeout(() => {
      const valid = code.length === 6
      if (valid) {
        setStatus('success')
        setBtnText('✓ Verified')
        setTimeout(() => {
          setShowSuccess(true)
          setTimeout(() => navigate('/'), 1200)
        }, 600)
      } else {
        setStatus('error')
        setBtnText('Invalid Code')
        setTimeout(() => {
          setOtp(Array(6).fill(''))
          inputRefs.current[0]?.focus()
          setBtnText('Verify Code')
          setStatus('idle')
        }, 1800)
      }
    }, 1000)
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Enter' && complete && status === 'idle') verifyCode()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  function resendCode() {
    setResendBusy(true)
    setOtp(Array(6).fill(''))
    setStatus('idle')
    inputRefs.current[0]?.focus()
    setSeconds(30)
  }

  const btnBg =
    status === 'success' ? 'linear-gradient(135deg,#10B981,#065f46)' :
    status === 'error' ? 'linear-gradient(135deg,#EF4444,#991b1b)' :
    undefined

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
                <linearGradient id="lg1v" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="50%" stopColor="#D946EF" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <path d="M8 26 C8 20 13 16 18 16 L21 16 L21 48 C17 48 8 42 8 36 Z" fill="url(#lg1v)" opacity="0.9" />
              <path d="M56 26 C56 20 51 16 46 16 L43 16 L43 48 C47 48 56 42 56 36 Z" fill="url(#lg1v)" opacity="0.9" />
              <rect x="21" y="14" width="22" height="4" rx="2" fill="url(#lg1v)" />
              <rect x="21" y="44" width="22" height="4" rx="2" fill="url(#lg1v)" />
              <rect x="13" y="28" width="3" height="9" rx="1.5" fill="rgba(255,255,255,0.8)" />
              <rect x="10" y="31" width="9" height="3" rx="1.5" fill="rgba(255,255,255,0.8)" />
              <circle cx="46" cy="28" r="2" fill="#10B981" />
              <circle cx="50" cy="32" r="2" fill="#EF4444" />
              <circle cx="46" cy="36" r="2" fill="#06B6D4" />
              <rect x="42" y="30" width="4" height="4" rx="0.5" fill="#F59E0B" transform="rotate(45 44 32)" />
              <rect x="27" y="28" width="10" height="7" rx="3" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
              <circle cx="23" cy="38" r="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
              <circle cx="41" cy="38" r="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
              <rect x="14" y="13" width="10" height="3" rx="1.5" fill="url(#lg1v)" opacity="0.7" />
              <rect x="40" y="13" width="10" height="3" rx="1.5" fill="url(#lg1v)" opacity="0.7" />
            </svg>
            <div className="brand-sub">Fusion Luxury Game</div>
          </div>

          <div className="email-icon-wrap">
            <div className="email-icon-circle">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="url(#eg)" strokeWidth="1.8">
                <defs>
                  <linearGradient id="eg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#D946EF" />
                  </linearGradient>
                </defs>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
              </svg>
            </div>
          </div>

          <div className="heading">Check Your Email</div>
          <div className="sub-text">
            We sent a 6-digit verification code to<br />
            <span>your email address</span>
          </div>

          <div className="otp-row">
            {otp.map((val, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                className={`otp-input${val ? ' filled' : ''}${status === 'success' ? ' success' : ''}${status === 'error' ? ' error' : ''}`}
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

          <button className="btn-verify" disabled={!complete} onClick={verifyCode} style={{ background: btnBg }}>
            <span>{btnText}</span>
          </button>

          <div className="resend-row">
            Didn't receive it?&nbsp;
            <button className="resend-btn" disabled={seconds > 0} onClick={resendCode}>
              {resendBusy && seconds === 30 ? 'Sent!' : 'Resend Code'}
            </button>
            {seconds > 0 && <span>&nbsp;in <span className="timer">{seconds}</span>s</span>}
          </div>

          <div className="footer-note">
            Staff Only &nbsp;·&nbsp; Contact support to get access<br />
            If any issue, call the admin
          </div>
        </div>
      </div>

      <div className={`success-overlay${showSuccess ? ' show' : ''}`}>
        <div className="success-box">
          <div className="checkmark">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div className="success-title">Verified!</div>
          <div className="success-sub">Identity confirmed. Welcome to FLG Staff Portal.</div>
        </div>
      </div>
    </>
  )
}

export default Verify
