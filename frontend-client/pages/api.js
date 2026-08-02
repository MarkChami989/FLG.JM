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
    faceEnroll: (data) => request('/auth/face/enroll', { method: 'POST', body: JSON.stringify(data) }),
    faceLogin: (data) => request('/auth/face/login', { method: 'POST', body: JSON.stringify(data) }),
    forgot: (data) => request('/auth/forgot', { method: 'POST', body: JSON.stringify(data) }),
    forgotVerify: (data) => request('/auth/forgot/verify', { method: 'POST', body: JSON.stringify(data) }),
    forgotReset: (data) => request('/auth/forgot/reset', { method: 'POST', body: JSON.stringify(data) }),
    sendPasswordCode: (data) => request('/auth/settings/password/send-code', { method: 'POST', body: JSON.stringify(data) }),
    changePassword: (data) => request('/auth/settings/password/change', { method: 'POST', body: JSON.stringify(data) }),
    updateProfilePicture: (data) => request('/auth/settings/profile-picture', { method: 'POST', body: JSON.stringify(data) }),
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
  clients: {
    search: (q, excludeId) => request(`/clients?search=${encodeURIComponent(q)}&excludeId=${encodeURIComponent(excludeId || '')}`),
  },
  chat: {
    requests: (userId, direction) => request(`/chat/requests?userId=${userId}${direction ? '&direction=' + direction : ''}`),
    sendRequest: (data) => request('/chat/requests', { method: 'POST', body: JSON.stringify(data) }),
    respondRequest: (id, data) => request(`/chat/requests/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    conversations: (userId) => request(`/chat/conversations?userId=${userId}`),
    createGroup: (data) => request('/chat/conversations/group', { method: 'POST', body: JSON.stringify(data) }),
    messages: (convId, userId, before) => request(`/chat/conversations/${convId}/messages?userId=${userId}${before ? '&before=' + before : ''}`),
    sendMessage: (convId, data) => request(`/chat/conversations/${convId}/messages`, { method: 'POST', body: JSON.stringify(data) }),
    markRead: (convId, userId) => request(`/chat/conversations/${convId}/read`, { method: 'POST', body: JSON.stringify({ userId }) }),
  },
  resources: {
    list: (category) => request(`/resources${category ? '?category=' + category : ''}`),
    slots: (id, date) => request(`/resources/${id}/slots${date ? '?date=' + date : ''}`),
    bookSlot: (id, data) => request(`/resources/${id}/slots`, { method: 'POST', body: JSON.stringify(data) }),
  },
  roomRates: {
    list: () => request('/room-rates'),
  },
  orderRates: {
    list: () => request('/order-rates'),
  },
  aiSupport: {
    start: (data) => request('/ai-support/start', { method: 'POST', body: JSON.stringify(data) }),
    chat: (data) => request('/ai-support/chat', { method: 'POST', body: JSON.stringify(data) }),
    confirmBooking: (data) => request('/ai-support/confirm-booking', { method: 'POST', body: JSON.stringify(data) }),
  },
}
