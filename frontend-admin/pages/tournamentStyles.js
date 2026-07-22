export const inputStyle = {
  width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, color: '#fff', fontFamily: "'Exo 2',sans-serif", fontSize: 14, outline: 'none',
}
export const joinRowStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: 10,
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer',
  transition: 'background 0.18s', marginBottom: 8,
}
export const removeBtnStyle = {
  padding: '5px 12px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)',
  color: 'var(--red)', cursor: 'pointer', fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 700,
  letterSpacing: 1.5, textTransform: 'uppercase',
}
export function actionBtnStyle(color) {
  const map = {
    cyan: { border: 'rgba(6,182,212,0.3)', bg: 'rgba(6,182,212,0.08)', c: 'var(--cyan)' },
    gold: { border: 'rgba(245,158,11,0.3)', bg: 'rgba(245,158,11,0.08)', c: 'var(--gold)' },
    red: { border: 'rgba(239,68,68,0.3)', bg: 'rgba(239,68,68,0.08)', c: 'var(--red)' },
  }[color]
  return {
    flex: 1, padding: 8, borderRadius: 8, border: `1px solid ${map.border}`, background: map.bg, color: map.c,
    cursor: 'pointer', fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
  }
}
