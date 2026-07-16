const API_BASE = 'http://localhost:5000/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  bookings: {
    list: (params) => request(`/bookings${params ? '?' + new URLSearchParams(params) : ''}`),
    create: (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id) => request(`/bookings/${id}`, { method: 'DELETE' }),
  },
  tournaments: {
    list: () => request('/tournaments'),
    create: (data) => request('/tournaments', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/tournaments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id) => request(`/tournaments/${id}`, { method: 'DELETE' }),
    join: (id, data) => request(`/tournaments/${id}/clients`, { method: 'POST', body: JSON.stringify(data) }),
    removeClient: (id, uid) => request(`/tournaments/${id}/clients/${uid}`, { method: 'DELETE' }),
    updateClient: (id, uid, data) => request(`/tournaments/${id}/clients/${uid}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  resources: {
    list: (category) => request(`/resources${category ? '?category=' + category : ''}`),
    update: (id, data) => request(`/resources/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    slots: (id, date) => request(`/resources/${id}/slots${date ? '?date=' + date : ''}`),
    bookSlot: (id, data) => request(`/resources/${id}/slots`, { method: 'POST', body: JSON.stringify(data) }),
    updateSlot: (id, slotId, data) => request(`/resources/${id}/slots/${slotId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteSlot: (id, slotId) => request(`/resources/${id}/slots/${slotId}`, { method: 'DELETE' }),
  },
  staff: {
    list: () => request('/staff'),
    create: (data) => request('/staff', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/staff/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id) => request(`/staff/${id}`, { method: 'DELETE' }),
  },
  reports: {
    summary: () => request('/reports/summary'),
  },
}
