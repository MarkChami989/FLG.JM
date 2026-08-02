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
  roomRates: {
    list: () => request('/room-rates'),
    set: (category, data) => request(`/room-rates/${category}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  orderRates: {
    list: () => request('/order-rates'),
    set: (group, data) => request(`/order-rates/${group}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  staff: {
    list: () => request('/staff'),
    get: (id) => request(`/staff/${id}`),
    create: (data) => request('/staff', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/staff/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id) => request(`/staff/${id}`, { method: 'DELETE' }),
  },
  reports: {
    summary: () => request('/reports/summary'),
  },
  adminAuth: {
    login: (data) => request('/admin-auth/login', { method: 'POST', body: JSON.stringify(data) }),
    verify: (data) => request('/admin-auth/verify', { method: 'POST', body: JSON.stringify(data) }),
    resend: () => request('/admin-auth/resend', { method: 'POST', body: JSON.stringify({}) }),
    sendPasswordCode: (data) => request('/admin-auth/settings/password/send-code', { method: 'POST', body: JSON.stringify(data) }),
    changePassword: (data) => request('/admin-auth/settings/password/change', { method: 'POST', body: JSON.stringify(data) }),
    sendProfileCode: () => request('/admin-auth/settings/profile/send-code', { method: 'POST', body: JSON.stringify({}) }),
    updateProfile: (data) => request('/admin-auth/settings/profile/update', { method: 'POST', body: JSON.stringify(data) }),
    updateProfilePicture: (data) => request('/admin-auth/settings/profile-picture', { method: 'POST', body: JSON.stringify(data) }),
  },
  staffAuth: {
    login: (data) => request('/staff-auth/login', { method: 'POST', body: JSON.stringify(data) }),
    verify: (data) => request('/staff-auth/verify', { method: 'POST', body: JSON.stringify(data) }),
    resend: (data) => request('/staff-auth/resend', { method: 'POST', body: JSON.stringify(data) }),
    sendPasswordCode: (data) => request('/staff-auth/settings/password/send-code', { method: 'POST', body: JSON.stringify(data) }),
    changePassword: (data) => request('/staff-auth/settings/password/change', { method: 'POST', body: JSON.stringify(data) }),
    updateProfilePicture: (data) => request('/staff-auth/settings/profile-picture', { method: 'POST', body: JSON.stringify(data) }),
  },
  supportInbox: {
    list: (status) => request(`/support-inbox/conversations${status ? '?status=' + status : ''}`),
    messages: (id) => request(`/support-inbox/conversations/${id}/messages`),
    reply: (id, data) => request(`/support-inbox/conversations/${id}/reply`, { method: 'POST', body: JSON.stringify(data) }),
    close: (id) => request(`/support-inbox/conversations/${id}/close`, { method: 'POST' }),
  },
}
