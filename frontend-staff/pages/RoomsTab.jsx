import { useState } from 'react'
import BackBtn from './BackBtn.jsx'
import TCard from './TCard.jsx'
import BookingDetail from './BookingDetail.jsx'
import { R_ROOMS } from './data.js'

function RoomsTab({ bookings, setBookings, onClose }) {
  const [selectedId, setSelectedId] = useState(null)
  const item = R_ROOMS.find((r) => r.id === selectedId)

  return (
    <div className="tab-page" style={{ alignItems: 'flex-start', justifyContent: 'flex-start', padding: '28px 32px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 0%,rgba(6,182,212,0.07),transparent 60%)', pointerEvents: 'none', borderRadius: 16 }}></div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {item ? (
          <BookingDetail item={item} bookings={bookings} setBookings={setBookings} onBack={() => setSelectedId(null)} />
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', background: 'linear-gradient(90deg,var(--cyan),var(--purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Rooms</div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 2 }}>Select a room to manage</div>
              </div>
              <BackBtn onClick={onClose} style={{ marginTop: 0 }} />
            </div>
            <div className="t-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              {R_ROOMS.map((r) => <TCard key={r.id} {...r} onClick={() => setSelectedId(r.id)} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RoomsTab
