import { io } from 'socket.io-client'

const SOCKET_ORIGIN = 'http://localhost:5000'

let socket = null

export function connectSocket(user) {
  if (!user) return null
  if (!socket) socket = io(SOCKET_ORIGIN, { autoConnect: false })
  if (!socket.connected) socket.connect()
  socket.emit('identify', { id: user.id, username: user.username })
  return socket
}

export function disconnectSocket() {
  socket?.disconnect()
}

export function getSocket() {
  return socket
}
