import { useState } from 'react'
import Header from '../src/components/Header.jsx'
import './tournaments.css'

function Tournaments() {
  const [fifaCount, setFifaCount] = useState(50)
  const [combatCount, setCombatCount] = useState(30)

  function joinFifa() {
    if (fifaCount >= 64) { alert('Tournament Full!'); return }
    setFifaCount((n) => n + 1)
  }
  function joinCombat() {
    if (combatCount >= 32) { alert('Tournament Full!'); return }
    setCombatCount((n) => n + 1)
  }

  return (
    <>
      <div className="bg"></div>
      <div className="orb orb1"></div><div className="orb orb2"></div><div className="orb orb3"></div>
      <div className="orb orb4"></div><div className="orb orb5"></div>

      <Header active="tournaments" />

      <main>
        <div className="page-hero">
          <div className="page-tag">Compete · Win · Dominate</div>
          <div className="page-title">TOURNAMENTS</div>
          <div className="page-line"></div>
        </div>

        <div className="grid">

          <div className="card">
            <div className="corner tl" style={{ borderTop: '1.5px solid var(--green)', borderLeft: '1.5px solid var(--green)' }}></div>
            <div className="corner tr" style={{ borderTop: '1.5px solid var(--green)', borderRight: '1.5px solid var(--green)' }}></div>
            <div className="corner bl" style={{ borderBottom: '1.5px solid var(--green)', borderLeft: '1.5px solid var(--green)' }}></div>
            <div className="corner br" style={{ borderBottom: '1.5px solid var(--green)', borderRight: '1.5px solid var(--green)' }}></div>

            <div className="t-visual">
              <div className="fifa-bg">
                <div className="confetti">
                  <div className="cf cf1"></div><div className="cf cf2"></div><div className="cf cf3"></div>
                  <div className="cf cf4"></div><div className="cf cf5"></div><div className="cf cf6"></div>
                  <div className="cf cf7"></div><div className="cf cf8"></div>
                </div>
                <div className="pitch">
                  <div className="pitch-glow"></div>
                  <div className="pitch-ball">⚽</div>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="live-chip chip-live"><div className="live-dot"></div> LIVE NOW</div>
              <div className="t-name">⚽ FIFA Tournament</div>
              <div className="t-desc">The biggest FIFA championship at Fusion. Battle through group stages, knockouts, and a grand final to claim the title and prize pool.</div>

              <div className="stats">
                <div className="stat">
                  <div className="stat-val" style={{ color: 'var(--green)' }}>{fifaCount}</div>
                  <div className="stat-lbl">Players Joined</div>
                </div>
                <div className="stat">
                  <div className="stat-val" style={{ color: 'var(--gold)' }}>64</div>
                  <div className="stat-lbl">Max Players</div>
                </div>
                <div className="stat">
                  <div className="stat-val" style={{ color: 'var(--pink)' }}>6</div>
                  <div className="stat-lbl">Rounds Left</div>
                </div>
              </div>

              <div className="players-row">
                <div className="avatars">
                  <div className="av">🦁</div><div className="av">🦅</div><div className="av">🐺</div>
                  <div className="av">🦂</div><div className="av">🐯</div>
                  <div className="av av-more">+45</div>
                </div>
                <div className="players-txt"><strong>{fifaCount}</strong> players joined · <strong>{64 - fifaCount}</strong> spots left</div>
              </div>

              <div className="progress-wrap">
                <div className="progress-lbl"><span>Registration</span><span>{fifaCount} / 64</span></div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(fifaCount / 64) * 100}%`, background: 'linear-gradient(90deg,#059669,#10b981)', boxShadow: '0 0 8px rgba(16,185,129,.5)' }}></div>
                </div>
              </div>

              <div className="prize-row">
                <div className="prize-icon">🏆</div>
                <div className="prize-info">
                  <div className="prize-lbl">Prize Pool</div>
                  <div className="prize-val">$2,500</div>
                </div>
                <div>
                  <span className="badge badge-green">🎮 PS5</span>
                  <span className="badge badge-gold">💵 Cash</span>
                </div>
              </div>

              <button className="btn-join btn-fifa" onClick={joinFifa}>⚽ &nbsp;JOIN NOW</button>
            </div>
          </div>

          <div className="card">
            <div className="corner tl" style={{ borderTop: '1.5px solid var(--red)', borderLeft: '1.5px solid var(--red)' }}></div>
            <div className="corner tr" style={{ borderTop: '1.5px solid var(--gold)', borderRight: '1.5px solid var(--gold)' }}></div>
            <div className="corner bl" style={{ borderBottom: '1.5px solid var(--gold)', borderLeft: '1.5px solid var(--gold)' }}></div>
            <div className="corner br" style={{ borderBottom: '1.5px solid var(--red)', borderRight: '1.5px solid var(--red)' }}></div>

            <div className="t-visual">
              <div className="combat-bg">
                <div className="flash-lines"></div>
                <div className="arena-glow"></div>
                <div className="health-bars">
                  <div className="hbar hbar1"><div className="hbar-fill"></div></div>
                  <div className="vs-mini">VS</div>
                  <div className="hbar hbar2"><div className="hbar-fill"></div></div>
                </div>
                <div className="fighter left">🥷</div>
                <div className="vs-badge">VS</div>
                <div className="fighter right">🥷</div>
              </div>
            </div>

            <div className="card-body">
              <div className="live-chip chip-open"><div className="live-dot"></div> OPEN · REGISTERING</div>
              <div className="t-name">🥊 Now Combat</div>
              <div className="t-desc">Intense 1v1 fighting game tournament. Choose your fighter, master your combos, and outlast every opponent to stand as the last one standing.</div>

              <div className="stats">
                <div className="stat">
                  <div className="stat-val" style={{ color: 'var(--red)' }}>{combatCount}</div>
                  <div className="stat-lbl">Players Joined</div>
                </div>
                <div className="stat">
                  <div className="stat-val" style={{ color: 'var(--gold)' }}>32</div>
                  <div className="stat-lbl">Max Players</div>
                </div>
                <div className="stat">
                  <div className="stat-val" style={{ color: 'var(--pink)' }}>2</div>
                  <div className="stat-lbl">Spots Left</div>
                </div>
              </div>

              <div className="players-row">
                <div className="avatars">
                  <div className="av">🐯</div><div className="av">🦈</div><div className="av">🐍</div>
                  <div className="av">🦂</div><div className="av">🐲</div>
                  <div className="av av-more">+25</div>
                </div>
                <div className="players-txt"><strong>{combatCount}</strong> players joined · <strong>{32 - combatCount}</strong> spots left</div>
              </div>

              <div className="progress-wrap">
                <div className="progress-lbl"><span>Registration</span><span>{combatCount} / 32</span></div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(combatCount / 32) * 100}%`, background: 'linear-gradient(90deg,#b91c1c,#ef4444)', boxShadow: '0 0 8px rgba(239,68,68,.5)' }}></div>
                </div>
              </div>

              <div className="prize-row" style={{ background: 'rgba(239,68,68,.06)', borderColor: 'rgba(239,68,68,.2)' }}>
                <div className="prize-icon">🏆</div>
                <div className="prize-info">
                  <div className="prize-lbl">Prize Pool</div>
                  <div className="prize-val" style={{ color: '#f87171' }}>$1,500</div>
                </div>
                <div>
                  <span className="badge badge-red">🥊 1v1</span>
                  <span className="badge badge-gold">💵 Cash</span>
                </div>
              </div>

              <button className="btn-join btn-combat" onClick={joinCombat}>🥊 &nbsp;JOIN NOW</button>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}

export default Tournaments
