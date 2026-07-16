import { Icon, ICONS } from './icons.jsx'

function BackBtn({ onClick, style }) {
  return (
    <button className="back-btn" onClick={onClick} style={style}>
      <Icon paths={ICONS.backIcon} width="14" height="14" strokeWidth="2" />
      Back
    </button>
  )
}

export default BackBtn
