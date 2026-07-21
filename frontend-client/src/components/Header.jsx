import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import './Header.css'

function Header({ active = '' }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header>
      <Link className="brand" to="/">
        <div className="brand-logo">
          <svg width="24" height="17" viewBox="0 0 42 30" fill="none">
            <defs>
              <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#f0abfc" />
              </linearGradient>
            </defs>
            <path
              d="M6 8C6 4 9 2 13 2L16 2L17 8L25 8L26 2L29 2C33 2 36 4 36 8L38 18C39.5 24 37 28 33 28C30 28 28 26 26 22L16 22C14 26 12 28 9 28C5 28 2.5 24 4 18Z"
              fill="url(#hg)"
              opacity=".15"
              stroke="url(#hg)"
              strokeWidth="1.5"
            />
            <rect x="9" y="13" width="2" height="6" rx="1" fill="url(#hg)" />
            <rect x="7" y="15" width="6" height="2" rx="1" fill="url(#hg)" />
            <circle cx="30" cy="13" r="1.4" fill="#a855f7" />
            <circle cx="33" cy="15.5" r="1.4" fill="#ec4899" />
            <circle cx="30" cy="18" r="1.4" fill="#60a5fa" />
            <circle cx="27" cy="15.5" r="1.4" fill="#34d399" />
            <circle cx="15" cy="18" r="3" stroke="url(#hg)" strokeWidth="1.2" fill="rgba(168,85,247,.2)" />
            <circle cx="25" cy="12" r="3" stroke="url(#hg)" strokeWidth="1.2" fill="rgba(168,85,247,.2)" />
            <circle cx="19.5" cy="15" r="1" fill="url(#hg)" opacity=".7" />
            <circle cx="22.5" cy="15" r="1" fill="url(#hg)" opacity=".7" />
          </svg>
        </div>
        <div>
          <div className="brand-sub">Fusion Luxury</div>
          <div className="brand-name">GAME</div>
        </div>
      </Link>
      <nav>
        <Link to="/" className={active === 'home' ? 'active' : ''}>Home</Link>
        <Link to="/rooms" className={active === 'rooms' ? 'active' : ''}>Rooms</Link>
        <Link to="/tournaments" className={active === 'tournaments' ? 'active' : ''}>Tournaments</Link>
        <Link to="/lounge" className={active === 'lounge' ? 'active' : ''}>Lounge</Link>
      </nav>
      <button
        className={`btn-activity-nav${active === 'activities' ? ' active-btn' : ''}`}
        onClick={() => navigate('/activities')}
      >
        Activities
      </button>
      {user ? (
        <div className="user-menu">
          <span className="user-badge">👤 {user.username}</span>
          <button className="btn-logout-nav" onClick={handleLogout}>Sign Out</button>
        </div>
      ) : (
        <button className="btn-login-nav" onClick={() => navigate('/login')}>
          Sign In
        </button>
      )}
    </header>
  )
}

export default Header
