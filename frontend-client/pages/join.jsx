import { useState } from 'react'
import Header from '../src/components/Header.jsx'
import './join.css'

const TOURNAMENTS = {
  fifa: { name: 'FIFA', emoji: '⚽', price: 25, spotsText: '14 Spots Left', spotsClass: 'spots-green', info: '50 / 64 Players' },
  combat: { name: 'Now Combat', emoji: '🥊', price: 20, spotsText: '2 Spots Left', spotsClass: 'spots-red', info: '30 / 32 Players' },
}

function Join() {
  const [selKey, setSelKey] = useState('')
  const [count, setCount] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)

  const sel = TOURNAMENTS[selKey]
  const price = sel ? sel.price : 25
  const total = count * price

  function selectTourn(key) {
    setSelKey(key)
  }
  function changeCount(n) {
    setCount((c) => Math.max(1, Math.min(10, c + n)))
  }

  function submitJoin(e) {
    e.preventDefault()
    if (!sel) { alert('Please choose a tournament.'); return }
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
                <input type="text" value="user123" readOnly style={{ cursor: 'default', color: 'rgba(217,70,239,.9)', fontWeight: 600, paddingRight: 130 }} />
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
                  <div className="tourn-info">50 / 64 Players</div>
                  <div className="tourn-spots spots-green">14 Spots Left</div>
                </div>
                <div className={`tourn-option t-combat${selKey === 'combat' ? ' selected' : ''}`} onClick={() => selectTourn('combat')}>
                  <div className="tourn-check check-combat">✓</div>
                  <span className="tourn-emoji">🥊</span>
                  <div className="tourn-name">COMBAT</div>
                  <div className="tourn-info">30 / 32 Players</div>
                  <div className="tourn-spots spots-red">2 Spots Left</div>
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
              <div className="summary-row"><span className="summary-key">Player</span><span className="summary-val">user123</span></div>
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
                <strong>user123</strong> has been registered!<br /><br />
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
