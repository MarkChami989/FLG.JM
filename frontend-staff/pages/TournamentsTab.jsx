import { useRef, useState } from 'react'
import BackBtn from './BackBtn.jsx'
import TCard from './TCard.jsx'
import GiftModal from './GiftModal.jsx'
import { Icon, ICONS } from './icons.jsx'
import { inputStyle, joinRowStyle, removeBtnStyle, actionBtnStyle } from './tournamentStyles.js'
import { api } from './api.js'

function TournamentsTab({ tDB, reload, onClose }) {
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
    api.tournaments.create({ name, max, cost }).then(() => {
      reload()
      setAddFeedback({ text: '✓ Tournament Created!', bad: false })
      setTimeout(() => { setAddFeedback(null); setScreen('main') }, 1400)
    })
  }

  function removeClient(tid, uid) {
    api.tournaments.removeClient(tid, uid).then(reload)
  }

  function tAction(tid, action) {
    if (action === 'delete') api.tournaments.remove(tid).then(reload)
    else if (action === 'archive') alert('Tournament ' + tid + ' archived.')
    else if (action === 'end') alert('Tournament ' + tid + ' marked as ended.')
  }

  function updateRank(tid, uid, val) {
    const newRank = parseInt(val) || 1
    api.tournaments.updateClient(tid, uid, { rank: newRank }).then(reload)
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
                <button onClick={() => removeClient(t.id, c.uid)} style={removeBtnStyle}>Remove</button>
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

export default TournamentsTab
