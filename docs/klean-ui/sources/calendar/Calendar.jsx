import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { twMerge } from 'tailwind-merge'
import {
  addDays,
  addMonths,
  calendarGrid,
  clampDate,
  compareDates,
  dateIsUnavailable,
  dateLabel,
  endOfMonth,
  firstDayOfWeek,
  monthLabel,
  monthValue,
  parseIsoDate,
  resolveDirection,
  resolveLocale,
  startOfMonth,
  todayIso,
  weekEdge,
  weekdayLabels
} from './date.js'

const Calendar = forwardRef(function Calendar(
  {
    value,
    defaultValue,
    onValueChange,
    onFocusChange,
    min,
    max,
    unavailable,
    rangeStart,
    rangeEnd,
    rangePreview,
    locale: localeProp,
    dir: directionProp,
    label = 'Choose a date',
    disabled = false,
    readOnly = false,
    className,
    ...sectionProps
  },
  forwardedRef
) {
  const root = useRef(null)
  const headingId = `klean-calendar-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}-heading`
  const locale = resolveLocale(localeProp)
  const direction = resolveDirection(locale, directionProp)
  const today = todayIso()
  const [internalValue, setInternalValue] = useState(
    parseIsoDate(defaultValue) ? defaultValue : undefined
  )
  const selected = value === undefined ? internalValue : value
  const limits = useMemo(
    () => ({ min, max, unavailable }),
    [max, min, unavailable]
  )

  function available(candidate) {
    return !disabled && !dateIsUnavailable(candidate, limits)
  }

  function nearestAvailable(candidate, movement = 1) {
    let next = clampDate(candidate, limits) ?? today
    for (let count = 0; count < 732; count += 1) {
      if (available(next)) return next
      const following = addDays(next, movement)
      if (!following) break
      if (min && compareDates(following, min) < 0) break
      if (max && compareDates(following, max) > 0) break
      next = following
    }
    return clampDate(candidate, limits) ?? today
  }

  const initialFocus =
    (parseIsoDate(selected) && selected) ||
    (parseIsoDate(defaultValue) && defaultValue) ||
    today
  const [focusedDate, setFocusedDate] = useState(() =>
    nearestAvailable(initialFocus)
  )
  const [viewMonth, setViewMonth] = useState(() => monthValue(focusedDate))
  const weekStart = firstDayOfWeek(locale)
  const weekdays = weekdayLabels(locale, weekStart)
  const days = calendarGrid(`${viewMonth}-01`, weekStart).map((candidate) => {
    const parsed = parseIsoDate(candidate)
    const decoratedEnd = rangeEnd || rangePreview
    const inRange =
      rangeStart &&
      decoratedEnd &&
      compareDates(candidate, rangeStart) >= 0 &&
      compareDates(candidate, decoratedEnd) <= 0
    return {
      value: candidate,
      day: parsed.day,
      label: dateLabel(candidate, locale, { weekday: 'long' }),
      outside: monthValue(candidate) !== viewMonth,
      selected: candidate === selected,
      today: candidate === today,
      unavailable: !available(candidate),
      rangeStart: candidate === rangeStart,
      rangeEnd: candidate === decoratedEnd,
      inRange
    }
  })
  const weeks = Array.from({ length: 6 }, (_, index) =>
    days.slice(index * 7, index * 7 + 7)
  )
  const visibleMonthLabel = monthLabel(`${viewMonth}-01`, locale)
  const previousDisabled =
    disabled ||
    Boolean(
      min && compareDates(endOfMonth(addMonths(`${viewMonth}-01`, -1)), min) < 0
    )
  const nextDisabled =
    disabled ||
    Boolean(
      max &&
        compareDates(startOfMonth(addMonths(`${viewMonth}-01`, 1)), max) > 0
    )

  function commit(nextValue) {
    if (!available(nextValue) || readOnly) return
    if (value === undefined) setInternalValue(nextValue)
    onValueChange?.(nextValue)
  }

  function focusDate(nextValue, { move = true } = {}) {
    const next = nearestAvailable(
      nextValue,
      compareDates(nextValue, focusedDate) < 0 ? -1 : 1
    )
    setFocusedDate(next)
    if (move) setViewMonth(monthValue(next))
    onFocusChange?.(next)
    queueMicrotask(() => {
      root.current
        ?.querySelector(`[data-date="${next}"]`)
        ?.focus({ preventScroll: true })
    })
  }

  function moveByMonth(amount) {
    if ((amount < 0 && previousDisabled) || (amount > 0 && nextDisabled)) return
    focusDate(addMonths(focusedDate, amount))
  }

  function handleDayKeyDown(event, candidate) {
    let next
    const horizontal = direction === 'rtl' ? -1 : 1
    if (event.key === 'ArrowLeft') next = addDays(candidate, -horizontal)
    else if (event.key === 'ArrowRight') next = addDays(candidate, horizontal)
    else if (event.key === 'ArrowUp') next = addDays(candidate, -7)
    else if (event.key === 'ArrowDown') next = addDays(candidate, 7)
    else if (event.key === 'Home')
      next = weekEdge(candidate, weekStart, 'start')
    else if (event.key === 'End') next = weekEdge(candidate, weekStart, 'end')
    else if (event.key === 'PageUp')
      next = addMonths(candidate, event.shiftKey ? -12 : -1)
    else if (event.key === 'PageDown')
      next = addMonths(candidate, event.shiftKey ? 12 : 1)
    else return
    event.preventDefault()
    focusDate(next)
  }

  useEffect(() => {
    if (!parseIsoDate(value)) return
    const next = nearestAvailable(value)
    setFocusedDate(next)
    setViewMonth(monthValue(next))
    // A controlled value is the synchronization boundary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useImperativeHandle(forwardedRef, () => ({
    element: root.current,
    focus: () => focusDate(focusedDate),
    focusedDate
  }))

  return (
    <section
      {...sectionProps}
      ref={root}
      dir={direction}
      data-slot="calendar"
      aria-label={label}
      className={twMerge(
        'w-full max-w-88 rounded-lg bg-white p-3 text-gray-950 dark:bg-gray-950 dark:text-white',
        className
      )}
    >
      <header
        data-slot="calendar-header"
        className="grid grid-cols-[2.75rem_1fr_2.75rem] items-center gap-1"
      >
        <button
          type="button"
          data-slot="calendar-previous"
          className="grid min-h-11 min-w-11 place-items-center rounded-md text-xl hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-gray-800 dark:focus-visible:outline-white"
          aria-label={`Previous month, ${visibleMonthLabel}`}
          disabled={previousDisabled}
          onClick={() => moveByMonth(-1)}
        >
          <span aria-hidden="true">{direction === 'rtl' ? '→' : '←'}</span>
        </button>
        <h2
          id={headingId}
          data-slot="calendar-heading"
          className="text-center text-base font-semibold"
          aria-live="polite"
          aria-atomic="true"
        >
          {visibleMonthLabel}
        </h2>
        <button
          type="button"
          data-slot="calendar-next"
          className="grid min-h-11 min-w-11 place-items-center rounded-md text-xl hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-gray-800 dark:focus-visible:outline-white"
          aria-label={`Next month, ${visibleMonthLabel}`}
          disabled={nextDisabled}
          onClick={() => moveByMonth(1)}
        >
          <span aria-hidden="true">{direction === 'rtl' ? '←' : '→'}</span>
        </button>
      </header>

      <table
        role="grid"
        data-slot="calendar-grid"
        className="mt-2 w-full table-fixed border-collapse"
        aria-labelledby={headingId}
        aria-readonly={readOnly || undefined}
        aria-disabled={disabled || undefined}
      >
        <thead>
          <tr>
            {weekdays.map((weekday) => (
              <th
                key={weekday}
                scope="col"
                data-slot="calendar-weekday"
                className="h-9 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day) => (
                <td
                  key={day.value}
                  role="gridcell"
                  data-slot="calendar-cell"
                  className="p-0 text-center"
                  aria-selected={day.selected}
                >
                  <button
                    type="button"
                    data-slot="calendar-day"
                    data-date={day.value}
                    data-outside-month={day.outside || undefined}
                    data-selected={day.selected || undefined}
                    data-today={day.today || undefined}
                    data-unavailable={day.unavailable || undefined}
                    data-range-start={day.rangeStart || undefined}
                    data-range-end={day.rangeEnd || undefined}
                    data-in-range={day.inRange || undefined}
                    aria-label={day.label}
                    aria-current={day.today ? 'date' : undefined}
                    aria-disabled={day.unavailable || undefined}
                    disabled={day.unavailable}
                    tabIndex={day.value === focusedDate ? 0 : -1}
                    className="mx-auto grid min-h-11 min-w-11 place-items-center rounded-md text-sm tabular-nums hover:bg-gray-100 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed data-in-range:bg-gray-100 data-outside-month:text-gray-400 data-range-end:bg-gray-950 data-range-end:font-semibold data-range-end:text-white data-range-start:bg-gray-950 data-range-start:font-semibold data-range-start:text-white data-selected:bg-gray-950 data-selected:font-semibold data-selected:text-white data-today:ring-1 data-today:ring-inset data-today:ring-gray-400 data-unavailable:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:outline-white dark:data-in-range:bg-gray-800 dark:data-outside-month:text-gray-600 dark:data-range-end:bg-white dark:data-range-end:text-gray-950 dark:data-range-start:bg-white dark:data-range-start:text-gray-950 dark:data-selected:bg-white dark:data-selected:text-gray-950 dark:data-today:ring-gray-600 dark:data-unavailable:text-gray-700"
                    onFocus={() => {
                      setFocusedDate(day.value)
                      onFocusChange?.(day.value)
                    }}
                    onKeyDown={(event) => handleDayKeyDown(event, day.value)}
                    onClick={() => commit(day.value)}
                  >
                    {day.day}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
})

export default Calendar
