import { useState } from 'react'
import { useAuth } from '../src/auth.jsx'
import { api } from './api.js'

function SettingsPanel() {
  const { user, login } = useAuth()

  // ---- Username / email edit ----
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

  // ---- Password change ----
  const [changingPassword, setChangingPassword] = useState(false)
  const [pwStep, setPwStep] = useState('code') // 'code' | 'form'
  const [pwCode, setPwCode] = useState('')
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwError, setPwError] = useState('')
  const [pwBusy, setPwBusy] = useState(false)
  const [pwToast, setPwToast] = useState('')

  async function openPasswordChange() {
    setChangingPassword(true)
    setPwStep('code')
    setPwCode('')
    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setPwError('')
    setPwBusy(true)
    try {
      await api.adminAuth.sendPasswordCode()
    } catch (err) {
      setPwError(err.message || 'Could not send verification code')
    } finally {
      setPwBusy(false)
    }
  }
  function closePasswordChange() {
    setChangingPassword(false)
  }

  async function resendPwCode() {
    setPwBusy(true)
    setPwError('')
    try {
      await api.adminAuth.sendPasswordCode()
    } catch (err) {
      setPwError(err.message || 'Could not resend code')
    } finally {
      setPwBusy(false)
    }
  }

  function verifyPwCode() {
    if (!pwCode.trim()) {
      setPwError('Enter the verification code')
      return
    }
    setPwError('')
    setPwStep('form')
  }

  async function submitPasswordChange(e) {
    e.preventDefault()
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
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
      await api.adminAuth.changePassword({
        code: pwCode.trim(),
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
        confirmPassword: pwForm.confirmPassword,
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

      <div className="subhead">Account Info</div>
      <div className="detail-grid">
        <div className="detail-item"><label>Username</label><div>{user?.username}</div></div>
        <div className="detail-item"><label>Email</label><div>{user?.email}</div></div>
      </div>
      <button className="btn ghost small" onClick={openProfileEdit}>Edit Username / Email</button>
      {profileToast && <div style={{ color: 'var(--green)', fontSize: 13, marginTop: 10 }}>{profileToast}</div>}

      <div className="subhead" style={{ marginTop: 34 }}>Security</div>
      <button className="btn small" onClick={openPasswordChange}>Change Password</button>
      {pwToast && <div style={{ color: 'var(--green)', fontSize: 13, marginTop: 10 }}>{pwToast}</div>}

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

      <div className={`gift-modal${changingPassword ? ' show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closePasswordChange() }}>
        {changingPassword && (
          <div className="gift-modal-box" style={{ maxWidth: 420 }}>
            <div className="gift-modal-title">Change Password</div>
            {pwStep === 'code' ? (
              <>
                <div className="gift-modal-sub">Enter the verification code sent to {user?.email}</div>
                <div style={{ display: 'grid', gap: 10 }}>
                  <input className="r-modal-input" placeholder="6-digit code" maxLength={6} value={pwCode} onChange={(e) => setPwCode(e.target.value.replace(/\D/g, ''))} />
                  {pwError && <div style={{ color: 'var(--red)', fontSize: 12.5 }}>{pwError}</div>}
                  <div className="gift-modal-actions">
                    <button type="button" className="gift-cancel-btn" onClick={closePasswordChange}>Cancel</button>
                    <button type="button" className="btn ghost small" disabled={pwBusy} onClick={resendPwCode}>Resend</button>
                    <button type="button" className="gift-send-btn" disabled={pwBusy} onClick={verifyPwCode}>Continue</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="gift-modal-sub">Confirm your current password, then choose a new one.</div>
                <form onSubmit={submitPasswordChange} style={{ display: 'grid', gap: 10 }}>
                  <input className="r-modal-input" type="password" placeholder="Current password" autoComplete="current-password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
                  <input className="r-modal-input" type="password" placeholder="New password" autoComplete="new-password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
                  <input className="r-modal-input" type="password" placeholder="Confirm new password" autoComplete="new-password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
                  {pwError && <div style={{ color: 'var(--red)', fontSize: 12.5 }}>{pwError}</div>}
                  <div className="gift-modal-actions">
                    <button type="button" className="gift-cancel-btn" onClick={closePasswordChange}>Cancel</button>
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
