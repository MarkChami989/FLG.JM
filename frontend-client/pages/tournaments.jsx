import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../src/components/Header.jsx'
import { api } from './api.js'
import './tournaments.css'

const ACCENTS = [
  { name: 'green', var: 'var(--green)', grad: 'linear-gradient(90deg,#059669,#10b981)', glow: 'rgba(16,185,129,.5)', border: 'rgba(16,185,129,.5)', chipBg: 'rgba(16,185,129,.15)', chipText: '#6ee7b7', btn: 'linear-gradient(135deg,#059669,#10b981,#34d399)', btnShadow: 'rgba(16,185,129,.4)' },
  { name: 'red', var: 'var(--red)', grad: 'linear-gradient(90deg,#b91c1c,#ef4444)', glow: 'rgba(239,68,68,.5)', border: 'rgba(239,68,68,.5)', chipBg: 'rgba(239,68,68,.15)', chipText: '#fca5a5', btn: 'linear-gradient(135deg,#b91c1c,#ef4444,#f97316)', btnShadow: 'rgba(239,68,68,.4)' },
  { name: 'purple', var: 'var(--purple)', grad: 'linear-gradient(90deg,#6d28d9,#a855f7)', glow: 'rgba(168,85,247,.5)', border: 'rgba(168,85,247,.5)', chipBg: 'rgba(168,85,247,.15)', chipText: '#d8b4fe', btn: 'linear-gradient(135deg,#6d28d9,#a855f7,#d946ef)', btnShadow: 'rgba(168,85,247,.4)' },
  { name: 'cyan', var: 'var(--cyan)', grad: 'linear-gradient(90deg,#0e7490,#06b6d4)', glow: 'rgba(6,182,212,.5)', border: 'rgba(6,182,212,.5)', chipBg: 'rgba(6,182,212,.15)', chipText: '#67e8f9', btn: 'linear-gradient(135deg,#0e7490,#06b6d4,#22d3ee)', btnShadow: 'rgba(6,182,212,.4)' },
]

function Tournaments() {
  const navigate = useNavigate()
  const [tournaments, setTournaments] = useState(null)

  useEffect(() => {
    api.tournaments.list().then(setTournaments).catch(() => setTournaments([]))
  }, [])

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

        {tournaments === null ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>Loading tournaments…</div>
        ) : tournaments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>No tournaments available right now.</div>
        ) : (
          <div className="grid">
            {tournaments.map((t, i) => {
              const a = ACCENTS[i % ACCENTS.length]
              const spotsLeft = Math.max(0, t.max - t.clients.length)
              const isFull = spotsLeft === 0
              const pct = t.max ? Math.min(100, Math.round((t.clients.length / t.max) * 100)) : 0

              return (
                <div key={t.id} className="card">
                  <div className="corner tl" style={{ borderTop: `1.5px solid ${a.var}`, borderLeft: `1.5px solid ${a.var}` }}></div>
                  <div className="corner tr" style={{ borderTop: `1.5px solid ${a.var}`, borderRight: `1.5px solid ${a.var}` }}></div>
                  <div className="corner bl" style={{ borderBottom: `1.5px solid ${a.var}`, borderLeft: `1.5px solid ${a.var}` }}></div>
                  <div className="corner br" style={{ borderBottom: `1.5px solid ${a.var}`, borderRight: `1.5px solid ${a.var}` }}></div>

                  <div className="t-visual">
                    {t.image ? (
                      <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg,#0a0512,#150a24,#0a0512)' }}>
                        <span style={{ fontSize: 52, filter: `drop-shadow(0 0 14px ${a.glow})` }}>🏆</span>
                      </div>
                    )}
                  </div>

<<<<<<< HEAD
            <div className="card-body">
              <div className="live-chip chip-live"><div className="live-dot"></div> LIVE NOW</div>
              <div className="t-name" style={{ color: '#3b82f6' }}>⚽ FIFA Tournament</div>
              <div className="t-desc">The biggest FIFA championship at Fusion. Battle through group stages, knockouts, and a grand final to claim the title and prize pool.</div>
=======
                  <div className="card-body">
                    <div className="live-chip" style={{ background: a.chipBg, border: `1px solid ${a.border}`, color: a.chipText }}>
                      <div className="live-dot" style={{ background: a.var }}></div>
                      {isFull ? 'FULL' : 'LIVE NOW'}
                    </div>
                    <div className="t-name">🏆 {t.name}</div>
                    <div className="t-desc">{t.description || 'Compete against the best. Join now to secure your spot.'}</div>
>>>>>>> b4b7b421fb57afb486889334a9ad33f47e9b4071

                    <div className="stats">
                      <div className="stat">
                        <div className="stat-val" style={{ color: a.var }}>{t.clients.length}</div>
                        <div className="stat-lbl">Players Joined</div>
                      </div>
                      <div className="stat">
                        <div className="stat-val" style={{ color: 'var(--gold)' }}>{t.max}</div>
                        <div className="stat-lbl">Max Players</div>
                      </div>
                      <div className="stat">
                        <div className="stat-val" style={{ color: 'var(--pink)' }}>{spotsLeft}</div>
                        <div className="stat-lbl">Spots Left</div>
                      </div>
                    </div>

                    <div className="progress-wrap">
                      <div className="progress-lbl"><span>Registration</span><span>{t.clients.length} / {t.max}</span></div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: a.grad, boxShadow: `0 0 8px ${a.glow}` }}></div>
                      </div>
                    </div>

                    <div className="prize-row" style={{ background: a.chipBg, borderColor: a.border }}>
                      <div className="prize-icon">💵</div>
                      <div className="prize-info">
                        <div className="prize-lbl">Entry Cost</div>
                        <div className="prize-val" style={{ color: a.var }}>${t.cost}</div>
                      </div>
                    </div>

                    <button
                      className="btn-join"
                      style={{ background: a.btn, boxShadow: `0 4px 24px ${a.btnShadow},0 0 0 1px rgba(255,255,255,.08) inset` }}
                      onClick={() => navigate('/join')}
                      disabled={isFull}
                    >
                      🏆 &nbsp;{isFull ? 'FULL' : 'JOIN NOW'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
<<<<<<< HEAD

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
              <div className="t-name" style={{ color: '#3b82f6' }}>🥊 Now Combat</div>
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
=======
        )}
>>>>>>> b4b7b421fb57afb486889334a9ad33f47e9b4071
      </main>
    </>
  )
}

export default Tournaments