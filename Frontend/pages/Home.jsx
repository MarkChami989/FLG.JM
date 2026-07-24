import { useEffect, useState } from 'react'
import './Home.css'
import { useAuth } from '../src/auth.jsx'
import { SECTIONS } from './data.js'
import OrdersPanel from './OrdersPanel.jsx'
import TournamentsPanel from './TournamentsPanel.jsx'
import RoomsPanel from './RoomsPanel.jsx'
import LoungePanel from './LoungePanel.jsx'
import TabletopPanel from './TabletopPanel.jsx'
import StaffPanel from './StaffPanel.jsx'
import ReportsPanel from './ReportsPanel.jsx'

const PANEL_RENDERERS = {
  orders: OrdersPanel,
  tournaments: TournamentsPanel,
  rooms: RoomsPanel,
  lounge: LoungePanel,
  tabletop: TabletopPanel,
  staff: StaffPanel,
  reports: ReportsPanel,
}

const NAV_MAP = { home: null, staffnav: 'staff', reportsnav: 'reports', settingsnav: null }

function Home() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const displayName = isAdmin
    ? (user?.username ? user.username[0].toUpperCase() + user.username.slice(1) : 'Admin')
    : (user?.name || 'Staff')
  const sections = Object.entries(SECTIONS).filter(([, s]) => !s.adminOnly || isAdmin)
  const [now, setNow] = useState(new Date())
  const [openTabs, setOpenTabs] = useState([])
  const [activeTab, setActiveTab] = useState(null)
  const [activeNav, setActiveNav] = useState('home')

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  function openTab(key) {
    setOpenTabs((prev) => (prev.includes(key) ? prev : [...prev, key]))
    setActiveTab(key)
  }
  function closeTab(key, e) {
    e.stopPropagation()
    setOpenTabs((prev) => {
      const next = prev.filter((k) => k !== key)
      if (activeTab === key) setActiveTab(next.length ? next[next.length - 1] : null)
      return next
    })
  }
  function goHome() { setActiveTab(null) }

  function handleNavClick(navKey) {
    setActiveNav(navKey)
    const target = NAV_MAP[navKey]
    if (target) openTab(target)
    else goHome()
  }

  const clockStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const ActivePanel = activeTab ? PANEL_RENDERERS[activeTab] : null

  return (
    <>
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>

      <div className="topbar">
        <div className="admin-id">
          <div className="avatar">{displayName[0]}</div>
          <div>
            <span className="admin-name">{displayName}</span>
            <span className="admin-badge">{isAdmin ? 'ADMIN' : 'STAFF'}</span>
          </div>
          <div className="clock">{clockStr}</div>
        </div>
        <div className="brand">
          <div className="brand-mark">FLG</div>
          <div className="brand-text">Fusion <span>Luxury</span> Game · {isAdmin ? 'Admin' : 'Staff'}</div>
        </div>
      </div>

      <div className="subnav">
        <a className={activeNav === 'home' ? 'active' : ''} onClick={() => handleNavClick('home')}>Dashboard</a>
        {isAdmin && <a className={activeNav === 'staffnav' ? 'active' : ''} onClick={() => handleNavClick('staffnav')}>Staff</a>}
        {isAdmin && <a className={activeNav === 'reportsnav' ? 'active' : ''} onClick={() => handleNavClick('reportsnav')}>Reports</a>}
        <a className={activeNav === 'settingsnav' ? 'active' : ''} onClick={() => handleNavClick('settingsnav')}>Settings</a>
      </div>

      <div className="tabstrip">
        {openTabs.length > 0 && (
          <>
            <div className={`tabchip ${activeTab === null ? 'active' : ''}`} onClick={goHome}>
              <span className="dot" style={{ background: 'var(--txt-dim)' }}></span> Home
            </div>
            {openTabs.map((key) => {
              const s = SECTIONS[key]
              return (
                <div key={key} className={`tabchip ${activeTab === key ? 'active' : ''}`} style={{ '--tabclr': s.clr }} onClick={() => openTab(key)}>
                  <span className="dot"></span>{s.icon} {s.label}
                  <span className="x" onClick={(e) => closeTab(key, e)}>✕</span>
                </div>
              )
            })}
          </>
        )}
      </div>

      <main>
        {activeTab === null ? (
          <>
            <div className="section-title">{isAdmin ? 'Admin Console' : 'Staff Console'}</div>
            <div className="page-title">Good to see you, {displayName}</div>
            <div className="launcher-grid">
              {sections.map(([key, s], i) => (
                <div key={key} className="launcher-card" style={{ '--clr': s.clr, animationDelay: `${i * 0.04}s` }} onClick={() => openTab(key)}>
                  {s.adminOnly && <div className="launcher-badge">ADMIN ONLY</div>}
                  <div className="launcher-icon" style={{ color: s.clr }}>{s.icon}</div>
                  <h3>{s.label}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <ActivePanel />
        )}
      </main>
    </>
  )
}

export default Home
