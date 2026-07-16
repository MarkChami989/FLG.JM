import BackBtn from './BackBtn.jsx'
import { Icon, TAB_ICON_MAP } from './icons.jsx'

function GenericTab({ id, title, color, onClose }) {
  return (
    <div className="tab-page">
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%,${color}18,transparent 60%)`, pointerEvents: 'none', borderRadius: 16 }}></div>
      <div style={{ width: 64, height: 64, borderRadius: 16, background: `${color}18`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, boxShadow: `0 0 30px ${color}30` }}>
        <Icon paths={TAB_ICON_MAP[id] || ''} width="28" height="28" stroke={color} strokeWidth="1.6" />
      </div>
      <div className="tab-page-title" style={{ color }}>{title}</div>
      <div className="tab-page-sub">Page content coming soon</div>
      <BackBtn onClick={onClose} />
    </div>
  )
}

export default GenericTab
