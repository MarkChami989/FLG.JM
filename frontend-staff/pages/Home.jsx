import { useEffect, useState } from 'react'
import './Home.css'
import { Icon, ICONS, TAB_ICON_MAP } from './icons.jsx'
import { api } from './api.js'
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
  const [tDB, setTDB] = useState([])

  function reloadTournaments() {
    api.tournaments.list().then(setTDB)
  }

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(reloadTournaments, [])

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
          <div className="admin-id">
            <div className="avatar">J</div>
            <div>
              <span className="admin-name">Jana</span>
              <span className="admin-badge">STAFF</span>
            </div>
            <div className="clock">{clockTime} · {dateStr}</div>
          </div>
          <div className="brand">
            <div className="brand-mark">FLG</div>
            <div className="brand-text">Fusion <span>Luxury</span> Game · Staff</div>
          </div>
        </header>

        <nav className="subnav">
          <a onClick={() => openTab('activities', 'Activities', '#10B981')}>
            <Icon paths={ICONS.activities} width="14" height="14" strokeWidth="1.8" />
            &nbsp;Activities
          </a>
          <a onClick={() => openTab('report', 'Report', '#06B6D4')}>
            <Icon paths={ICONS.report} width="14" height="14" strokeWidth="1.8" />
            &nbsp;Report
          </a>
          <a onClick={() => openTab('settings', 'Settings', '#F59E0B')}>
            <Icon paths={ICONS.settings} width="14" height="14" strokeWidth="1.8" />
            &nbsp;Settings
          </a>
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
            <>
              <div className="section-title">Staff Console</div>
              <div className="page-title">Good to see you, Jana</div>
              <div className="launcher-grid">
                <div className="launcher-card" style={{ '--clr': '#a78bfa' }} onClick={() => openTab('orders', 'Received Orders', '#7C3AED')}>
                  <div className="launcher-icon" style={{ color: '#a78bfa' }}><Icon paths={ICONS.ordersDetail} width="20" height="20" strokeWidth="1.8" /></div>
                  <h3>Received Orders</h3>
                  <p>Approve or reject incoming client requests across every activity.</p>
                </div>

                <div className="launcher-card" style={{ '--clr': '#fbbf24' }} onClick={() => openTab('tournaments', 'Tournaments', '#F59E0B')}>
                  <div className="launcher-icon" style={{ color: '#fbbf24' }}><Icon paths={ICONS.tournaments} width="20" height="20" strokeWidth="1.8" /></div>
                  <h3>Tournaments</h3>
                  <p>Create, manage, and settle FIFA &amp; Combat tournament brackets.</p>
                </div>

                <div className="launcher-card" style={{ '--clr': '#22d3ee' }} onClick={() => openTab('rooms', 'Rooms', '#06B6D4')}>
                  <div className="launcher-icon" style={{ color: '#22d3ee' }}><Icon paths={ICONS.rooms} width="20" height="20" strokeWidth="1.8" /></div>
                  <h3>Rooms</h3>
                  <p>Live occupancy across PC, PS5, and every VIP tier.</p>
                </div>

                <div className="launcher-card" style={{ '--clr': '#fb923c' }} onClick={() => openTab('lounge', 'Lounge', '#F97316')}>
                  <div className="launcher-icon" style={{ color: '#fb923c' }}><Icon paths={ICONS.lounge} width="20" height="20" strokeWidth="1.8" /></div>
                  <h3>Lounge</h3>
                  <p>Bar seating and table status for the Cigar Lounge.</p>
                </div>

                <div className="launcher-card" style={{ '--clr': '#e879f9' }} onClick={() => openTab('tabletop', 'Tabletop Games', '#D946EF')}>
                  <div className="launcher-icon" style={{ color: '#e879f9' }}><Icon paths={ICONS.tabletop} width="20" height="20" strokeWidth="1.8" /></div>
                  <h3>Tabletop Games</h3>
                  <p>Ping Pong, Billiard &amp; Baby Foot table reservations.</p>
                </div>
              </div>
            </>
          )}

          {tabs.map((t) => (
            <div key={t.id} className="tab-content" style={{ display: t.id === activeTab ? 'block' : 'none' }}>
              {t.id === 'orders' && <OrdersTab />}
              {t.id === 'tournaments' && <TournamentsTab tDB={tDB} reload={reloadTournaments} onClose={() => closeTab('tournaments')} />}
              {t.id === 'rooms' && <RoomsTab onClose={() => closeTab('rooms')} />}
              {t.id === 'lounge' && <LoungeTab onClose={() => closeTab('lounge')} />}
              {t.id === 'tabletop' && <TabletopTab onClose={() => closeTab('tabletop')} />}
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
