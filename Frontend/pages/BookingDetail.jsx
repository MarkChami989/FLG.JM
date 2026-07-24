import { useEffect, useMemo, useState } from 'react'
import BackBtn from './BackBtn.jsx'
import { pad2, dateKey } from './helpers.js'
import { api } from './api.js'

function BookingDetail({ item, onBack }) {
  const now = useMemo(() => new Date(), [])
  const [y, setY] = useState(now.getFullYear())
  const [mo, setMo] = useState(now.getMonth() + 1)
  const [d, setD] = useState(now.getDate())
  const [modal, setModal] = useState(null) // { hour, hs, mode, name }
  const [slots, setSlots] = useState([])

  const ds = dateKey(y, mo, d)
  const isToday = y === now.getFullYear() && mo === now.getMonth() + 1 && d === now.getDate()
  const curH = now.getHours()
  const hours = Array.from({ length: 24 }, (_, i) => i)

  function loadSlots() {
    api.resources.slots(item.id, ds).then(setSlots)
  }
  useEffect(loadSlots, [item.id, ds])

  function slotFor(hour) {
    return slots.find((s) => s.hour === hour)
  }

  function openModal(hour, hs, mode) {
    const existing = slotFor(hour)
    setModal({ hour, hs, mode, name: mode === 'edit' ? existing?.clientName || '' : '' })
  }
  function confirmModal() {
    const name = modal.name.trim()
    if (!name) return
    const existing = slotFor(modal.hour)
    const req = existing
      ? api.resources.updateSlot(item.id, existing.id, { clientName: name })
      : api.resources.bookSlot(item.id, { date: ds, hour: modal.hour, clientName: name })
    req.then(() => { loadSlots(); setModal(null) })
  }
  function deleteBooking(hour) {
    const existing = slotFor(hour)
    if (!existing) return
    api.resources.deleteSlot(item.id, existing.id).then(loadSlots)
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', background: item.glow, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{item.title}</div>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 2 }}>Booking Schedule</div>
        </div>
        <BackBtn onClick={onBack} style={{ marginTop: 0 }} />
      </div>

      <div className="r-date-bar">
        <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Date</span>
        <select className="r-date-sel" value={y} onChange={(e) => setY(parseInt(e.target.value))}>
          {[2025, 2026, 2027, 2028].map((yr) => <option key={yr} value={yr}>{yr}</option>)}
        </select>
        <select className="r-date-sel" value={mo} onChange={(e) => setMo(parseInt(e.target.value))}>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((mn, i) => <option key={mn} value={i + 1}>{mn}</option>)}
        </select>
        <select className="r-date-sel" value={d} onChange={(e) => setD(parseInt(e.target.value))}>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((dd) => <option key={dd} value={dd}>{dd}</option>)}
        </select>
      </div>

      <div style={{ maxHeight: 440, overflowY: 'auto', paddingRight: 4 }}>
        {hours.map((h) => {
          const hour = pad2(h)
          const hs = hour + ':00'
          const slot = slotFor(hour)
          const isNow = isToday && h === curH
          const nowBadge = isNow && <span className="r-now-dot">● NOW</span>
          if (slot) {
            return (
              <div key={hs} className={`r-slot booked${isNow ? ' r-slot-now' : ''}`}>
                <span className="r-hour">{hs}</span>
                {nowBadge}
                <span className="r-client-name">{slot.clientName}</span>
                <button className="r-edit-btn" onClick={() => openModal(hour, hs, 'edit')}>Edit</button>
                <button className="r-del-btn" onClick={() => deleteBooking(hour)}>Delete</button>
              </div>
            )
          }
          return (
            <div key={hs} className={`r-slot empty${isNow ? ' r-slot-now' : ''}`}>
              <span className="r-hour">{hs}</span>
              {nowBadge}
              <span className="r-avail">{isNow ? 'Free Right Now' : 'Available'}</span>
              <button className="r-book-btn" onClick={() => openModal(hour, hs, 'book')}>+ Book</button>
            </div>
          )
        })}
      </div>

      <div className={`r-modal${modal ? ' show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}>
        {modal && (
          <div className="r-modal-box">
            <div className="r-modal-title">{modal.mode === 'edit' ? 'Edit Booking' : 'Book Slot'}</div>
            <div className="r-modal-sub">{modal.hs} · {ds}</div>
            <input
              className="r-modal-input"
              type="text"
              placeholder="Client name..."
              maxLength={60}
              value={modal.name}
              onChange={(e) => setModal({ ...modal, name: e.target.value })}
              autoFocus
            />
            <div className="r-modal-actions">
              <button className="r-modal-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button className="r-modal-confirm" onClick={confirmModal}>Confirm</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default BookingDetail
