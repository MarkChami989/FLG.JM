import { useState } from 'react'
import BackBtn from './BackBtn.jsx'
import TCard from './TCard.jsx'
import BookingDetail from './BookingDetail.jsx'
import { TT_SECTIONS } from './data.js'

function TabletopTab({ onClose }) {
  const [selectedId, setSelectedId] = useState(null)
  let item = null
  for (const sec of TT_SECTIONS) {
    const found = sec.items.find((x) => x.id === selectedId)
    if (found) { item = found; break }
  }

  return (
    <div className="tab-page" style={{ alignItems: 'flex-start', justifyContent: 'flex-start', padding: '28px 32px', overflowY: 'auto' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 0%,rgba(217,70,239,0.07),transparent 60%)', pointerEvents: 'none', borderRadius: 16 }}></div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {item ? (
          <BookingDetail item={item} onBack={() => setSelectedId(null)} />
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', background: 'linear-gradient(90deg,var(--pink),var(--purple),var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Tabletop Games</div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 2 }}>Select a table to manage</div>
              </div>
              <BackBtn onClick={onClose} style={{ marginTop: 0 }} />
            </div>
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
      </div>
    </div>
  )
}

export default TabletopTab
