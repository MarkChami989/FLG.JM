import { useState } from 'react'
import TCard from './TCard.jsx'
import BookingDetail from './BookingDetail.jsx'
import { ICONS } from './icons.jsx'
import { LOUNGE_BARS, LOUNGE_TABLES } from './data.js'

function LoungePanel() {
  const [selectedId, setSelectedId] = useState(null)
  const item = [...LOUNGE_BARS, ...LOUNGE_TABLES].find((x) => x.id === selectedId)

  return (
    <>
      {item ? (
        <BookingDetail item={item} onBack={() => setSelectedId(null)} />
      ) : (
        <>
          <div className="panel-head"><h2>🥃 Lounge</h2></div>
          <div className="subhead">Bars</div>
          <div className="t-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {LOUNGE_BARS.map((b) => <TCard key={b.id} {...b} icon={ICONS.barIcon} onClick={() => setSelectedId(b.id)} />)}
          </div>
          <div className="subhead">Tables</div>
          <div className="t-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            {LOUNGE_TABLES.map((t) => <TCard key={t.id} {...t} icon={ICONS.tableIcon} onClick={() => setSelectedId(t.id)} />)}
          </div>
        </>
      )}
    </>
  )
}

export default LoungePanel
