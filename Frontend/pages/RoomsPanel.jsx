import { useState } from 'react'
import TCard from './TCard.jsx'
import BookingDetail from './BookingDetail.jsx'
import { R_ROOMS } from './data.js'

function RoomsPanel() {
  const [selectedId, setSelectedId] = useState(null)
  const item = R_ROOMS.find((r) => r.id === selectedId)

  return (
    <>
      {item ? (
        <BookingDetail item={item} onBack={() => setSelectedId(null)} />
      ) : (
        <>
          <div className="panel-head"><h2>🖥️ Rooms</h2></div>
          <div className="t-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {R_ROOMS.map((r) => <TCard key={r.id} {...r} onClick={() => setSelectedId(r.id)} />)}
          </div>
        </>
      )}
    </>
  )
}

export default RoomsPanel
