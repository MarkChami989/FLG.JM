import { useState } from 'react'
import Header from '../src/components/Header.jsx'
import './reserve-table.css'

const TABLES = [
  { name: 'Table 1', cap: '4 Persons', desc: 'Intimate dining · Lounge setting', chairs: ['top', 'bot', 'left', 'right'], icon: '🪑', size: 'sm' },
  { name: 'Table 2', cap: '8 Persons', desc: 'Group gathering · VIP section', chairs: ['top2', 'bot2', 'left2', 'right2'], icon: '🍽️', size: 'lg' },
  { name: 'Table 3', cap: '2 Persons', desc: 'Romantic · Private corner', chairs: ['top', 'bot'], icon: '🕯️', size: 'xs' },
  { name: 'Table 4', cap: '6 Persons', desc: 'Social · Premium lounge', chairs: ['top2', 'bot2', 'left', 'right'], icon: '👥', size: 'md' },
]
const ORDERS = [
  { key: 'low', name: 'Low Order', price: '$60', icon: '🥗', sub: 'Light bites & soft drinks', tags: ['🥗 Salad', '🧃 Juices', '🍞 Bread'] },
  { key: 'med', name: 'Medium Order', price: '$130', icon: '🍽️', sub: 'Full meal & premium drinks', tags: ['🥩 Steak', '🍷 Wine', '🍮 Dessert'] },
  { key: 'high', name: 'High Order', price: '$280', icon: '👑', sub: 'Luxury feast & top spirits', tags: ['🦞 Lobster', '🥃 Macallan', '🚬 Cohiba'] },
]

function TableVisual({ size, chairs, icon }) {
  const dims = { xs: { w: 48, h: 36, f: 14 }, sm: { w: 60, h: 40, f: 16 }, md: { w: 64, h: 42, f: 15 }, lg: { w: 72, h: 44, f: 16 } }[size]
  const positions = {
    top: { cls: 'c-top', style: { left: 'calc(50% - 4px)' } },
    bot: { cls: 'c-bot', style: { left: 'calc(50% - 4px)' } },
    left: { cls: 'c-left', style: { top: 'calc(50% - 4px)' } },
    right: { cls: 'c-right', style: { top: 'calc(50% - 4px)' } },
    top2: { cls: 'c-top', style: { left: '20%' }, twin: { left: '60%' } },
    bot2: { cls: 'c-bot', style: { left: '20%' }, twin: { left: '60%' } },
    left2: { cls: 'c-left', style: { top: '20%' }, twin: { top: '60%' } },
    right2: { cls: 'c-right', style: { top: '20%' }, twin: { top: '60%' } },
  }
  const dots = chairs.flatMap((c) => {
    const p = positions[c]
    return p.twin ? [{ key: c + '-a', cls: p.cls, style: p.style }, { key: c + '-b', cls: p.cls, style: p.twin }] : [{ key: c, cls: p.cls, style: p.style }]
  })

  return (
    <div className="t-visual" style={{ width: dims.w, height: dims.h }}>
      {dots.map((d) => (
        <div key={d.key} className={`t-chair ${d.cls}`} style={d.style}></div>
      ))}
      <span style={{ fontSize: dims.f }}>{icon}</span>
    </div>
  )
}

