import { Icon, ICONS } from './icons.jsx'

function TCard({ onClick, glow, iconBg, iconBorder, iconStroke, icon, title, style }) {
  return (
    <div className="t-card" onClick={onClick} style={{ boxShadow: `0 0 0 1px ${iconBorder},0 16px 48px rgba(0,0,0,0.4)`, cursor: onClick ? 'pointer' : 'default', ...style }}>
      <div className="t-card-glow" style={{ background: glow }}></div>
      <div className="t-card-icon" style={{ background: iconBg, border: `1px solid ${iconBorder}` }}>
        <Icon paths={icon} width="22" height="22" stroke={iconStroke} />
      </div>
      <div className="t-card-title">{title}</div>
      {onClick && <div className="t-card-arrow"><Icon paths={ICONS.arrowIcon} width="16" height="16" strokeWidth="2" /></div>}
    </div>
  )
}

export default TCard
