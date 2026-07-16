import { LOUNGE_BARS, LOUNGE_TABLES } from './data.js'

function LoungePanel() {
  return (
    <>
      <div className="panel-head"><h2>🥃 Lounge</h2></div>
      <div className="subhead">Bars</div>
      <div className="status-grid">
        {LOUNGE_BARS.map((b) => (
          <div className="status-card" key={b.n}>
            <h4>{b.n}</h4>
            <span className={`status-toggle ${b.s === 'free' ? 'st-free' : 'st-occ'}`}>{b.s === 'free' ? 'Free' : 'Occupied'}</span>
          </div>
        ))}
      </div>
      <div className="subhead">Tables</div>
      <div className="status-grid">
        {LOUNGE_TABLES.map((t) => (
          <div className="status-card" key={t.n}>
            <h4>{t.n}</h4>
            <span className={`status-toggle ${t.s === 'free' ? 'st-free' : 'st-occ'}`}>{t.s === 'free' ? 'Free' : 'Occupied'}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default LoungePanel
