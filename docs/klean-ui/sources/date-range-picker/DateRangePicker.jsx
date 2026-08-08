import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { twMerge } from 'tailwind-merge'
import Calendar from '../calendar/Calendar.jsx'
import {
  compareDates,
  dateIsUnavailable,
  dateLabel,
  parseIsoDate,
  resolveLocale
} from '../calendar/date.js'
import Input from '../input/Input.jsx'
import Popover from '../popover/Popover.jsx'

function normalizeRange(value) {
  return {
    start: parseIsoDate(value?.start) ? value.start : '',
    end: parseIsoDate(value?.end) ? value.end : ''
  }
}

const DateRangePicker = forwardRef(function DateRangePicker(
  {
    value,
    defaultValue = {},
    onValueChange,
    id,
    name,
    label = 'Date range',
    startLabel = 'Start date',
    endLabel = 'End date',
    min,
    max,
    unavailable,
    locale: localeProp,
    dir,
    open,
    defaultOpen = false,
    onOpenChange,
    required = false,
    disabled = false,
    readOnly = false,
    className,
    ...fieldsetProps
  },
  forwardedRef
) {
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const baseId = id ?? `klean-date-range-${generatedId}`
  const startId = `${baseId}-start`
  const endId = `${baseId}-end`
  const popoverId = `${baseId}-calendar`
  const statusId = `${baseId}-status`
  const [internalValue, setInternalValue] = useState(() =>
    normalizeRange(defaultValue)
  )
  const range = value === undefined ? internalValue : normalizeRange(value)
  const [startDraft, setStartDraft] = useState(range.start)
  const [endDraft, setEndDraft] = useState(range.end)
  const [activePart, setActivePart] = useState('start')
  const [preview, setPreview] = useState('')
  const startInput = useRef(null)
  const endInput = useRef(null)
  const popoverRef = useRef(null)
  const locale = resolveLocale(localeProp)
  const limits = { min, max, unavailable }
  const startInvalid = Boolean(
    startDraft &&
      (!parseIsoDate(startDraft) || dateIsUnavailable(startDraft, limits))
  )
  const endInvalid = Boolean(
    endDraft && (!parseIsoDate(endDraft) || dateIsUnavailable(endDraft, limits))
  )
  const orderInvalid = Boolean(
    parseIsoDate(startDraft) &&
      parseIsoDate(endDraft) &&
      compareDates(endDraft, startDraft) < 0
  )
  let statusText
  if (orderInvalid)
    statusText = 'The end date must be on or after the start date.'
  else if (startInvalid || endInvalid)
    statusText = 'Enter available dates as YYYY-MM-DD.'
  else if (range.start && range.end)
    statusText = `${dateLabel(range.start, locale)} through ${dateLabel(range.end, locale)}.`
  else if (range.start) statusText = 'Choose an end date.'
  else statusText = 'Choose a start date, then an end date.'
  const decoratedEnd = range.end || preview
  const decoration =
    range.start && decoratedEnd && compareDates(range.start, decoratedEnd) > 0
      ? { start: decoratedEnd, end: range.start }
      : { start: range.start, end: decoratedEnd }
  const calendarValue =
    activePart === 'end' ? range.end || preview || range.start : range.start

  function updateRange(nextRange) {
    const normalized = normalizeRange(nextRange)
    if (value === undefined) setInternalValue(normalized)
    onValueChange?.(normalized)
  }

  function openPart(part) {
    setActivePart(part)
    setPreview('')
    popoverRef.current?.open()
  }

  function handleDraft(part, event) {
    const next = event.target.value.trim()
    if (part === 'start') setStartDraft(next)
    else setEndDraft(next)
    if (next && (!parseIsoDate(next) || dateIsUnavailable(next, limits))) return
    const nextRange = {
      start: part === 'start' ? next : range.start,
      end: part === 'end' ? next : range.end
    }
    if (
      nextRange.start &&
      nextRange.end &&
      compareDates(nextRange.end, nextRange.start) < 0
    ) {
      return
    }
    updateRange(nextRange)
  }

  function chooseDate(date) {
    if (activePart === 'start' || !range.start) {
      updateRange({ start: date, end: '' })
      setStartDraft(date)
      setEndDraft('')
      setActivePart('end')
      setPreview(date)
      return
    }
    const nextRange =
      compareDates(date, range.start) < 0
        ? { start: date, end: range.start }
        : { start: range.start, end: date }
    updateRange(nextRange)
    setStartDraft(nextRange.start)
    setEndDraft(nextRange.end)
    setPreview('')
    popoverRef.current?.close()
  }

  useEffect(() => {
    setStartDraft(range.start)
    setEndDraft(range.end)
  }, [range.end, range.start])

  useEffect(() => {
    if (startInput.current) {
      startInput.current.setCustomValidity(
        startInvalid || orderInvalid
          ? statusText
          : required && !range.start
            ? 'Choose a start date.'
            : ''
      )
    }
    if (endInput.current) {
      endInput.current.setCustomValidity(
        endInvalid || orderInvalid
          ? statusText
          : required && !range.end
            ? 'Choose an end date.'
            : ''
      )
    }
  }, [
    endInvalid,
    orderInvalid,
    range.end,
    range.start,
    required,
    startInvalid,
    statusText
  ])

  useImperativeHandle(forwardedRef, () => ({
    focus: (part = 'start', options) =>
      (part === 'end' ? endInput.current : startInput.current)?.focus(options),
    open: (part = 'start') => openPart(part),
    close: () => popoverRef.current?.close()
  }))

  const calendarButtonClasses =
    'absolute inset-y-0 end-0 grid min-w-11 place-items-center rounded-e-md text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white'

  return (
    <fieldset
      {...fieldsetProps}
      data-slot="date-range-picker"
      disabled={disabled}
      className={twMerge(
        'grid w-full gap-3 [&_[data-slot=date-range-field]]:relative [&_[data-slot=date-range-field]]:flex [&_[data-slot=date-range-field]]:items-stretch [&_[data-slot=input]]:pe-12',
        className
      )}
    >
      <legend data-slot="date-range-legend" className="text-sm font-medium">
        {label}
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <label
            htmlFor={startId}
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            {startLabel}
          </label>
          <div data-slot="date-range-field">
            <Input
              ref={startInput}
              id={startId}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              name={name ? `${name}[start]` : undefined}
              value={startDraft}
              placeholder="YYYY-MM-DD"
              required={required}
              readOnly={readOnly}
              aria-invalid={startInvalid || orderInvalid || undefined}
              aria-describedby={statusId}
              data-slot="date-range-start"
              onChange={(event) => handleDraft('start', event)}
              onClick={() => openPart('start')}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' && !disabled && !readOnly) {
                  event.preventDefault()
                  openPart('start')
                }
              }}
            />
            <button
              type="button"
              popoverTarget={popoverId}
              popoverTargetAction="show"
              data-slot="date-range-start-button"
              className={calendarButtonClasses}
              disabled={disabled || readOnly}
              aria-label={`Choose ${startLabel.toLowerCase()}`}
              onClick={() => setActivePart('start')}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="size-5"
              >
                <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="grid gap-2">
          <label
            htmlFor={endId}
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            {endLabel}
          </label>
          <div data-slot="date-range-field">
            <Input
              ref={endInput}
              id={endId}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              name={name ? `${name}[end]` : undefined}
              value={endDraft}
              placeholder="YYYY-MM-DD"
              required={required}
              readOnly={readOnly}
              aria-invalid={endInvalid || orderInvalid || undefined}
              aria-describedby={statusId}
              data-slot="date-range-end"
              onChange={(event) => handleDraft('end', event)}
              onClick={() => openPart('end')}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' && !disabled && !readOnly) {
                  event.preventDefault()
                  openPart('end')
                }
              }}
            />
            <button
              type="button"
              popoverTarget={popoverId}
              popoverTargetAction="show"
              data-slot="date-range-end-button"
              className={calendarButtonClasses}
              disabled={disabled || readOnly}
              aria-label={`Choose ${endLabel.toLowerCase()}`}
              onClick={() => setActivePart('end')}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="size-5"
              >
                <path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <p
        id={statusId}
        data-slot="date-range-status"
        className={twMerge(
          'text-sm text-gray-600 dark:text-gray-400',
          (startInvalid || endInvalid || orderInvalid) &&
            'text-red-700 dark:text-red-400'
        )}
        aria-live="polite"
      >
        {statusText}
      </p>
      <Popover
        ref={popoverRef}
        id={popoverId}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        placement="bottom-start"
        data-slot="date-range-popover"
        className="w-[min(22rem,calc(100vw-1rem))] p-0"
      >
        <Calendar
          value={calendarValue}
          defaultValue={range.start}
          min={min}
          max={max}
          unavailable={unavailable}
          rangeStart={decoration.start}
          rangeEnd={range.end ? decoration.end : undefined}
          rangePreview={!range.end ? decoration.end : undefined}
          locale={locale}
          dir={dir}
          disabled={disabled}
          readOnly={readOnly}
          onFocusChange={(date) => {
            if (activePart === 'end' && range.start) setPreview(date)
          }}
          onValueChange={chooseDate}
        />
      </Popover>
    </fieldset>
  )
})

export default DateRangePicker
