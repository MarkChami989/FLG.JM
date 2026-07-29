import { useEffect, useState } from 'react'
import Header from '../src/components/Header.jsx'
import { useAuth } from '../src/auth.jsx'
import { api } from './api.js'
import './join.css'

const ACCENTS = [
  { key: 'green', border: 'rgba(16,185,129,.5)', bg: 'rgba(16,185,129,.1)', bgHover: 'rgba(16,185,129,.12)', glow: 'rgba(16,185,129,.15)', check: '#10b981' },
  { key: 'red', border: 'rgba(239,68,68,.5)', bg: 'rgba(239,68,68,.1)', bgHover: 'rgba(239,68,68,.12)', glow: 'rgba(239,68,68,.15)', check: '#ef4444' },
  { key: 'purple', border: 'rgba(168,85,247,.5)', bg: 'rgba(168,85,247,.1)', bgHover: 'rgba(168,85,247,.12)', glow: 'rgba(168,85,247,.15)', check: '#a855f7' },
  { key: 'cyan', border: 'rgba(6,182,212,.5)', bg: 'rgba(6,182,212,.1)', bgHover: 'rgba(6,182,212,.12)', glow: 'rgba(6,182,212,.15)', check: '#06b6d4' },
]

function Join() {
  const { user } = useAuth()
  const username = user?.username || ''
  const [tournaments, setTournaments] = useState(null)
  const [selId, setSelId] = useState('')
  const [count, setCount] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)

  function reload() {
    api.tournaments.list().then(setTournaments)
  }
  useEffect(reload, [])

  const list = tournaments || []
  const sel = list.find((t) => t.id === selId)
  const price = sel ? sel.cost : 25
  const total = count * price

  function selectTourn(id) {
    setSelId(id)
  }
  function changeCount(n) {
    setCount((c) => Math.max(1, Math.min(10, c + n)))
  }

  async function submitJoin(e) {
    e.preventDefault()
    if (!sel) { alert('Please choose a tournament.'); return }

    try {
      for (let i = 0; i < count; i++) {
        await api.tournaments.join(sel.id, { user: username, uid: username })
      }
      await api.bookings.create({
        type: 'tournament',
        activity: `${sel.name} Tournament`,
        user: username,
        date: sel.date || new Date().toISOString().slice(0, 10),
        time: sel.time || '00:00',
        pay: total,
        paid: false,
      })
    } catch (err) {
      alert(err.message || 'Could not complete registration, please try again.')
      return
    }

    reload()
    setShowSuccess(true)
  }

  return (
    <>
      <div className="bg"></div>
      <div className="orb orb1"></div><div className="orb orb2"></div><div className="orb orb3"></div>

      <Header active="tournaments" />

      <main>
        <div className="join-card">
          <div className="corner tl"></div><div className="corner tr"></div>
          <div className="corner bl"></div><div className="corner br"></div>

          <div className="form-header">
            <div className="form-icon"></div>
            <div className="form-tag">Tournaments</div>
            <div className="form-title">Join Tournament</div>
          </div>
          <div className="divider"></div>

          <form onSubmit={submitJoin}>
            <div className="block">
              <div className="block-label">Logged In As</div>
              <div className="input-wrap">
                <input type="text" value={username} readOnly style={{ cursor: 'default', color: 'rgba(217,70,239,.9)', fontWeight: 600, paddingRight: 130 }} />
                <span className="input-icon"></span>
                <div className="logged-badge"><div className="logged-dot"></div> Logged In</div>
              </div>
            </div>

            <div className="block">
              <div className="block-label">Choose Tournament</div>
              {tournaments === null ? (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--muted)', fontSize: 13 }}>Loading tournaments…</div>
              ) : list.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--muted)', fontSize: 13 }}>No tournaments available right now.</div>
              ) : (
                <div className="tourn-grid">
                  {list.map((t, i) => {
                    const a = ACCENTS[i % ACCENTS.length]
                    const left = t.max - t.clients.length
                    const isFull = left <= 0
                    return (
                      <div
                        key={t.id}
                        className={`tourn-option${selId === t.id ? ' selected' : ''}${isFull ? ' full' : ''}`}
                        onClick={() => !isFull && selectTourn(t.id)}
                        style={{
                          borderColor: selId === t.id ? a.border : undefined,
                          background: selId === t.id ? a.bg : undefined,
                          boxShadow: selId === t.id ? `0 0 0 1px ${a.border},0 8px 24px ${a.glow}` : undefined,
                          opacity: isFull ? 0.5 : 1,
                          cursor: isFull ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <div className="tourn-check" style={{ display: selId === t.id ? 'flex' : 'none', background: a.check, color: '#fff' }}>✓</div>
                        <div className="tourn-name">{t.name}</div>
                        <div className="tourn-info">{t.date || 'TBA'} {t.time ? `· ${t.time}` : ''}</div>
                        <div className="tourn-info">{t.clients.length} / {t.max} Players</div>
                        <div className={`tourn-spots ${isFull ? 'spots-red' : left <= 5 ? 'spots-red' : 'spots-green'}`}>{isFull ? 'Full' : `${left} Spot${left !== 1 ? 's' : ''} Left`}</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="block">
              <div className="block-label">Number of Tickets</div>
              <div className="ticket-wrap">
                <div className="ticket-info">
                  <div className="ticket-icon"></div>
                  <div>
                    <div className="ticket-label">Tickets</div>
                    <div className="ticket-sub">Entry per player · ${price} each</div>
                  </div>
                </div>
                <div className="counter-ctrl">
                  <button type="button" className="counter-btn" onClick={() => changeCount(-1)}>−</button>
                  <div className="counter-val">{count}</div>
                  <button type="button" className="counter-btn" onClick={() => changeCount(1)}>+</button>
                </div>
              </div>

              <div className="ticket-badges">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} className={`t-badge${count === n ? ' active' : ''}`} onClick={() => setCount(n)}>×{n}</span>
                ))}
              </div>
            </div>

            <div className="price-preview">
              <div className="price-left">
                Total Entry Fee
                <span>{count} ticket{count > 1 ? 's' : ''} × ${price}</span>
              </div>
              <div className="price-right">${total}</div>
            </div>

            <div className={`summary${sel ? ' show' : ''}`}>
              <div className="summary-title">Registration Summary</div>
              <div className="summary-row"><span className="summary-key">Player</span><span className="summary-val">{username}</span></div>
              <div className="summary-row"><span className="summary-key">Tournament</span><span className="summary-val">{sel ? sel.name : '—'}</span></div>
              <div className="summary-row"><span className="summary-key">Schedule</span><span className="summary-val">{sel ? `${sel.date || 'TBA'} ${sel.time || ''}` : '—'}</span></div>
              <div className="summary-row"><span className="summary-key">Tickets</span><span className="summary-val">{count} ticket{count > 1 ? 's' : ''}</span></div>
              <div className="summary-row" style={{ marginTop: 4 }}>
                <span className="summary-key" style={{ fontWeight: 700, color: 'var(--text)' }}>Total</span>
                <span className="summary-val" style={{ color: 'var(--gold)', fontFamily: 'Rajdhani,sans-serif', fontSize: 18, fontWeight: 700 }}>${total}</span>
              </div>
            </div>

            <button className="btn-submit" type="submit">Submit &amp; Join</button>
          </form>
        </div>
      </main>

      <div className={`success-overlay${showSuccess ? ' show' : ''}`}>
        <div className="success-box">
          <div className="success-icon"></div>
          <div className="success-title">You're In!</div>
          <div className="success-sub">
            {sel && (
              <>
                <strong>{username}</strong> has been registered!<br /><br />
                {sel.name} — {sel.date || 'TBA'} {sel.time || ''}<br />
                {count} Ticket{count > 1 ? 's' : ''} · <strong style={{ color: 'var(--gold)' }}>${total}</strong><br /><br />
                Good luck and may the best player win!
              </>
            )}
          </div>
          <button className="btn-close" onClick={() => setShowSuccess(false)}>Let's Go</button>
        </div>
      </div>
    </>
  )
}

export default Join
