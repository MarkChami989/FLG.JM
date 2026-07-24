export function pad2(n) { return String(n).padStart(2, '0') }
export function dateKey(y, mo, d) { return `${y}-${pad2(mo)}-${pad2(d)}` }
export function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1) }
