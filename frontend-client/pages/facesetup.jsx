import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from './api.js'
import FaceCapture from '../src/components/FaceCapture.jsx'
import './verify.css'

function FaceSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [busy, setBusy] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [statusType, setStatusType] = useState('')

  async function handleCapture(descriptor) {
    setBusy(true)
    setStatusMsg('')
    try {
      await api.auth.faceEnroll({ email, descriptor })
      setStatusMsg('Face ID saved! Redirecting to sign in…')
      setStatusType('success')
      setTimeout(() => navigate('/login'), 1000)
    } catch (err) {
      setStatusMsg(err.message || 'Could not save Face ID')
      setStatusType('error')
    } finally {
      setBusy(false)
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

          <div className="steps" style={{ marginTop: 16 }}>
            <div className="step active"></div>
            <div className="step active"></div>
            <div className="step active"></div>
          </div>

          <div className="divider-line"></div>

          <div className="verify-title">Set Up Face ID</div>
          <div className="verify-sub">
            Optional — sign in faster next time with your face instead of a password.<br />
            <span>{email}</span>
          </div>

          {email ? (
            <FaceCapture onCapture={handleCapture} busy={busy} statusMsg={statusMsg} statusType={statusType} />
          ) : (
            <div className="face-msg error">Missing account info. Please register again.</div>
          )}

          <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); navigate('/login') }}>
            Skip for now →
          </a>
        </div>
      </div>
    </>
  )
}

export default FaceSetup
