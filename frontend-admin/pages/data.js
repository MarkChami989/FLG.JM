export const SECTIONS = {
  orders: { label: 'Received Orders', icon: '📋', clr: 'var(--purple)', desc: 'Approve or reject incoming client requests across every activity.' },
  tournaments: { label: 'Tournaments', icon: '🏆', clr: 'var(--gold)', desc: 'Create, manage, and settle FIFA & Combat tournament brackets.' },
  rooms: { label: 'Rooms', icon: '🖥️', clr: 'var(--cyan)', desc: 'Live occupancy across PC, PS5, and every VIP tier.' },
  lounge: { label: 'Lounge', icon: '🥃', clr: 'var(--orange)', desc: 'Bar seating and table status for the Cigar Lounge.' },
  tabletop: { label: 'Tabletop Games', icon: '🏓', clr: 'var(--pink)', desc: 'Ping Pong, Billiard & Baby Foot table oversight.' },
  staff: { label: 'Staff Management', icon: '🛡️', clr: 'var(--admin)', desc: 'Add, edit, and manage staff accounts and permissions.', adminOnly: true },
  reports: { label: 'Reports & Analytics', icon: '📊', clr: 'var(--admin)', desc: 'Revenue, bookings, and performance across the venue.', adminOnly: true },
}

export const ORDERS = [
  { id: 'FLG-4821', user: 'karim_j', date: 'Jul 14', time: '21:30', pay: '$160', activity: 'Reserve Bar – Bar 2', status: 'pending' },
  { id: 'FLG-4822', user: 'nadine.r', date: 'Jul 14', time: '19:00', pay: '$80', activity: 'Table for 4', status: 'accepted' },
  { id: 'FLG-4823', user: 'yehya22', date: 'Jul 15', time: '22:00', pay: '$25', activity: 'FIFA Tournament', status: 'pending' },
  { id: 'FLG-4824', user: 'sara.k', date: 'Jul 13', time: '18:00', pay: '$130', activity: 'Reserve Table – 8p', status: 'rejected' },
  { id: 'FLG-4825', user: 'tarek_m', date: 'Jul 15', time: '20:00', pay: '$20', activity: 'Combat Tournament', status: 'accepted' },
]

export const TOURNAMENT_ACTIONS = [
  { ic: '➕', t: 'Add Tournament', d: 'Create a new FIFA or Combat bracket with entry price and slot cap.' },
  { ic: '👥', t: 'Join Requests', d: 'Review pending player sign-ups before spots lock in.' },
  { ic: '🗑️', t: 'Delete Tournament', d: 'Cancel an upcoming tournament and notify registered players.' },
  { ic: '🏁', t: 'Results', d: 'Log winners and close out finished brackets.' },
]

export const ROOMS = [
  { n: 'PS Room', s: 'free' },
  { n: 'PC Room', s: 'occ' },
  { n: 'VIP Standard', s: 'free' },
  { n: 'VIP Elite', s: 'occ' },
  { n: 'VIP Royal', s: 'free' },
]

export const LOUNGE_BARS = [
  { n: 'Bar 1', s: 'free' },
  { n: 'Bar 2', s: 'occ' },
  { n: 'Bar 3', s: 'free' },
]
export const LOUNGE_TABLES = [
  { n: 'Table 1', s: 'free' },
  { n: 'Table 2', s: 'occ' },
  { n: 'Table 3', s: 'occ' },
  { n: 'Table 4', s: 'free' },
]

export const STAFF = [
  { name: 'Jana K.', role: 'admin', status: 'active', last: 'Now' },
  { name: 'Rami H.', role: 'staff', status: 'active', last: '2m ago' },
  { name: 'Lea S.', role: 'staff', status: 'active', last: '14m ago' },
  { name: 'Omar D.', role: 'staff', status: 'suspended', last: '3d ago' },
]

export const REPORT_BARS = [40, 65, 52, 80, 72, 90, 60]
export const REPORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const REPORT_BREAKDOWN = [
  { l: 'Reservations', v: 38, clr: 'var(--purple)' },
  { l: 'Tournaments', v: 26, clr: 'var(--gold)' },
  { l: 'Rooms', v: 20, clr: 'var(--cyan)' },
  { l: 'Lounge', v: 16, clr: 'var(--orange)' },
]
export const REPORT_STATS = [
  { num: '$18.4K', lbl: 'Revenue this month' },
  { num: '312', lbl: 'Total bookings' },
  { num: '4', lbl: 'Active staff' },
  { num: '4.8', lbl: 'Avg client rating' },
]
