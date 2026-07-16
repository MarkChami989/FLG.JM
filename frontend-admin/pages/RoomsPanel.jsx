import { useEffect, useState } from 'react'
import { api } from './api.js'

function RoomsPanel() {
  const [rooms, setRooms] = useState([])

  function load() {
    api.resources.list('room').then(setRooms)
  }
  useEffect(load, [])

  function toggle(room) {
    api.resources.update(room.id, { status: room.status === 'free' ? 'occ' : 'free' }).then(load)
  }

  return (
    <>
      <div className="panel-head"><h2>🖥️ Rooms</h2></div>
      <div className="status-grid">
        {rooms.map((r) => (
          <div className="status-card" key={r.id}>
            <h4>{r.title}</h4>
            <span className={`status-toggle ${r.status === 'free' ? 'st-free' : 'st-occ'}`} style={{ cursor: 'pointer' }} onClick={() => toggle(r)}>
              {r.status === 'free' ? 'Free' : 'Occupied'}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

export default RoomsPanel
