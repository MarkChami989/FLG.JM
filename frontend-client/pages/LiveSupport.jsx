import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../src/components/Header.jsx'
import { useAuth } from '../src/auth.jsx'
import { Icon, ICONS } from '../src/icons.jsx'
import { api } from './api.js'
import './LiveSupport.css'

const CATEGORIES = [
  { id: 'booking', label: 'Booking' },
  { id: 'it-support', label: 'IT Support' },
  { id: 'login', label: 'Login' },
  { id: 'other', label: 'Other' },
]

let uid = 0
function nextId() { return ++uid }

function formatHour(h) {
  const n = parseInt(h, 10)
  const ampm = n < 12 ? 'AM' : 'PM'
  const h12 = n % 12 === 0 ? 12 : n % 12
  return `${h12}:00 ${ampm}`
}

function formatHours(hours) {
  const sorted = [...hours].map(Number).sort((a, b) => a - b)
  const isContiguous = sorted.length > 1 && sorted.every((h, i) => i === 0 || h === sorted[i - 1] + 1)
  if (isContiguous) return `${formatHour(sorted[0])} – ${formatHour(sorted[sorted.length - 1] + 1)}`
  return sorted.map((h) => formatHour(h)).join(', ')
}

function LiveSupport() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [messages, setMessages] = useState(() => [
    { id: nextId(), role: 'ai', text: `Hey ${user?.username || 'there'}! I'm the FLG assistant. What can I help you with today?` },
  ])
  const [category, setCategory] = useState(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState({})
  const [proposal, setProposal] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, sending])

  async function askAI(history, cat) {
    setSending(true)
    try {
      const { reply, bookingProposal } = await api.aiSupport.chat({
        messages: history.map(({ role, text }) => ({ role, text })),
        category: cat,
      })
      setMessages((prev) => [...prev, { id: nextId(), role: 'ai', text: reply }])
      setProposal(bookingProposal || null)
    } catch (err) {
      setMessages((prev) => [...prev, { id: nextId(), role: 'ai', text: err.message || 'Something went wrong — please try again.' }])
    } finally {
      setSending(false)
    }
  }

  async function confirmBooking() {
    if (!proposal || confirming) return
    setConfirming(true)
    try {
      const booking = await api.aiSupport.confirmBooking({
        category: proposal.category,
        resourceId: proposal.resourceId,
        activityLabel: proposal.activityLabel,
        date: proposal.date,
        hours: proposal.hours,
        pay: proposal.pay,
        clientUsername: user?.username,
      })
      setProposal(null)
      setMessages((prev) => [...prev, { id: nextId(), role: 'ai', text: `Booking confirmed! Reference ${booking.id} — it's pending staff approval. See you then!` }])
    } catch (err) {
      setProposal(null)
      setMessages((prev) => [...prev, { id: nextId(), role: 'ai', text: err.message || 'Could not confirm that booking — please try again.' }])
    } finally {
      setConfirming(false)
    }
  }

  function cancelProposal() {
    setProposal(null)
  }

  function pickCategory(cat) {
    if (sending) return
    setCategory(cat.id)
    const next = [...messages, { id: nextId(), role: 'user', text: cat.label }]
    setMessages(next)
    askAI(next, cat.id)
  }

  function send(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || sending) return
    setInput('')
    const next = [...messages, { id: nextId(), role: 'user', text: trimmed }]
    setMessages(next)
    askAI(next, category)
  }

  function regenerate() {
    if (sending) return
    const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === 'user')
    if (lastUserIdx === -1) return
    const cutIndex = messages.length - 1 - lastUserIdx
    const history = messages.slice(0, cutIndex + 1)
    setMessages(history)
    askAI(history, category)
  }

  function copyText(text) {
    navigator.clipboard?.writeText(text)
  }

  function toggleFeedback(id, dir) {
    setFeedback((prev) => ({ ...prev, [id]: prev[id] === dir ? null : dir }))
  }

  return (
    <>
      <div className="bg"></div>
      <div className="orb orb1"></div><div className="orb orb2"></div>

      <Header active="messages" />

      <main className="support-main">
        <div className="support-card">
          <div className="corner tl"></div><div className="corner tr"></div>
          <div className="corner bl"></div><div className="corner br"></div>

          <div className="support-header">
            <button className="support-back" onClick={() => navigate('/messages')}>
              <Icon paths={ICONS.backIcon} width="18" height="18" />
            </button>
            <div className="support-brand-icon"><Icon paths={ICONS.sparkleIcon} width="20" height="20" fill="currentColor" /></div>
            <div className="support-title-wrap">
              <div className="support-title">FLG Assistant</div>
              <div className="support-subtitle">AI · Live Support</div>
            </div>
          </div>

          <div className="support-messages" ref={listRef}>
            {messages.map((m, i) => (
              <div key={m.id} className={`support-row${m.role === 'user' ? ' mine' : ''}`}>
                <div className="support-bubble">
                  <div className="support-bubble-text">{m.text}</div>
                  {m.role === 'ai' && (
                    <div className="support-bubble-actions">
                      <button
                        className={`sa-btn${feedback[m.id] === 'up' ? ' active' : ''}`}
                        onClick={() => toggleFeedback(m.id, 'up')}
                        aria-label="Good response"
                      >
                        <Icon paths={ICONS.thumbUpIcon} width="14" height="14" />
                      </button>
                      <button
                        className={`sa-btn${feedback[m.id] === 'down' ? ' active' : ''}`}
                        onClick={() => toggleFeedback(m.id, 'down')}
                        aria-label="Bad response"
                      >
                        <Icon paths={ICONS.thumbDownIcon} width="14" height="14" />
                      </button>
                      {i === messages.length - 1 && (
                        <button className="sa-btn" onClick={regenerate} aria-label="Regenerate">
                          <Icon paths={ICONS.refreshIcon} width="14" height="14" />
                        </button>
                      )}
                      <button className="sa-btn" onClick={() => copyText(m.text)} aria-label="Copy">
                        <Icon paths={ICONS.copyIcon} width="14" height="14" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="support-row">
                <div className="support-bubble support-typing"><span></span><span></span><span></span></div>
              </div>
            )}
          </div>

          {proposal && (
            <div className="booking-proposal">
              <div className="bp-header">
                <Icon paths={ICONS.checkIcon} width="16" height="16" />
                <span>Booking Summary</span>
              </div>
              <div className="bp-row"><span>Where</span><span>{proposal.resourceLabel}</span></div>
              <div className="bp-row"><span>Date</span><span>{proposal.date}</span></div>
              <div className="bp-row"><span>Time</span><span>{formatHours(proposal.hours)}</span></div>
              {proposal.partySize ? <div className="bp-row"><span>Party</span><span>{proposal.partySize}</span></div> : null}
              {proposal.pay > 0 ? <div className="bp-row"><span>Est. Price</span><span>${proposal.pay}</span></div> : null}
              {proposal.notes ? <div className="bp-row"><span>Notes</span><span>{proposal.notes}</span></div> : null}
              <div className="bp-actions">
                <button type="button" className="bp-cancel" onClick={cancelProposal} disabled={confirming}>Cancel</button>
                <button type="button" className="bp-confirm" onClick={confirmBooking} disabled={confirming}>{confirming ? 'Booking…' : 'Confirm Booking'}</button>
              </div>
            </div>
          )}

          <div className="support-categories">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`support-chip${category === c.id ? ' active' : ''}`}
                onClick={() => pickCategory(c)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <form className="support-input-bar" onSubmit={send}>
            <input
              type="text"
              placeholder="Ask FLG Support…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
            />
            <button type="submit" className="support-send-btn" disabled={sending || !input.trim()}>
              <Icon paths={ICONS.sendIcon} width="17" height="17" />
            </button>
          </form>
        </div>
      </main>
    </>
  )
}

export default LiveSupport
