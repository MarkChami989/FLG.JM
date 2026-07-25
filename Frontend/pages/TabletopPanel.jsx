import { useState } from 'react'
import TCard from './TCard.jsx'
import BookingDetail from './BookingDetail.jsx'
import HourlyPricing from './HourlyPricing.jsx'
import { TT_SECTIONS } from './data.js'
import { Icon, ICONS } from './icons.jsx'

const AMOUNT_CARD = { id: 'amount', title: 'Amount', glow: 'linear-gradient(90deg,#F59E0B,#FBBF24)', iconBg: 'rgba(245,158,11,0.14)', iconBorder: 'rgba(245,158,11,0.32)', iconStroke: '#fbbf24', icon: ICONS.moneyIcon }

const PRICE_ITEMS = TT_SECTIONS.flatMap((sec) => sec.items.map((it) => ({ id: it.id, title: `${sec.name} · ${it.title}` })))

function TabletopPanel() {
  const [selectedId, setSelectedId] = useState(null)
  let item = null
  for (const sec of TT_SECTIONS) {
    const found = sec.items.find((x) => x.id === selectedId)
    if (found) { item = found; break }
  }

  return (
    <>
      {selectedId === 'amount' ? (
        <HourlyPricing heading="Table" subheading="Hourly Price per Table" items={PRICE_ITEMS} onBack={() => setSelectedId(null)} />
      ) : item ? (
        <BookingDetail item={item} onBack={() => setSelectedId(null)} />
      ) : (
        <>
          <div className="panel-head"><h2>Tabletop Games</h2></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {TT_SECTIONS.map((sec) => (
              <div key={sec.name}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Icon paths={sec.icon} width="16" height="16" style={{ color: sec.color }} />
                  <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, color: sec.color, textTransform: 'uppercase' }}>{sec.name}</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }}></div>
                </div>
                <div className="t-grid" style={{ gridTemplateColumns: `repeat(${sec.cols},1fr)` }}>
                  {sec.items.map((r) => <TCard key={r.id} {...r} onClick={() => setSelectedId(r.id)} />)}
                </div>
              </div>
            ))}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Icon paths={ICONS.moneyIcon} width="16" height="16" style={{ color: 'var(--gold)' }} />
                <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 3, color: 'var(--gold)', textTransform: 'uppercase' }}>Pricing</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }}></div>
              </div>
              <div className="t-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
                <TCard {...AMOUNT_CARD} onClick={() => setSelectedId('amount')} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default TabletopPanel
