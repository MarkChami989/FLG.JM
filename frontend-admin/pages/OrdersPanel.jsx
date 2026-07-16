import { useEffect, useState } from 'react'
import { api } from './api.js'

function OrdersPanel() {
  const [orders, setOrders] = useState([])
  const [activeOrder, setActiveOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function load() {
    setLoading(true)
    api.bookings.list()
      .then((list) => {
        setOrders(list)
        setActiveOrder((prev) => (list.find((o) => o.id === prev) ? prev : list[0]?.id ?? null))
        setError(null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  function setStatus(id, status) {
    api.bookings.update(id, { status }).then(load).catch((e) => setError(e.message))
  }

  const o = orders.find((x) => x.id === activeOrder)

  return (
    <>
      <div className="panel-head">
        <h2>📋 Received Orders</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn ghost small">Filter</button>
          <button className="btn small">Export</button>
        </div>
      </div>
      {loading ? (
        <p style={{ color: 'var(--txt-dim)' }}>Loading…</p>
      ) : error ? (
        <p style={{ color: 'var(--red)' }}>{error}</p>
      ) : orders.length === 0 ? (
        <p style={{ color: 'var(--txt-dim)' }}>No orders yet.</p>
      ) : (
        <div className="orders-layout">
          <div className="order-list">
            {orders.map((order) => (
              <div key={order.id} className={`order-row ${activeOrder === order.id ? 'active' : ''}`} onClick={() => setActiveOrder(order.id)}>
                <span className="flg-chip">{order.id}</span>
                <span className={`status-pill status-${order.status}`}>{order.status}</span>
              </div>
            ))}
          </div>
          {o && (
            <div className="order-detail">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="flg-chip" style={{ fontSize: 14 }}>{o.id}</span>
                <span className={`status-pill status-${o.status}`}>{o.status}</span>
              </div>
              <div className="detail-grid">
                <div className="detail-item"><label>Username</label><div>{o.user}</div></div>
                <div className="detail-item"><label>Payment</label><div>${o.pay}</div></div>
                <div className="detail-item"><label>Date</label><div>{o.date}</div></div>
                <div className="detail-item"><label>Time</label><div>{o.time}</div></div>
                <div className="detail-item" style={{ gridColumn: '1/-1' }}><label>Activity</label><div>{o.activity}</div></div>
              </div>
              <div className="detail-actions">
                <button className="btn" onClick={() => setStatus(o.id, 'accepted')}>Accept</button>
                <button className="btn ghost" onClick={() => setStatus(o.id, 'rejected')}>Reject</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default OrdersPanel
