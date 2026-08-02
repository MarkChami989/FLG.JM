import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../src/components/Header.jsx'
import { useAuth } from '../src/auth.jsx'
import { useChat } from '../src/chat.jsx'
import { getSocket } from '../src/socket.js'
import { Icon, ICONS } from '../src/icons.jsx'
import { api } from './api.js'
import './chat-thread.css'

const TYPING_STOP_DELAY = 2000

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function ChatThread() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refresh } = useChat()
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState(null)
  const [text, setText] = useState('')
  const [otherTyping, setOtherTyping] = useState(false)
  const [online, setOnline] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const listRef = useRef(null)
  const typingTimerRef = useRef(null)
  const isTypingRef = useRef(false)

  useEffect(() => {
    api.chat.conversations(user.id).then((list) => {
      setConversation(list.find((c) => c.id === id) || null)
    })
  }, [id, user])

  useEffect(() => {
    let ignore = false
    api.chat.messages(id, user.id).then((list) => {
      if (ignore) return
      setMessages(list)
      setHasMore(list.length >= 30)
      requestAnimationFrame(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
      })
    })
    api.chat.markRead(id, user.id).then(refresh)

    const socket = getSocket()
    socket?.emit('conversation:join', { conversationId: id })

    return () => { ignore = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const onMessage = (msg) => {
      if (msg.conversationId !== id) return
      setMessages((prev) => {
        if (!prev) return prev
        if (prev.some((m) => m.id === msg.id)) return prev
        return [...prev, msg]
      })
      if (msg.fromId !== user.id) {
        api.chat.markRead(id, user.id).then(refresh)
      }
      requestAnimationFrame(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
      })
    }
    const onTyping = ({ conversationId, userId, typing }) => {
      if (conversationId !== id || userId === user.id) return
      setOtherTyping(typing)
    }
    const onRead = ({ conversationId, userId }) => {
      if (conversationId !== id) return
      setMessages((prev) => (prev ? prev.map((m) => (m.readBy.includes(userId) ? m : { ...m, readBy: [...m.readBy, userId] })) : prev))
    }
    const onOnline = ({ userId }) => {
      if (conversation?.type === 'direct' && conversation.participants.includes(userId)) setOnline(true)
    }
    const onOffline = ({ userId }) => {
      if (conversation?.type === 'direct' && conversation.participants.includes(userId)) setOnline(false)
    }
    const onSnapshot = ({ online: ids }) => {
      const otherId = conversation?.participants.find((p) => p !== user.id)
      if (otherId && ids.includes(otherId)) setOnline(true)
    }

    socket.on('message:new', onMessage)
    socket.on('typing:update', onTyping)
    socket.on('message:read', onRead)
    socket.on('presence:online', onOnline)
    socket.on('presence:offline', onOffline)
    socket.on('presence:snapshot', onSnapshot)

    if (conversation?.type === 'direct') {
      const otherId = conversation.participants.find((p) => p !== user.id)
      if (otherId) socket.emit('presence:query', { userIds: [otherId] })
    }

    return () => {
      socket.off('message:new', onMessage)
      socket.off('typing:update', onTyping)
      socket.off('message:read', onRead)
      socket.off('presence:online', onOnline)
      socket.off('presence:offline', onOffline)
      socket.off('presence:snapshot', onSnapshot)
    }
  }, [id, user, conversation, refresh])

  const loadOlder = useCallback(() => {
    if (!messages || messages.length === 0 || !hasMore) return
    const oldest = messages[0]
    const el = listRef.current
    const prevHeight = el?.scrollHeight || 0
    api.chat.messages(id, user.id, oldest.id).then((older) => {
      if (older.length === 0) { setHasMore(false); return }
      setMessages((prev) => [...older, ...prev])
      setHasMore(older.length >= 30)
      requestAnimationFrame(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight - prevHeight
      })
    })
  }, [messages, hasMore, id, user])

  function onScroll(e) {
    if (e.target.scrollTop < 60) loadOlder()
  }

  function handleTyping() {
    const socket = getSocket()
    if (!socket) return
    if (!isTypingRef.current) {
      isTypingRef.current = true
      socket.emit('typing:start', { conversationId: id })
    }
    clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false
      socket.emit('typing:stop', { conversationId: id })
    }, TYPING_STOP_DELAY)
  }

  async function send(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setText('')
    clearTimeout(typingTimerRef.current)
    if (isTypingRef.current) {
      isTypingRef.current = false
      getSocket()?.emit('typing:stop', { conversationId: id })
    }
    try {
      const msg = await api.chat.sendMessage(id, { fromId: user.id, fromUsername: user.username, text: trimmed })
      setMessages((prev) => (prev?.some((m) => m.id === msg.id) ? prev : [...(prev || []), msg]))
      requestAnimationFrame(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
      })
    } catch (err) {
      setText(trimmed)
      alert(err.message || 'Could not send message')
    }
  }

  const title = useMemo(() => {
    if (!conversation) return ''
    if (conversation.type === 'group') return conversation.name
    const otherId = conversation.participants.find((p) => p !== user.id)
    return conversation.participantNames?.[otherId] || otherId
  }, [conversation, user])

  const avatarPicture = useMemo(() => {
    if (!conversation || conversation.type === 'group') return null
    const otherId = conversation.participants.find((p) => p !== user.id)
    return conversation.participantPictures?.[otherId] || null
  }, [conversation, user])

  const subtitle = useMemo(() => {
    if (!conversation) return ''
    if (conversation.type === 'group') return `${conversation.participants.length} members`
    if (otherTyping) return 'typing…'
    return online ? 'Online' : 'Offline'
  }, [conversation, online, otherTyping])

  return (
    <>
      <div className="bg"></div>
      <div className="orb orb1"></div><div className="orb orb2"></div>

      <Header active="messages" />

      <main className="thread-main">
        <div className="thread-card">
          <div className="corner tl"></div><div className="corner tr"></div>
          <div className="corner bl"></div><div className="corner br"></div>

          <div className="thread-header">
            <button className="thread-back" onClick={() => navigate('/messages')}>
              <Icon paths={ICONS.backIcon} width="18" height="18" />
            </button>
            <div className="thread-avatar">{avatarPicture ? <img src={avatarPicture} alt="" /> : title?.charAt(0)?.toUpperCase()}</div>
            <div className="thread-title-wrap">
              <div className="thread-title">{title || '…'}</div>
              <div className={`thread-subtitle${otherTyping ? ' typing' : ''}`}>{subtitle}</div>
            </div>
          </div>

          <div className="thread-messages" ref={listRef} onScroll={onScroll}>
            {messages === null ? (
              <div className="thread-empty">Loading messages…</div>
            ) : messages.length === 0 ? (
              <div className="thread-empty">No messages yet — say hi!</div>
            ) : (
              messages.map((m) => {
                const mine = m.fromId === user.id
                const read = conversation && conversation.participants.filter((p) => p !== m.fromId).every((p) => m.readBy.includes(p))
                return (
                  <div key={m.id} className={`bubble-row${mine ? ' mine' : ''}`}>
                    <div className="bubble">
                      {!mine && conversation?.type === 'group' && <div className="bubble-sender">{m.fromUsername}</div>}
                      <div className="bubble-text">{m.text}</div>
                      <div className="bubble-meta">
                        {formatTime(m.createdAt)}
                        {mine && <span className={`bubble-tick${read ? ' read' : ''}`}>✓✓</span>}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <form className="thread-input-bar" onSubmit={send}>
            <input
              type="text"
              placeholder="Type a message…"
              value={text}
              onChange={(e) => { setText(e.target.value); handleTyping() }}
            />
            <button type="submit" className="thread-send-btn">
              <Icon paths={ICONS.sendIcon} width="17" height="17" />
            </button>
          </form>
        </div>
      </main>
    </>
  )
}

export default ChatThread
