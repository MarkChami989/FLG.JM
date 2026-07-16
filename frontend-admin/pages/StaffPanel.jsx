import { useEffect, useState } from 'react'
import { api } from './api.js'

function StaffPanel() {
  const [staff, setStaff] = useState([])

  function load() {
    api.staff.list().then(setStaff)
  }
  useEffect(load, [])

  function toggleStatus(member) {
    const status = member.status === 'active' ? 'suspended' : 'active'
    api.staff.update(member.id, { status }).then(load)
  }

  return (
    <>
      <div className="panel-head"><h2>🛡️ Staff Management</h2><button className="btn small">+ Add Staff</button></div>
      <table>
        <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Last Active</th><th>Actions</th></tr></thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td><span className={`role-pill role-${s.role}`}>{s.role.toUpperCase()}</span></td>
              <td><span className={`dot-status dot-${s.status === 'active' ? 'active' : 'suspended'}`}></span>{s.status === 'active' ? 'Active' : 'Suspended'}</td>
              <td style={{ color: 'var(--txt-dim)' }}>{s.last}</td>
              <td><button className="btn ghost small">Edit</button> <button className="btn ghost small" onClick={() => toggleStatus(s)}>{s.status === 'active' ? 'Suspend' : 'Reinstate'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default StaffPanel
