import { STAFF } from './data.js'

function StaffPanel() {
  return (
    <>
      <div className="panel-head"><h2>🛡️ Staff Management</h2><button className="btn small">+ Add Staff</button></div>
      <table>
        <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Last Active</th><th>Actions</th></tr></thead>
        <tbody>
          {STAFF.map((s) => (
            <tr key={s.name}>
              <td>{s.name}</td>
              <td><span className={`role-pill role-${s.role}`}>{s.role.toUpperCase()}</span></td>
              <td><span className={`dot-status dot-${s.status === 'active' ? 'active' : 'suspended'}`}></span>{s.status === 'active' ? 'Active' : 'Suspended'}</td>
              <td style={{ color: 'var(--txt-dim)' }}>{s.last}</td>
              <td><button className="btn ghost small">Edit</button> <button className="btn ghost small">{s.status === 'active' ? 'Suspend' : 'Reinstate'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default StaffPanel
