import { useEffect, useState } from 'react'
import { Icon, ICONS } from './icons.jsx'
import { cap } from './helpers.js'
import { api } from './api.js'

const STATUS_COLOR = { accepted: 'var(--green)', reserved: 'var(--cyan)', pending: 'var(--gold)', rejected: 'var(--red)' }

function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.bookings.list().then(setOrders)
  }, [])

  const order = orders.find((o) => o.id === selected)

  return (
    <div className="tab-page" style={{ alignItems: 'flex-start', justifyContent: 'flex-start', padding: '20px 24px', height: 'calc(100vh - 180px)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 0%,rgba(124,58,237,0.1),transparent 55%)', pointerEvents: 'none', borderRadius: 16 }}></div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', background: 'linear-gradient(90deg,var(--purple),var(--pink))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Received Orders</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 2 }}>{orders.length} orders · click an ID to view details</div>
          </div>
        </div>
        <div className="orders-layout">
          <div className="id-list">
            <div className="id-list-header"><div className="id-list-title">Order IDs</div></div>
            {orders.map((o) => (
              <div key={o.id} className={`id-item${selected === o.id ? ' active' : ''}`} onClick={() => setSelected(o.id)}>
                <span className="id-dot" style={{ background: STATUS_COLOR[o.status], boxShadow: `0 0 6px ${STATUS_COLOR[o.status]}88` }}></span>
                <span className="id-code">{o.id}</span>
              </div>
            ))}
          </div>
          <div className="detail-panel">
            {!order ? (
              <div className="detail-empty">
                <div className="detail-empty-icon">
                  <Icon paths={ICONS.ordersDetail} width="22" height="22" stroke="rgba(255,255,255,0.2)" strokeWidth="1.6" />
                </div>
                <div className="detail-empty-txt">Select an order ID<br />to view client details</div>
              </div>
            ) : (
              <div className="detail-content">
                <div className="detail-top">
                  <div>
                    <div className="detail-id">{order.id}</div>
                    <div className="detail-act">{order.activity}</div>
                  </div>
                  <span className={`badge badge-${order.status}`}>{cap(order.status)}</span>
                </div>
                <div className="detail-rows">
                  <div className="detail-row">
                    <div className="detail-row-icon" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
                      <Icon paths={ICONS.userIcon} width="17" height="17" stroke="#a78bfa" strokeWidth="1.8" />
                    </div>
                    <div><div className="detail-row-label">Username</div><div className="detail-row-value">{order.user}</div></div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-row-icon" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                      <Icon paths={ICONS.calIcon} width="17" height="17" stroke="#22d3ee" strokeWidth="1.8" />
                    </div>
                    <div><div className="detail-row-label">Date</div><div className="detail-row-value">{order.date}</div></div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-row-icon" style={{ background: 'rgba(217,70,239,0.1)', border: '1px solid rgba(217,70,239,0.2)' }}>
                      <Icon paths={ICONS.clockIcon} width="17" height="17" stroke="#e879f9" strokeWidth="1.8" />
                    </div>
                    <div><div className="detail-row-label">Time</div><div className="detail-row-value">{order.time}</div></div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-row-icon" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <Icon paths={ICONS.moneyIcon} width="17" height="17" stroke="#34d399" strokeWidth="1.8" />
                    </div>
                    <div><div className="detail-row-label">Payment</div><div className="detail-row-value"><span className={`badge badge-${order.paid ? 'paid' : 'unpaid'}`}>{order.paid ? 'Paid' : 'Unpaid'}</span></div></div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-row-icon" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <Icon paths={ICONS.ordersDetail} width="17" height="17" stroke="#fbbf24" strokeWidth="1.8" />
                    </div>
                    <div><div className="detail-row-label">Activity</div><div className="detail-row-value">{order.activity}</div></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersTab
