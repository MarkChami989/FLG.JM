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
  auth: {
    register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    verify: (data) => request('/auth/verify', { method: 'POST', body: JSON.stringify(data) }),
    resend: (data) => request('/auth/resend', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  },
  bookings: {
    list: (params) => request(`/bookings${params ? '?' + new URLSearchParams(params) : ''}`),
    create: (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id) => request(`/bookings/${id}`, { method: 'DELETE' }),
  },
  tournaments: {
    list: () => request('/tournaments'),
    join: (id, data) => request(`/tournaments/${id}/clients`, { method: 'POST', body: JSON.stringify(data) }),
  },
  resources: {
    list: (category) => request(`/resources${category ? '?category=' + category : ''}`),
    slots: (id, date) => request(`/resources/${id}/slots${date ? '?date=' + date : ''}`),
    bookSlot: (id, data) => request(`/resources/${id}/slots`, { method: 'POST', body: JSON.stringify(data) }),
  },
}
