import { useState } from 'react'
import { ORDERS } from './data.js'

function OrdersPanel() {
  const [activeOrder, setActiveOrder] = useState(ORDERS[0].id)
  const o = ORDERS.find((x) => x.id === activeOrder)

  return (
    <>
      <div className="panel-head">
        <h2>📋 Received Orders</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn ghost small">Filter</button>
          <button className="btn small">Export</button>
        </div>
      </div>
      <div className="orders-layout">
        <div className="order-list">
          {ORDERS.map((order) => (
            <div key={order.id} className={`order-row ${activeOrder === order.id ? 'active' : ''}`} onClick={() => setActiveOrder(order.id)}>
              <span className="flg-chip">{order.id}</span>
              <span className={`status-pill status-${order.status}`}>{order.status}</span>
            </div>
          ))}
        </div>
        <div className="order-detail">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="flg-chip" style={{ fontSize: 14 }}>{o.id}</span>
            <span className={`status-pill status-${o.status}`}>{o.status}</span>
          </div>
          <div className="detail-grid">
            <div className="detail-item"><label>Username</label><div>{o.user}</div></div>
            <div className="detail-item"><label>Payment</label><div>{o.pay}</div></div>
            <div className="detail-item"><label>Date</label><div>{o.date}</div></div>
            <div className="detail-item"><label>Time</label><div>{o.time}</div></div>
            <div className="detail-item" style={{ gridColumn: '1/-1' }}><label>Activity</label><div>{o.activity}</div></div>
          </div>
          <div className="detail-actions">
            <button className="btn">Accept</button>
            <button className="btn ghost">Reject</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrdersPanel
