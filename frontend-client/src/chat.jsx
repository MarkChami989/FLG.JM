import { createContext, useContext, useCallback, useEffect, useState } from 'react'
import { useAuth } from './auth.jsx'
import { getSocket } from './socket.js'
import { api } from '../pages/api.js'

const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const { user } = useAuth()
  const [unreadTotal, setUnreadTotal] = useState(0)
  const [pendingRequestCount, setPendingRequestCount] = useState(0)

  const refresh = useCallback(() => {
    if (!user) return
    api.chat.conversations(user.id).then((list) => {
      setUnreadTotal(list.reduce((sum, c) => sum + (c.unread || 0), 0))
    })
    api.chat.requests(user.id, 'incoming').then((list) => {
      setPendingRequestCount(list.length)
    })
  }, [user])

  useEffect(() => {
    if (!user) return
    refresh()

    const socket = getSocket()
    if (!socket) return
    const onMessage = () => refresh()
    const onRequestNew = () => refresh()
    const onRequestAccepted = () => refresh()
    const onMessageRead = () => refresh()
    socket.on('message:new', onMessage)
    socket.on('request:new', onRequestNew)
    socket.on('request:accepted', onRequestAccepted)
    socket.on('message:read', onMessageRead)
    return () => {
      socket.off('message:new', onMessage)
      socket.off('request:new', onRequestNew)
      socket.off('request:accepted', onRequestAccepted)
      socket.off('message:read', onMessageRead)
    }
  }, [user, refresh])

  return (
    <ChatContext.Provider value={{ unreadTotal: user ? unreadTotal : 0, pendingRequestCount: user ? pendingRequestCount : 0, refresh }}>
      {children}
    </ChatContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  return useContext(ChatContext)
}
