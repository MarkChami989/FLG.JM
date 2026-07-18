import Header from '../src/components/Header.jsx'
import './rooms.css'

function Rooms() {
  return (
    <>
      <div className="bg"></div>
      <div className="orb orb1"></div><div className="orb orb2"></div><div className="orb orb3"></div>
      <div className="orb orb4"></div><div className="orb orb5"></div>

      <Header active="rooms" />

      <main>
        <div className="page-hero">
          <div className="page-tag">Premium Gaming Experience</div>
          <div className="page-title">PC &amp; PS ROOMS</div>
          <div className="page-line"></div>
        </div>

        <div className="row-top">
          <div className="card">
            <div className="card-glow" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%,rgba(59,130,246,.12),transparent)' }}></div>
            <div className="corner tl" style={{ borderColor: 'var(--blue)' }}></div>
            <div className="corner tr" style={{ borderColor: 'var(--cyan)' }}></div>
            <div className="corner bl" style={{ borderColor: 'var(--cyan)' }}></div>
            <div className="corner br" style={{ borderColor: 'var(--blue)' }}></div>

            <div className="room-visual">
              <div className="pc-visual">
                <div style={{ position: 'relative' }}>
                  <div className="big-monitor">
                    <div className="screen-content">
                      <div className="screen-scanline"></div>
                      <div className="screen-glow"></div>
                      <div className="screen-game-icon">🖥️</div>
                      <div className="screen-label">PC GAMING</div>
                    </div>
                    <div className="monitor-stand"></div>
                    <div className="monitor-base"></div>
                  </div>
                  <div className="keyboard-big">
                    {Array.from({ length: 13 }).map((_, i) => <div className="key" key={i}></div>)}
                  </div>
                </div>
                <div className="desk-items">
                  <div className="pc-tower-big">
                    <div className="led led-b"></div>
                    <div className="led led-p"></div>
                    <div className="led led-c"></div>
                    <div className="led led-b" style={{ animationDelay: '1.2s' }}></div>
                  </div>
                  <div className="headset">🎧</div>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="card-title">💻 PC Room</div>
              <div className="card-desc">Ultra-high performance rigs with RTX 4090, 4K monitors, mechanical keyboards and surround sound. Built for competitive gaming and immersive single-player experiences.</div>
              <div>
                <span className="badge badge-blue">⚡ RTX 4090</span>
                <span className="badge badge-blue">🖥️ 4K Display</span>
                <span className="badge badge-green">✅ Available</span>
              </div>
              <button className="btn-book">Book Now</button>
            </div>
          </div>

          <div className="card">
            <div className="card-glow" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%,rgba(59,130,246,.12),transparent)' }}></div>
            <div className="corner tl"></div><div className="corner tr"></div>
            <div className="corner bl"></div><div className="corner br"></div>

            <div className="room-visual">
              <div className="ps-visual">
                <div style={{ position: 'relative' }}>
                  <div className="big-tv">
                    <div className="tv-screen-content">
                      <div className="tv-scanline"></div>
                      <div className="tv-glow-inner"></div>
                      <div className="tv-game-icon">🎮</div>
                      <div className="tv-label">PS5 GAMING</div>
                    </div>
                    <div className="tv-stand"></div>
                    <div className="tv-base"></div>
                  </div>
                </div>
                <div className="ps-side">
                  <div className="ps5-console">
                    <div className="disc-slot"></div>
                  </div>
                  <div className="ps-ctrl">🕹️</div>
                  <div style={{ fontSize: 20, filter: 'drop-shadow(0 0 8px rgba(59,130,246,.6))' }}>🎯</div>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="card-title">🎮 PS Room</div>
              <div className="card-desc">PlayStation 5 stations with 4K OLED TVs, DualSense haptic controllers and premium surround sound. Enjoy the latest exclusives and multiplayer sessions.</div>
              <div>
                <span className="badge badge-pink">🎮 PS5</span>
                <span className="badge badge-pink">📺 4K OLED</span>
                <span className="badge badge-green">✅ Available</span>
              </div>
              <button className="btn-book" style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>Book Now</button>
            </div>
          </div>
        </div>

        <div className="row-bottom">
          <div className="card vip1">
            <div className="card-glow" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%,rgba(16,185,129,.1),transparent)' }}></div>
            <div className="corner tl" style={{ borderColor: 'var(--green)' }}></div>
            <div className="corner tr" style={{ borderColor: 'var(--green)' }}></div>
            <div className="corner bl" style={{ borderColor: 'var(--green)' }}></div>
            <div className="corner br" style={{ borderColor: 'var(--green)' }}></div>

            <div className="vip-visual">
              <div className="vip-room-bg" style={{ background: 'linear-gradient(135deg,#001a0a,#003015,#001008)' }}>
                <div className="mini-tv">
                  <div className="mini-tv-screen">
                    <div className="movie-scanline"></div>
                    <div className="movie-glow"></div>
                    <div className="movie-icon">🍿</div>
                    <div className="movie-label">VIP STANDARD</div>
                  </div>
                  <div className="mini-tv-stand"></div>
                  <div className="mini-tv-base"></div>
                </div>
              </div>
              <div className="vip-badge vip-badge-green">👑 VIP</div>
            </div>

            <div className="card-body">
              <div className="card-title" style={{ fontSize: 18 }}>VIP Standard</div>
              <div className="card-desc">Private room with dedicated PC or PS5, mini-bar, lounge seating, and personal service. Perfect for a premium solo or duo gaming session.</div>
              <div>
                <span className="badge badge-green">🔒 Private</span>
                <span className="badge badge-green">🥤 Mini Bar</span>
              </div>
              <button className="btn-book" style={{ background: 'linear-gradient(135deg,#059669,#10b981)' }}>Book VIP</button>
            </div>
          </div>

          <div className="card vip2">
            <div className="card-glow" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%,rgba(59,130,246,.1),transparent)' }}></div>
            <div className="corner tl" style={{ borderColor: 'var(--blue)' }}></div>
            <div className="corner tr" style={{ borderColor: 'var(--blue)' }}></div>
            <div className="corner bl" style={{ borderColor: 'var(--blue)' }}></div>
            <div className="corner br" style={{ borderColor: 'var(--blue)' }}></div>

            <div className="vip-visual">
              <div className="vip-room-bg" style={{ background: 'linear-gradient(135deg,#00091a,#001535,#000a20)' }}>
                <div className="mini-tv">
                  <div className="mini-tv-screen">
                    <div className="movie-scanline"></div>
                    <div className="movie-glow"></div>
                    <div className="movie-icon">⚡</div>
                    <div className="movie-label">VIP ELITE</div>
                  </div>
                  <div className="mini-tv-stand"></div>
                  <div className="mini-tv-base"></div>
                </div>
              </div>
              <div className="vip-badge vip-badge-blue">💠 ELITE</div>
            </div>

            <div className="card-body">
              <div className="card-title" style={{ fontSize: 18 }}>VIP Elite</div>
              <div className="card-desc">Full private lounge with dual-screen setup, gourmet snacks, priority booking, and a dedicated gaming host for groups up to 4 players.</div>
              <div>
                <span className="badge badge-blue">👥 4 Players</span>
                <span className="badge badge-blue">🎧 Host</span>
              </div>
              <button className="btn-book" style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>Book Elite</button>
            </div>
          </div>

          <div className="card vip3">
            <div className="card-glow" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%,rgba(245,158,11,.1),transparent)' }}></div>
            <div className="corner tl" style={{ borderColor: 'var(--gold)' }}></div>
            <div className="corner tr" style={{ borderColor: 'var(--gold)' }}></div>
            <div className="corner bl" style={{ borderColor: 'var(--gold)' }}></div>
            <div className="corner br" style={{ borderColor: 'var(--gold)' }}></div>

            <div className="vip-visual">
              <div className="vip-room-bg" style={{ background: 'linear-gradient(135deg,#1a0a00,#2d1500,#1a0800)' }}>
                <div className="mini-tv">
                  <div className="mini-tv-screen">
                    <div className="movie-scanline"></div>
                    <div className="movie-glow"></div>
                    <div className="movie-icon">👑</div>
                    <div className="movie-label">VIP ROYAL</div>
                  </div>
                  <div className="mini-tv-stand"></div>
                  <div className="mini-tv-base"></div>
                </div>
              </div>
              <div className="vip-badge vip-badge-gold">🏆 ROYAL</div>
            </div>

            <div className="card-body">
              <div className="card-title" style={{ fontSize: 18 }}>VIP Royal</div>
              <div className="card-desc">The ultimate experience — cinema-size screen, full bar service, cigar selection, luxury seating and a private tournament setup for up to 8 players.</div>
              <div>
                <span className="badge badge-gold">🏆 Tournament</span>
                <span className="badge badge-gold">🥃 Full Bar</span>
              </div>
              <button className="btn-book" style={{ background: 'linear-gradient(135deg,#b45309,#f59e0b)', color: '#1a0a00' }}>Book Royal</button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Rooms