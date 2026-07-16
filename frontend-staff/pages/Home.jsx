import { useEffect, useState } from 'react'
import './Home.css'
import { Icon, ICONS, TAB_ICON_MAP } from './icons.jsx'
import { INITIAL_TDB } from './data.js'
import OrdersTab from './OrdersTab.jsx'
import TournamentsTab from './TournamentsTab.jsx'
import RoomsTab from './RoomsTab.jsx'
import LoungeTab from './LoungeTab.jsx'
import TabletopTab from './TabletopTab.jsx'
import GenericTab from './GenericTab.jsx'

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
