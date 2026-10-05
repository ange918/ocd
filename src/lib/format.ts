const dayMonth = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' })
const dayMonthYear = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
const time = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' })

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/** « 28 sept. » */
export function formatShortDate(iso: string): string {
  return dayMonth.format(new Date(iso))
}

/** « 28 sept. 2026 » */
export function formatDate(iso: string): string {
  return dayMonthYear.format(new Date(iso))
}

/** « 07:14 » */
export function formatTime(iso: string): string {
  return time.format(new Date(iso))
}

/** « Aujourd'hui · 07:14 » ou « 28 sept. 2026 · 14:22 » */
export function formatDateTime(iso: string, now: Date = new Date()): string {
  const d = new Date(iso)
  if (isSameDay(d, now)) return `Aujourd'hui · ${time.format(d)}`
  return `${dayMonthYear.format(d)} · ${time.format(d)}`
}

/** « Il y a 2 h », « Il y a 5 min », sinon « 28 sept. » */
export function formatRelative(iso: string, now: Date = new Date()): string {
  const diff = (now.getTime() - new Date(iso).getTime()) / 1000
  if (diff < 60) return "À l'instant"
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`
  return dayMonth.format(new Date(iso))
}

/** Regroupe les chiffres par paires : « 97124588 » → « 97 12 45 88 » */
export function groupDigits(digits: string): string {
  return digits.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1 ')
}

/** « +22997124588 » → « +229 97 12 45 88 » (indicatifs à 3 chiffres d'Afrique de l'Ouest) */
export function formatPhone(e164: string): string {
  const m = /^\+(\d{3})(\d+)$/.exec(e164)
  if (!m) return e164
  return `+${m[1]} ${groupDigits(m[2] ?? '')}`
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`
}
