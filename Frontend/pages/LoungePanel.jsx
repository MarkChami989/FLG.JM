import { useState } from 'react'
import TCard from './TCard.jsx'
import BookingDetail from './BookingDetail.jsx'
import OrderPricing from './OrderPricing.jsx'
import { ICONS } from './icons.jsx'
import { LOUNGE_BARS, LOUNGE_TABLES } from './data.js'

const AMOUNT_CARD = { id: 'amount', title: 'Amount', glow: 'linear-gradient(90deg,#F59E0B,#FBBF24)', iconBg: 'rgba(245,158,11,0.14)', iconBorder: 'rgba(245,158,11,0.32)', iconStroke: '#fbbf24', icon: ICONS.moneyIcon }

function LoungePanel() {
  const [selectedId, setSelectedId] = useState(null)
  const item = [...LOUNGE_BARS, ...LOUNGE_TABLES].find((x) => x.id === selectedId)

  return (
    <>
      {selectedId === 'amount' ? (
        <OrderPricing onBack={() => setSelectedId(null)} />
      ) : item ? (
        <BookingDetail item={item} onBack={() => setSelectedId(null)} />
      ) : (
        <>
          <div className="panel-head"><h2>Lounge</h2></div>
          <div className="subhead">Bars</div>
          <div className="t-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {LOUNGE_BARS.map((b) => <TCard key={b.id} {...b} icon={ICONS.barIcon} onClick={() => setSelectedId(b.id)} />)}
          </div>
          <div className="subhead">Tables</div>
          <div className="t-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            {LOUNGE_TABLES.map((t) => <TCard key={t.id} {...t} icon={ICONS.tableIcon} onClick={() => setSelectedId(t.id)} />)}
          </div>
          <div className="subhead">Pricing</div>
          <div className="t-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            <TCard {...AMOUNT_CARD} onClick={() => setSelectedId('amount')} />
          </div>
        </>
      )}
    </>
  )
}

export default LoungePanel
