import { useEffect, useState } from 'react'
import { api } from './api.js'

function LoungePanel() {
  const [bars, setBars] = useState([])
  const [tables, setTables] = useState([])

  function load() {
    api.resources.list('bar').then(setBars)
    api.resources.list('lounge-table').then(setTables)
  }
  useEffect(load, [])

  function toggle(resource) {
    api.resources.update(resource.id, { status: resource.status === 'free' ? 'occ' : 'free' }).then(load)
  }

  return (
    <>
      <div className="panel-head"><h2>🥃 Lounge</h2></div>
      <div className="subhead">Bars</div>
      <div className="status-grid">
        {bars.map((b) => (
          <div className="status-card" key={b.id}>
            <h4>{b.title}</h4>
            <span className={`status-toggle ${b.status === 'free' ? 'st-free' : 'st-occ'}`} style={{ cursor: 'pointer' }} onClick={() => toggle(b)}>
              {b.status === 'free' ? 'Free' : 'Occupied'}
            </span>
          </div>
        ))}
      </div>
      <div className="subhead">Tables</div>
      <div className="status-grid">
        {tables.map((t) => (
          <div className="status-card" key={t.id}>
            <h4>{t.title}</h4>
            <span className={`status-toggle ${t.status === 'free' ? 'st-free' : 'st-occ'}`} style={{ cursor: 'pointer' }} onClick={() => toggle(t)}>
              {t.status === 'free' ? 'Free' : 'Occupied'}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

export default LoungePanel
