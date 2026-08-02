import { useState } from 'react'
import Header from '../src/components/Header.jsx'
import { useAuth } from '../src/auth.jsx'
import { api } from './api.js'
import './Settings.css'

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function Settings() {
  const { user, login } = useAuth()

  const [pictureFileName, setPictureFileName] = useState('')
  const [pictureBusy, setPictureBusy] = useState(false)
  const [pictureError, setPictureError] = useState('')
  const [pictureToast, setPictureToast] = useState('')

  async function handlePictureChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPictureFileName(file.name)
    setPictureBusy(true)
    setPictureError('')
    try {
      const image = await fileToDataUrl(file)
      const updated = await api.auth.updateProfilePicture({ clientId: user.id, image })
      login({ ...user, profilePicture: updated.profilePicture })
      setPictureToast('Profile picture updated')
      setTimeout(() => setPictureToast(''), 2500)
    } catch (err) {
      setPictureError(err.message || 'Could not upload picture')
    } finally {
      setPictureBusy(false)
    }
  }

  const [pwStage, setPwStage] = useState('confirm') // 'confirm' | 'verify'
  const [currentPassword, setCurrentPassword] = useState('')
  const [pwCode, setPwCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwBusy, setPwBusy] = useState(false)
  const [pwToast, setPwToast] = useState('')

  async function submitCurrentPassword(e) {
    e.preventDefault()
    if (!currentPassword) {
      setPwError('Enter your current password')
      return
    }
    setPwBusy(true)
    setPwError('')
    try {
      await api.auth.sendPasswordCode({ clientId: user.id, currentPassword })
      setPwStage('verify')
    } catch (err) {
      setPwError(err.message || 'Could not verify current password')
    } finally {
      setPwBusy(false)
    }
  }

  async function resendPwCode() {
    setPwBusy(true)
    setPwError('')
    try {
      await api.auth.sendPasswordCode({ clientId: user.id, currentPassword })
    } catch (err) {
      setPwError(err.message || 'Could not resend code')
    } finally {
      setPwBusy(false)
    }
  }

  async function submitNewPassword(e) {
    e.preventDefault()
    if (!pwCode.trim() || !newPassword || !confirmPassword) {
      setPwError('All fields are required')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setPwError('New password must be at least 6 characters')
      return
    }
    setPwBusy(true)
    setPwError('')
    try {
      await api.auth.changePassword({ clientId: user.id, code: pwCode.trim(), newPassword, confirmPassword })
      setPwStage('confirm')
      setCurrentPassword('')
      setPwCode('')
      setNewPassword('')
      setConfirmPassword('')
      setPwToast('Password changed')
      setTimeout(() => setPwToast(''), 2500)
    } catch (err) {
      setPwError(err.message || 'Could not change password')
    } finally {
      setPwBusy(false)
    }
  }

  return (
    <>
      <div className="bg"></div>
      <div className="orb orb1"></div><div className="orb orb2"></div>

      <Header active="settings" />

      <main className="settings-main">
        <div className="settings-card">
          <div className="corner tl"></div><div className="corner tr"></div>
          <div className="corner bl"></div><div className="corner br"></div>

          <div className="settings-title">Settings</div>

          <div className="settings-section">
            <div className="settings-label">Profile Picture</div>
            <div className="settings-pic-row">
              <div className="settings-avatar">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" />
                ) : (
                  (user?.username || '?')[0]?.toUpperCase()
                )}
              </div>
              <label className={`file-upload-btn${pictureFileName ? ' has-file' : ''}`}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                <span>{pictureBusy ? 'Uploading…' : (pictureFileName || 'Upload profile picture')}</span>
                <input type="file" accept="image/*" onChange={handlePictureChange} disabled={pictureBusy} />
              </label>
            </div>
            {pictureError && <div className="settings-error">{pictureError}</div>}
            {pictureToast && <div className="settings-toast">{pictureToast}</div>}
          </div>

          <div className="settings-section">
            <div className="settings-label">Change Password</div>
            {pwStage === 'confirm' ? (
              <form onSubmit={submitCurrentPassword} className="settings-form">
                <input
                  type="password"
                  placeholder="Current password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                {pwError && <div className="settings-error">{pwError}</div>}
                <button type="submit" disabled={pwBusy}>{pwBusy ? 'Verifying…' : 'Send Code'}</button>
              </form>
            ) : (
              <form onSubmit={submitNewPassword} className="settings-form">
                <div className="settings-sub">Enter the code sent to {user?.email}, and your new password.</div>
                <input placeholder="6-digit code" maxLength={6} value={pwCode} onChange={(e) => setPwCode(e.target.value.replace(/\D/g, ''))} />
                <input type="password" placeholder="New password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <input type="password" placeholder="Confirm new password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                {pwError && <div className="settings-error">{pwError}</div>}
                <div className="settings-form-actions">
                  <button type="button" className="settings-ghost-btn" onClick={() => setPwStage('confirm')}>Back</button>
                  <button type="button" className="settings-ghost-btn" disabled={pwBusy} onClick={resendPwCode}>Resend</button>
                  <button type="submit" disabled={pwBusy}>{pwBusy ? 'Saving…' : 'Change Password'}</button>
                </div>
              </form>
            )}
            {pwToast && <div className="settings-toast">{pwToast}</div>}
          </div>
        </div>
      </main>
    </>
  )
}

export default Settings
