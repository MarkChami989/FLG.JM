import { useState } from 'react'
import { useAuth } from '../src/auth.jsx'
import { api } from './api.js'

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function SettingsPanel() {
  const { user, login } = useAuth()
  const isAdmin = user?.role === 'admin'
  const authApi = isAdmin ? api.adminAuth : api.staffAuth
  const idParam = isAdmin ? {} : { staffId: user?.id }

  // ---- Profile picture ----
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
      const updated = await authApi.updateProfilePicture({ image, ...idParam })
      login({ ...user, profilePicture: updated.profilePicture })
      setPictureToast('Profile picture updated')
      setTimeout(() => setPictureToast(''), 2500)
    } catch (err) {
      setPictureError(err.message || 'Could not upload picture')
    } finally {
      setPictureBusy(false)
    }
  }

  // ---- Username / email edit (admin only) ----
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ username: '', email: '' })
  const [profileStep, setProfileStep] = useState('form') // 'form' | 'code'
  const [profileCode, setProfileCode] = useState('')
  const [profileError, setProfileError] = useState('')
  const [profileBusy, setProfileBusy] = useState(false)
  const [profileToast, setProfileToast] = useState('')

  function openProfileEdit() {
    setProfileForm({ username: user?.username || '', email: user?.email || '' })
    setProfileStep('form')
    setProfileCode('')
    setProfileError('')
    setEditingProfile(true)
  }
  function closeProfileEdit() {
    setEditingProfile(false)
  }

  async function sendProfileCode() {
    if (!profileForm.username.trim() || !profileForm.email.trim()) {
      setProfileError('Username and email are required')
      return
    }
    setProfileBusy(true)
    setProfileError('')
    try {
      await api.adminAuth.sendProfileCode()
      setProfileStep('code')
    } catch (err) {
      setProfileError(err.message || 'Could not send verification code')
    } finally {
      setProfileBusy(false)
    }
  }

  async function confirmProfile() {
    if (!profileCode.trim()) {
      setProfileError('Enter the verification code')
      return
    }
    setProfileBusy(true)
    setProfileError('')
    try {
      const updated = await api.adminAuth.updateProfile({
        code: profileCode.trim(),
        username: profileForm.username.trim(),
        email: profileForm.email.trim(),
      })
      login({ ...user, ...updated })
      setEditingProfile(false)
      setProfileToast('Profile updated')
      setTimeout(() => setProfileToast(''), 2500)
    } catch (err) {
      setProfileError(err.message || 'Could not update profile')
    } finally {
      setProfileBusy(false)
    }
  }

  // ---- Password change: confirm current password FIRST, then email a code + new password ----
  const [changingPassword, setChangingPassword] = useState(false)
  const [pwStep, setPwStep] = useState('confirm') // 'confirm' | 'verify'
  const [currentPassword, setCurrentPassword] = useState('')
  const [pwCode, setPwCode] = useState('')
  const [pwForm, setPwForm] = useState({ newPassword: '', confirmPassword: '' })
  const [pwError, setPwError] = useState('')
  const [pwBusy, setPwBusy] = useState(false)
  const [pwToast, setPwToast] = useState('')

  function openPasswordChange() {
    setChangingPassword(true)
    setPwStep('confirm')
    setCurrentPassword('')
    setPwCode('')
    setPwForm({ newPassword: '', confirmPassword: '' })
    setPwError('')
  }
  function closePasswordChange() {
    setChangingPassword(false)
  }

  async function submitCurrentPassword(e) {
    e.preventDefault()
    if (!currentPassword) {
      setPwError('Enter your current password')
      return
    }
    setPwBusy(true)
    setPwError('')
    try {
      await authApi.sendPasswordCode({ currentPassword, ...idParam })
      setPwStep('verify')
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
      await authApi.sendPasswordCode({ currentPassword, ...idParam })
    } catch (err) {
      setPwError(err.message || 'Could not resend code')
    } finally {
      setPwBusy(false)
    }
  }

  async function submitNewPassword(e) {
    e.preventDefault()
    if (!pwCode.trim() || !pwForm.newPassword || !pwForm.confirmPassword) {
      setPwError('All fields are required')
      return
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match')
      return
    }
    if (pwForm.newPassword.length < 6) {
      setPwError('New password must be at least 6 characters')
      return
    }
    setPwBusy(true)
    setPwError('')
    try {
      await authApi.changePassword({
        code: pwCode.trim(),
        newPassword: pwForm.newPassword,
        confirmPassword: pwForm.confirmPassword,
        ...idParam,
      })
      setChangingPassword(false)
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
      <div className="panel-head"><h2>Settings</h2></div>

      <div className="subhead">Profile Picture</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
          background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20,
        }}>
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            (user?.name || user?.username || '?')[0]?.toUpperCase()
          )}
        </div>
        <label className={`file-upload-btn${pictureFileName ? ' has-file' : ''}`} style={{ flex: 1, maxWidth: 320 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          <span>{pictureBusy ? 'Uploading…' : (pictureFileName || 'Upload profile picture')}</span>
          <input type="file" accept="image/*" onChange={handlePictureChange} disabled={pictureBusy} />
        </label>
      </div>
      {pictureError && <div style={{ color: 'var(--red)', fontSize: 12.5, marginBottom: 10 }}>{pictureError}</div>}
      {pictureToast && <div style={{ color: 'var(--green)', fontSize: 13, marginBottom: 10 }}>{pictureToast}</div>}

      {isAdmin && (
        <>
          <div className="subhead" style={{ marginTop: 24 }}>Account Info</div>
          <div className="detail-grid">
            <div className="detail-item"><label>Username</label><div>{user?.username}</div></div>
            <div className="detail-item"><label>Email</label><div>{user?.email}</div></div>
          </div>
          <button className="btn ghost small" onClick={openProfileEdit}>Edit Username / Email</button>
          {profileToast && <div style={{ color: 'var(--green)', fontSize: 13, marginTop: 10 }}>{profileToast}</div>}
        </>
      )}

      <div className="subhead" style={{ marginTop: 34 }}>Security</div>
      <button className="btn small" onClick={openPasswordChange}>Change Password</button>
      {pwToast && <div style={{ color: 'var(--green)', fontSize: 13, marginTop: 10 }}>{pwToast}</div>}

      {isAdmin && (
        <div className={`gift-modal${editingProfile ? ' show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeProfileEdit() }}>
          {editingProfile && (
            <div className="gift-modal-box" style={{ maxWidth: 420 }}>
              <div className="gift-modal-title">Edit Username / Email</div>
              {profileStep === 'form' ? (
                <>
                  <div className="gift-modal-sub">We'll send a verification code to your current email to confirm this change.</div>
                  <div style={{ display: 'grid', gap: 10 }}>
                    <input className="r-modal-input" placeholder="Username" value={profileForm.username} onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} />
                    <input className="r-modal-input" type="email" placeholder="Email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                    {profileError && <div style={{ color: 'var(--red)', fontSize: 12.5 }}>{profileError}</div>}
                    <div className="gift-modal-actions">
                      <button type="button" className="gift-cancel-btn" onClick={closeProfileEdit}>Cancel</button>
                      <button type="button" className="gift-send-btn" disabled={profileBusy} onClick={sendProfileCode}>{profileBusy ? 'Sending…' : 'Send Code'}</button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="gift-modal-sub">Enter the code sent to {user?.email}</div>
                  <div style={{ display: 'grid', gap: 10 }}>
                    <input className="r-modal-input" placeholder="6-digit code" maxLength={6} value={profileCode} onChange={(e) => setProfileCode(e.target.value.replace(/\D/g, ''))} />
                    {profileError && <div style={{ color: 'var(--red)', fontSize: 12.5 }}>{profileError}</div>}
                    <div className="gift-modal-actions">
                      <button type="button" className="gift-cancel-btn" onClick={closeProfileEdit}>Cancel</button>
                      <button type="button" className="gift-send-btn" disabled={profileBusy} onClick={confirmProfile}>{profileBusy ? 'Saving…' : 'Confirm & Save'}</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className={`gift-modal${changingPassword ? ' show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closePasswordChange() }}>
        {changingPassword && (
          <div className="gift-modal-box" style={{ maxWidth: 420 }}>
            <div className="gift-modal-title">Change Password</div>
            {pwStep === 'confirm' ? (
              <>
                <div className="gift-modal-sub">Confirm your current password to get started.</div>
                <form onSubmit={submitCurrentPassword} style={{ display: 'grid', gap: 10 }}>
                  <input className="r-modal-input" type="password" placeholder="Current password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoFocus />
                  {pwError && <div style={{ color: 'var(--red)', fontSize: 12.5 }}>{pwError}</div>}
                  <div className="gift-modal-actions">
                    <button type="button" className="gift-cancel-btn" onClick={closePasswordChange}>Cancel</button>
                    <button type="submit" className="gift-send-btn" disabled={pwBusy}>{pwBusy ? 'Verifying…' : 'Send Code'}</button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="gift-modal-sub">Enter the code sent to {user?.email}, and your new password.</div>
                <form onSubmit={submitNewPassword} style={{ display: 'grid', gap: 10 }}>
                  <input className="r-modal-input" placeholder="6-digit code" maxLength={6} value={pwCode} onChange={(e) => setPwCode(e.target.value.replace(/\D/g, ''))} autoFocus />
                  <input className="r-modal-input" type="password" placeholder="New password" autoComplete="new-password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
                  <input className="r-modal-input" type="password" placeholder="Confirm new password" autoComplete="new-password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
                  {pwError && <div style={{ color: 'var(--red)', fontSize: 12.5 }}>{pwError}</div>}
                  <div className="gift-modal-actions">
                    <button type="button" className="gift-cancel-btn" onClick={closePasswordChange}>Cancel</button>
                    <button type="button" className="btn ghost small" disabled={pwBusy} onClick={resendPwCode}>Resend</button>
                    <button type="submit" className="gift-send-btn" disabled={pwBusy}>{pwBusy ? 'Saving…' : 'Change Password'}</button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default SettingsPanel
