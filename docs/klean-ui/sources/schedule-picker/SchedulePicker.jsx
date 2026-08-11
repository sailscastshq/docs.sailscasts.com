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
import Calendar from '../calendar/Calendar.jsx'
import Input from '../input/Input.jsx'
import Popover from '../popover/Popover.jsx'
import {
  formatSchedule,
  formatTimeLabel,
  instantToWallClock,
  interpretSchedule,
  resolveTimeZone,
  roundedFutureWallClock,
  timeOptions,
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
    min,
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
  const initialWall =
    instantToWallClock(committedValue, zone) ||
    roundedFutureWallClock(new Date(), zone, minuteStep)
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
  const inputRef = useRef(null)
  const popoverRef = useRef(null)
  const panelRef = useRef(null)
  const rootRef = useRef(null)
  const configuredMinimum = new Date(min).getTime()
  const minimumTimestamp = Math.max(
    Date.now(),
    Number.isNaN(configuredMinimum) ? -Infinity : configuredMinimum
  )
  const calendarMin = instantToWallClock(
    new Date(minimumTimestamp + 1000).toISOString(),
    zone
  ).date
  const choices = useMemo(() => timeOptions(minuteStep), [minuteStep])
  const proposalIsPast =
    interpretation.state === 'proposal' &&
    new Date(interpretation.iso).getTime() <= minimumTimestamp
  const committable = interpretation.state === 'proposal' && !proposalIsPast
  const invalid =
    interpretation.state === 'invalid' ||
    proposalIsPast ||
    (touched && interpretation.state === 'incomplete')
  let statusText
  if (interpretation.state === 'empty')
    statusText = 'Type a date and time, or choose them from the calendar.'
  else if (interpretation.state === 'invalid')
    statusText = 'Enter a date and time, such as tomorrow at 9am.'
  else if (interpretation.state === 'incomplete')
    statusText = interpretation.message
  else if (proposalIsPast) statusText = 'Choose a time in the future.'
  else if (interpretation.state === 'proposal')
    statusText = `Will schedule for ${interpretation.label} in ${zone}. Press Enter or leave the picker to use it.`
  else statusText = `Scheduled for ${interpretation.label} in ${zone}.`
  const describedBy = [externalDescribedBy, statusId].filter(Boolean).join(' ')

  function updateValue(nextValue) {
    if (value === undefined) setInternalValue(nextValue)
    onValueChange?.(nextValue)
  }

  function readDraft(nextDraft) {
    setDraft(nextDraft)
    if (!nextDraft.trim()) {
      updateValue('')
      setInterpretation({ state: 'empty' })
      return
    }
    const next = interpretSchedule(nextDraft, {
      reference: new Date(),
      locale,
      timeZone: zone
    })
    setInterpretation(next)
    if (next.date) setSelectedDate(next.date)
    if (next.time) setSelectedTime(next.time)
  }

  function stage(date = selectedDate, time = selectedTime) {
    const iso = wallClockToIso({ date, time, timeZone: zone })
    if (!iso) {
      setInterpretation({ state: 'invalid' })
      return
    }
    const label = formatSchedule(iso, locale, zone)
    setSelectedDate(date)
    setSelectedTime(time)
    setDraft(label)
    setInterpretation({ state: 'proposal', iso, date, time, label })
  }

  function commitProposal({ restoreFocus = true } = {}) {
    if (!committable || disabled || readOnly) return
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

  function handleOpenChange(nextOpen) {
    onOpenChange?.(nextOpen)
    if (!nextOpen) return
    queueMicrotask(() =>
      panelRef.current
        ?.querySelector(`[data-time="${selectedTime}"]`)
        ?.scrollIntoView?.({ block: 'center' })
    )
  }

  function timeIsUnavailable(time) {
    const iso = wallClockToIso({ date: selectedDate, time, timeZone: zone })
    return !iso || new Date(iso).getTime() <= minimumTimestamp
  }

  function handleTimeKeyDown(event, index) {
    let nextIndex
    if (event.key === 'ArrowDown')
      nextIndex = Math.min(index + 1, choices.length - 1)
    else if (event.key === 'ArrowUp') nextIndex = Math.max(index - 1, 0)
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = choices.length - 1
    else return
    event.preventDefault()
    const movement = nextIndex >= index ? 1 : -1
    while (
      nextIndex >= 0 &&
      nextIndex < choices.length &&
      timeIsUnavailable(choices[nextIndex])
    ) {
      nextIndex += movement
    }
    const nextTime = choices[nextIndex]
    if (!nextTime) return
    setSelectedTime(nextTime)
    queueMicrotask(() =>
      panelRef.current
        ?.querySelector(`[data-time="${nextTime}"]`)
        ?.focus({ preventScroll: true })
    )
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
      inputRef.current.setCustomValidity('Choose a schedule.')
    else if (invalid) inputRef.current.setCustomValidity(statusText)
    else inputRef.current.setCustomValidity('')
  }, [committable, committedValue, invalid, required, statusText])

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
          data-slot="schedule-picker-input"
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
            } else if (event.key === 'Enter' && committable) {
              event.preventDefault()
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
      {name ? <input type="hidden" name={name} value={committedValue} /> : null}
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
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
        placement="bottom-start"
        data-slot="schedule-picker-popover"
        className="w-[min(42rem,calc(100vw-1rem))] p-0"
      >
        <div ref={panelRef} data-slot="schedule-picker-panel">
          <div className="grid sm:grid-cols-[minmax(0,1fr)_10rem]">
            <Calendar
              value={selectedDate}
              min={calendarMin}
              locale={locale}
              dir={dir}
              disabled={disabled}
              readOnly={readOnly}
              className="max-w-none p-4"
              onValueChange={(date) => stage(date, selectedTime)}
            />
            <section
              data-slot="schedule-picker-times"
              className="border-t border-gray-200 p-3 sm:border-s sm:border-t-0 dark:border-gray-700"
              aria-labelledby={timeHeadingId}
            >
              <h2
                id={timeHeadingId}
                className="px-2 pb-2 text-sm font-semibold"
              >
                Time
              </h2>
              <div
                role="listbox"
                aria-label="Choose a time"
                className="max-h-64 overflow-y-auto overscroll-contain"
              >
                {choices.map((time, index) => (
                  <button
                    key={time}
                    type="button"
                    role="option"
                    data-slot="schedule-picker-time"
                    data-time={time}
                    aria-selected={time === selectedTime}
                    disabled={timeIsUnavailable(time)}
                    tabIndex={time === selectedTime ? 0 : -1}
                    className="block min-h-11 w-full rounded-md px-3 text-start text-sm tabular-nums hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:text-gray-300 aria-selected:bg-gray-950 aria-selected:font-semibold aria-selected:text-white dark:hover:bg-gray-800 dark:focus-visible:outline-white dark:disabled:text-gray-700 dark:aria-selected:bg-white dark:aria-selected:text-gray-950"
                    onClick={() => stage(selectedDate, time)}
                    onKeyDown={(event) => handleTimeKeyDown(event, index)}
                  >
                    {formatTimeLabel(time, locale)}
                  </button>
                ))}
              </div>
            </section>
          </div>
          <footer
            data-slot="schedule-picker-footer"
            className="flex flex-col gap-3 border-t border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {statusText}
            </p>
            <button
              type="button"
              data-slot="schedule-picker-confirm"
              className="min-h-11 shrink-0 rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:outline-white"
              disabled={!committable || disabled || readOnly}
              onClick={() => commitProposal()}
            >
              Use this time
            </button>
          </footer>
        </div>
      </Popover>
    </div>
  )
})

export default SchedulePicker
