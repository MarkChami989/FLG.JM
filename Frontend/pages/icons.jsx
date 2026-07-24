export function Icon({ paths, ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" dangerouslySetInnerHTML={{ __html: paths }} {...props} />
}

export const ICONS = {
  orders: `<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>`,
  tournaments: `<path d="M8 21h8m-4-4v4M5 3H3v7a7 7 0 0014 0V3h-2M5 3h14M5 3v3M19 3v3"/>`,
  rooms: `<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`,
  lounge: `<path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>`,
  tabletop: `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>`,
  activities: `<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>`,
  report: `<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>`,
  settings: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>`,
  ppIcon: `<rect x="2" y="9" width="20" height="6" rx="2"/><circle cx="7" cy="12" r="1.5" fill="currentColor"/><circle cx="17" cy="12" r="1.5" fill="currentColor"/>`,
  bilIcon: `<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1.5" fill="currentColor"/><circle cx="14" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="14" r="1.5" fill="currentColor"/>`,
  bfIcon: `<rect x="2" y="6" width="20" height="12" rx="2"/><line x1="12" y1="6" x2="12" y2="18"/><circle cx="7" cy="12" r="1.5" fill="currentColor"/><circle cx="17" cy="12" r="1.5" fill="currentColor"/>`,
  addPlus: `<path d="M12 5v14M5 12h14"/>`,
  joinIcon: `<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>`,
  trashIcon: `<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/>`,
  resultsIcon: `<path d="M8 21h8m-4-4v4M5 3H3v7a7 7 0 0014 0V3h-2M5 3h14"/>`,
  ordersDetail: `<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>`,
  userIcon: `<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  calIcon: `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
  clockIcon: `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
  moneyIcon: `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>`,
  backIcon: `<path d="M19 12H5M12 19l-7-7 7-7"/>`,
  arrowIcon: `<path d="M5 12h14M12 5l7 7-7 7"/>`,
  psRoomIcon: `<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`,
  pcRoomIcon: `<rect x="2" y="3" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><polyline points="7 8 12 13 17 8"/>`,
  starIcon: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`,
  starIcon2: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/><path d="M12 6l2 4 4.5.65-3.25 3.17.77 4.48L12 16.25l-4.02 2.05.77-4.48L5.5 10.65 10 10z"/>`,
  crownIcon: `<path d="M2 20h20M6 20V10l6-8 6 8v10"/><path d="M10 20v-5h4v5"/>`,
  barIcon: `<path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>`,
  tableIcon: `<rect x="3" y="8" width="18" height="10" rx="2"/><line x1="7" y1="8" x2="7" y2="18"/><line x1="17" y1="8" x2="17" y2="18"/><line x1="3" y1="13" x2="21" y2="13"/>`,
}

export const TAB_ICON_MAP = { orders: ICONS.orders, tournaments: ICONS.tournaments, rooms: ICONS.rooms, lounge: ICONS.lounge, tabletop: ICONS.tabletop, activities: ICONS.activities, report: ICONS.report, settings: ICONS.settings }
