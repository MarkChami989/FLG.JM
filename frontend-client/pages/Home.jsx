import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../src/components/Header.jsx'
import './Home.css'

const SLIDE_COUNT = 3

function Home() {
  const navigate = useNavigate()
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDE_COUNT), 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <div className="bg"></div>
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>
      <div className="orb orb4"></div>
      <div className="orb orb5"></div>

      <Header active="home" />

      <main>
        <div className="hero">
          <div className="hero-tag">Welcome to the Ultimate Gaming Experience</div>
          <div className="hero-title">FUSION LUXURY GAME</div>
          <div className="hero-sub">Where luxury meets entertainment · PC · PS · Tournaments · Tabletop · Cigar Lounge</div>
          <div className="hero-line"></div>
        </div>

        <div className="grid">

          <div className="card card-rooms" onClick={() => navigate('/rooms')}>
            <div className="card-glow"></div>
            <div className="corner tl"></div><div className="corner tr"></div>
            <div className="corner bl"></div><div className="corner br"></div>

            <div className="slideshow">
              <div className={`slide${slide === 0 ? ' active' : ''}`}>
                <div className="room-pc">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div className="monitor">
                      <div className="monitor-screen">🖥️<br />PC ROOM</div>
                    </div>
                    <div className="keyboard">
                      {Array.from({ length: 12 }).map((_, i) => <div className="key" key={i}></div>)}
                    </div>
                  </div>
                  <div className="pc-tower">
                    <div className="pc-led"></div>
                    <div className="pc-led" style={{ background: '#a855f7', boxShadow: '0 0 6px #a855f7', animationDelay: '.5s' }}></div>
                    <div className="pc-led" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32 }}>🎮</div>
                    <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 10, letterSpacing: 2, color: 'rgba(59,130,246,.8)', marginTop: 4 }}>HIGH PERFORMANCE</div>
                  </div>
                </div>
                <div className="slide-label">💻 PC ROOM</div>
              </div>

              <div className={`slide${slide === 1 ? ' active' : ''}`}>
                <div className="room-ps">
                  <div className="tv-screen">
                    <div className="tv-text">📺<br />PS ROOM</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div className="ps-console">
                      <div className="ps-disc"></div>
                    </div>
                    <div style={{ fontSize: 28 }}>🕹️</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28 }}>🎾</div>
                    <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 10, letterSpacing: 2, color: 'rgba(217,70,239,.8)', marginTop: 4 }}>CONSOLE ZONE</div>
                  </div>
                </div>
                <div className="slide-label">🎮 PS ROOM</div>
              </div>

              <div className={`slide${slide === 2 ? ' active' : ''}`}>
                <div className="room-ps" style={{ background: 'linear-gradient(135deg,#0a0a00,#1a1500,#0a0a00)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 52, filter: 'drop-shadow(0 0 12px rgba(245,158,11,.7))' }}>👑</div>
                    <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: 3, color: 'var(--gold)', marginTop: 6 }}>VIP ROOM</div>
                    <div style={{ fontSize: 11, color: 'rgba(245,158,11,.6)', letterSpacing: 1, marginTop: 4 }}>Private · Exclusive</div>
                  </div>
                </div>
                <div className="slide-label" style={{ borderColor: 'rgba(245,158,11,.4)', color: 'var(--gold)' }}>👑 VIP</div>
              </div>
            </div>

            <div className="slide-nav">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`dot${slide === i ? ' active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setSlide(i) }}
                ></button>
              ))}
            </div>

            <div className="card-body">
              <div className="card-title">PC &amp; PS Rooms</div>
              <div className="card-desc">High-end gaming stations with the latest hardware. Immersive setups for solo &amp; multiplayer sessions.</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-purple">💻 PC</span>
                <span className="badge badge-pink">🎮 PS5</span>
                <span className="badge badge-gold">👑 VIP</span>
              </div>
            </div>
          </div>

          <div className="card card-tourn">
            <div className="card-glow" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%,rgba(245,158,11,.1),transparent)' }}></div>
            <div className="corner tl"></div><div className="corner tr"></div>
            <div className="corner bl"></div><div className="corner br"></div>

            <div className="tourn-banner">
              <div className="tourn-rays"></div>
              <div className="tourn-center">
                <div className="tourn-live"><div className="live-dot"></div> LIVE</div>
                <div className="tourn-trophy">🏆</div>
                <div className="tourn-name">GRAND MASTERS CUP</div>
                <div className="prize">💰 Prize Pool: $5,000</div>
                <div className="players">
                  <div className="avatar">🦁</div><div className="avatar">🦅</div><div className="avatar">🐺</div>
                  <div className="avatar">🦂</div><div className="avatar">🐯</div>
                  <div style={{ marginLeft: -6, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.1)', border: '2px solid rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--muted)' }}>+38</div>
                </div>
                <button className="tourn-btn" onClick={() => navigate('/join')}>JOIN NOW</button>
              </div>
            </div>

            <div className="ticker">
              <div className="ticker-inner">
                <span className="ticker-item">🏆 Grand Masters Cup · LIVE</span>
                <span className="ticker-item">🎮 FIFA Tournament · Fri 8PM</span>
                <span className="ticker-item">🕹️ Tekken League · Sat 6PM</span>
                <span className="ticker-item">🎾 FPS Showdown · Sun 5PM</span>
                <span className="ticker-item">🏆 Grand Masters Cup · LIVE</span>
                <span className="ticker-item">🎮 FIFA Tournament · Fri 8PM</span>
                <span className="ticker-item">🕹️ Tekken League · Sat 6PM</span>
                <span className="ticker-item">🎾 FPS Showdown · Sun 5PM</span>
              </div>
            </div>

            <div className="card-body" style={{ paddingTop: 14 }}>
              <div className="card-title">Tournaments</div>
              <div className="card-desc">Compete against the best. Weekly championships with real prize pools and leaderboards.</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-gold">🏆 Weekly</span>
                <span className="badge badge-green">✅ Open</span>
              </div>
            </div>
          </div>

          <div className="card card-table">
            <div className="card-glow"></div>
            <div className="corner tl"></div><div className="corner tr"></div>
            <div className="corner bl"></div><div className="corner br"></div>

            <div className="tabletop-wrap">
              <div style={{ marginBottom: 16 }}>
                <div className="sec-title">Play Together</div>
                <div className="card-title">Tabletop Games</div>
              </div>
              <div className="tabletop-items">
                <div className="tabletop-item" onClick={() => navigate('/pingpong')}>
                  <div className="tabletop-icon">🏓</div>
                  <div className="tabletop-info">
                    <div className="tabletop-name">Ping Pong</div>
                    <div className="tabletop-sub">2–4 Players · Tables available now</div>
                  </div>
                  <div className="tabletop-arrow">›</div>
                </div>

                <div className="tabletop-item" onClick={() => navigate('/billiard')}>
                  <div className="tabletop-icon">🎱</div>
                  <div className="tabletop-info">
                    <div className="tabletop-name">Billiard</div>
                    <div className="tabletop-sub">2 Players · Professional tables</div>
                  </div>
                  <div className="tabletop-arrow">›</div>
                </div>

                <div className="tabletop-item" onClick={() => navigate('/babyfoot')}>
                  <div className="tabletop-icon">⚽</div>
                  <div className="tabletop-info">
                    <div className="tabletop-name">Baby Foot</div>
                    <div className="tabletop-sub">2–4 Players · Tournament mode</div>
                  </div>
                  <div className="tabletop-arrow">›</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-cigar" onClick={() => navigate('/lounge')}>
            <div className="card-glow" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%,rgba(245,158,11,.08),transparent)' }}></div>
            <div className="corner tl" style={{ borderColor: 'var(--gold)' }}></div>
            <div className="corner tr" style={{ borderColor: 'var(--gold)' }}></div>
            <div className="corner bl" style={{ borderColor: 'var(--gold)' }}></div>
            <div className="corner br" style={{ borderColor: 'var(--gold)' }}></div>

            <div className="cigar-banner">
              <div className="cigar-smoke"></div>
              <div className="cigar-visual">
                <div className="smoke-puff">💨</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 36, filter: 'drop-shadow(0 0 10px rgba(139,92,46,.6))' }}>🥃</div>
                  <div className="cigar-stick"></div>
                </div>
                <div className="smoke-puff">💨</div>
                <div className="smoke-puff">💨</div>
              </div>
              <div className="cigar-title-bar">🚬 Cigar Lounge &amp; Bar</div>
            </div>

            <div className="menu-list">
              <div className="menu-item">
                <div className="menu-item-left">
                  <div className="menu-emoji">🥂</div>
                  <div>
                    <div className="menu-name">Dom Pérignon</div>
                    <div className="menu-origin">Champagne · France</div>
                  </div>
                </div>
                <div className="menu-price">$45</div>
              </div>
              <div className="menu-item">
                <div className="menu-item-left">
                  <div className="menu-emoji">🥃</div>
                  <div>
                    <div className="menu-name">Macallan 18</div>
                    <div className="menu-origin">Single Malt Scotch · Scotland</div>
                  </div>
                </div>
                <div className="menu-price">$38</div>
              </div>
              <div className="menu-item">
                <div className="menu-item-left">
                  <div className="menu-emoji">🚬</div>
                  <div>
                    <div className="menu-name">Cohiba Behike</div>
                    <div className="menu-origin">Premium Cigar · Cuba</div>
                  </div>
                </div>
                <div className="menu-price">$28</div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}

export default Home
