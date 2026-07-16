import { useEffect, useMemo, useRef, useState } from 'react'
import './Home.css'

/* ── shared helpers ── */
function pad2(n) { return String(n).padStart(2, '0') }
function dateKey(y, mo, d) { return `${y}-${pad2(mo)}-${pad2(d)}` }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1) }

function Icon({ paths, ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" dangerouslySetInnerHTML={{ __html: paths }} {...props} />
}

/* ── static icon path strings ── */
const ICONS = {
  orders: `<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>`,
  tournaments: `<path d="M8 21h8m-4-4v4M5 3H3v7a7 7 0 0014 0V3h-2M5 3h14M5 3v3M19 3v3"/>`,
  rooms: `<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`,
  lounge: `<path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>`,
  tabletop: `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>`,
  activities: `<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>`,
  report: `<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
  settings: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>`,
  ppIcon: `<rect x="2" y="9" width="20" height="6" rx="2"/><circle cx="7" cy="12" r="1.5" fill="currentColor"/><circle cx="17" cy="12" r="1.5" fill="currentColor"/>`,
  bilIcon: `<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="14" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="14" r="1.5" fill="currentColor"/>`,
  bfIcon: `<rect x="2" y="6" width="20" height="12" rx="2"/><line x1="12" y1="6" x2="12" y2="18"/><circle cx="7" cy="12" r="1.5" fill="currentColor"/><circle cx="17" cy="12" r="1.5" fill="currentColor"/>`,
  addPlus: `<path d="M12 5v14M5 12h14"/>`,
  joinIcon: `<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>`,
  trashIcon: `<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/>`,
  resultsIcon: `<path d="M8 21h8m-4-4v4M5 3H3v7a7 7 0 0014 0V3h-2M5 3h14"/>`,
  ordersDetail: `<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>`,
  userIcon: `<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  calIcon: `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  clockIcon: `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
  moneyIcon: `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>`,
  backIcon: `<path d="M19 12H5M12 19l-7-7 7-7"/>`,
  arrowIcon: `<path d="M5 12h14M12 5l7 7-7 7"/>`,
  psRoomIcon: `<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`,
  pcRoomIcon: `<rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><polyline points="7 8 12 13 17 8"/>`,
  starIcon: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`,
  starIcon2: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/><path d="M12 6l2 4 4.5.65-3.25 3.17.77 4.48L12 16.25l-4.02 2.05.77-4.48L5.5 10.65 10 10z"/>`,
  crownIcon: `<path d="M2 20h20M6 20V10l6-8 6 8v10"/><path d="M10 20v-5h4v5"/>`,
  barIcon: `<path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>`,
  tableIcon: `<rect x="3" y="8" width="18" height="10" rx="2"/><line x1="7" y1="8" x2="7" y2="18"/><line x1="17" y1="8" x2="17" y2="18"/><line x1="3" y1="13" x2="21" y2="13"/>`,
}

/* ── static data ── */
const ORDERS_DATA = [
  { id: 'FLG-0041', activity: 'Bar Reservation', date: '2026-07-13', time: '20:00', user: 'Jana', paid: true, status: 'pending' },
  { id: 'FLG-0040', activity: 'Table Reserve', date: '2026-07-13', time: '19:30', user: 'Rami', paid: true, status: 'accepted' },
  { id: 'FLG-0039', activity: 'Room Booking', date: '2026-07-13', time: '18:00', user: 'Lara', paid: false, status: 'reserved' },
  { id: 'FLG-0038', activity: 'Tournament', date: '2026-07-12', time: '21:00', user: 'Karim', paid: true, status: 'accepted' },
  { id: 'FLG-0037', activity: 'Ping Pong', date: '2026-07-12', time: '17:00', user: 'Sara', paid: false, status: 'pending' },
  { id: 'FLG-0036', activity: 'Billiard VIP', date: '2026-07-12', time: '16:00', user: 'Nour', paid: true, status: 'reserved' },
  { id: 'FLG-0035', activity: 'Baby Foot', date: '2026-07-11', time: '15:00', user: 'Elie', paid: true, status: 'accepted' },
  { id: 'FLG-0034', activity: 'Bar Reservation', date: '2026-07-11', time: '22:00', user: 'Maya', paid: false, status: 'pending' },
]
const STATUS_COLOR = { accepted: 'var(--green)', reserved: 'var(--cyan)', pending: 'var(--gold)' }

const INITIAL_TDB = [
  { id: 'T-001', name: 'FIFA Summer Cup', max: 64, cost: 25, clients: [
    { user: 'Marc', uid: 'FLG-0050', times: 3, rank: 65 },
    { user: 'Rami', uid: 'FLG-0040', times: 3, rank: 64 },
    { user: 'Lara', uid: 'FLG-0039', times: 1, rank: 50 },
    { user: 'Karim', uid: 'FLG-0038', times: 5, rank: 30 },
    { user: 'Sara', uid: 'FLG-0037', times: 2, rank: 10 },
    { user: 'Nour', uid: 'FLG-0036', times: 4, rank: 3 },
    { user: 'Elie', uid: 'FLG-0035', times: 6, rank: 2 },
    { user: 'Jana', uid: 'FLG-0034', times: 8, rank: 1 },
  ]},
  { id: 'T-002', name: 'Combat Night', max: 32, cost: 20, clients: [
    { user: 'Nour', uid: 'FLG-0036', times: 4, rank: 5 },
    { user: 'Elie', uid: 'FLG-0035', times: 1, rank: 4 },
    { user: 'Karim', uid: 'FLG-0038', times: 2, rank: 3 },
    { user: 'Sara', uid: 'FLG-0037', times: 3, rank: 2 },
    { user: 'Jana', uid: 'FLG-0034', times: 5, rank: 1 },
  ]},
  { id: 'T-003', name: 'Pro FIFA League', max: 16, cost: 50, clients: [] },
]

const R_ROOMS = [
  { id: 'ps', title: 'PS Room', glow: 'linear-gradient(90deg,#06B6D4,#7C3AED)', iconBg: 'rgba(6,182,212,0.12)', iconBorder: 'rgba(6,182,212,0.28)', iconStroke: '#22d3ee', icon: ICONS.psRoomIcon },
  { id: 'pc', title: 'PC Room', glow: 'linear-gradient(90deg,#7C3AED,#D946EF)', iconBg: 'rgba(124,58,237,0.13)', iconBorder: 'rgba(124,58,237,0.28)', iconStroke: '#a78bfa', icon: ICONS.pcRoomIcon },
  { id: 'vip-standard', title: 'VIP Standard', glow: 'linear-gradient(90deg,#F59E0B,#F97316)', iconBg: 'rgba(245,158,11,0.12)', iconBorder: 'rgba(245,158,11,0.28)', iconStroke: '#fbbf24', icon: ICONS.starIcon },
  { id: 'vip-elite', title: 'VIP Elite', glow: 'linear-gradient(90deg,#F97316,#EF4444)', iconBg: 'rgba(249,115,22,0.12)', iconBorder: 'rgba(249,115,22,0.28)', iconStroke: '#fb923c', icon: ICONS.starIcon2 },
  { id: 'vip-royal', title: 'VIP Royal', glow: 'linear-gradient(90deg,#D946EF,#7C3AED)', iconBg: 'rgba(217,70,239,0.12)', iconBorder: 'rgba(217,70,239,0.28)', iconStroke: '#e879f9', icon: ICONS.crownIcon },
]

const TT_SECTIONS = [
  { emoji: '🏓', name: 'Ping Pong', color: '#06B6D4', cols: 4, items: [
    { id: 'pp-t1', title: 'Table 1', glow: 'linear-gradient(90deg,#06B6D4,#7C3AED)', iconBg: 'rgba(6,182,212,0.12)', iconBorder: 'rgba(6,182,212,0.28)', iconStroke: '#22d3ee', icon: ICONS.ppIcon },
    { id: 'pp-t2', title: 'Table 2', glow: 'linear-gradient(90deg,#7C3AED,#D946EF)', iconBg: 'rgba(124,58,237,0.12)', iconBorder: 'rgba(124,58,237,0.28)', iconStroke: '#a78bfa', icon: ICONS.ppIcon },
    { id: 'pp-t3', title: 'Table 3', glow: 'linear-gradient(90deg,#D946EF,#06B6D4)', iconBg: 'rgba(217,70,239,0.12)', iconBorder: 'rgba(217,70,239,0.28)', iconStroke: '#e879f9', icon: ICONS.ppIcon },
    { id: 'pp-t4', title: 'Table 4', glow: 'linear-gradient(90deg,#06B6D4,#10B981)', iconBg: 'rgba(6,182,212,0.10)', iconBorder: 'rgba(6,182,212,0.22)', iconStroke: '#22d3ee', icon: ICONS.ppIcon },
  ]},
  { emoji: '🎱', name: 'Billiard', color: '#F59E0B', cols: 4, items: [
    { id: 'bi-t1', title: 'Table 1', glow: 'linear-gradient(90deg,#F59E0B,#10B981)', iconBg: 'rgba(245,158,11,0.12)', iconBorder: 'rgba(245,158,11,0.28)', iconStroke: '#fbbf24', icon: ICONS.bilIcon },
    { id: 'bi-t2', title: 'Table 2', glow: 'linear-gradient(90deg,#10B981,#F59E0B)', iconBg: 'rgba(16,185,129,0.12)', iconBorder: 'rgba(16,185,129,0.28)', iconStroke: '#34d399', icon: ICONS.bilIcon },
    { id: 'bi-vb', title: 'VIP Blue', glow: 'linear-gradient(90deg,#06B6D4,#7C3AED)', iconBg: 'rgba(6,182,212,0.12)', iconBorder: 'rgba(6,182,212,0.28)', iconStroke: '#22d3ee', icon: ICONS.bilIcon },
    { id: 'bi-vr', title: 'VIP Red', glow: 'linear-gradient(90deg,#EF4444,#D946EF)', iconBg: 'rgba(239,68,68,0.12)', iconBorder: 'rgba(239,68,68,0.28)', iconStroke: '#f87171', icon: ICONS.bilIcon },
  ]},
  { emoji: '⚽', name: 'Baby Foot', color: '#D946EF', cols: 2, items: [
    { id: 'bf-solo', title: 'Solo (1v1)', glow: 'linear-gradient(90deg,#F97316,#D946EF)', iconBg: 'rgba(249,115,22,0.12)', iconBorder: 'rgba(249,115,22,0.28)', iconStroke: '#fb923c', icon: ICONS.bfIcon },
    { id: 'bf-team', title: 'Team (2v2)', glow: 'linear-gradient(90deg,#D946EF,#F97316)', iconBg: 'rgba(217,70,239,0.12)', iconBorder: 'rgba(217,70,239,0.28)', iconStroke: '#e879f9', icon: ICONS.bfIcon },
  ]},
]

const LOUNGE_BARS = [
  { title: 'Bar 1', glow: 'linear-gradient(90deg,#F97316,#F59E0B)', iconBg: 'rgba(249,115,22,0.12)', iconBorder: 'rgba(249,115,22,0.28)', iconStroke: '#fb923c' },
  { title: 'Bar 2', glow: 'linear-gradient(90deg,#F59E0B,#D946EF)', iconBg: 'rgba(245,158,11,0.12)', iconBorder: 'rgba(245,158,11,0.28)', iconStroke: '#fbbf24' },
  { title: 'Bar 3', glow: 'linear-gradient(90deg,#D946EF,#7C3AED)', iconBg: 'rgba(217,70,239,0.12)', iconBorder: 'rgba(217,70,239,0.28)', iconStroke: '#e879f9' },
]
const LOUNGE_TABLES = [
  { title: 'Table 1', glow: 'linear-gradient(90deg,#06B6D4,#7C3AED)', iconBg: 'rgba(6,182,212,0.12)', iconBorder: 'rgba(6,182,212,0.28)', iconStroke: '#22d3ee' },
  { title: 'Table 2', glow: 'linear-gradient(90deg,#7C3AED,#D946EF)', iconBg: 'rgba(124,58,237,0.12)', iconBorder: 'rgba(124,58,237,0.28)', iconStroke: '#a78bfa' },
  { title: 'Table 3', glow: 'linear-gradient(90deg,#10B981,#06B6D4)', iconBg: 'rgba(16,185,129,0.12)', iconBorder: 'rgba(16,185,129,0.28)', iconStroke: '#34d399' },
  { title: 'Table 4', glow: 'linear-gradient(90deg,#F59E0B,#10B981)', iconBg: 'rgba(245,158,11,0.12)', iconBorder: 'rgba(245,158,11,0.28)', iconStroke: '#fbbf24' },
]

const TAB_ICON_MAP = { orders: ICONS.orders, tournaments: ICONS.tournaments, rooms: ICONS.rooms, lounge: ICONS.lounge, tabletop: ICONS.tabletop, activities: ICONS.activities, report: ICONS.report, settings: ICONS.settings }

/* ── Back button ── */
function BackBtn({ onClick, style }) {
  return (
    <button className="back-btn" onClick={onClick} style={style}>
      <Icon paths={ICONS.backIcon} width="14" height="14" strokeWidth="2" />
      Back
    </button>
  )
}

/* ── generic t-card ── */
function TCard({ onClick, glow, iconBg, iconBorder, iconStroke, icon, title, style }) {
  return (
    <div className="t-card" onClick={onClick} style={{ boxShadow: `0 0 0 1px ${iconBorder},0 16px 48px rgba(0,0,0,0.4)`, cursor: onClick ? 'pointer' : 'default', ...style }}>
      <div className="t-card-glow" style={{ background: glow }}></div>
      <div className="t-card-icon" style={{ background: iconBg, border: `1px solid ${iconBorder}` }}>
        <Icon paths={icon} width="22" height="22" stroke={iconStroke} />
      </div>
      <div className="t-card-title">{title}</div>
      {onClick && <div className="t-card-arrow"><Icon paths={ICONS.arrowIcon} width="16" height="16" strokeWidth="2" /></div>}
    </div>
  )
}

/* ── ORDERS TAB ── */
function OrdersTab() {
  const [selected, setSelected] = useState(null)
  const order = ORDERS_DATA.find((o) => o.id === selected)

  return (
    <div className="tab-page" style={{ alignItems: 'flex-start', justifyContent: 'flex-start', padding: '20px 24px', height: 'calc(100vh - 180px)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 0%,rgba(124,58,237,0.1),transparent 55%)', pointerEvents: 'none', borderRadius: 16 }}></div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', background: 'linear-gradient(90deg,var(--purple),var(--pink))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Received Orders</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 2 }}>{ORDERS_DATA.length} orders · click an ID to view details</div>
          </div>
        </div>
        <div className="orders-layout">
          <div className="id-list">
            <div className="id-list-header"><div className="id-list-title">Order IDs</div></div>
            {ORDERS_DATA.map((o) => (
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

/* ── ROOM / TABLETOP BOOKING DETAIL (shared) ── */
function BookingDetail({ item, bookings, setBookings, onBack }) {
  const now = useMemo(() => new Date(), [])
  const [y, setY] = useState(now.getFullYear())
  const [mo, setMo] = useState(now.getMonth() + 1)
  const [d, setD] = useState(now.getDate())
  const [modal, setModal] = useState(null) // { hs, mode, name }

  const ds = dateKey(y, mo, d)
  const dayBook = (bookings[item.id] && bookings[item.id][ds]) || {}
  const isToday = y === now.getFullYear() && mo === now.getMonth() + 1 && d === now.getDate()
  const curH = now.getHours()
  const hours = Array.from({ length: 17 }, (_, i) => i + 7)

  function openModal(hs, mode) {
    const existing = dayBook[hs] || ''
    setModal({ hs, mode, name: mode === 'edit' ? existing : '' })
  }
  function confirmModal() {
    const name = modal.name.trim()
    if (!name) return
    setBookings((prev) => {
      const roomBook = { ...(prev[item.id] || {}) }
      const day = { ...(roomBook[ds] || {}) }
      day[modal.hs] = name
      roomBook[ds] = day
      return { ...prev, [item.id]: roomBook }
    })
    setModal(null)
  }
  function deleteBooking(hs) {
    setBookings((prev) => {
      const roomBook = { ...(prev[item.id] || {}) }
      const day = { ...(roomBook[ds] || {}) }
      delete day[hs]
      roomBook[ds] = day
      return { ...prev, [item.id]: roomBook }
    })
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', background: item.glow, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{item.title}</div>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 2 }}>Booking Schedule</div>
        </div>
        <BackBtn onClick={onBack} style={{ marginTop: 0 }} />
      </div>

      <div className="r-date-bar">
        <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Date</span>
        <select className="r-date-sel" value={y} onChange={(e) => setY(parseInt(e.target.value))}>
          {[2025, 2026, 2027, 2028].map((yr) => <option key={yr} value={yr}>{yr}</option>)}
        </select>
        <select className="r-date-sel" value={mo} onChange={(e) => setMo(parseInt(e.target.value))}>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((mn, i) => <option key={mn} value={i + 1}>{mn}</option>)}
        </select>
        <select className="r-date-sel" value={d} onChange={(e) => setD(parseInt(e.target.value))}>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((dd) => <option key={dd} value={dd}>{dd}</option>)}
        </select>
      </div>

      <div style={{ maxHeight: 440, overflowY: 'auto', paddingRight: 4 }}>
        {hours.map((h) => {
          const hs = pad2(h) + ':00'
          const client = dayBook[hs]
          const isNow = isToday && h === curH
          const nowBadge = isNow && <span className="r-now-dot">● NOW</span>
          if (client) {
            return (
              <div key={hs} className={`r-slot booked${isNow ? ' r-slot-now' : ''}`}>
                <span className="r-hour">{hs}</span>
                {nowBadge}
                <span className="r-client-name">{client}</span>
                <button className="r-edit-btn" onClick={() => openModal(hs, 'edit')}>Edit</button>
                <button className="r-del-btn" onClick={() => deleteBooking(hs)}>Delete</button>
              </div>
            )
          }
          return (
            <div key={hs} className={`r-slot empty${isNow ? ' r-slot-now' : ''}`}>
              <span className="r-hour">{hs}</span>
              {nowBadge}
              <span className="r-avail">{isNow ? 'Free Right Now' : 'Available'}</span>
              <button className="r-book-btn" onClick={() => openModal(hs, 'book')}>+ Book</button>
            </div>
          )
        })}
      </div>

      <div className={`r-modal${modal ? ' show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setModal(null) }}>
        {modal && (
          <div className="r-modal-box">
            <div className="r-modal-title">{modal.mode === 'edit' ? 'Edit Booking' : 'Book Slot'}</div>
            <div className="r-modal-sub">{modal.hs} · {ds}</div>
            <input
              className="r-modal-input"
              type="text"
              placeholder="Client name..."
              maxLength={60}
              value={modal.name}
              onChange={(e) => setModal({ ...modal, name: e.target.value })}
              autoFocus
            />
            <div className="r-modal-actions">
              <button className="r-modal-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button className="r-modal-confirm" onClick={confirmModal}>Confirm</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/* ── ROOMS TAB ── */
function RoomsTab({ bookings, setBookings, onClose }) {
  const [selectedId, setSelectedId] = useState(null)
  const item = R_ROOMS.find((r) => r.id === selectedId)

  return (
    <div className="tab-page" style={{ alignItems: 'flex-start', justifyContent: 'flex-start', padding: '28px 32px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 0%,rgba(6,182,212,0.07),transparent 60%)', pointerEvents: 'none', borderRadius: 16 }}></div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {item ? (
          <BookingDetail item={item} bookings={bookings} setBookings={setBookings} onBack={() => setSelectedId(null)} />
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', background: 'linear-gradient(90deg,var(--cyan),var(--purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Rooms</div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 2 }}>Select a room to manage</div>
              </div>
              <BackBtn onClick={onClose} style={{ marginTop: 0 }} />
            </div>
            <div className="t-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
              {R_ROOMS.map((r) => <TCard key={r.id} {...r} onClick={() => setSelectedId(r.id)} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ── TABLETOP TAB ── */
function TabletopTab({ bookings, setBookings, onClose }) {
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
          <BookingDetail item={item} bookings={bookings} setBookings={setBookings} onBack={() => setSelectedId(null)} />
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

/* ── LOUNGE TAB (static) ── */
function LoungeTab({ onClose }) {
  return (
    <div className="tab-page" style={{ alignItems: 'flex-start', justifyContent: 'flex-start', padding: '28px 32px' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 0%,rgba(249,115,22,0.07),transparent 60%)', pointerEvents: 'none', borderRadius: 16 }}></div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}>
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
            {LOUNGE_BARS.map((b) => <TCard key={b.title} {...b} icon={ICONS.barIcon} />)}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 12 }}>Tables</div>
          <div className="t-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            {LOUNGE_TABLES.map((t) => <TCard key={t.title} {...t} icon={ICONS.tableIcon} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── GIFT MODAL ── */
function GiftModal({ user, onClose, onSend }) {
  const [msg, setMsg] = useState('')
  const [errored, setErrored] = useState(false)

  function send() {
    const m = msg.trim()
    if (!m) { setErrored(true); setTimeout(() => setErrored(false), 1000); return }
    onSend(m)
  }

  return (
    <div className={`gift-modal${user ? ' show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      {user && (
        <div className="gift-modal-box">
          <div className="gift-modal-title">🎁 Send Message</div>
          <div className="gift-modal-sub">To: {user}</div>
          <textarea
            className="gift-textarea"
            placeholder="e.g. Amazing performance! You crushed it. Here's your reward 🏆"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            style={errored ? { borderColor: 'var(--red)' } : undefined}
            autoFocus
          ></textarea>
          <div className="gift-modal-actions">
            <button className="gift-cancel-btn" onClick={onClose}>Cancel</button>
            <button className="gift-send-btn" onClick={send}>Send →</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── TOURNAMENTS TAB ── */
function TournamentsTab({ tDB, setTDB, onClose }) {
  const [screen, setScreen] = useState('main')
  const [selectedTid, setSelectedTid] = useState(null)
  const [giftUser, setGiftUser] = useState(null)
  const [toast, setToast] = useState({ show: false, msg: '' })
  const [addFeedback, setAddFeedback] = useState(null)
  const nameRef = useRef(null)
  const maxRef = useRef(null)
  const costRef = useRef(null)

  const t = tDB.find((x) => x.id === selectedTid)

  function goto(s, tid) { setScreen(s); if (tid !== undefined) setSelectedTid(tid) }

  function tCreate() {
    const name = nameRef.current.value.trim()
    const max = parseInt(maxRef.current.value)
    const cost = parseInt(costRef.current.value)
    if (!name || !max || isNaN(cost)) {
      setAddFeedback({ text: 'Fill all fields', bad: true })
      setTimeout(() => setAddFeedback(null), 1600)
      return
    }
    const id = 'T-00' + (tDB.length + 1)
    setTDB((prev) => [...prev, { id, name, max, cost, clients: [] }])
    setAddFeedback({ text: '✓ Tournament Created!', bad: false })
    setTimeout(() => { setAddFeedback(null); setScreen('main') }, 1400)
  }

  function removeClient(tid, idx) {
    setTDB((prev) => prev.map((x) => x.id !== tid ? x : { ...x, clients: x.clients.filter((_, i) => i !== idx) }))
  }

  function tAction(tid, action) {
    if (action === 'delete') setTDB((prev) => prev.filter((x) => x.id !== tid))
    else if (action === 'archive') alert('Tournament ' + tid + ' archived.')
    else if (action === 'end') alert('Tournament ' + tid + ' marked as ended.')
  }

  function updateRank(tid, uid, val) {
    const newRank = parseInt(val) || 1
    setTDB((prev) => prev.map((x) => x.id !== tid ? x : {
      ...x,
      clients: x.clients.map((c) => c.uid === uid ? { ...c, rank: newRank } : c),
    }))
  }

  function sendGift(msg) {
    setGiftUser(null)
    setToast({ show: true, msg: `✓ Sent to ${giftUser}: "${msg.length > 40 ? msg.slice(0, 40) + '…' : msg}"` })
    setTimeout(() => setToast((s) => ({ ...s, show: false })), 4000)
  }

  return (
    <div className="tab-page" style={{ alignItems: 'flex-start', justifyContent: 'flex-start', padding: '28px 32px', minHeight: 340 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 0%,rgba(245,158,11,0.08),transparent 60%)', pointerEvents: 'none', borderRadius: 16 }}></div>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', background: 'linear-gradient(90deg,var(--gold),var(--orange))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Tournaments</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 2 }}>Manage all tournament operations</div>
          </div>
          <BackBtn onClick={onClose} style={{ marginTop: 0 }} />
        </div>

        {screen === 'main' && (
          <div className="t-grid">
            <TCard onClick={() => goto('add')} glow="linear-gradient(90deg,var(--green),var(--cyan))" iconBg="rgba(16,185,129,0.14)" iconBorder="rgba(16,185,129,0.28)" iconStroke="#34d399" icon={ICONS.addPlus} title="Add Tournament" />
            <TCard onClick={() => goto('join')} glow="linear-gradient(90deg,var(--gold),var(--orange))" iconBg="rgba(245,158,11,0.12)" iconBorder="rgba(245,158,11,0.28)" iconStroke="#fbbf24" icon={ICONS.joinIcon} title="Join Tournament" />
            <TCard onClick={() => goto('delete')} glow="linear-gradient(90deg,var(--red),var(--pink))" iconBg="rgba(239,68,68,0.12)" iconBorder="rgba(239,68,68,0.28)" iconStroke="#f87171" icon={ICONS.trashIcon} title="Delete & End Tournament" />
            <TCard onClick={() => goto('results')} glow="linear-gradient(90deg,var(--purple),var(--pink))" iconBg="rgba(124,58,237,0.14)" iconBorder="rgba(124,58,237,0.28)" iconStroke="#a78bfa" icon={ICONS.resultsIcon} title="Results" />
          </div>
        )}

        {screen === 'add' && (
          <div style={{ maxWidth: 480 }}>
            <BackBtn onClick={() => setScreen('main')} style={{ marginBottom: 18, marginTop: 0 }} />
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2.5, color: 'var(--green)', textTransform: 'uppercase', marginBottom: 20 }}>Add Tournament</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 7 }}>Tournament Name</div>
                <input ref={nameRef} type="text" placeholder="e.g. FIFA Summer Cup" style={inputStyle} />
              </div>
              <div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 7 }}>Max Players</div>
                <input ref={maxRef} type="number" placeholder="e.g. 32" min="2" style={inputStyle} />
              </div>
              <div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 7 }}>Cost per Client ($)</div>
                <input ref={costRef} type="number" placeholder="e.g. 25" min="0" style={inputStyle} />
              </div>
              <button
                onClick={tCreate}
                style={{
                  marginTop: 4, padding: 13, border: 'none', borderRadius: 10, cursor: 'pointer',
                  fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: '#fff',
                  background: addFeedback ? (addFeedback.bad ? 'linear-gradient(135deg,var(--red),#991b1b)' : 'linear-gradient(135deg,var(--green),#065f46)') : 'linear-gradient(135deg,var(--green),var(--cyan))',
                  boxShadow: '0 0 20px rgba(16,185,129,0.3)',
                }}
              >
                {addFeedback ? addFeedback.text : 'Create Tournament'}
              </button>
            </div>
          </div>
        )}

        {screen === 'join' && (
          <div>
            <BackBtn onClick={() => setScreen('main')} style={{ marginBottom: 16, marginTop: 0 }} />
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2.5, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>Join Tournament — Select</div>
            {tDB.map((tt) => (
              <div key={tt.id} onClick={() => goto('joinDetail', tt.id)} style={joinRowStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: '3px 10px', borderRadius: 5, background: 'rgba(245,158,11,0.15)', color: 'var(--gold)' }}>{tt.id}</span>
                  <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: 1 }}>{tt.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{tt.clients.length} / {tt.max} players</span>
                  <Icon paths={ICONS.arrowIcon} width="15" height="15" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {screen === 'joinDetail' && t && (
          <div>
            <BackBtn onClick={() => setScreen('join')} style={{ marginBottom: 16, marginTop: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: 2, color: 'var(--gold)' }}>{t.name}</div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginTop: 3 }}>{t.clients.length} / {t.max} players</div>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Cost: <span style={{ color: 'var(--green)', fontWeight: 600 }}>${t.cost}</span></div>
            </div>
            {t.clients.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 28, fontFamily: "'Rajdhani',sans-serif", fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>No clients joined yet</div>
            ) : t.clients.map((c, i) => (
              <div key={c.uid + i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 13, color: '#a78bfa' }}>{c.user.charAt(0)}</div>
                  <div>
                    <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>{c.user}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: '1px 7px', borderRadius: 4, background: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}>{c.uid}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Joined {c.times}x</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeClient(t.id, i)} style={removeBtnStyle}>Remove</button>
              </div>
            ))}
          </div>
        )}

        {screen === 'delete' && (
          <div>
            <BackBtn onClick={() => setScreen('main')} style={{ marginBottom: 16, marginTop: 0 }} />
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2.5, color: 'var(--red)', textTransform: 'uppercase', marginBottom: 16 }}>Delete & End Tournament</div>
            {tDB.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32, fontFamily: "'Rajdhani',sans-serif", fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>No tournaments</div>
            ) : tDB.map((tt) => (
              <div key={tt.id} style={{ padding: '16px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: '3px 10px', borderRadius: 5, background: 'rgba(239,68,68,0.15)', color: 'var(--red)' }}>{tt.id}</span>
                    <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: 1 }}>{tt.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{tt.clients.length} clients</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => tAction(tt.id, 'archive')} style={actionBtnStyle('cyan')}>Archive</button>
                  <button onClick={() => tAction(tt.id, 'end')} style={actionBtnStyle('gold')}>End</button>
                  <button onClick={() => tAction(tt.id, 'delete')} style={actionBtnStyle('red')}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {screen === 'results' && (
          <div>
            <BackBtn onClick={() => setScreen('main')} style={{ marginBottom: 16, marginTop: 0 }} />
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2.5, color: '#a78bfa', textTransform: 'uppercase', marginBottom: 16 }}>Results — Select Tournament</div>
            {tDB.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32, fontFamily: "'Rajdhani',sans-serif", fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>No tournaments yet</div>
            ) : tDB.map((tt) => (
              <div key={tt.id} onClick={() => goto('leaderboard', tt.id)} style={joinRowStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18 }}>🏆</span>
                  <div>
                    <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: 1 }}>{tt.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{tt.clients.length} participants</div>
                  </div>
                </div>
                <Icon paths={ICONS.arrowIcon} width="15" height="15" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
              </div>
            ))}
          </div>
        )}

        {screen === 'leaderboard' && t && (
          t.clients.length === 0 ? (
            <div>
              <BackBtn onClick={() => setScreen('results')} style={{ marginBottom: 16, marginTop: 0 }} />
              <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.2)', fontFamily: "'Rajdhani',sans-serif", letterSpacing: 2, textTransform: 'uppercase' }}>No participants yet</div>
            </div>
          ) : (
            <div>
              <BackBtn onClick={() => setScreen('results')} style={{ marginBottom: 16, marginTop: 0 }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: 2, color: '#a78bfa' }}>{t.name}</div>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 3 }}>{t.clients.length} players · Last → First</div>
                </div>
                <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
                  <span>🥇 Top 1</span><span>🥈 Top 2</span><span>🥉 Top 3</span>
                </div>
              </div>
              <div style={{ maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
                {[...t.clients].sort((a, b) => b.rank - a.rank).map((c) => {
                  const topClass = c.rank === 1 ? 'rank-top1' : c.rank === 2 ? 'rank-top2' : c.rank === 3 ? 'rank-top3' : ''
                  const crownEmoji = c.rank === 1 ? '🥇' : c.rank === 2 ? '🥈' : c.rank === 3 ? '🥉' : ''
                  const avatarStyle =
                    c.rank === 1 ? { background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', color: '#fbbf24' } :
                    c.rank === 2 ? { background: 'rgba(148,163,184,0.15)', border: '1px solid rgba(148,163,184,0.3)', color: '#94a3b8' } :
                    c.rank === 3 ? { background: 'rgba(180,100,50,0.15)', border: '1px solid rgba(180,100,50,0.3)', color: '#cd7c3f' } :
                    { background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa' }
                  return (
                    <div key={c.uid} className={`rank-row ${topClass}`}>
                      <span className="crown">{crownEmoji}</span>
                      <div className="rank-avatar" style={avatarStyle}>{c.user.charAt(0)}</div>
                      <div className="rank-info">
                        <div className="rank-name">{c.user}</div>
                        <div className="rank-meta">
                          <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: '1px 7px', borderRadius: 4, background: 'rgba(124,58,237,0.15)', color: '#a78bfa' }}>{c.uid}</span>
                          <span className="rank-times">Joined {c.times}×</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                        <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>#</span>
                        <input
                          type="number" className="rank-editable" defaultValue={c.rank} min="1"
                          onBlur={(e) => updateRank(t.id, c.uid, e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur() }}
                          onClick={(e) => e.target.select()}
                        />
                      </div>
                      <button className="gift-btn" onClick={() => setGiftUser(c.user)}>🎁 Send Gift</button>
                    </div>
                  )
                })}
              </div>
              <div className={`gift-toast${toast.show ? ' show' : ''}`}>{toast.msg}</div>
            </div>
          )
        )}
      </div>

      <GiftModal user={giftUser} onClose={() => setGiftUser(null)} onSend={sendGift} />
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: '#fff', fontFamily: "'Exo 2',sans-serif", fontSize: 14, outline: 'none',
}
const joinRowStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 10,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer',
  transition: 'background 0.18s', marginBottom: 8,
}
const removeBtnStyle = {
  padding: '5px 12px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)',
  color: 'var(--red)', cursor: 'pointer', fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 700,
  letterSpacing: 1.5, textTransform: 'uppercase',
}
function actionBtnStyle(color) {
  const map = {
    cyan: { border: 'rgba(6,182,212,0.3)', bg: 'rgba(6,182,212,0.08)', c: 'var(--cyan)' },
    gold: { border: 'rgba(245,158,11,0.3)', bg: 'rgba(245,158,11,0.08)', c: 'var(--gold)' },
    red: { border: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.08)', c: 'var(--red)' },
  }[color]
  return {
    flex: 1, padding: 8, borderRadius: 8, border: `1px solid ${map.border}`, background: map.bg, color: map.c,
    cursor: 'pointer', fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
  }
}

/* ── GENERIC PLACEHOLDER TAB ── */
function GenericTab({ id, title, color, onClose }) {
  return (
    <div className="tab-page">
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%,${color}18,transparent 60%)`, pointerEvents: 'none', borderRadius: 16 }}></div>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: `${color}18`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, boxShadow: `0 0 30px ${color}30` }}>
        <Icon paths={TAB_ICON_MAP[id] || ''} width="28" height="28" stroke={color} strokeWidth="1.6" />
      </div>
      <div className="tab-page-title" style={{ color }}>{title}</div>
      <div className="tab-page-sub">Page content coming soon</div>
      <BackBtn onClick={onClose} />
    </div>
  )
}

/* ── MAIN HOME COMPONENT ── */
function Home() {
  const [now, setNow] = useState(new Date())
  const [tabs, setTabs] = useState([])
  const [activeTab, setActiveTab] = useState(null)
  const [tDB, setTDB] = useState(INITIAL_TDB)
  const [bookings, setBookings] = useState({})

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  function openTab(id, title, color) {
    setTabs((prev) => {
      if (prev.find((t) => t.id === id)) return prev
      return [...prev, { id, title, color }]
    })
    setActiveTab(id)
  }
  function switchTab(id) { setActiveTab(id) }
  function closeTab(id) {
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === id)
      const next = prev.filter((t) => t.id !== id)
      if (activeTab === id) {
        setActiveTab(next.length ? next[Math.max(0, idx - 1)].id : null)
      }
      return next
    })
  }

  const clockTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <>
      <div className="orb orb-1"></div><div className="orb orb-2"></div><div className="orb orb-3"></div>
      <div className="grid-bg"></div>

      <div className="page">
        <header className="topbar">
          <div className="user-info">
            <div className="realtime">
              <span className="live-dot"></span>
              <span>{clockTime}</span>&nbsp;·&nbsp;<span>{dateStr}</span>
            </div>
            <div className="user-name">Jana</div>
            <div className="user-role"><span className="role-badge">Staff</span>Staff Portal</div>
          </div>
          <div className="brand-right">
            <div className="brand-flg">FLG</div>
            <div className="brand-sub">Fusion Luxury Game</div>
          </div>
        </header>

        <nav className="subnav">
          <button className="nav-btn" onClick={() => openTab('activities', 'Activities', '#10B981')}>
            <Icon paths={ICONS.activities} width="15" height="15" strokeWidth="1.8" />
            Activities
          </button>
          <button className="nav-btn" onClick={() => openTab('report', 'Report', '#06B6D4')}>
            <Icon paths={ICONS.report} width="15" height="15" strokeWidth="1.8" />
            Report
          </button>
          <button className="nav-btn" onClick={() => openTab('settings', 'Settings', '#F59E0B')}>
            <Icon paths={ICONS.settings} width="15" height="15" strokeWidth="1.8" />
            Settings
          </button>
        </nav>

        <div className="tabbar">
          {tabs.length === 0 ? (
            <span className="tabbar-empty">No open tabs — click a card to open</span>
          ) : tabs.map((t) => (
            <div key={t.id} className={`tab${t.id === activeTab ? ' active' : ''}`} onClick={() => switchTab(t.id)}>
              <span className="tab-dot" style={{ background: t.color, boxShadow: `0 0 6px ${t.color}88` }}></span>
              <Icon paths={TAB_ICON_MAP[t.id] || ''} width="13" height="13" strokeWidth="2" />
              {t.title}
              <button className="tab-close" title="Close" onClick={(e) => { e.stopPropagation(); closeTab(t.id) }}>✕</button>
            </div>
          ))}
        </div>

        <main className="main">
          {!activeTab && (
            <div className="cards-grid">
              <div className="card" onClick={() => openTab('orders', 'Received Orders', '#7C3AED')}>
                <div className="card-glow" style={{ background: 'linear-gradient(90deg,var(--purple),var(--pink))' }}></div>
                <div className="card-header">
                  <div className="card-title">Received Orders</div>
                  <div className="card-icon-wrap" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
                    <Icon paths={ICONS.ordersDetail} width="22" height="22" stroke="#a78bfa" strokeWidth="1.8" />
                  </div>
                </div>
                <div className="card-arrow"><Icon paths={ICONS.arrowIcon} width="16" height="16" strokeWidth="2" /></div>
              </div>

              <div className="card" onClick={() => openTab('tournaments', 'Tournaments', '#F59E0B')}>
                <div className="card-glow" style={{ background: 'linear-gradient(90deg,var(--gold),var(--orange))' }}></div>
                <div className="card-header">
                  <div className="card-title">Tournaments</div>
                  <div className="card-icon-wrap" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
                    <Icon paths={ICONS.tournaments} width="22" height="22" stroke="#fbbf24" strokeWidth="1.8" />
                  </div>
                </div>
                <div className="card-arrow"><Icon paths={ICONS.arrowIcon} width="16" height="16" strokeWidth="2" /></div>
              </div>

              <div className="card" onClick={() => openTab('rooms', 'Rooms', '#06B6D4')}>
                <div className="card-glow" style={{ background: 'linear-gradient(90deg,var(--cyan),var(--purple))' }}></div>
                <div className="card-header">
                  <div className="card-title">Rooms</div>
                  <div className="card-icon-wrap" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}>
                    <Icon paths={ICONS.rooms} width="22" height="22" stroke="#22d3ee" strokeWidth="1.8" />
                  </div>
                </div>
                <div className="card-arrow"><Icon paths={ICONS.arrowIcon} width="16" height="16" strokeWidth="2" /></div>
              </div>

              <div className="card card-lounge" onClick={() => openTab('lounge', 'Lounge', '#F97316')}>
                <div className="card-glow" style={{ background: 'linear-gradient(90deg,var(--orange),var(--gold))' }}></div>
                <div className="card-header">
                  <div className="card-title">Lounge</div>
                  <div className="card-icon-wrap" style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)' }}>
                    <Icon paths={ICONS.lounge} width="22" height="22" stroke="#fb923c" strokeWidth="1.8" />
                  </div>
                </div>
                <div className="card-arrow"><Icon paths={ICONS.arrowIcon} width="16" height="16" strokeWidth="2" /></div>
              </div>

              <div className="card card-tabletop" onClick={() => openTab('tabletop', 'Tabletop Games', '#D946EF')}>
                <div className="card-glow" style={{ background: 'linear-gradient(90deg,var(--pink),var(--purple),var(--cyan))' }}></div>
                <div className="card-header">
                  <div className="card-title">Tabletop Games</div>
                  <div className="card-icon-wrap" style={{ background: 'rgba(217,70,239,0.12)', border: '1px solid rgba(217,70,239,0.25)' }}>
                    <Icon paths={ICONS.tabletop} width="22" height="22" stroke="#e879f9" strokeWidth="1.8" />
                  </div>
                </div>
                <div className="card-arrow"><Icon paths={ICONS.arrowIcon} width="16" height="16" strokeWidth="2" /></div>
              </div>
            </div>
          )}

          {tabs.map((t) => (
            <div key={t.id} className="tab-content" style={{ display: t.id === activeTab ? 'block' : 'none' }}>
              {t.id === 'orders' && <OrdersTab />}
              {t.id === 'tournaments' && <TournamentsTab tDB={tDB} setTDB={setTDB} onClose={() => closeTab('tournaments')} />}
              {t.id === 'rooms' && <RoomsTab bookings={bookings} setBookings={setBookings} onClose={() => closeTab('rooms')} />}
              {t.id === 'lounge' && <LoungeTab onClose={() => closeTab('lounge')} />}
              {t.id === 'tabletop' && <TabletopTab bookings={bookings} setBookings={setBookings} onClose={() => closeTab('tabletop')} />}
              {['activities', 'report', 'settings'].includes(t.id) && (
                <GenericTab id={t.id} title={t.title} color={t.color} onClose={() => closeTab(t.id)} />
              )}
            </div>
          ))}
        </main>
      </div>
    </>
  )
}

export default Home
