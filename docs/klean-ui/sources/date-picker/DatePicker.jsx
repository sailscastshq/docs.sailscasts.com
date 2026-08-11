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
  dateIsUnavailable,
  dateLabel,
  parseIsoDate,
  resolveLocale
} from '../calendar/date.js'
import Input from '../input/Input.jsx'
import Popover from '../popover/Popover.jsx'

const DatePicker = forwardRef(function DatePicker(
  {
    value,
    defaultValue,
    onValueChange,
    onChange,
    id,
    name,
    placeholder = 'YYYY-MM-DD',
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
    'aria-describedby': ariaDescribedBy,
    ...inputProps
  },
  forwardedRef
) {
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const inputId = id ?? `klean-date-picker-${generatedId}`
  const popoverId = `${inputId}-calendar`
  const descriptionId = `${inputId}-description`
  const [internalValue, setInternalValue] = useState(
    parseIsoDate(defaultValue) ? defaultValue : ''
  )
  const selected = value === undefined ? internalValue : value
  const [draft, setDraft] = useState(selected ?? '')
  const inputRef = useRef(null)
  const popoverRef = useRef(null)
  const locale = resolveLocale(localeProp)
  const invalid = Boolean(
    draft &&
      (!parseIsoDate(draft) ||
        dateIsUnavailable(draft, { min, max, unavailable }))
  )
  const describedValue =
    !invalid && parseIsoDate(draft)
      ? dateLabel(draft, locale, { weekday: 'long' })
      : ''
  const describedBy =
    [ariaDescribedBy, describedValue && descriptionId]
      .filter(Boolean)
      .join(' ') || undefined

  function commit(nextValue) {
    if (disabled || readOnly) return
    if (nextValue && dateIsUnavailable(nextValue, { min, max, unavailable }))
      return
    if (value === undefined) setInternalValue(nextValue)
    setDraft(nextValue)
    onValueChange?.(nextValue)
  }

  function handleChange(event) {
    onChange?.(event)
    if (event.defaultPrevented) return
    const nextValue = event.target.value.trim()
    setDraft(nextValue)
    if (
      !nextValue ||
      (parseIsoDate(nextValue) &&
        !dateIsUnavailable(nextValue, { min, max, unavailable }))
    ) {
      commit(nextValue)
    }
  }

  function handleCalendarChange(nextValue) {
    commit(nextValue)
    popoverRef.current?.close()
  }

  useEffect(() => setDraft(selected ?? ''), [selected])

  useEffect(() => {
    if (!inputRef.current) return
    if (required && !draft) inputRef.current.setCustomValidity('Choose a date.')
    else if (invalid)
      inputRef.current.setCustomValidity(
        'Enter an available date as YYYY-MM-DD.'
      )
    else inputRef.current.setCustomValidity('')
  }, [draft, invalid, required])

  useImperativeHandle(forwardedRef, () => ({
    input: inputRef.current,
    focus: (options) => inputRef.current?.focus(options),
    open: () => popoverRef.current?.open(),
    close: () => popoverRef.current?.close()
  }))

  return (
    <div
      data-slot="date-picker"
      className={twMerge(
        'relative flex w-full items-stretch **:data-[slot=input]:pe-12',
        className
      )}
    >
      <Input
        {...inputProps}
        ref={inputRef}
        id={inputId}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        name={name}
        value={draft}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        data-slot="date-picker-input"
        onChange={handleChange}
        onClick={() => !disabled && !readOnly && popoverRef.current?.open()}
        onKeyDown={(event) => {
          inputProps.onKeyDown?.(event)
          if (
            !event.defaultPrevented &&
            event.key === 'ArrowDown' &&
            !disabled &&
            !readOnly
          ) {
            event.preventDefault()
            popoverRef.current?.open()
          }
        }}
      />
      {describedValue ? (
        <span
          id={descriptionId}
          data-slot="date-picker-description"
          className="sr-only"
        >
          {describedValue}
        </span>
      ) : null}
      <button
        type="button"
        popoverTarget={popoverId}
        data-slot="date-picker-button"
        className="absolute inset-y-0 inset-e-0 grid min-w-11 place-items-center rounded-e-md text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white"
        disabled={disabled || readOnly}
        aria-label={draft ? `Change date, ${describedValue}` : 'Choose a date'}
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
      <Popover
        ref={popoverRef}
        id={popoverId}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        placement="bottom-start"
        data-slot="date-picker-popover"
        className="w-[min(22rem,calc(100vw-1rem))] p-0"
      >
        <Calendar
          value={parseIsoDate(selected) ? selected : undefined}
          defaultValue={parseIsoDate(draft) ? draft : undefined}
          min={min}
          max={max}
          unavailable={unavailable}
          locale={locale}
          dir={dir}
          disabled={disabled}
          readOnly={readOnly}
          onValueChange={handleCalendarChange}
        />
      </Popover>
    </div>
  )
})

export default DatePicker
