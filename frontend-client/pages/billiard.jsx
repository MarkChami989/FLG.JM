import { useEffect, useMemo, useState } from 'react'
import Header from '../src/components/Header.jsx'
import { useAuth } from '../src/auth.jsx'
import { api } from './api.js'
import './billiard.css'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const TABLE_IDS = { 'Table 1': 'bi-t1', 'Table 2': 'bi-t2', 'Table 3': 'bi-vb', 'Table 4': 'bi-vr' }

function fmtKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function BilliardTableArt({ bg }) {
  return (
    <div className="bil-art" style={bg ? { background: bg.bg, borderColor: bg.border } : undefined}>
      <div className="bil-balls">
        <div className="bil-ball b-white"></div>
        <div className="bil-ball b-red1"></div>
        <div className="bil-ball b-red2"></div>
        <div className="bil-ball b-yel"></div>
        <div className="bil-ball b-blue"></div>
        <div className="bil-ball b-pink"></div>
        <div className="bil-ball b-blk"></div>
      </div>
      <div className="bil-cue"></div>
    </div>
  )
}

function Billiard() {
  const { user } = useAuth()
  const username = user?.username || ''
  const [selTable, setSelTable] = useState('')

  const now = useMemo(() => { const n = new Date(); n.setHours(0, 0, 0, 0); return n }, [])
  const [calYear, setCalYear] = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth())
  const [selDateKey, setSelDateKey] = useState('')
  const [selDateLabel, setSelDateLabel] = useState('')
  const [chosenSlots, setChosenSlots] = useState(new Set())
  const [dragMode, setDragMode] = useState(null)

  const [takenHours, setTakenHours] = useState(new Set())
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)

  useEffect(() => {
    function onUp() { setDragMode(null) }
    window.addEventListener('mouseup', onUp)
    return () => window.removeEventListener('mouseup', onUp)
  }, [])

  useEffect(() => {
    if (!selTable || !selDateKey) { setTakenHours(new Set()); return }
    api.resources.slots(TABLE_IDS[selTable], selDateKey).then((slots) => {
      setTakenHours(new Set(slots.map((s) => s.hour)))
    })
  }, [selTable, selDateKey])

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

  function selectTable(name) {
    setSelTable(name)
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

  async function submitReserve() {
    if (!selTable) { alert('Please choose a table.'); return }
    if (!selDateKey) { alert('Please pick a date.'); return }
    if (chosenSlots.size === 0) { alert('Please select at least one time slot.'); return }
    const sorted = Array.from(chosenSlots).sort()
    const resourceId = TABLE_IDS[selTable]

    try {
      for (const h of sorted) {
        await api.resources.bookSlot(resourceId, { date: selDateKey, hour: h, clientName: username })
      }
      await api.bookings.create({
        type: 'tabletop',
        activity: `Billiard – ${selTable}`,
        user: username,
        date: selDateKey,
        time: `${sorted[0]}:00`,
        pay: 0,
        paid: false,
      })
    } catch (e) {
      alert(e.message || 'Could not complete reservation, please try again.')
      return
    }

    setSuccessMsg(
      <>
        <strong>{username}</strong> — your billiard table is booked!<br /><br />
        🎱 <strong>{selTable}</strong><br />
        📅 {selDateLabel}<br />
        ⏰ {sorted.map((h) => `${h}:00`).join(' · ')}<br />
        ⏱️ {sorted.length} hour{sorted.length > 1 ? 's' : ''}<br /><br />
        Rack &apos;em up and good luck! 🎯
      </>
    )
    setChosenSlots(new Set())
    setTakenHours((prev) => new Set([...prev, ...sorted]))
    setShowSuccess(true)
  }

  const calDays = []
  const first = new Date(calYear, calMonth, 1).getDay()
  const total = new Date(calYear, calMonth + 1, 0).getDate()
  for (let i = 0; i < first; i++) calDays.push(null)
  for (let d = 1; d <= total; d++) calDays.push(d)

  const summarySorted = Array.from(chosenSlots).sort()
  const showSummary = selTable && selDateKey && chosenSlots.size > 0

  return (
    <>
      <div className="bg"></div>
      <div className="orb orb1"></div><div className="orb orb2"></div><div className="orb orb3"></div>

      <Header />

      <main>
        <div className="reserve-card">
          <div className="corner tl"></div><div className="corner tr"></div>
          <div className="corner bl"></div><div className="corner br"></div>

          <div className="form-header">
            <span className="form-icon">🎱</span>
            <div className="form-tag">Billiard · Snooker</div>
            <div className="form-title">Reserve Billiard Table</div>
          </div>
          <div className="divider"></div>

          <div className="block">
            <div className="block-label">Player</div>
            <div className="input-wrap">
              <input type="text" value={username} readOnly style={{ color: 'rgba(245,158,11,.9)', fontWeight: 600, paddingRight: 130 }} />
              <span className="input-icon">👤</span>
              <div className="logged-badge"><div className="logged-dot"></div> Logged In</div>
            </div>
          </div>

          <div className="block">
            <div className="block-label">Choose Table</div>
            <div className="table-grid">
              {[
                { name: 'Table 1', cap: 'Standard · 2–4p' },
                { name: 'Table 2', cap: 'Standard · 2–4p' },
                { name: 'Table 3', cap: 'VIP Blue · 2–4p', bg: { bg: '#1a4a6b', border: '#0e2d42' } },
                { name: 'Table 4', cap: 'VIP Red · 2–4p', bg: { bg: '#4a1a1a', border: '#2c0e0e' } },
              ].map((t) => (
                <div key={t.name} className={`table-opt${selTable === t.name ? ' selected' : ''}`} onClick={() => selectTable(t.name)}>
                  <div className="table-check">✓</div>
                  <BilliardTableArt bg={t.bg} />
                  <div className="table-name">{t.name.toUpperCase()}</div>
                  <div className="table-cap">{t.cap}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="block">
            <div className="block-label">Pick a Date</div>
            <div className="cal-wrap">
              <div className="cal-header">
                <button className="cal-nav" onClick={() => changeMonth(-1)}>‹</button>
                <div className="cal-month">{MONTHS[calMonth]} {calYear}</div>
                <button className="cal-nav" onClick={() => changeMonth(1)}>›</button>
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
            {!selDateKey ? (
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
                    const isTaken = selTable ? takenHours.has(hStr) : false
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
            <div className="summary-row"><span className="summary-key">Player</span><span className="summary-val">{username}</span></div>
            <div className="summary-row"><span className="summary-key">Table</span><span className="summary-val">{selTable || '—'}</span></div>
            <div className="summary-row"><span className="summary-key">Date</span><span className="summary-val">{selDateLabel || '—'}</span></div>
            <div className="summary-row"><span className="summary-key">Time Slots</span><span className="summary-val">{summarySorted.length ? summarySorted.map((h) => `${h}:00`).join(', ') : '—'}</span></div>
            <div className="summary-row"><span className="summary-key">Duration</span><span className="summary-val">{summarySorted.length ? `${summarySorted.length} hour${summarySorted.length > 1 ? 's' : ''}` : '—'}</span></div>
          </div>

          <button className="btn-submit" onClick={submitReserve}>🎱 &nbsp; Submit Reservation</button>
        </div>
      </main>

      <div className={`success-overlay${showSuccess ? ' show' : ''}`}>
        <div className="success-box">
          <div className="success-icon">🎱</div>
          <div className="success-title">Table Reserved!</div>
          <div className="success-sub">{successMsg}</div>
          <button className="btn-close" onClick={() => setShowSuccess(false)}>Break &amp; Play! 🎱</button>
        </div>
      </div>
    </>
  )
}

export default Billiard
