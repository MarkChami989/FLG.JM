import { REPORT_BARS, REPORT_DAYS, REPORT_BREAKDOWN, REPORT_STATS } from './data.js'

function ReportsPanel() {
  return (
    <>
      <div className="panel-head"><h2>📊 Reports &amp; Analytics</h2><button className="btn ghost small">Export CSV</button></div>
      <div className="stat-grid">
        {REPORT_STATS.map((s) => (
          <div className="stat-card" key={s.lbl}>
            <div className="num">{s.num}</div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>
      <div className="subhead">Bookings – last 7 days</div>
      <div className="chart-wrap">
        {REPORT_BARS.map((h, i) => (
          <div className="bar" key={REPORT_DAYS[i]} style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }}>
            <span>{REPORT_DAYS[i]}</span>
          </div>
        ))}
      </div>
      <div className="subhead" style={{ marginTop: 34 }}>Breakdown by activity</div>
      <div className="breakdown">
        {REPORT_BREAKDOWN.map((b) => (
          <div className="bd-row" key={b.l}>
            <div className="bd-label">{b.l}</div>
            <div className="bd-bar-bg"><div className="bd-bar-fill" style={{ width: `${b.v * 2}%`, background: b.clr }}></div></div>
            <div className="bd-val">{b.v}%</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ReportsPanel
