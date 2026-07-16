export const SECTIONS = {
  orders: { label: 'Received Orders', icon: '📋', clr: 'var(--purple)', desc: 'Approve or reject incoming client requests across every activity.' },
  tournaments: { label: 'Tournaments', icon: '🏆', clr: 'var(--gold)', desc: 'Create, manage, and settle FIFA & Combat tournament brackets.' },
  rooms: { label: 'Rooms', icon: '🖥️', clr: 'var(--cyan)', desc: 'Live occupancy across PC, PS5, and every VIP tier.' },
  lounge: { label: 'Lounge', icon: '🥃', clr: 'var(--orange)', desc: 'Bar seating and table status for the Cigar Lounge.' },
  tabletop: { label: 'Tabletop Games', icon: '🏓', clr: 'var(--pink)', desc: 'Ping Pong, Billiard & Baby Foot table oversight.' },
  staff: { label: 'Staff Management', icon: '🛡️', clr: 'var(--admin)', desc: 'Add, edit, and manage staff accounts and permissions.', adminOnly: true },
  reports: { label: 'Reports & Analytics', icon: '📊', clr: 'var(--admin)', desc: 'Revenue, bookings, and performance across the venue.', adminOnly: true },
}

export const TOURNAMENT_ACTIONS = [
  { ic: '➕', t: 'Add Tournament', d: 'Create a new FIFA or Combat bracket with entry price and slot cap.' },
  { ic: '👥', t: 'Join Requests', d: 'Review pending player sign-ups before spots lock in.' },
  { ic: '🗑️', t: 'Delete Tournament', d: 'Cancel an upcoming tournament and notify registered players.' },
  { ic: '🏁', t: 'Results', d: 'Log winners and close out finished brackets.' },
]

export const BREAKDOWN_COLORS = {
  Reservations: 'var(--purple)',
  Tournaments: 'var(--gold)',
  Rooms: 'var(--cyan)',
  Lounge: 'var(--orange)',
  Tabletop: 'var(--pink)',
}
