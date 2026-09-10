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
import Input from '../input/Input.jsx'
import Popover from '../popover/Popover.jsx'
import {
  formatSchedule,
  instantToWallClock,
  initialScheduleWallClock,
  interpretSchedule,
  resolveTimeZone,
  scheduleCalendarBounds,
  scheduleConstraint,
  timeFields,
  updateTimeField,
  wallClockToIso
} from './schedule.js'

const SchedulePicker = forwardRef(function SchedulePicker(
  {
    value,
    defaultValue,
    onValueChange,
    onChange,
    id,
    name,
    placeholder = 'Tomorrow at 9am',
    timeZone,
    locale,
    dir,
    allowPast = false,
    min,
    max,
    minuteStep = 15,
    open,
    defaultOpen = false,
    onOpenChange,
    required = false,
    disabled = false,
    readOnly = false,
    className,
    'aria-describedby': externalDescribedBy,
    ...inputProps
  },
  forwardedRef
) {
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const inputId = id ?? `klean-schedule-picker-${generatedId}`
  const popoverId = `${inputId}-panel`
  const statusId = `${inputId}-status`
  const timeHeadingId = `${inputId}-time-heading`
  const zone = resolveTimeZone(timeZone)
  const validDefault = Number.isNaN(new Date(defaultValue).getTime())
    ? ''
    : defaultValue
  const [internalValue, setInternalValue] = useState(validDefault)
  const committedValue = value === undefined ? internalValue : value
  const initialWall = initialScheduleWallClock(committedValue, {
    allowPast,
    min,
    max,
    timeZone: zone,
    minuteStep
  })
  const [selectedDate, setSelectedDate] = useState(initialWall.date)
  const [selectedTime, setSelectedTime] = useState(initialWall.time)
  const [draft, setDraft] = useState(
    committedValue ? formatSchedule(committedValue, locale, zone) : ''
  )
  const [interpretation, setInterpretation] = useState(
    committedValue
      ? {
          state: 'committed',
          iso: committedValue,
          ...initialWall,
          label: formatSchedule(committedValue, locale, zone)
        }
      : { state: 'empty' }
  )
  const [touched, setTouched] = useState(false)
  const [validationClock, setValidationClock] = useState(Date.now)
  const inputRef = useRef(null)
  const popoverRef = useRef(null)
  const panelRef = useRef(null)
  const rootRef = useRef(null)
  const constraints = {
    allowPast,
    min,
    max,
    reference: new Date(validationClock)
  }
  const calendarBounds = scheduleCalendarBounds({
    ...constraints,
    timeZone: zone
  })
  const fields = timeFields(selectedTime, locale)
  const minutes = Array.from({ length: 60 }, (_, minute) =>
    String(minute).padStart(2, '0')
  )
  const constraintError = interpretation.iso
    ? scheduleConstraint(interpretation.iso, constraints)
    : ''
  const committable = interpretation.state === 'proposal' && !constraintError
  const invalid =
    interpretation.state === 'invalid' ||
    Boolean(constraintError) ||
    (touched && interpretation.state === 'incomplete')
  let statusText
  if (interpretation.state === 'empty')
    statusText = 'Type a date and time, or choose them from the calendar.'
  else if (interpretation.state === 'invalid')
    statusText = 'Enter a date and time, such as tomorrow at 9am.'
  else if (interpretation.state === 'incomplete')
    statusText = interpretation.message
  else if (constraintError === 'past')
    statusText = 'Choose a time in the future.'
  else if (constraintError === 'min')
    statusText = `Choose ${formatSchedule(min, locale, zone)} or later.`
  else if (constraintError === 'max')
    statusText = `Choose ${formatSchedule(max, locale, zone)} or earlier.`
  else if (interpretation.state === 'proposal')
    statusText = `${allowPast ? 'Use' : 'Will schedule for'} ${interpretation.label} in ${zone}. Press Enter or leave the picker to use it.`
  else
    statusText = `${allowPast ? 'Selected' : 'Scheduled for'} ${interpretation.label} in ${zone}.`
  const describedBy = [externalDescribedBy, statusId].filter(Boolean).join(' ')

  function updateValue(nextValue) {
    if (value === undefined) setInternalValue(nextValue)
    onValueChange?.(nextValue)
  }

  function readDraft(nextDraft) {
    setValidationClock(Date.now())
    setDraft(nextDraft)
    if (!nextDraft.trim()) {
      updateValue('')
      setInterpretation({ state: 'empty' })
      return
    }
    const next = interpretSchedule(nextDraft, {
      reference: new Date(),
      locale,
      timeZone: zone,
      allowPast
    })
    setInterpretation(next)
    if (next.date) setSelectedDate(next.date)
    if (next.time) setSelectedTime(next.time)
  }

  function stage(date = selectedDate, time = selectedTime) {
    if (disabled || readOnly) return
    setValidationClock(Date.now())
    // Reselecting an unchanged instant must not discard its seconds.
    const iso =
      interpretation.iso &&
      interpretation.date === date &&
      interpretation.time === time
        ? interpretation.iso
        : wallClockToIso({ date, time, timeZone: zone })
    setSelectedDate(date)
    setSelectedTime(time)
    if (!iso) {
      setInterpretation({ state: 'invalid' })
      return
    }
    const label = formatSchedule(iso, locale, zone)
    setDraft(label)
    setInterpretation({ state: 'proposal', iso, date, time, label })
  }

  function commitProposal({ restoreFocus = true } = {}) {
    const reference = new Date()
    setValidationClock(reference.getTime())
    if (
      interpretation.state !== 'proposal' ||
      disabled ||
      readOnly ||
      scheduleConstraint(interpretation.iso, { allowPast, min, max, reference })
    )
      return
    updateValue(interpretation.iso)
    setDraft(interpretation.label)
    setInterpretation({ ...interpretation, state: 'committed' })
    popoverRef.current?.close({ restoreFocus })
  }

  function handleBlur(event) {
    if (
      event.relatedTarget &&
      event.currentTarget.contains(event.relatedTarget)
    )
      return
    setTouched(true)
    commitProposal({ restoreFocus: false })
  }

  function finish() {
    const reference = new Date()
    setValidationClock(reference.getTime())
    if (
      disabled ||
      readOnly ||
      scheduleConstraint(interpretation.iso, { allowPast, min, max, reference })
    )
      return
    if (interpretation.state === 'committed') {
      popoverRef.current?.close()
      return
    }
    commitProposal()
  }

  function handleOpenChange(nextOpen) {
    setValidationClock(Date.now())
    onOpenChange?.(nextOpen)
    if (!nextOpen) return
    if (interpretation.state === 'empty') {
      const wall = initialScheduleWallClock('', {
        allowPast,
        min,
        max,
        timeZone: zone,
        minuteStep
      })
      setSelectedDate(wall.date)
      setSelectedTime(wall.time)
    }
    requestAnimationFrame(() => {
      if (!panelRef.current?.getClientRects().length) return
      panelRef.current.parentElement.scrollTop = 0
    })
  }

  function chooseTimeField(part, nextValue) {
    stage(selectedDate, updateTimeField(selectedTime, part, nextValue, locale))
  }

  useEffect(() => {
    const wall = instantToWallClock(committedValue, zone)
    if (!wall) {
      if (!committedValue) {
        setDraft('')
        setInterpretation({ state: 'empty' })
      }
      return
    }
    const label = formatSchedule(committedValue, locale, zone)
    setSelectedDate(wall.date)
    setSelectedTime(wall.time)
    setDraft(label)
    setInterpretation({
      state: 'committed',
      iso: committedValue,
      ...wall,
      label
    })
  }, [committedValue, locale, zone])

  useEffect(() => {
    if (!inputRef.current) return
    if (required && !committedValue)
      inputRef.current.setCustomValidity('Choose a date and time.')
    else if (invalid || interpretation.state === 'incomplete')
      inputRef.current.setCustomValidity(statusText)
    else inputRef.current.setCustomValidity('')
  }, [
    committable,
    committedValue,
    interpretation.state,
    invalid,
    required,
    statusText
  ])

  useImperativeHandle(forwardedRef, () => ({
    input: inputRef.current,
    focus: (options) => inputRef.current?.focus(options),
    open: () => popoverRef.current?.open(),
    close: () => popoverRef.current?.close()
  }))

  return (
    <div
      ref={rootRef}
      data-slot="schedule-picker"
      data-state={interpretation.state}
      onBlur={handleBlur}
      className={twMerge(
        'grid w-full gap-2 **:data-[slot=schedule-picker-field]:relative **:data-[slot=schedule-picker-field]:flex **:data-[slot=schedule-picker-field]:items-stretch **:data-[slot=input]:pe-12',
        className
      )}
    >
      <div data-slot="schedule-picker-field">
        <Input
          {...inputProps}
          ref={inputRef}
          id={inputId}
          type="text"
          autoComplete="off"
          value={draft}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={(event) => {
            onChange?.(event)
            if (!event.defaultPrevented) {
              setTouched(false)
              readDraft(event.target.value)
            }
          }}
          onClick={() => !disabled && !readOnly && popoverRef.current?.open()}
          onKeyDown={(event) => {
            inputProps.onKeyDown?.(event)
            if (event.defaultPrevented) return
            if (event.key === 'ArrowDown' && !disabled && !readOnly) {
              event.preventDefault()
              popoverRef.current?.open()
            } else if (
              event.key === 'Enter' &&
              (interpretation.state === 'proposal' ||
                interpretation.state === 'incomplete' ||
                interpretation.state === 'invalid' ||
                constraintError)
            ) {
              event.preventDefault()
              setTouched(true)
              commitProposal({ restoreFocus: false })
            }
          }}
        />
        <button
          type="button"
          popoverTarget={popoverId}
          data-slot="schedule-picker-button"
          className="absolute inset-y-0 inset-e-0 grid min-w-11 place-items-center rounded-e-md text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white"
          disabled={disabled || readOnly}
          aria-label="Choose a date and time"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-5"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </button>
      </div>
      {name ? (
        <input
          type="hidden"
          name={name}
          value={committedValue}
          disabled={disabled}
        />
      ) : null}
      <p
        id={statusId}
        data-slot="schedule-picker-status"
        className="text-sm text-gray-600 aria-invalid:text-red-700 dark:text-gray-400 dark:aria-invalid:text-red-400"
        aria-invalid={invalid}
        aria-live="polite"
      >
        {statusText}
      </p>

      <Popover
        ref={popoverRef}
        id={popoverId}
        anchor={inputId}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
        placement="bottom-start"
        data-slot="schedule-picker-popover"
        className="max-h-[min(var(--klean-popover-available-height,100dvh),calc(100dvh-1rem))] w-[min(24rem,calc(100vw-1rem))] overflow-y-auto overscroll-contain rounded-xl p-0"
      >
        <div ref={panelRef} data-slot="schedule-picker-panel">
          <div className="grid">
            <Calendar
              value={selectedDate}
              min={calendarBounds.min}
              max={calendarBounds.max}
              locale={locale}
              dir={dir}
              disabled={disabled}
              readOnly={readOnly}
              className="max-w-none p-4"
              onValueChange={(date) => stage(date, selectedTime)}
            />
            <section
              data-slot="schedule-picker-times"
              className="sticky bottom-0 grid min-w-0 gap-2 border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950"
              aria-labelledby={timeHeadingId}
            >
              <div className="flex min-w-0 items-baseline justify-between gap-3">
                <h2 id={timeHeadingId} className="text-sm font-medium">
                  Time
                </h2>
                <p
                  id={`${inputId}-time-zone`}
                  data-slot="schedule-picker-time-zone"
                  className="min-w-0 text-end text-xs wrap-anywhere text-gray-500 dark:text-gray-400"
                >
                  {zone}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div
                  data-slot="schedule-picker-time-fields"
                  role="group"
                  aria-labelledby={timeHeadingId}
                  aria-describedby={`${inputId}-time-zone`}
                  dir="ltr"
                  className="inline-flex shrink-0 items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-sm font-medium tabular-nums shadow-xs dark:border-gray-700 dark:bg-gray-900"
                >
                  <select
                    data-slot="schedule-picker-hour"
                    aria-label="Hour"
                    className="h-11 w-11 cursor-pointer appearance-none rounded-md bg-transparent text-center text-gray-950 hover:bg-gray-200/60 focus-visible:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:outline-white"
                    value={fields.hour}
                    disabled={disabled || readOnly}
                    onChange={(event) =>
                      chooseTimeField('hour', event.target.value)
                    }
                  >
                    {fields.hours.map((hour) => (
                      <option key={hour.value} value={hour.value}>
                        {hour.label}
                      </option>
                    ))}
                  </select>
                  <span aria-hidden="true" className="text-gray-400">
                    :
                  </span>
                  <select
                    data-slot="schedule-picker-minute"
                    aria-label="Minute"
                    className="h-11 w-11 cursor-pointer appearance-none rounded-md bg-transparent text-center text-gray-950 hover:bg-gray-200/60 focus-visible:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:outline-white"
                    value={fields.minute}
                    disabled={disabled || readOnly}
                    onChange={(event) =>
                      chooseTimeField('minute', event.target.value)
                    }
                  >
                    {minutes.map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                  {fields.hour12 ? (
                    <div className="relative ms-1 border-s border-gray-200 ps-1 dark:border-gray-700">
                      <select
                        data-slot="schedule-picker-period"
                        aria-label="Period"
                        className="h-11 min-w-16 cursor-pointer appearance-none rounded-md bg-transparent ps-2 pe-6 text-gray-950 hover:bg-gray-200/60 focus-visible:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:outline-white"
                        value={fields.period}
                        disabled={disabled || readOnly}
                        onChange={(event) =>
                          chooseTimeField('period', event.target.value)
                        }
                      >
                        {fields.periods.map((period) => (
                          <option key={period.value} value={period.value}>
                            {period.label}
                          </option>
                        ))}
                      </select>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="pointer-events-none absolute inset-e-2 top-1/2 size-3 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      >
                        <path d="m7 10 5 5 5-5" />
                      </svg>
                    </div>
                  ) : null}
                </div>
                <div data-slot="schedule-picker-footer">
                  <button
                    type="button"
                    data-slot="schedule-picker-confirm"
                    className="min-h-11 cursor-pointer rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:outline-white"
                    disabled={
                      (!committable && interpretation.state !== 'committed') ||
                      invalid ||
                      disabled ||
                      readOnly
                    }
                    onClick={finish}
                  >
                    Done
                  </button>
                </div>
              </div>
              {invalid ? (
                <p className="text-sm text-red-700 dark:text-red-400">
                  {statusText}
                </p>
              ) : null}
            </section>
          </div>
        </div>
      </Popover>
    </div>
  )
})

export default SchedulePicker
