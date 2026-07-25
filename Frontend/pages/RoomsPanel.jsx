import { useState } from 'react'
import TCard from './TCard.jsx'
import BookingDetail from './BookingDetail.jsx'
import HourlyPricing from './HourlyPricing.jsx'
import { R_ROOMS } from './data.js'
import { ICONS } from './icons.jsx'

const AMOUNT_CARD = { id: 'amount', title: 'Amount', glow: 'linear-gradient(90deg,#F59E0B,#FBBF24)', iconBg: 'rgba(245,158,11,0.14)', iconBorder: 'rgba(245,158,11,0.32)', iconStroke: '#fbbf24', icon: ICONS.moneyIcon }

function RoomsPanel() {
  const [selectedId, setSelectedId] = useState(null)
  const item = R_ROOMS.find((r) => r.id === selectedId)

  return (
    <>
      {selectedId === 'amount' ? (
        <HourlyPricing heading="Room Category" subheading="Hourly Price per Room Category" items={R_ROOMS} onBack={() => setSelectedId(null)} />
      ) : item ? (
        <BookingDetail item={item} onBack={() => setSelectedId(null)} />
      ) : (
        <>
          <div className="panel-head"><h2>Rooms</h2></div>
          <div className="t-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {R_ROOMS.map((r) => <TCard key={r.id} {...r} onClick={() => setSelectedId(r.id)} />)}
            <TCard {...AMOUNT_CARD} onClick={() => setSelectedId('amount')} />
          </div>
        </>
      )}
    </>
  )
}

export default RoomsPanel
