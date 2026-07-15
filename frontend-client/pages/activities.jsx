import { useMemo, useState } from 'react'
import Header from '../src/components/Header.jsx'
import './activities.css'

const INITIAL_ACTIVITIES = [
  { id: 1, uid: 'FLG-4A7X', type: 'Ping Pong', emoji: '🏓', cls: 'act-pp', date: '2026-07-14', time: '10:00 – 12:00', ltn: 'Table 2', status: 'accepted' },
  { id: 2, uid: 'FLG-9B2M', type: 'Billiard', emoji: '🎱', cls: 'act-bil', date: '2026-07-15', time: '14:00 – 16:00', ltn: 'Table 3', status: 'pending' },
  { id: 3, uid: 'FLG-3K8R', type: 'Baby Foot', emoji: '⚽', cls: 'act-bf', date: '2026-07-16', time: '18:00 – 19:00', ltn: 'Table 1', status: 'accepted' },
  { id: 4, uid: 'FLG-7T1Q', type: 'Reserve Bar', emoji: '🥃', cls: 'act-bar', date: '2026-07-17', time: '20:00 – 23:00', ltn: 'Bar 2', status: 'pending' },
  { id: 5, uid: 'FLG-2W5N', type: 'Reserve Table', emoji: '🍽️', cls: 'act-tbl', date: '2026-07-18', time: '19:30 – 21:30', ltn: 'Table 4', status: 'rejected' },
  { id: 6, uid: 'FLG-6P3Z', type: 'FIFA Tournament', emoji: '⚽', cls: 'act-tour', date: '2026-07-20', time: '15:00 – 18:00', ltn: 'Main Hall', status: 'accepted' },
  { id: 7, uid: 'FLG-0D9V', type: 'Now Combat', emoji: '🥊', cls: 'act-tour', date: '2026-07-21', time: '17:00 – 19:00', ltn: 'Arena 1', status: 'pending' },
  { id: 8, uid: 'FLG-8H4C', type: 'VIP Room', emoji: '👑', cls: 'act-vip', date: '2026-07-22', time: '21:00 – 23:59', ltn: 'Royal', status: 'pending' },
  { id: 9, uid: 'FLG-1F6L', type: 'Ping Pong', emoji: '🏓', cls: 'act-pp', date: '2026-07-23', time: '09:00 – 10:00', ltn: 'Table 1', status: 'rejected' },
  { id: 10, uid: 'FLG-5Y2E', type: 'Reserve Bar', emoji: '🥃', cls: 'act-bar', date: '2026-07-25', time: '22:00 – 23:00', ltn: 'Bar 3', status: 'accepted' },
  { id: 11, uid: 'FLG-3J8U', type: 'Billiard', emoji: '🎱', cls: 'act-bil', date: '2026-07-26', time: '13:00 – 15:00', ltn: 'Table 1', status: 'pending' },
  { id: 12, uid: 'FLG-7S0G', type: 'Baby Foot', emoji: '⚽', cls: 'act-bf', date: '2026-07-27', time: '16:00 – 17:00', ltn: 'Table 4', status: 'accepted' },
]

const REASONS = ['Change of plans', 'Double booking', 'Not available', 'Wrong date/time']

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
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [modalId, setModalId] = useState(null)
  const [selectedReason, setSelectedReason] = useState('')
  const [otherReason, setOtherReason] = useState('')
  const [toast, setToast] = useState({ show: false, msg: '', err: false })

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
  function confirmDelete() {
    const reason = selectedReason || otherReason.trim()
    if (!reason) {
      showToast('Please select or write a reason.', true)
      return
    }
    const act = activities.find((a) => a.id === modalId)
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
            <div className="user-name">👤 user123</div>
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
