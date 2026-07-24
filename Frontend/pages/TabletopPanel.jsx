import { useState } from 'react'
import TCard from './TCard.jsx'
import BookingDetail from './BookingDetail.jsx'
import { TT_SECTIONS } from './data.js'

function TabletopPanel() {
  const [selectedId, setSelectedId] = useState(null)
  let item = null
  for (const sec of TT_SECTIONS) {
    const found = sec.items.find((x) => x.id === selectedId)
    if (found) { item = found; break }
  }

  return (
    <>
      {item ? (
        <BookingDetail item={item} onBack={() => setSelectedId(null)} />
      ) : (
        <>
          <div className="panel-head"><h2>🏓 Tabletop Games</h2></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {TT_SECTIONS.map((sec) => (
              <div key={sec.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>{sec.emoji}</span>
                  <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, color: sec.color, textTransform: 'uppercase' }}>{sec.name}</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }}></div>
                </div>
                <div className="t-grid" style={{ gridTemplateColumns: `repeat(${sec.cols},1fr)` }}>
                  {sec.items.map((r) => <TCard key={r.id} {...r} onClick={() => setSelectedId(r.id)} />)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default TabletopPanel
