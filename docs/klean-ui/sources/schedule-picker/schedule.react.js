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
    const zoned = toZoned(
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
    // A gap must not silently move an entered time forward. During an overlap,
    // compatible disambiguation keeps the earlier occurrence.
    if (
      zoned.year !== parsedDate.year ||
      zoned.month !== parsedDate.month ||
      zoned.day !== parsedDate.day ||
      zoned.hour !== parsedTime.hour ||
      zoned.minute !== parsedTime.minute ||
      zoned.second !== second ||
      zoned.millisecond !== millisecond
    ) {
      return undefined
    }
    return zoned.toDate().toISOString()
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

function timestamp(value) {
  if (value === undefined || value === null || value === '') return NaN
  return new Date(value).getTime()
}

function referenceTimestamp(reference) {
  const value = timestamp(reference)
  return Number.isFinite(value) ? value : Date.now()
}

export function scheduleConstraint(
  value,
  { allowPast = false, min, max, reference = new Date() } = {}
) {
  const instant = timestamp(value)
  if (!Number.isFinite(instant)) return 'invalid'
  if (!allowPast && instant <= referenceTimestamp(reference)) return 'past'
  if (instant < timestamp(min)) return 'min'
  if (instant > timestamp(max)) return 'max'
  return ''
}

export function scheduleCalendarBounds({
  allowPast = false,
  min,
  max,
  timeZone,
  reference = new Date()
} = {}) {
  const configuredMin = timestamp(min)
  const lower = Math.max(
    allowPast ? -Infinity : referenceTimestamp(reference) + 1,
    Number.isFinite(configuredMin) ? configuredMin : -Infinity
  )
  const upper = timestamp(max)
  return {
    min: Number.isFinite(lower)
      ? instantToWallClock(lower, timeZone)?.date
      : undefined,
    max: Number.isFinite(upper)
      ? instantToWallClock(upper, timeZone)?.date
      : undefined
  }
}

export function timeFields(value, locale) {
  const time = parseTime(value) ?? { hour: 0, minute: 0 }
  const resolvedLocale = resolveLocale(locale)
  const hour12 = new Intl.DateTimeFormat(resolvedLocale, {
    hour: 'numeric'
  }).resolvedOptions().hour12
  const hoursFormatter = new Intl.DateTimeFormat(resolvedLocale, {
    timeZone: 'UTC',
    hour: '2-digit',
    hourCycle: hour12 ? 'h12' : 'h23'
  })
  const periodsFormatter = new Intl.DateTimeFormat(resolvedLocale, {
    timeZone: 'UTC',
    hour: 'numeric',
    hourCycle: 'h12'
  })
  const part = (formatter, hour, type) =>
    formatter
      .formatToParts(new Date(Date.UTC(2020, 0, 1, hour)))
      .find((item) => item.type === type)?.value

  return {
    hour: String(hour12 ? time.hour % 12 || 12 : time.hour),
    minute: String(time.minute).padStart(2, '0'),
    period: time.hour < 12 ? 'am' : 'pm',
    hour12,
    periods: [
      { value: 'am', label: part(periodsFormatter, 6, 'dayPeriod') ?? 'AM' },
      { value: 'pm', label: part(periodsFormatter, 18, 'dayPeriod') ?? 'PM' }
    ],
    hours: Array.from({ length: hour12 ? 12 : 24 }, (_, index) => {
      const hour = hour12 ? index + 1 : index
      return {
        value: String(hour),
        label: part(hoursFormatter, hour, 'hour') ?? String(hour)
      }
    })
  }
}

export function updateTimeField(time, part, value, locale) {
  const current = parseTime(time)
  if (!current) return time
  const fields = timeFields(time, locale)
  if (part === 'period') {
    if (!fields.hour12 || !['am', 'pm'].includes(value)) return time
    current.hour = (current.hour % 12) + (value === 'pm' ? 12 : 0)
  } else {
    if (!/^\d{1,2}$/.test(String(value))) return time
    const number = Number(value)
    if (part === 'minute') {
      if (number > 59) return time
      current.minute = number
    } else if (part === 'hour') {
      if (fields.hour12) {
        if (number < 1 || number > 12) return time
        current.hour = (number % 12) + (fields.period === 'pm' ? 12 : 0)
      } else {
        if (number > 23) return time
        current.hour = number
      }
    } else {
      return time
    }
  }
  return formatTime(current)
}

function normalizeMinuteStep(step) {
  const value = Number(step)
  return Number.isFinite(value)
    ? Math.min(60, Math.max(1, Math.round(value)))
    : 15
}

export function timeOptions(step = 15) {
  const safeStep = normalizeMinuteStep(step)
  const values = []
  for (let minute = 0; minute < 24 * 60; minute += safeStep) {
    values.push(
      formatTime({ hour: Math.floor(minute / 60), minute: minute % 60 })
    )
  }
  return values
}

function roundedFutureTimestamp(reference, step) {
  const amount = normalizeMinuteStep(step)
  const rounded = new Date(referenceTimestamp(reference))
  rounded.setSeconds(0, 0)
  const remainder = rounded.getMinutes() % amount
  rounded.setMinutes(
    rounded.getMinutes() + (remainder ? amount - remainder : amount)
  )
  return rounded.getTime()
}

export function roundedFutureWallClock(reference, timeZone, step = 15) {
  return instantToWallClock(roundedFutureTimestamp(reference, step), timeZone)
}

export function initialScheduleWallClock(
  value,
  {
    allowPast = false,
    min,
    max,
    timeZone,
    minuteStep = 15,
    reference = new Date()
  } = {}
) {
  const current = timestamp(value)
  if (Number.isFinite(current)) return instantToWallClock(current, timeZone)

  const now = referenceTimestamp(reference)
  const initial = roundedFutureTimestamp(now, minuteStep)
  const configuredMin = timestamp(min)
  const configuredMax = timestamp(max)
  const lower = Math.max(
    allowPast ? -Infinity : now + 1,
    Number.isFinite(configuredMin) ? configuredMin : -Infinity
  )
  const upper = Number.isFinite(configuredMax) ? configuredMax : Infinity
  // Bounds still disable every choice when the allowed interval is empty.
  // Initializing a view must not imply that a forbidden instant is valid.
  const candidate =
    lower <= upper ? Math.min(upper, Math.max(lower, initial)) : initial
  return instantToWallClock(candidate, timeZone)
}

export function interpretSchedule(
  text,
  { reference = new Date(), locale, timeZone, allowPast = false } = {}
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
    { forwardDate: !allowPast }
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
    ...instantToWallClock(iso, zone),
    iso,
    label: formatSchedule(iso, locale, zone),
    timeZone: zone
  }
}
