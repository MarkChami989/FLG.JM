import { useEffect, useMemo, useState } from 'react'
import Header from '../src/components/Header.jsx'
import { useAuth } from '../src/auth.jsx'
import { api } from './api.js'
import './reserve.css'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const BAR_IDS = { 'Bar 1': 'bar-1', 'Bar 2': 'bar-2', 'Bar 3': 'bar-3' }
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

function fmtKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function Reserve() {
  const { user } = useAuth()
  const username = user?.username || ''
  const [selBar, setSelBar] = useState('')
  const [selOrder, setSelOrder] = useState(null)

  const now = useMemo(() => { const n = new Date(); n.setHours(0, 0, 0, 0); return n }, [])
  const [calYear, setCalYear] = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth())
  const [selDateKey, setSelDateKey] = useState('')
  const [selDateLabel, setSelDateLabel] = useState('')
  const [chosenSlots, setChosenSlots] = useState(new Set())
  const [dragMode, setDragMode] = useState(null)

  const [takenHours, setTakenHours] = useState(new Set())
  const [showSuccess, setShowSuccess] = useState(false)
  const [confirmedDtStr, setConfirmedDtStr] = useState('—')

  useEffect(() => {
    function onUp() { setDragMode(null) }
    window.addEventListener('mouseup', onUp)
    return () => window.removeEventListener('mouseup', onUp)
  }, [])

  useEffect(() => {
    if (!selBar || !selDateKey) { setTakenHours(new Set()); return }
    api.resources.slots(BAR_IDS[selBar], selDateKey).then((slots) => {
      setTakenHours(new Set(slots.map((s) => s.hour)))
    })
  }, [selBar, selDateKey])

  function changeMonth(dir) {
    let m = calMonth + dir, y = calYear
    if (m > 11) { m = 0; y++ }
    if (m < 0) { m = 11; y-- }
    setCalMonth(m); setCalYear(y)
  }

  function pickDate(date, key) {
    setSelDateKey(key)
    setSelDateLabel(date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    setChosenSlots(new Set())
  }

  function selectBar(name) {
    setSelBar(name)
    setChosenSlots(new Set())
  }

  function slotDown(h, taken) {
    if (taken) return
    setChosenSlots((prev) => {
      const next = new Set(prev)
      if (next.has(h)) { next.delete(h); setDragMode('unchoose') }
      else { next.add(h); setDragMode('choose') }
      return next
    })
  }
  function slotEnter(h, taken) {
    if (!dragMode || taken) return
    setChosenSlots((prev) => {
      const next = new Set(prev)
      if (dragMode === 'choose') next.add(h)
      else next.delete(h)
      return next
    })
  }

  const dtStr = selDateLabel && chosenSlots.size ? `${selDateLabel} · ${Array.from(chosenSlots).sort().map((h) => `${h}:00`).join(', ')}` : '—'
  const showSummary = selBar || selOrder || selDateKey

  async function submitOrder(e) {
    e.preventDefault()
    if (!selBar) { alert('Please choose a bar.'); return }
    if (!selOrder) { alert('Please choose an order level.'); return }
    if (!selDateKey) { alert('Please pick a date.'); return }
    if (chosenSlots.size === 0) { alert('Please select at least one time slot.'); return }
    const sorted = Array.from(chosenSlots).sort()
    const resourceId = BAR_IDS[selBar]

    try {
      for (const h of sorted) {
        await api.resources.bookSlot(resourceId, { date: selDateKey, hour: h, clientName: username })
      }
      await api.bookings.create({
        type: 'reserve-bar',
        activity: `Reserve Bar – ${selBar}`,
        user: username,
        date: selDateKey,
        time: sorted.map((h) => `${h}:00`).join(', '),
        resourceId,
        pay: selOrder.pay,
        paid: false,
      })
    } catch (err) {
      alert(err.message || 'Could not complete reservation, please try again.')
      return
    }

    setConfirmedDtStr(`${selDateLabel} · ${sorted.map((h) => `${h}:00`).join(', ')}`)
    setChosenSlots(new Set())
    setTakenHours((prev) => new Set([...prev, ...sorted]))
    setShowSuccess(true)
  }

  const calDays = []
  const first = new Date(calYear, calMonth, 1).getDay()
  const total = new Date(calYear, calMonth + 1, 0).getDate()
  for (let i = 0; i < first; i++) calDays.push(null)
  for (let d = 1; d <= total; d++) calDays.push(d)

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
                <input type="text" value={username} readOnly style={{ cursor: 'default', color: 'rgba(245,158,11,.9)', fontWeight: 600, paddingRight: 130 }} />
                <span className="input-icon">👤</span>
                <div className="logged-badge"><div className="logged-dot"></div> Logged In</div>
              </div>
            </div>

            <div className="block">
              <div className="block-label">Choose Your Bar</div>
              <div className="bar-grid">
                {BARS.map((b) => (
                  <div key={b.name} className={`bar-option${selBar === b.name ? ' selected' : ''}`} onClick={() => selectBar(b.name)}>
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
              <div className="block-label">Pick a Date</div>
              <div className="cal-wrap">
                <div className="cal-header">
                  <button type="button" className="cal-nav" onClick={() => changeMonth(-1)}>‹</button>
                  <div className="cal-month">{MONTHS[calMonth]} {calYear}</div>
                  <button type="button" className="cal-nav" onClick={() => changeMonth(1)}>›</button>
                </div>
                <div className="cal-grid">
                  {DAYS.map((d) => <div className="cal-dow" key={d}>{d}</div>)}
                  {calDays.map((d, i) => {
                    if (d === null) return <div className="cal-day empty" key={i}></div>
                    const date = new Date(calYear, calMonth, d)
                    const key = fmtKey(date)
                    const isPast = date < now
                    const isToday = date.getTime() === now.getTime()
                    const isSelected = key === selDateKey
                    return (
                      <div
                        key={i}
                        className={`cal-day${isPast ? ' past' : ''}${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}`}
                        onClick={() => !isPast && pickDate(date, key)}
                      >
                        {d}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="block">
              <div className="block-label">Select Time Slots</div>
              {!selBar ? (
                <div className="no-date-notice"><span>🍸</span>Please choose a bar first</div>
              ) : !selDateKey ? (
                <div className="no-date-notice"><span>📅</span>Please pick a date first</div>
              ) : (
                <>
                  <div className="time-legend">
                    <div className="leg-item"><div className="leg-dot leg-av"></div>Available</div>
                    <div className="leg-item"><div className="leg-dot leg-tak"></div>Taken</div>
                    <div className="leg-item"><div className="leg-dot leg-sel"></div>Your Selection</div>
                  </div>
                  <div className="time-grid">
                    {Array.from({ length: 24 }).map((_, h) => {
                      const hStr = String(h).padStart(2, '0')
                      const ampm = h < 12 ? (h === 0 ? '12 AM' : `${h} AM`) : (h === 12 ? '12 PM' : `${h - 12} PM`)
                      const isTaken = takenHours.has(hStr)
                      const isChosen = chosenSlots.has(hStr)
                      return (
                        <div
                          key={hStr}
                          className={`time-slot${isTaken ? ' taken' : isChosen ? ' chosen' : ''}`}
                          onMouseDown={() => slotDown(hStr, isTaken)}
                          onMouseEnter={() => slotEnter(hStr, isTaken)}
                        >
                          {hStr}:00<span className="am-pm">{ampm}</span>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            <div className={`summary${showSummary ? ' show' : ''}`}>
              <div className="summary-title">📋 Reservation Summary</div>
              <div className="summary-row"><span className="summary-key">Guest</span><span className="summary-val">{username}</span></div>
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
                📅 {confirmedDtStr}<br /><br />
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
