import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../src/auth.jsx'
import { api } from './api.js'
import FaceCapture from '../src/components/FaceCapture.jsx'
import './login.css'
import './verify.css'

function FaceLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [busy, setBusy] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')
  const [statusType, setStatusType] = useState('')

  async function handleCapture(descriptor) {
    setBusy(true)
    setStatusMsg('')
    try {
      const client = await api.auth.faceLogin({ descriptor })
      login(client)
      navigate(location.state?.from || '/')
    } catch (err) {
      setStatusMsg(err.message || 'Face not recognized')
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

          <div className="divider-line"></div>

          <div className="verify-title">Sign In with Face ID</div>
          <div className="verify-sub">Look at the camera to sign in.</div>

          <FaceCapture onCapture={handleCapture} busy={busy} statusMsg={statusMsg} statusType={statusType} />

          <a href="#" className="back-link" onClick={(e) => { e.preventDefault(); navigate('/login') }}>
            ← Use username & password instead
          </a>
        </div>
      </div>
    </>
  )
}

export default FaceLogin
