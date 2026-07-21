import { useEffect, useMemo, useState } from 'react'
import Header from '../src/components/Header.jsx'
import { useAuth } from '../src/auth.jsx'
import { api } from './api.js'
import './activities.css'

const REASONS = ['Change of plans', 'Double booking', 'Not available', 'Wrong date/time']

const TYPE_META = {
  'Ping Pong': { emoji: '🏓', cls: 'act-pp' },
  'Billiard': { emoji: '🎱', cls: 'act-bil' },
  'Baby Foot': { emoji: '⚽', cls: 'act-bf' },
  'Reserve Bar': { emoji: '🥃', cls: 'act-bar' },
  'Reserve Table': { emoji: '🍽️', cls: 'act-tbl' },
}

function deriveActivity(b) {
  if (b.type === 'tournament') {
    return { uid: b.id, type: b.activity, emoji: '🏆', cls: 'act-tour', ltn: 'Main Hall' }
  }
  const [label, rest = ''] = b.activity.split(' – ')
  const ltn = rest.split(' · ')[0] || '—'
  const meta = TYPE_META[label] || { emoji: '🎮', cls: 'act-pp' }
  return { uid: b.id, type: label, emoji: meta.emoji, cls: meta.cls, ltn }
}

function formatDate(d) {
  const [y, m, day] = d.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${day} ${months[+m - 1]} ${y}`
}
function getDayName(d) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long' })
}
function statusBadge(s) {
  if (s === 'pending') return <span className="status-badge s-pending"><span className="st-dot"></span>PENDING</span>
  if (s === 'accepted') return <span className="status-badge s-accepted"><span className="st-dot"></span>ACCEPTED</span>
  return <span className="status-badge s-rejected"><span className="st-dot"></span>REJECTED</span>
}

function Activities() {
  const { user } = useAuth()
  const username = user?.username || ''
  const [activities, setActivities] = useState([])
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [modalId, setModalId] = useState(null)
  const [selectedReason, setSelectedReason] = useState('')
  const [otherReason, setOtherReason] = useState('')
  const [toast, setToast] = useState({ show: false, msg: '', err: false })

  useEffect(() => {
    api.bookings.list({ user: username }).then((list) => {
      setActivities(list.map((b) => ({ ...b, ...deriveActivity(b) })))
    })
  }, [username])

  const rows = useMemo(() => {
    const q = query.toLowerCase()
    return activities.filter((a) => {
      const matchFilter = filter === 'all' || a.status === filter
      const matchSearch = !q || a.type.toLowerCase().includes(q) || a.ltn.toLowerCase().includes(q) || a.date.includes(q) || a.uid.toLowerCase().includes(q)
      return matchFilter && matchSearch
    })
  }, [activities, filter, query])

  const counts = {
    all: activities.length,
    pending: activities.filter((a) => a.status === 'pending').length,
    accepted: activities.filter((a) => a.status === 'accepted').length,
    rejected: activities.filter((a) => a.status === 'rejected').length,
  }

  const modalActivity = activities.find((a) => a.id === modalId)

  function openModal(id) {
    setModalId(id)
    setSelectedReason('')
    setOtherReason('')
  }
  function closeModal() {
    setModalId(null)
  }
  function showToast(msg, err = false) {
    setToast({ show: true, msg, err })
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3200)
  }
  async function confirmDelete() {
    const reason = selectedReason || otherReason.trim()
    if (!reason) {
      showToast('Please select or write a reason.', true)
      return
    }
    const act = activities.find((a) => a.id === modalId)
    try {
      await api.bookings.remove(modalId)
    } catch (err) {
      closeModal()
      showToast(err.message || 'Could not delete activity.', true)
      return
    }
    setActivities((prev) => prev.filter((a) => a.id !== modalId))
    closeModal()
    showToast(`🗑️ ${act.type} deleted – "${reason}"`)
  }

  return (
    <>
      <div className="bg"></div>
      <div className="orb orb1"></div><div className="orb orb2"></div><div className="orb orb3"></div>

      <Header active="activities" />

      <main>
        <div className="page-head">
          <div className="page-title-wrap">
            <div className="page-tag">Dashboard</div>
            <h1>My Activities</h1>
          </div>
          <div className="user-chip">
            <div className="user-dot"></div>
            <div className="user-name">👤 {username}</div>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div><div className="stat-val sv-all">{counts.all}</div><div className="stat-lbl">Total</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div><div className="stat-val sv-pend">{counts.pending}</div><div className="stat-lbl">Pending</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div><div className="stat-val sv-acc">{counts.accepted}</div><div className="stat-lbl">Accepted</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❌</div>
            <div><div className="stat-val sv-rej">{counts.rejected}</div><div className="stat-lbl">Rejected</div></div>
          </div>
        </div>

        <div className="filters">
          <button className={`filter-btn${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-btn f-pend${filter === 'pending' ? ' active' : ''}`} onClick={() => setFilter('pending')}>⏳ Pending</button>
          <button className={`filter-btn f-acc${filter === 'accepted' ? ' active' : ''}`} onClick={() => setFilter('accepted')}>✅ Accepted</button>
          <button className={`filter-btn f-rej${filter === 'rejected' ? ' active' : ''}`} onClick={() => setFilter('rejected')}>❌ Rejected</button>
          <div className="filter-spacer"></div>
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" type="text" placeholder="Search activities…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>

        <div className="table-wrap">
          {rows.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type of Activity</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>LTN</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a, i) => (
                  <tr key={a.id} style={{ animationDelay: `${i * 0.04}s` }}>
                    <td><span className="uid-badge">{a.uid}</span></td>
                    <td><span className={`act-chip ${a.cls}`}>{a.emoji} {a.type}</span></td>
                    <td className="date-cell">
                      <div className="date-main">{formatDate(a.date)}</div>
                      <div className="date-sub">{getDayName(a.date)}</div>
                    </td>
                    <td style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 600, fontSize: 13, color: '#c4b5fd', letterSpacing: '.5px' }}>{a.time}</td>
                    <td><span className="ltn-badge">{a.ltn}</span></td>
                    <td>{statusBadge(a.status)}</td>
                    <td className="actions">
                      <button className="btn-delete" onClick={() => openModal(a.id)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <span>🎭</span>
              <p>No activities found.</p>
            </div>
          )}
        </div>
      </main>

      <div className={`modal-overlay${modalId !== null ? ' show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}>
        <div className="modal-box">
          <div className="modal-icon">🗑️</div>
          <div className="modal-title">Delete Activity</div>
          <div className="modal-sub">
            Are you sure you want to delete <strong>{modalActivity ? `[${modalActivity.uid}] ${modalActivity.emoji} ${modalActivity.type} – ${formatDate(modalActivity.date)}` : ''}</strong>?
          </div>

          <span className="reason-label">Why do you want to cancel?</span>
          <div className="reason-grid">
            {REASONS.map((r) => (
              <div key={r} className={`reason-opt${selectedReason === r ? ' sel' : ''}`} onClick={() => setSelectedReason(r)}>
                <div className="ro-dot"></div>{r}
              </div>
            ))}
          </div>
          <textarea
            className="reason-other"
            rows={2}
            placeholder="Or write your own reason…"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
          ></textarea>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={closeModal}>Cancel</button>
            <button className="btn-confirm-del" onClick={confirmDelete}>🗑️ Delete</button>
          </div>
        </div>
      </div>

      <div className={`toast${toast.show ? ' show' : ''}${toast.err ? ' err' : ''}`}>{toast.msg}</div>
    </>
  )
}

export default Activities
