import { TOURNAMENT_ACTIONS } from './data.js'

function TournamentsPanel() {
  return (
    <>
      <div className="panel-head"><h2>🏆 Tournaments</h2><button className="btn small">+ New Tournament</button></div>
      <div className="action-grid">
        {TOURNAMENT_ACTIONS.map((c) => (
          <div className="action-card" key={c.t}>
            <div className="ic">{c.ic}</div>
            <h4>{c.t}</h4>
            <p>{c.d}</p>
            <button className="btn ghost small">Open</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default TournamentsPanel
