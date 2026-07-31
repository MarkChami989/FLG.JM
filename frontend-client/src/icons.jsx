export function Icon({ paths, ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" dangerouslySetInnerHTML={{ __html: paths }} {...props} />
}

export const ICONS = {
  ppIcon: `<rect x="2" y="9" width="20" height="6" rx="2"/><circle cx="7" cy="12" r="1.5" fill="currentColor"/><circle cx="17" cy="12" r="1.5" fill="currentColor"/>`,
  bilIcon: `<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="14" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="14" r="1.5" fill="currentColor"/>`,
  bfIcon: `<rect x="2" y="6" width="20" height="12" rx="2"/><line x1="12" y1="6" x2="12" y2="18"/><circle cx="7" cy="12" r="1.5" fill="currentColor"/><circle cx="17" cy="12" r="1.5" fill="currentColor"/>`,
  chatIcon: `<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>`,
  sendIcon: `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`,
  checkIcon: `<polyline points="20 6 9 17 4 12"/>`,
  plusIcon: `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
  groupIcon: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  backIcon: `<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>`,
  supportIcon: `<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3z"/><path d="M3 19a2 2 0 0 0 2 2h1v-6H3z"/>`,
  sparkleIcon: `<path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z"/>`,
  thumbUpIcon: `<path d="M7 22H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3m0 11V11m0 11 4.4 1.47a2 2 0 0 0 .63.1h6.09a2 2 0 0 0 1.98-1.7l1.07-7a2 2 0 0 0-1.98-2.3H15V5a2 2 0 0 0-2-2l-2 6.5"/>`,
  thumbDownIcon: `<path d="M17 2h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3m0-11v11m0-11-4.4-1.47a2 2 0 0 0-.63-.1H5.88a2 2 0 0 0-1.98 1.7l-1.07 7a2 2 0 0 0 1.98 2.3H9v5a2 2 0 0 0 2 2l2-6.5"/>`,
  copyIcon: `<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`,
  refreshIcon: `<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>`,
}
