import { useState } from 'react'
import BackBtn from './BackBtn.jsx'
import TCard from './TCard.jsx'
import BookingDetail from './BookingDetail.jsx'
import { ICONS } from './icons.jsx'
import { LOUNGE_BARS, LOUNGE_TABLES } from './data.js'

function LoungeTab({ onClose }) {
  const [selectedId, setSelectedId] = useState(null)
  const item = [...LOUNGE_BARS, ...LOUNGE_TABLES].find((x) => x.id === selectedId)

  return (
    <div className="tab-page" style={{ alignItems: 'flex-start', justifyContent: 'flex-start', padding: '28px 32px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 0%,rgba(249,115,22,0.07),transparent 60%)', pointerEvents: 'none', borderRadius: 16 }}></div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {item ? (
          <BookingDetail item={item} onBack={() => setSelectedId(null)} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', background: 'linear-gradient(90deg,var(--orange),var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Lounge</div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 2 }}>Select a bar or table to manage</div>
              </div>
              <BackBtn onClick={onClose} style={{ marginTop: 0 }} />
            </div>
            <div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 12 }}>Bars</div>
              <div className="t-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
                {LOUNGE_BARS.map((b) => <TCard key={b.id} {...b} icon={ICONS.barIcon} onClick={() => setSelectedId(b.id)} />)}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 12 }}>Tables</div>
              <div className="t-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                {LOUNGE_TABLES.map((t) => <TCard key={t.id} {...t} icon={ICONS.tableIcon} onClick={() => setSelectedId(t.id)} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoungeTab
