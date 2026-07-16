import { useEffect, useState } from 'react'
import { api } from './api.js'
import { BREAKDOWN_COLORS } from './data.js'

function ReportsPanel() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    api.reports.summary().then(setSummary)
  }, [])

  if (!summary) return <p style={{ color: 'var(--txt-dim)' }}>Loading…</p>

  const { stats, chart, breakdown } = summary

  return (
    <>
      <div className="panel-head"><h2>📊 Reports &amp; Analytics</h2><button className="btn ghost small">Export CSV</button></div>
      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.lbl}>
            <div className="num">{s.num}</div>
            <div className="lbl">{s.lbl}</div>
          </div>
        ))}
      </div>
      <div className="subhead">Bookings – last 7 days</div>
      <div className="chart-wrap">
        {chart.bars.map((h, i) => (
          <div className="bar" key={chart.days[i] + i} style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }}>
            <span>{chart.days[i]}</span>
          </div>
        ))}
      </div>
      <div className="subhead" style={{ marginTop: 34 }}>Breakdown by activity</div>
      <div className="breakdown">
        {breakdown.map((b) => (
          <div className="bd-row" key={b.l}>
            <div className="bd-label">{b.l}</div>
            <div className="bd-bar-bg"><div className="bd-bar-fill" style={{ width: `${b.v * 2}%`, background: BREAKDOWN_COLORS[b.l] || 'var(--purple)' }}></div></div>
            <div className="bd-val">{b.v}%</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ReportsPanel
