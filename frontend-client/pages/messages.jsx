import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../src/components/Header.jsx'
import { useAuth } from '../src/auth.jsx'
import { useChat } from '../src/chat.jsx'
import { getSocket } from '../src/socket.js'
import { Icon, ICONS } from '../src/icons.jsx'
import { api } from './api.js'
import './messages.css'

function timeAgo(ts) {
  if (!ts) return ''
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}d`
}

function Messages() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { refresh } = useChat()
  const [tab, setTab] = useState('chats')
  const [conversations, setConversations] = useState(null)
  const [incoming, setIncoming] = useState([])
  const [outgoing, setOutgoing] = useState([])
  const [onlineIds, setOnlineIds] = useState(() => new Set())
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [toast, setToast] = useState('')
  const [groupName, setGroupName] = useState('')
  const [groupSelected, setGroupSelected] = useState(() => new Set())

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }, [])

  const loadAll = useCallback(() => {
    if (!user) return
    api.chat.conversations(user.id).then(setConversations)
    api.chat.requests(user.id, 'incoming').then(setIncoming)
    api.chat.requests(user.id, 'outgoing').then(setOutgoing)
  }, [user])

  useEffect(loadAll, [loadAll])

  const contacts = useMemo(() => {
    if (!conversations) return []
    const map = new Map()
    conversations.filter((c) => c.type === 'direct').forEach((c) => {
      const otherId = c.participants.find((p) => p !== user.id)
      const name = c.participantNames?.[otherId] || otherId
      if (otherId) map.set(otherId, { id: otherId, username: name })
    })
    return [...map.values()]
  }, [conversations, user])

  useEffect(() => {
    const socket = getSocket()
    if (!socket || contacts.length === 0) return
    socket.emit('presence:query', { userIds: contacts.map((c) => c.id) })
  }, [contacts])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    const onSnapshot = ({ online }) => setOnlineIds(new Set(online))
    const onOnline = ({ userId }) => setOnlineIds((s) => new Set(s).add(userId))
    const onOffline = ({ userId }) => setOnlineIds((s) => { const n = new Set(s); n.delete(userId); return n })
    const onAnyChange = () => loadAll()
    socket.on('presence:snapshot', onSnapshot)
    socket.on('presence:online', onOnline)
    socket.on('presence:offline', onOffline)
    socket.on('message:new', onAnyChange)
    socket.on('request:new', onAnyChange)
    socket.on('request:accepted', onAnyChange)
    return () => {
      socket.off('presence:snapshot', onSnapshot)
      socket.off('presence:online', onOnline)
      socket.off('presence:offline', onOffline)
      socket.off('message:new', onAnyChange)
      socket.off('request:new', onAnyChange)
      socket.off('request:accepted', onAnyChange)
    }
  }, [loadAll])

  function runSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    api.clients.search(query.trim(), user.id).then(setResults)
  }

  async function sendRequest(client) {
    try {
      await api.chat.sendRequest({ fromId: user.id, fromUsername: user.username, toId: client.id, toUsername: client.username })
      showToast(`Request sent to ${client.username}`)
      setResults((r) => r.map((c) => (c.id === client.id ? { ...c, _requested: true } : c)))
    } catch (err) {
      showToast(err.message || 'Could not send request')
    }
  }

  async function respond(req, action) {
    try {
      const res = await api.chat.respondRequest(req.id, { action, userId: user.id })
      loadAll()
      refresh()
      if (action === 'accept') {
        showToast(`You and ${req.fromUsername} are now connected`)
        setTab('chats')
        if (res.conversation) getSocket()?.emit('conversation:join', { conversationId: res.conversation.id })
      } else {
        showToast('Request declined')
      }
    } catch (err) {
      showToast(err.message || 'Could not respond to request')
    }
  }

  function toggleGroupMember(id) {
    setGroupSelected((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  async function createGroup() {
    if (!groupName.trim()) return showToast('Enter a group name')
    if (groupSelected.size === 0) return showToast('Pick at least one contact')
    const members = contacts.filter((c) => groupSelected.has(c.id)).map((c) => ({ id: c.id, username: c.username }))
    try {
      const conv = await api.chat.createGroup({ ownerId: user.id, ownerUsername: user.username, name: groupName.trim(), members })
      getSocket()?.emit('conversation:join', { conversationId: conv.id })
      setGroupName('')
      setGroupSelected(new Set())
      navigate(`/messages/${conv.id}`)
    } catch (err) {
      showToast(err.message || 'Could not create group')
    }
  }

  function openConversation(id) {
    navigate(`/messages/${id}`)
  }

  const requestedIds = useMemo(() => new Set(outgoing.map((r) => r.toId)), [outgoing])
  const contactIds = useMemo(() => new Set(contacts.map((c) => c.id)), [contacts])

  return (
    <>
      <div className="bg"></div>
      <div className="orb orb1"></div><div className="orb orb2"></div><div className="orb orb3"></div>

      <Header active="messages" />

      <main>
        <div className="page-hero">
          <div className="page-tag">Connect · Chat · Compete</div>
          <div className="page-title">MESSAGES</div>
          <div className="page-line"></div>
        </div>

        <div className="msg-tabs">
          <button className={`msg-tab${tab === 'chats' ? ' active' : ''}`} onClick={() => setTab('chats')}>
            <Icon paths={ICONS.chatIcon} width="15" height="15" /> Chats
          </button>
          <button className={`msg-tab${tab === 'requests' ? ' active' : ''}`} onClick={() => setTab('requests')}>
            Requests {incoming.length > 0 && <span className="msg-tab-badge">{incoming.length}</span>}
          </button>
          <button className={`msg-tab${tab === 'newChat' ? ' active' : ''}`} onClick={() => setTab('newChat')}>
            <Icon paths={ICONS.plusIcon} width="15" height="15" /> New Chat
          </button>
          <button className={`msg-tab${tab === 'newGroup' ? ' active' : ''}`} onClick={() => setTab('newGroup')}>
            <Icon paths={ICONS.groupIcon} width="15" height="15" /> New Group
          </button>
        </div>

        {tab === 'chats' && (
          <div className="msg-list">
            {conversations === null ? (
              <div className="msg-empty">Loading chats…</div>
            ) : conversations.length === 0 ? (
              <div className="msg-empty">No chats yet — send a request to start one.</div>
            ) : (
              conversations.map((c) => {
                const otherId = c.type === 'direct' ? c.participants.find((p) => p !== user.id) : null
                const name = c.type === 'group' ? c.name : (c.participantNames?.[otherId] || otherId)
                const online = otherId && onlineIds.has(otherId)
                return (
                  <div key={c.id} className="chat-row" onClick={() => openConversation(c.id)}>
                    <div className="chat-avatar">
                      {name?.charAt(0)?.toUpperCase()}
                      {c.type === 'direct' && <span className={`presence-dot ${online ? 'online' : ''}`}></span>}
                    </div>
                    <div className="chat-row-main">
                      <div className="chat-row-top">
                        <span className="chat-row-name">{name}{c.type === 'group' && <span className="chat-row-group-tag">GROUP</span>}</span>
                        <span className="chat-row-time">{timeAgo(c.lastMessage?.createdAt)}</span>
                      </div>
                      <div className="chat-row-bottom">
                        <span className="chat-row-preview">{c.lastMessage ? c.lastMessage.text : 'No messages yet'}</span>
                        {c.unread > 0 && <span className="chat-row-unread">{c.unread}</span>}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {tab === 'requests' && (
          <div className="msg-list">
            <div className="req-section-label">Incoming</div>
            {incoming.length === 0 ? (
              <div className="msg-empty">No incoming requests.</div>
            ) : incoming.map((r) => (
              <div key={r.id} className="req-row">
                <div className="chat-avatar">{r.fromUsername.charAt(0).toUpperCase()}</div>
                <div className="chat-row-main">
                  <span className="chat-row-name">{r.fromUsername}</span>
                  <span className="chat-row-preview">wants to connect</span>
                </div>
                <div className="req-actions">
                  <button className="req-btn req-accept" onClick={() => respond(r, 'accept')}>Accept</button>
                  <button className="req-btn req-decline" onClick={() => respond(r, 'decline')}>Decline</button>
                </div>
              </div>
            ))}

            <div className="req-section-label" style={{ marginTop: 20 }}>Outgoing</div>
            {outgoing.length === 0 ? (
              <div className="msg-empty">No pending outgoing requests.</div>
            ) : outgoing.map((r) => (
              <div key={r.id} className="req-row">
                <div className="chat-avatar">{r.toUsername.charAt(0).toUpperCase()}</div>
                <div className="chat-row-main">
                  <span className="chat-row-name">{r.toUsername}</span>
                  <span className="chat-row-preview">Pending…</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'newChat' && (
          <div className="msg-list">
            <form className="msg-search" onSubmit={runSearch}>
              <input type="text" placeholder="Search by username…" value={query} onChange={(e) => setQuery(e.target.value)} />
              <button type="submit">Search</button>
            </form>
            {results === null ? (
              <div className="msg-empty">Search for a username to start a chat.</div>
            ) : results.length === 0 ? (
              <div className="msg-empty">No clients found.</div>
            ) : results.map((c) => {
              const isContact = contactIds.has(c.id)
              const isRequested = requestedIds.has(c.id) || c._requested
              return (
                <div key={c.id} className="req-row">
                  <div className="chat-avatar">{c.username.charAt(0).toUpperCase()}</div>
                  <div className="chat-row-main">
                    <span className="chat-row-name">{c.username}</span>
                  </div>
                  <div className="req-actions">
                    {isContact ? (
                      <button className="req-btn req-accept" onClick={() => {
                        const conv = conversations.find((cv) => cv.type === 'direct' && cv.participants.includes(c.id))
                        if (conv) openConversation(conv.id)
                      }}>Open Chat</button>
                    ) : isRequested ? (
                      <span className="req-pending-lbl">Pending</span>
                    ) : (
                      <button className="req-btn req-accept" onClick={() => sendRequest(c)}>Send Request</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'newGroup' && (
          <div className="msg-list">
            {contacts.length === 0 ? (
              <div className="msg-empty">You need at least one accepted contact before creating a group.</div>
            ) : (
              <>
                <input
                  className="group-name-input"
                  type="text"
                  placeholder="Group name…"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                {contacts.map((c) => (
                  <div key={c.id} className={`req-row group-pick${groupSelected.has(c.id) ? ' picked' : ''}`} onClick={() => toggleGroupMember(c.id)}>
                    <div className="chat-avatar">{c.username.charAt(0).toUpperCase()}</div>
                    <div className="chat-row-main"><span className="chat-row-name">{c.username}</span></div>
                    {groupSelected.has(c.id) && <Icon paths={ICONS.checkIcon} width="18" height="18" stroke="#10b981" />}
                  </div>
                ))}
                <button className="group-create-btn" onClick={createGroup}>Create Group</button>
              </>
            )}
          </div>
        )}
      </main>

      <div className={`msg-toast${toast ? ' show' : ''}`}>{toast}</div>
    </>
  )
}

export default Messages
