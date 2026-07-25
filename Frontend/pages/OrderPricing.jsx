import { useEffect, useState } from 'react'
import BackBtn from './BackBtn.jsx'
import { api } from './api.js'

const GROUPS = [
  { id: 'bar', title: 'Bar Orders' },
  { id: 'table', title: 'Table Orders' },
]

function OrderPricing({ onBack }) {
  const [rates, setRates] = useState({})
  const [group, setGroup] = useState(GROUPS[0].id)
  const [low, setLow] = useState('')
  const [med, setMed] = useState('')
  const [high, setHigh] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  function loadRates() {
    api.orderRates.list().then((list) => {
      const map = {}
      list.forEach((r) => { map[r.group] = r })
      setRates(map)
    })
  }
  useEffect(loadRates, [])

  useEffect(() => {
    const r = rates[group]
    setLow(r ? String(r.low) : '')
    setMed(r ? String(r.med) : '')
    setHigh(r ? String(r.high) : '')
    setMsg('')
  }, [group, rates])

  async function handleSave() {
    const values = { low: Number(low), med: Number(med), high: Number(high) }
    for (const v of Object.values(values)) {
      if (Number.isNaN(v) || v < 0) {
        setMsg('Enter valid prices (0 or more) for all three tiers.')
        return
      }
    }
    setSaving(true)
    setMsg('')
    try {
      await api.orderRates.set(group, values)
      setRates((prev) => ({ ...prev, [group]: { group, ...values } }))
      setMsg('Saved!')
    } catch (err) {
      setMsg(err.message || 'Could not save prices')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--gold)' }}>Amount</div>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginTop: 2 }}>Fixed Order Prices — Low / Medium / High</div>
        </div>
        <BackBtn onClick={onBack} style={{ marginTop: 0 }} />
      </div>

      <div style={{ maxWidth: 380 }}>
        <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Order Group</label>
        <select className="r-modal-input" value={group} onChange={(e) => setGroup(e.target.value)} style={{ marginBottom: 16 }}>
          {GROUPS.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
        </select>

        <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Low Order ($)</label>
        <input className="r-modal-input" type="number" min="0" step="1" placeholder="e.g. 80" value={low} onChange={(e) => setLow(e.target.value)} style={{ marginBottom: 14 }} />

        <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Medium Order ($)</label>
        <input className="r-modal-input" type="number" min="0" step="1" placeholder="e.g. 160" value={med} onChange={(e) => setMed(e.target.value)} style={{ marginBottom: 14 }} />

        <label style={{ display: 'block', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>High Order ($)</label>
        <input className="r-modal-input" type="number" min="0" step="1" placeholder="e.g. 300" value={high} onChange={(e) => setHigh(e.target.value)} style={{ marginBottom: 16 }} />

        {msg && <div style={{ fontSize: 12.5, color: msg === 'Saved!' ? '#4ade80' : '#f87171', marginBottom: 12 }}>{msg}</div>}

        <button className="gift-send-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Prices'}</button>
      </div>

      <div style={{ marginTop: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>Current Prices</div>
        {GROUPS.map((g) => (
          <div key={g.id} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, marginBottom: 6 }}>
            <div style={{ marginBottom: 6 }}>{g.title}</div>
            <div style={{ display: 'flex', gap: 16, color: rates[g.id] ? 'var(--gold)' : 'rgba(255,255,255,0.25)', fontWeight: 600, fontSize: 13 }}>
              <span>Low: {rates[g.id] ? `$${rates[g.id].low}` : '—'}</span>
              <span>Med: {rates[g.id] ? `$${rates[g.id].med}` : '—'}</span>
              <span>High: {rates[g.id] ? `$${rates[g.id].high}` : '—'}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default OrderPricing
