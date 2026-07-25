import { useEffect, useState } from 'react'
import BackBtn from './BackBtn.jsx'
import { api } from './api.js'

function HourlyPricing({ heading, subheading, items, onBack }) {
  const [rates, setRates] = useState({})
  const [category, setCategory] = useState(items[0].id)
  const [priceInput, setPriceInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  function loadRates() {
    api.roomRates.list().then((list) => {
      const map = {}
      list.forEach((r) => { map[r.category] = r.pricePerHour })
      setRates(map)
    })
  }
  useEffect(loadRates, [])

  useEffect(() => {
    setPriceInput(rates[category] != null ? String(rates[category]) : '')
    setMsg('')
  }, [category, rates])

  async function handleSave() {
    const value = Number(priceInput)
    if (priceInput === '' || Number.isNaN(value) || value < 0) {
      setMsg('Enter a valid price (0 or more).')
      return
    }
    setSaving(true)
    setMsg('')
    try {
      await api.roomRates.set(category, { pricePerHour: value })
      setRates((prev) => ({ ...prev, [category]: value }))
      setMsg('Saved!')
    } catch (err) {
      setMsg(err.message || 'Could not save price')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--gold)' }}>Amount</div>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 2 }}>{subheading}</div>
        </div>
        <BackBtn onClick={onBack} style={{ marginTop: 0 }} />
      </div>

      <div style={{ maxWidth: 380 }}>
        <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{heading}</label>
        <select className="r-modal-input" value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginBottom: 16 }}>
          {items.map((it) => <option key={it.id} value={it.id}>{it.title}</option>)}
        </select>

        <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Price per Hour ($)</label>
        <input
          className="r-modal-input"
          type="number"
          min="0"
          step="0.5"
          placeholder="e.g. 5"
          value={priceInput}
          onChange={(e) => setPriceInput(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        {msg && <div style={{ fontSize: 12.5, color: msg === 'Saved!' ? '#4ade80' : '#f87171', marginBottom: 12 }}>{msg}</div>}

        <button className="gift-send-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Price'}</button>
      </div>

      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>Current Rates</div>
        {items.map((it) => (
          <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, marginBottom: 6 }}>
            <span>{it.title}</span>
            <span style={{ color: rates[it.id] != null ? 'var(--gold)' : 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
              {rates[it.id] != null ? `$${rates[it.id]} / hr` : 'Not set'}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

export default HourlyPricing
