import { useEffect, useState } from 'react'
import { api } from './api.js'

const EMPTY_FORM = { name: '', username: '', password: '', email: '', phone: '' }

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function StaffPanel() {
  const [staff, setStaff] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [frontId, setFrontId] = useState(null)
  const [backId, setBackId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [viewing, setViewing] = useState(null)

  function load() {
    api.staff.list().then(setStaff)
  }
  useEffect(load, [])

  function toggleStatus(member) {
    const status = member.status === 'active' ? 'suspended' : 'active'
    api.staff.update(member.id, { status }).then(load)
  }

  function removeStaff(member) {
    if (!confirm(`Remove ${member.name}?`)) return
    api.staff.remove(member.id).then(load)
  }

  function openView(member) {
    api.staff.get(member.id).then(setViewing)
  }

  function closeAdd() {
    setShowAdd(false)
    setForm(EMPTY_FORM)
    setFrontId(null)
    setBackId(null)
    setError('')
  }

  async function handleFile(setter, e) {
    const file = e.target.files?.[0]
    if (!file) return
    setter(await fileToDataUrl(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.username || !form.password || !form.email || !form.phone || !frontId || !backId) {
      setError('All fields including both ID photos are required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.staff.create({ ...form, frontId, backId })
      closeAdd()
      load()
    } catch (err) {
      setError(err.message || 'Could not create staff account')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="panel-head"><h2>🛡️ Staff Management</h2><button className="btn small" onClick={() => setShowAdd(true)}>+ Add Staff</button></div>
      <div className="table-scroll">
      <table>
        <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.username}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td><span className={`dot-status dot-${s.status === 'active' ? 'active' : 'suspended'}`}></span>{s.status === 'active' ? 'Active' : 'Suspended'}</td>
              <td>
                <button className="btn ghost small" onClick={() => openView(s)}>IDs</button>{' '}
                <button className="btn ghost small" onClick={() => toggleStatus(s)}>{s.status === 'active' ? 'Suspend' : 'Reinstate'}</button>{' '}
                <button className="btn ghost small" onClick={() => removeStaff(s)}>Delete</button>
              </td>
            </tr>
          ))}
          {staff.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--txt-dim)', padding: '24px 0' }}>No staff accounts yet</td></tr>
          )}
        </tbody>
      </table>
      </div>

      <div className={`gift-modal${showAdd ? ' show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeAdd() }}>
        {showAdd && (
          <div className="gift-modal-box" style={{ maxWidth: 460 }}>
            <div className="gift-modal-title">➕ Add Staff</div>
            <div className="gift-modal-sub">Creates real login credentials for this staff member</div>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
              <input className="r-modal-input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="r-modal-input" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
              <input className="r-modal-input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <input className="r-modal-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="r-modal-input" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <label style={{ fontSize: 12, color: 'var(--txt-dim)' }}>
                Front ID photo
                <input type="file" accept="image/*" onChange={(e) => handleFile(setFrontId, e)} style={{ display: 'block', marginTop: 4 }} />
              </label>
              <label style={{ fontSize: 12, color: 'var(--txt-dim)' }}>
                Back ID photo
                <input type="file" accept="image/*" onChange={(e) => handleFile(setBackId, e)} style={{ display: 'block', marginTop: 4 }} />
              </label>
              {error && <div style={{ color: 'var(--red)', fontSize: 12.5 }}>{error}</div>}
              <div className="gift-modal-actions">
                <button type="button" className="gift-cancel-btn" onClick={closeAdd}>Cancel</button>
                <button type="submit" className="gift-send-btn" disabled={submitting}>{submitting ? 'Creating…' : 'Create Staff'}</button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className={`gift-modal${viewing ? ' show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setViewing(null) }}>
        {viewing && (
          <div className="gift-modal-box">
            <div className="gift-modal-title">🪪 {viewing.name}'s IDs</div>
            <div style={{ display: 'grid', gap: 10 }}>
              <img src={viewing.frontId} alt="Front ID" style={{ width: '100%', borderRadius: 10 }} />
              <img src={viewing.backId} alt="Back ID" style={{ width: '100%', borderRadius: 10 }} />
            </div>
            <div className="gift-modal-actions">
              <button className="gift-cancel-btn" onClick={() => setViewing(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default StaffPanel
