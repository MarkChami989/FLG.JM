import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../src/auth.jsx'
import { api } from './api.js'

const STATUS_LABELS = { ai: 'With AI', escalated: 'Needs Reply', closed: 'Closed' }
const LIST_POLL_MS = 5000
const THREAD_POLL_MS = 3000

function SupportInboxPanel() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    function load() { api.supportInbox.list().then(setConversations) }
    load()
    const id = setInterval(load, LIST_POLL_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!activeId) return
    function load() {
      api.supportInbox.messages(activeId).then((list) => {
        setMessages(list)
        requestAnimationFrame(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight })
      })
    }
    load()
    const id = setInterval(load, THREAD_POLL_MS)
    return () => clearInterval(id)
  }, [activeId])

  const active = conversations.find((c) => c.id === activeId)

  async function send(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || !activeId || sending) return
    setSending(true)
    setText('')
    try {
      await api.supportInbox.reply(activeId, {
        staffId: user?.id || user?.username,
        staffName: user?.name || user?.username,
        role: user?.role,
        text: trimmed,
      })
      const [list, msgs] = await Promise.all([api.supportInbox.list(), api.supportInbox.messages(activeId)])
      setConversations(list)
      setMessages(msgs)
      requestAnimationFrame(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight })
    } catch (err) {
      alert(err.message || 'Could not send reply')
    } finally {
      setSending(false)
    }
  }

  function closeConversation() {
    if (!activeId) return
    api.supportInbox.close(activeId).then((updated) => {
      setConversations((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    })
  }

  return (
    <>
      <div className="panel-head"><h2>Support Inbox</h2></div>
      <div className="support-inbox-layout">
        <div className="support-inbox-list">
          {conversations.length === 0 && (
            <div style={{ color: 'var(--txt-dim)', padding: 16, fontSize: 13 }}>No support conversations yet.</div>
          )}
          {conversations.map((c) => (
            <div key={c.id} className={`support-inbox-row${activeId === c.id ? ' active' : ''}`} onClick={() => setActiveId(c.id)}>
              <div className="support-inbox-row-top">
                <span>{c.clientUsername}</span>
                <span className={`support-status-pill status-${c.status}`}>{STATUS_LABELS[c.status] || c.status}</span>
              </div>
              <div className="support-inbox-preview">{c.lastMessage?.text || 'No messages yet'}</div>
            </div>
          ))}
        </div>

        <div className="support-inbox-thread">
          {!active ? (
            <div style={{ color: 'var(--txt-dim)', margin: 'auto' }}>Select a conversation</div>
          ) : (
            <>
              <div className="support-inbox-thread-head">
                <div>
                  <div style={{ fontWeight: 700 }}>{active.clientUsername}</div>
                  <div style={{ fontSize: 12, color: 'var(--txt-dim)' }}>{active.category || 'general'} · {STATUS_LABELS[active.status] || active.status}</div>
                </div>
                {active.status !== 'closed' && <button className="btn ghost small" onClick={closeConversation}>Close</button>}
              </div>

              <div className="support-inbox-messages" ref={listRef}>
                {messages.map((m) => {
                  const isStaff = m.fromId !== active.clientId && m.fromId !== 'ai'
                  return (
                    <div key={m.id} className={`support-inbox-bubble-row${isStaff ? ' mine' : ''}`}>
                      <div className="support-inbox-bubble">
                        {isStaff && <div className="support-inbox-sender">{m.fromUsername}</div>}
                        {m.fromId === 'ai' && <div className="support-inbox-sender ai">FLG Assistant</div>}
                        <div>{m.text}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {active.status !== 'closed' ? (
                <form className="support-inbox-input-bar" onSubmit={send}>
                  <input placeholder="Type a reply…" value={text} onChange={(e) => setText(e.target.value)} disabled={sending} />
                  <button className="btn small" type="submit" disabled={sending || !text.trim()}>Send</button>
                </form>
              ) : (
                <div className="support-inbox-closed-note">This conversation is closed.</div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default SupportInboxPanel
