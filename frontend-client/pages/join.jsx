import { useEffect, useState } from 'react'
import Header from '../src/components/Header.jsx'
import { api, CURRENT_USER } from './api.js'
import './join.css'

const TOURN_META = {
  fifa: { id: 'T-001', emoji: '⚽', spotsClass: (left) => (left <= 5 ? 'spots-red' : 'spots-green') },
  combat: { id: 'T-002', emoji: '🥊', spotsClass: (left) => (left <= 5 ? 'spots-red' : 'spots-green') },
}

function Join() {
  const [tournaments, setTournaments] = useState({})
  const [selKey, setSelKey] = useState('')
  const [count, setCount] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    api.tournaments.list().then((list) => {
      const byId = {}
      list.forEach((t) => { byId[t.id] = t })
      const next = {}
      for (const [key, meta] of Object.entries(TOURN_META)) {
        const t = byId[meta.id]
        if (!t) continue
        const left = t.max - t.clients.length
        next[key] = {
          id: t.id,
          name: t.name,
          emoji: meta.emoji,
          price: t.cost,
          spotsLeft: left,
          spotsText: `${left} Spot${left !== 1 ? 's' : ''} Left`,
          spotsClass: meta.spotsClass(left),
          info: `${t.clients.length} / ${t.max} Players`,
        }
      }
      setTournaments(next)
    })
  }, [])

  const sel = tournaments[selKey]
  const price = sel ? sel.price : 25
  const total = count * price

  function selectTourn(key) {
    setSelKey(key)
  }
  function changeCount(n) {
    setCount((c) => Math.max(1, Math.min(10, c + n)))
  }

  async function submitJoin(e) {
    e.preventDefault()
    if (!sel) { alert('Please choose a tournament.'); return }

    try {
      for (let i = 0; i < count; i++) {
        await api.tournaments.join(sel.id, { user: CURRENT_USER, uid: CURRENT_USER })
      }
      const now = new Date()
      await api.bookings.create({
        type: 'tournament',
        activity: `${sel.name} Tournament`,
        user: CURRENT_USER,
        date: now.toISOString().slice(0, 10),
        time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        pay: total,
        paid: false,
      })
    } catch (err) {
      alert(err.message || 'Could not complete registration, please try again.')
      return
    }

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
            <div className="form-icon">🏆</div>
            <div className="form-tag">Tournaments</div>
            <div className="form-title">Join Tournament</div>
          </div>
          <div className="divider"></div>

          <form onSubmit={submitJoin}>
            <div className="block">
              <div className="block-label">Logged In As</div>
              <div className="input-wrap">
                <input type="text" value={CURRENT_USER} readOnly style={{ cursor: 'default', color: 'rgba(217,70,239,.9)', fontWeight: 600, paddingRight: 130 }} />
                <span className="input-icon">👤</span>
                <div className="logged-badge"><div className="logged-dot"></div> Logged In</div>
              </div>
            </div>

            <div className="block">
              <div className="block-label">Choose Tournament</div>
              <div className="tourn-grid">
                <div className={`tourn-option t-fifa${selKey === 'fifa' ? ' selected' : ''}`} onClick={() => selectTourn('fifa')}>
                  <div className="tourn-check check-fifa">✓</div>
                  <span className="tourn-emoji">⚽</span>
                  <div className="tourn-name">FIFA</div>
                  <div className="tourn-info">{tournaments.fifa ? tournaments.fifa.info : '—'}</div>
                  <div className={`tourn-spots ${tournaments.fifa ? tournaments.fifa.spotsClass : 'spots-green'}`}>{tournaments.fifa ? tournaments.fifa.spotsText : '—'}</div>
                </div>
                <div className={`tourn-option t-combat${selKey === 'combat' ? ' selected' : ''}`} onClick={() => selectTourn('combat')}>
                  <div className="tourn-check check-combat">✓</div>
                  <span className="tourn-emoji">🥊</span>
                  <div className="tourn-name">COMBAT</div>
                  <div className="tourn-info">{tournaments.combat ? tournaments.combat.info : '—'}</div>
                  <div className={`tourn-spots ${tournaments.combat ? tournaments.combat.spotsClass : 'spots-red'}`}>{tournaments.combat ? tournaments.combat.spotsText : '—'}</div>
                </div>
              </div>
            </div>

            <div className="block">
              <div className="block-label">Number of Tickets</div>
              <div className="ticket-wrap">
                <div className="ticket-info">
                  <div className="ticket-icon">🎟️</div>
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
              <div className="summary-title">📋 Registration Summary</div>
              <div className="summary-row"><span className="summary-key">Player</span><span className="summary-val">{CURRENT_USER}</span></div>
              <div className="summary-row"><span className="summary-key">Tournament</span><span className="summary-val">{sel ? `${sel.emoji} ${sel.name}` : '—'}</span></div>
              <div className="summary-row"><span className="summary-key">Tickets</span><span className="summary-val">{count} ticket{count > 1 ? 's' : ''}</span></div>
              <div className="summary-row" style={{ marginTop: 4 }}>
                <span className="summary-key" style={{ fontWeight: 700, color: 'var(--text)' }}>Total</span>
                <span className="summary-val" style={{ color: 'var(--gold)', fontFamily: 'Rajdhani,sans-serif', fontSize: 18, fontWeight: 700 }}>${total}</span>
              </div>
            </div>

            <button className="btn-submit" type="submit">🏆 &nbsp; Submit &amp; Join</button>
          </form>
        </div>
      </main>

      <div className={`success-overlay${showSuccess ? ' show' : ''}`}>
        <div className="success-box">
          <div className="success-icon">🎉</div>
          <div className="success-title">You're In!</div>
          <div className="success-sub">
            {sel && (
              <>
                <strong>{CURRENT_USER}</strong> has been registered!<br /><br />
                {sel.emoji} {sel.name}<br />
                🎟️ {count} Ticket{count > 1 ? 's' : ''} · <strong style={{ color: 'var(--gold)' }}>${total}</strong><br /><br />
                Good luck and may the best player win! 🏆
              </>
            )}
          </div>
          <button className="btn-close" onClick={() => setShowSuccess(false)}>Let's Go 🚀</button>
        </div>
      </div>
    </>
  )
}

export default Join
