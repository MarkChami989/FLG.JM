import { ROOMS } from './data.js'

function RoomsPanel() {
  return (
    <>
      <div className="panel-head"><h2>🖥️ Rooms</h2></div>
      <div className="status-grid">
        {ROOMS.map((r) => (
          <div className="status-card" key={r.n}>
            <h4>{r.n}</h4>
            <span className={`status-toggle ${r.s === 'free' ? 'st-free' : 'st-occ'}`}>{r.s === 'free' ? 'Free' : 'Occupied'}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default RoomsPanel
