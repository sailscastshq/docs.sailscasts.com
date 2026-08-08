const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

function pad(value) {
  return String(value).padStart(2, '0')
}

function fromUtcDate(date) {
  return formatIsoDate({
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate()
  })
}

function toUtcDate(value) {
  const date = typeof value === 'string' ? parseIsoDate(value) : value
  if (!date) return undefined
  return new Date(Date.UTC(date.year, date.month - 1, date.day))
}

export function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

export function formatIsoDate({ year, month, day }) {
  return `${String(year).padStart(4, '0')}-${pad(month)}-${pad(day)}`
}

export function parseIsoDate(value) {
  if (typeof value !== 'string') return undefined
  const match = ISO_DATE.exec(value.trim())
  if (!match) return undefined

  const date = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3])
  }

  if (
    date.month < 1 ||
    date.month > 12 ||
    date.day < 1 ||
    date.day > daysInMonth(date.year, date.month)
  ) {
    return undefined
  }

  return date
}

export function compareDates(left, right) {
  return String(left).localeCompare(String(right))
}

export function addDays(value, amount) {
  const date = toUtcDate(value)
  if (!date) return undefined
  date.setUTCDate(date.getUTCDate() + amount)
  return fromUtcDate(date)
}

export function addMonths(value, amount) {
  const date = typeof value === 'string' ? parseIsoDate(value) : value
  if (!date) return undefined

  const monthIndex = date.year * 12 + date.month - 1 + amount
  const year = Math.floor(monthIndex / 12)
  const month = (((monthIndex % 12) + 12) % 12) + 1

  return formatIsoDate({
    year,
    month,
    day: Math.min(date.day, daysInMonth(year, month))
  })
}

export function monthValue(value) {
  const date = typeof value === 'string' ? parseIsoDate(value) : value
  return date ? `${String(date.year).padStart(4, '0')}-${pad(date.month)}` : ''
}

export function startOfMonth(value) {
  const date = typeof value === 'string' ? parseIsoDate(value) : value
  return date ? formatIsoDate({ ...date, day: 1 }) : undefined
}

export function endOfMonth(value) {
  const date = typeof value === 'string' ? parseIsoDate(value) : value
  return date
    ? formatIsoDate({
        ...date,
        day: daysInMonth(date.year, date.month)
      })
    : undefined
}

export function resolveLocale(locale) {
  return (
    locale ||
    (typeof document !== 'undefined' && document.documentElement.lang) ||
    (typeof navigator !== 'undefined' && navigator.language) ||
    'en'
  )
}

export function resolveDirection(locale, direction) {
  if (direction === 'ltr' || direction === 'rtl') return direction

  if (typeof document !== 'undefined') {
    const documentDirection = document.documentElement.dir
    if (documentDirection === 'ltr' || documentDirection === 'rtl') {
      return documentDirection
    }
  }

  try {
    return new Intl.Locale(resolveLocale(locale)).textInfo.direction
  } catch {
    return 'ltr'
  }
}

export function firstDayOfWeek(locale) {
  try {
    const firstDay = new Intl.Locale(resolveLocale(locale)).getWeekInfo()
      .firstDay
    return firstDay === 7 ? 0 : firstDay
  } catch {
    const region = resolveLocale(locale).split('-')[1]?.toUpperCase()
    return ['CA', 'JP', 'PH', 'US'].includes(region) ? 0 : 1
  }
}

export function todayIso(timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    ...(timeZone ? { timeZone } : {}),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date())
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${value.year}-${value.month}-${value.day}`
}

export function dateLabel(value, locale, options = {}) {
  const date = toUtcDate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }).format(date)
}

export function monthLabel(value, locale) {
  const date = toUtcDate(startOfMonth(value))
  if (!date) return ''
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long'
  }).format(date)
}

export function weekdayLabels(locale, firstDay = firstDayOfWeek(locale)) {
  const formatter = new Intl.DateTimeFormat(resolveLocale(locale), {
    timeZone: 'UTC',
    weekday: 'short'
  })
  const sunday = new Date(Date.UTC(2020, 5, 7))

  return Array.from({ length: 7 }, (_, index) => {
    const weekday = (firstDay + index) % 7
    const date = new Date(sunday)
    date.setUTCDate(sunday.getUTCDate() + weekday)
    return formatter.format(date)
  })
}

export function calendarGrid(view, firstDay = 1) {
  const first = startOfMonth(view)
  const date = toUtcDate(first)
  if (!date) return []
  const leadingDays = (date.getUTCDay() - firstDay + 7) % 7
  const gridStart = addDays(first, -leadingDays)

  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
}

export function dateIsUnavailable(value, { min, max, unavailable } = {}) {
  if (!parseIsoDate(value)) return true
  if (min && compareDates(value, min) < 0) return true
  if (max && compareDates(value, max) > 0) return true
  return Boolean(unavailable?.(value))
}

export function clampDate(value, { min, max } = {}) {
  if (!parseIsoDate(value)) return undefined
  if (min && compareDates(value, min) < 0) return min
  if (max && compareDates(value, max) > 0) return max
  return value
}

export function weekEdge(value, firstDay, edge) {
  const date = toUtcDate(value)
  if (!date) return undefined
  const offset = (date.getUTCDay() - firstDay + 7) % 7
  return addDays(value, edge === 'end' ? 6 - offset : -offset)
}
