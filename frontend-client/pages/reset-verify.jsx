import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from './api.js'
import './verify.css'

function ResetVerify() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [status, setStatus] = useState('idle') // idle | error | success
  const [errorMsg, setErrorMsg] = useState('')
  const [countdown, setCountdown] = useState(0)
  const inputRefs = useRef([])

  useEffect(() => {
    if (!email) navigate('/forgot-password')
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
      await api.auth.forgotVerify({ email, code })
    } catch (err) {
      setErrorMsg(err.message || 'Invalid code')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 600)
      return
    }
    setStatus('success')
    setTimeout(() => navigate('/reset-password', { state: { email, code } }), 600)
  }

  async function startResend(e) {
    e.preventDefault()
    if (countdown > 0) return
    try {
      await api.auth.forgot({ email })
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

          <div className="brand-name">Fusion Luxury</div>
          <div className="brand-title">GAME</div>

          <div className="divider-line"></div>

          <div className="verify-ring"></div>

          <div className="verify-title">Reset Your Password</div>
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

          <button className="btn-verify" onClick={submitOTP}>Verify</button>

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

          <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); navigate('/login') }}>
            ← Back to Sign In
          </a>
        </div>
      </div>
    </>
  )
}

export default ResetVerify
