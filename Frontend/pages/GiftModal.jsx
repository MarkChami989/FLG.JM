import { useState } from 'react'

function GiftModal({ user, onClose, onSend }) {
  const [msg, setMsg] = useState('')
  const [errored, setErrored] = useState(false)

  function send() {
    const m = msg.trim()
    if (!m) { setErrored(true); setTimeout(() => setErrored(false), 1000); return }
    onSend(m)
  }

  return (
    <div className={`gift-modal${user ? ' show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      {user && (
        <div className="gift-modal-box">
          <div className="gift-modal-title">🎁 Send Message</div>
          <div className="gift-modal-sub">To: {user}</div>
          <textarea
            className="gift-textarea"
            placeholder="e.g. Amazing performance! You crushed it. Here's your reward 🏆"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            style={errored ? { borderColor: 'var(--red)' } : undefined}
            autoFocus
          ></textarea>
          <div className="gift-modal-actions">
            <button className="gift-cancel-btn" onClick={onClose}>Cancel</button>
            <button className="gift-send-btn" onClick={send}>Send →</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GiftModal
