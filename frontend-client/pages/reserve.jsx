import { useState } from 'react'
import Header from '../src/components/Header.jsx'
import { api, CURRENT_USER } from './api.js'
import './reserve.css'

const BARS = [
  { name: 'Bar 1', emoji: '🍸', sub: 'Main Lounge' },
  { name: 'Bar 2', emoji: '🥃', sub: 'Whiskey Corner' },
  { name: 'Bar 3', emoji: '🥂', sub: 'Champagne Room' },
]
const ORDERS = [
  { key: 'low', name: 'Low Order', price: '$80', pay: 80, icon: '🥂', sub: 'Light drinks & snacks' },
  { key: 'med', name: 'Medium Order', price: '$160', pay: 160, icon: '🥃', sub: 'Premium selection' },
  { key: 'high', name: 'High Order', price: '$300', pay: 300, icon: '👑', sub: 'Full luxury package' },
]

function Reserve() {
  const [selBar, setSelBar] = useState('')
  const [selOrder, setSelOrder] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const dtStr = date && time ? `${date} at ${time}` : date || time || '—'
  const showSummary = selBar || selOrder || date || time

  async function submitOrder(e) {
    e.preventDefault()
    if (!selBar) { alert('Please choose a bar.'); return }
    if (!selOrder) { alert('Please choose an order level.'); return }
    if (!date || !time) { alert('Please select a date and time.'); return }

    try {
      await api.bookings.create({
        type: 'reserve-bar',
        activity: `Reserve Bar – ${selBar}`,
        user: CURRENT_USER,
        date,
        time,
        pay: selOrder.pay,
        paid: false,
      })
    } catch (err) {
      alert(err.message || 'Could not complete reservation, please try again.')
      return
    }

    setShowSuccess(true)
  }

  return (
    <>
      <div className="bg"></div>
      <div className="orb orb1"></div><div className="orb orb2"></div><div className="orb orb3"></div>

      <Header active="lounge" />

      <main>
        <div className="reserve-card">
          <div className="corner tl"></div><div className="corner tr"></div>
          <div className="corner bl"></div><div className="corner br"></div>

          <div className="form-header">
            <div className="form-icon">🥃</div>
            <div className="form-tag">Cigar Lounge</div>
            <div className="form-title">Reserve Your Bar</div>
          </div>
          <div className="divider"></div>

          <form onSubmit={submitOrder}>
            <div className="block">
              <div className="block-label">Logged In As</div>
              <div className="input-wrap">
                <input type="text" value={CURRENT_USER} readOnly style={{ cursor: 'default', color: 'rgba(245,158,11,.9)', fontWeight: 600, paddingRight: 130 }} />
                <span className="input-icon">👤</span>
                <div className="logged-badge"><div className="logged-dot"></div> Logged In</div>
              </div>
            </div>

            <div className="block">
              <div className="block-label">Choose Your Bar</div>
              <div className="bar-grid">
                {BARS.map((b) => (
                  <div key={b.name} className={`bar-option${selBar === b.name ? ' selected' : ''}`} onClick={() => setSelBar(b.name)}>
                    <div className="bar-check">✓</div>
                    <span className="bar-emoji">{b.emoji}</span>
                    <div className="bar-name">{b.name.toUpperCase()}</div>
                    <div className="bar-sub">{b.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="block">
              <div className="block-label">Order Level</div>
              <div className="order-grid">
                {ORDERS.map((o) => (
                  <div key={o.key} className={`order-option order-${o.key}${selOrder?.key === o.key ? ' selected' : ''}`} onClick={() => setSelOrder(o)}>
                    <div className="order-check">✓</div>
                    <span className="order-icon">{o.icon}</span>
                    <div className="order-name">{o.key.toUpperCase()}</div>
                    <div className="order-sub">{o.sub}</div>
                    <div className={`order-price price-${o.key}`}>{o.price}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="block">
              <div className="block-label">Date &amp; Time</div>
              <div className="datetime-grid">
                <div className="dt-group">
                  <label htmlFor="res-date">📅 Date</label>
                  <input type="date" id="res-date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="dt-group">
                  <label htmlFor="res-time">🕐 Time</label>
                  <input type="time" id="res-time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>
            </div>

            <div className={`summary${showSummary ? ' show' : ''}`}>
              <div className="summary-title">📋 Reservation Summary</div>
              <div className="summary-row"><span className="summary-key">Guest</span><span className="summary-val">{CURRENT_USER}</span></div>
              <div className="summary-row"><span className="summary-key">Location</span><span className="summary-val">{selBar || '—'}</span></div>
              <div className="summary-row"><span className="summary-key">Order Level</span><span className="summary-val">{selOrder ? selOrder.name : '—'}</span></div>
              <div className="summary-row"><span className="summary-key">Date &amp; Time</span><span className="summary-val">{dtStr}</span></div>
            </div>

            <button className="btn-submit" type="submit">🥃 &nbsp; Submit Order</button>
          </form>
        </div>
      </main>

      <div className={`success-overlay${showSuccess ? ' show' : ''}`}>
        <div className="success-box">
          <div className="success-icon">🎉</div>
          <div className="success-title">Reservation Confirmed!</div>
          <div className="success-sub">
            {selBar && selOrder ? (
              <>
                Your reservation is confirmed!<br /><br />
                🥃 {selBar} &nbsp;·&nbsp; {selOrder.name} ({selOrder.price})<br />
                📅 {date} at {time}<br /><br />
                We look forward to seeing you. 🥂
              </>
            ) : (
              <>Your table has been reserved.<br />We'll see you soon at Fusion Luxury Game.</>
            )}
          </div>
          <button className="btn-close" onClick={() => setShowSuccess(false)}>Done</button>
        </div>
      </div>
    </>
  )
}

export default Reserve
