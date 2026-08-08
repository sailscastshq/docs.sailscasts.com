import {
  CalendarDateTime,
  fromAbsolute,
  toZoned
} from '@internationalized/date'
import { en as chrono } from 'chrono-node'
import { dateLabel, parseIsoDate, resolveLocale } from '../calendar/date.js'

export function resolveTimeZone(timeZone) {
  const fallback = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  const candidate = timeZone || fallback
  try {
    new Intl.DateTimeFormat('en', { timeZone: candidate }).format()
    return candidate
  } catch {
    return fallback
  }
}

export function parseTime(value) {
  const match = /^(\d{2}):(\d{2})$/.exec(value ?? '')
  if (!match) return undefined
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour > 23 || minute > 59) return undefined
  return { hour, minute }
}

export function formatTime({ hour, minute }) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export function wallClockToIso({
  date,
  time,
  timeZone,
  timezoneOffset,
  second = 0,
  millisecond = 0
}) {
  const parsedDate = parseIsoDate(date)
  const parsedTime = parseTime(time)
  if (!parsedDate || !parsedTime) return undefined

  if (Number.isFinite(timezoneOffset)) {
    return new Date(
      Date.UTC(
        parsedDate.year,
        parsedDate.month - 1,
        parsedDate.day,
        parsedTime.hour,
        parsedTime.minute,
        second,
        millisecond
      ) +
        -timezoneOffset * 60_000
    ).toISOString()
  }

  try {
    return toZoned(
      new CalendarDateTime(
        parsedDate.year,
        parsedDate.month,
        parsedDate.day,
        parsedTime.hour,
        parsedTime.minute,
        second,
        millisecond
      ),
      resolveTimeZone(timeZone),
      'compatible'
    )
      .toDate()
      .toISOString()
  } catch {
    return undefined
  }
}

export function instantToWallClock(value, timeZone) {
  const instant = new Date(value)
  if (Number.isNaN(instant.getTime())) return undefined
  const zoned = fromAbsolute(instant.getTime(), resolveTimeZone(timeZone))
  return {
    date: `${String(zoned.year).padStart(4, '0')}-${String(zoned.month).padStart(2, '0')}-${String(zoned.day).padStart(2, '0')}`,
    time: formatTime({ hour: zoned.hour, minute: zoned.minute })
  }
}

export function formatSchedule(value, locale, timeZone) {
  const instant = new Date(value)
  if (Number.isNaN(instant.getTime())) return ''
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    timeZone: resolveTimeZone(timeZone),
    dateStyle: 'medium',
    timeStyle:
      instant.getUTCSeconds() || instant.getUTCMilliseconds()
        ? 'medium'
        : 'short'
  }).format(instant)
}

export function formatTimeLabel(value, locale) {
  const time = parseTime(value)
  if (!time) return ''
  return new Intl.DateTimeFormat(resolveLocale(locale), {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(Date.UTC(2020, 0, 1, time.hour, time.minute)))
}

export function timeOptions(step = 15) {
  const safeStep = Math.min(60, Math.max(1, Math.round(step)))
  const values = []
  for (let minute = 0; minute < 24 * 60; minute += safeStep) {
    values.push(
      formatTime({ hour: Math.floor(minute / 60), minute: minute % 60 })
    )
  }
  return values
}

export function roundedFutureWallClock(reference, timeZone, step = 15) {
  const amount = Math.min(60, Math.max(1, Math.round(step)))
  const rounded = new Date(reference)
  rounded.setSeconds(0, 0)
  const remainder = rounded.getMinutes() % amount
  rounded.setMinutes(
    rounded.getMinutes() + (remainder ? amount - remainder : amount)
  )
  return instantToWallClock(rounded.toISOString(), timeZone)
}

export function interpretSchedule(
  text,
  { reference = new Date(), locale, timeZone } = {}
) {
  const source = text?.trim()
  if (!source) return { state: 'empty' }

  const zone = resolveTimeZone(timeZone)
  const referenceDate =
    reference instanceof Date ? reference : new Date(reference)
  const referenceInstant = Number.isNaN(referenceDate.getTime())
    ? new Date()
    : referenceDate
  const zonedReference = fromAbsolute(referenceInstant.getTime(), zone)
  const result = chrono.parse(
    source,
    {
      instant: referenceInstant,
      timezone: zonedReference.offset / 60_000
    },
    { forwardDate: true }
  )[0]

  if (!result) return { state: 'invalid' }

  const date = `${String(result.start.get('year')).padStart(4, '0')}-${String(result.start.get('month')).padStart(2, '0')}-${String(result.start.get('day')).padStart(2, '0')}`
  const hasTime = result.start.isCertain('hour')
  if (!hasTime) {
    return {
      state: 'incomplete',
      date,
      message: `${dateLabel(date, locale)} needs a time.`
    }
  }

  const time = formatTime({
    hour: result.start.get('hour'),
    minute: result.start.get('minute') ?? 0
  })
  const timezoneOffset = result.start.isCertain('timezoneOffset')
    ? result.start.get('timezoneOffset')
    : undefined
  const iso = wallClockToIso({
    date,
    time,
    timeZone: zone,
    timezoneOffset,
    second: result.start.get('second') ?? 0,
    millisecond: result.start.get('millisecond') ?? 0
  })
  if (!iso) return { state: 'invalid' }

  return {
    state: 'proposal',
    date,
    time,
    iso,
    label: formatSchedule(iso, locale, zone),
    timeZone: zone
  }
}