function ReserveTable() {
  const [selTable, setSelTable] = useState(null)
  const [selOrder, setSelOrder] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const dtStr = date && time ? `${date} at ${time}` : date || time || '—'
  const showSummary = selTable || selOrder || date || time

  function submitOrder(e) {
    e.preventDefault()
    if (!selTable) { alert('Please choose a table.'); return }
    if (!selOrder) { alert('Please choose an order level.'); return }
    if (!date || !time) { alert('Please select a date and time.'); return }
    setShowSuccess(true)
  }

  return (
    <>
      <div className="bg"></div>
      <div className="orb orb1"></div><div className="orb orb2"></div><div className="orb orb3"></div>

      <Header active="lounge" />

      <main>
        <div className="reserve-card">
          <div className="corner tl"></div><div className="corner tr"></div>
          <div className="corner bl"></div><div className="corner br"></div>

          <div className="form-header">
            <div className="form-icon">🛋️</div>
            <div className="form-tag">Cigar Lounge</div>
            <div className="form-title">Reserve Your Table</div>
          </div>
          <div className="divider"></div>

          <form onSubmit={submitOrder}>
            <div className="block">
              <div className="block-label">Logged In As</div>
              <div className="input-wrap">
                <input type="text" value="user123" readOnly style={{ cursor: 'default', color: 'rgba(245,158,11,.9)', fontWeight: 600, paddingRight: 130 }} />
                <span className="input-icon">👤</span>
                <div className="logged-badge"><div className="logged-dot"></div> Logged In</div>
              </div>
            </div>

            <div className="block">
              <div className="block-label">Choose Your Table</div>
              <div className="table-grid">
                {TABLES.map((t) => (
                  <div key={t.name} className={`table-option${selTable?.name === t.name ? ' selected' : ''}`} onClick={() => setSelTable(t)}>
                    <div className="table-check">✓</div>
                    <TableVisual size={t.size} chairs={t.chairs} icon={t.icon} />
                    <div className="table-num">{t.name.toUpperCase()}</div>
                    <div className="table-cap">👥 {t.cap}</div>
                    <div className="table-desc">{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="block">
              <div className="block-label">Food &amp; Drinks Order</div>
              <div className="order-grid">
                {ORDERS.map((o) => (
                  <div key={o.key} className={`order-option order-${o.key}${selOrder?.key === o.key ? ' selected' : ''}`} onClick={() => setSelOrder(o)}>
                    <div className="order-check">✓</div>
                    <span className="order-icon">{o.icon}</span>
                    <div className="order-name">{o.key.toUpperCase()}</div>
                    <div className="order-sub">{o.sub}</div>
                    <div className="menu-items">
                      {o.tags.map((tag) => <span key={tag} className={`menu-tag tag-${o.key}`}>{tag}</span>)}
                    </div>
                    <div className={`order-price price-${o.key}`}>{o.price}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="block">
              <div className="block-label">Date &amp; Time</div>
              <div className="datetime-grid">
                <div className="dt-group">
                  <label htmlFor="res-date">📅 Date</label>
                  <input type="date" id="res-date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="dt-group">
                  <label htmlFor="res-time">🕐 Time</label>
                  <input type="time" id="res-time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>
            </div>

            <div className={`summary${showSummary ? ' show' : ''}`}>
              <div className="summary-title">📋 Reservation Summary</div>
              <div className="summary-row"><span className="summary-key">Guest</span><span className="summary-val">user123</span></div>
              <div className="summary-row"><span className="summary-key">Table</span><span className="summary-val">{selTable ? selTable.name : '—'}</span></div>
              <div className="summary-row"><span className="summary-key">Capacity</span><span className="summary-val">{selTable ? selTable.cap : '—'}</span></div>
              <div className="summary-row"><span className="summary-key">Order Level</span><span className="summary-val">{selOrder ? selOrder.name : '—'}</span></div>
              <div className="summary-row"><span className="summary-key">Date &amp; Time</span><span className="summary-val">{dtStr}</span></div>
              <div className="summary-row" style={{ marginTop: 4 }}>
                <span className="summary-key" style={{ fontWeight: 700, color: 'var(--text)' }}>Total</span>
                <span className="summary-val" style={{ color: 'var(--gold)', fontFamily: 'Rajdhani,sans-serif', fontSize: 18, fontWeight: 700 }}>{selOrder ? selOrder.price : '—'}</span>
              </div>
            </div>

            <button className="btn-submit" type="submit">🛋️ &nbsp; Submit Order</button>
          </form>
        </div>
      </main>

      <div className={`success-overlay${showSuccess ? ' show' : ''}`}>
        <div className="success-box">
          <div className="success-icon">🎉</div>
          <div className="success-title">Table Reserved!</div>
          <div className="success-sub">
            {selTable && selOrder ? (
              <>
                Your table is confirmed!<br /><br />
                📍 {selTable.name} · {selTable.cap}<br />
                🍽️ {selOrder.name} ({selOrder.price})<br />
                📅 {date} at {time}<br /><br />
                We look forward to serving you. 🛋️
              </>
            ) : (
              <>Your table has been reserved.</>
            )}
          </div>
          <button className="btn-close" onClick={() => setShowSuccess(false)}>Done</button>
        </div>
      </div>
    </>
  )
}

export default ReserveTable
