import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { twMerge } from 'tailwind-merge'
import Popover from '../popover/Popover.jsx'

const INPUT_CLASSES =
  'min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-base text-gray-950 shadow-sm outline-none transition-colors duration-150 placeholder:text-gray-500 hover:border-gray-400 focus:border-gray-950 focus:outline-2 focus:outline-offset-2 focus:outline-gray-950 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 aria-invalid:border-red-600 aria-invalid:focus:outline-red-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-400 dark:hover:border-gray-600 dark:focus:border-white dark:focus:outline-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500 dark:aria-invalid:border-red-500 dark:aria-invalid:focus:outline-red-500 motion-reduce:transition-none'

function serializedValue(value) {
  return ['string', 'number', 'boolean'].includes(typeof value)
    ? String(value)
    : ''
}

function searchableText(option) {
  return [option.label, option.description, ...(option.keywords ?? [])]
    .filter(Boolean)
    .join(' ')
    .normalize('NFKD')
    .toLocaleLowerCase()
}

const Combobox = forwardRef(function Combobox(
  {
    value: controlledValue,
    defaultValue,
    options = [],
    query: controlledQuery,
    defaultQuery = '',
    placeholder = 'Search and choose',
    emptyText = 'No matches found.',
    loadingText = 'Searching…',
    loading = false,
    error = '',
    searchDelay = 300,
    name,
    required = false,
    disabled = false,
    id,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    onValueChange,
    onQueryChange,
    onChange,
    onSearch,
    placement = 'bottom-start',
    offset = 4,
    className,
    style,
    renderOption,
    renderEmpty,
    renderLoading,
    renderError,
    onFocus,
    onClick,
    onInput,
    onKeyDown,
    onBlur,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedby,
    form,
    ...inputProps
  },
  forwardedRef
) {
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const controlId = id ?? `klean-combobox-${generatedId}`
  const contentId = `${controlId}-content`
  const listboxId = `${controlId}-listbox`
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const popoverRef = useRef(null)
  const searchTimer = useRef()
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [internalQuery, setInternalQuery] = useState(defaultQuery)
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [inputWidth, setInputWidth] = useState(0)
  const isValueControlled = controlledValue !== undefined
  const currentValue = isValueControlled ? controlledValue : internalValue
  const isQueryControlled = controlledQuery !== undefined
  const currentQuery = isQueryControlled ? controlledQuery : internalQuery
  const isOpenControlled = controlledOpen !== undefined
  const isOpen = isOpenControlled ? controlledOpen : internalOpen
  const selectedIndex = options.findIndex((option) =>
    Object.is(option.value, currentValue)
  )
  const selectedOption = options[selectedIndex]
  const visibleValue = isOpen
    ? currentQuery
    : String(selectedOption?.label ?? '')

  const filteredEntries = useMemo(() => {
    const needle = currentQuery.trim().normalize('NFKD').toLocaleLowerCase()
    return options
      .map((option, index) => ({ option, index }))
      .filter(
        ({ option }) => !needle || searchableText(option).includes(needle)
      )
  }, [currentQuery, options])
  const groupedEntries = useMemo(() => {
    const groups = new Map()
    for (const entry of filteredEntries) {
      const label = entry.option.group ?? null
      if (!groups.has(label)) groups.set(label, [])
      groups.get(label).push(entry)
    }
    return [...groups].map(([label, entries]) => ({ label, entries }))
  }, [filteredEntries])
  const activeDescendant =
    isOpen && highlightedIndex >= 0
      ? `${controlId}-option-${highlightedIndex}`
      : undefined

  const enabledIndexes = useCallback(
    () =>
      filteredEntries
        .filter(({ option }) => !option.disabled)
        .map(({ index }) => index),
    [filteredEntries]
  )

  const initialHighlight = useCallback(
    (edge = 'selected') => {
      const enabled = enabledIndexes()
      if (!enabled.length) return -1
      if (edge === 'selected' && enabled.includes(selectedIndex)) {
        return selectedIndex
      }
      return edge === 'last' ? enabled.at(-1) : enabled[0]
    },
    [enabledIndexes, selectedIndex]
  )

  const revealHighlighted = useCallback((index) => {
    if (index < 0) return
    queueMicrotask(() => {
      popoverRef.current?.content
        ?.querySelector?.(`[data-option-index="${index}"]`)
        ?.scrollIntoView?.({ block: 'nearest' })
    })
  }, [])

  const syncInputWidth = useCallback(() => {
    setInputWidth(inputRef.current?.getBoundingClientRect().width ?? 0)
  }, [])

  const setQuery = useCallback(
    (nextQuery, { search = false } = {}) => {
      if (!isQueryControlled) setInternalQuery(nextQuery)
      onQueryChange?.(nextQuery)
      clearTimeout(searchTimer.current)
      searchTimer.current = undefined
      if (!search) return
      searchTimer.current = setTimeout(
        () => {
          onSearch?.(nextQuery)
          searchTimer.current = undefined
        },
        Math.max(0, searchDelay)
      )
    },
    [isQueryControlled, onQueryChange, onSearch, searchDelay]
  )

  const requestOpen = useCallback(
    (nextOpen) => {
      if (!isOpenControlled) setInternalOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [isOpenControlled, onOpenChange]
  )

  const openCombobox = useCallback(
    (edge = 'first') => {
      if (disabled) return
      syncInputWidth()
      if (!isOpen) {
        setQuery('', { search: true })
        popoverRef.current?.open(inputRef.current)
      } else {
        const next = initialHighlight(edge)
        setHighlightedIndex(next)
        revealHighlighted(next)
      }
    },
    [
      disabled,
      initialHighlight,
      isOpen,
      revealHighlighted,
      setQuery,
      syncInputWidth
    ]
  )

  const closeCombobox = useCallback(
    ({ restoreFocus = false } = {}) => {
      setQuery('')
      popoverRef.current?.close({ restoreFocus })
    },
    [setQuery]
  )

  const moveHighlight = useCallback(
    (step) => {
      const enabled = enabledIndexes()
      if (!enabled.length) return
      const current = enabled.indexOf(highlightedIndex)
      const position =
        current < 0
          ? step > 0
            ? 0
            : enabled.length - 1
          : (current + step + enabled.length) % enabled.length
      const next = enabled[position]
      setHighlightedIndex(next)
      revealHighlighted(next)
    },
    [enabledIndexes, highlightedIndex, revealHighlighted]
  )

  const choose = useCallback(
    (index) => {
      const option = options[index]
      if (!option || option.disabled || disabled) return
      if (!isValueControlled) setInternalValue(option.value)
      onValueChange?.(option.value, option)
      onChange?.(option.value, option)
      setHighlightedIndex(index)
      closeCombobox({ restoreFocus: true })
    },
    [
      closeCombobox,
      disabled,
      isValueControlled,
      onChange,
      onValueChange,
      options
    ]
  )

  useImperativeHandle(
    forwardedRef,
    () => ({
      close: closeCombobox,
      focus: (options) => inputRef.current?.focus(options),
      input: inputRef.current,
      open: openCombobox
    }),
    [closeCombobox, openCombobox]
  )

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1)
      return
    }
    const next = initialHighlight('selected')
    setHighlightedIndex(next)
    syncInputWidth()
    revealHighlighted(next)
  }, [isOpen, initialHighlight, revealHighlighted, syncInputWidth])

  useEffect(() => {
    if (!isOpen) return
    const enabled = enabledIndexes()
    if (!enabled.includes(highlightedIndex)) {
      const next = enabled[0] ?? -1
      setHighlightedIndex(next)
      revealHighlighted(next)
    }
  }, [enabledIndexes, highlightedIndex, isOpen, revealHighlighted])

  useEffect(() => {
    const node = inputRef.current
    const parentForm = rootRef.current?.closest?.('form')
    const handleReset = () => {
      clearTimeout(searchTimer.current)
      if (!isValueControlled) setInternalValue(defaultValue)
      setQuery(defaultQuery)
      if (isOpen) closeCombobox()
    }
    parentForm?.addEventListener('reset', handleReset)
    const observer =
      typeof ResizeObserver !== 'undefined' && node
        ? new ResizeObserver(syncInputWidth)
        : undefined
    observer?.observe(node)
    syncInputWidth()
    return () => {
      clearTimeout(searchTimer.current)
      observer?.disconnect()
      parentForm?.removeEventListener('reset', handleReset)
    }
  }, [
    closeCombobox,
    defaultQuery,
    defaultValue,
    isOpen,
    isValueControlled,
    setQuery,
    syncInputWidth
  ])

  function handleInput(event) {
    onInput?.(event)
    if (event.defaultPrevented) return
    if (!isOpen) openCombobox()
    setQuery(event.currentTarget.value, { search: true })
  }

  function handleKeydown(event) {
    onKeyDown?.(event)
    if (event.defaultPrevented || disabled) return

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) openCombobox(event.key === 'ArrowUp' ? 'last' : 'first')
      else moveHighlight(event.key === 'ArrowDown' ? 1 : -1)
    } else if (event.key === 'Home' && isOpen) {
      event.preventDefault()
      const next = initialHighlight('first')
      setHighlightedIndex(next)
      revealHighlighted(next)
    } else if (event.key === 'End' && isOpen) {
      event.preventDefault()
      const next = initialHighlight('last')
      setHighlightedIndex(next)
      revealHighlighted(next)
    } else if (event.key === 'Enter' && isOpen) {
      event.preventDefault()
      if (highlightedIndex >= 0) choose(highlightedIndex)
    } else if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      event.stopPropagation()
      closeCombobox({ restoreFocus: true })
    } else if (event.key === 'Tab' && isOpen) {
      closeCombobox()
    }
  }

  function handlePopoverOpen(nextOpen) {
    requestOpen(nextOpen)
    if (!nextOpen) setQuery('')
  }

  return (
    <span
      ref={rootRef}
      data-slot="combobox"
      data-state={isOpen ? 'open' : 'closed'}
      data-disabled={disabled ? '' : undefined}
      data-invalid={
        ariaInvalid === true || ariaInvalid === 'true' ? '' : undefined
      }
      className="relative grid w-full"
    >
      <span data-slot="combobox-control" className="relative grid">
        <input
          {...inputProps}
          ref={inputRef}
          id={controlId}
          type="text"
          role="combobox"
          autoComplete="off"
          disabled={disabled}
          value={visibleValue}
          placeholder={placeholder}
          popovertarget={contentId}
          popovertargetaction="show"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-activedescendant={activeDescendant}
          aria-required={required || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
          data-slot="combobox-input"
          data-state={isOpen ? 'open' : 'closed'}
          className={twMerge(INPUT_CLASSES, className)}
          style={style}
          onFocus={(event) => {
            onFocus?.(event)
            if (!event.defaultPrevented) openCombobox('selected')
          }}
          onClick={(event) => {
            onClick?.(event)
            if (!event.defaultPrevented) openCombobox('selected')
          }}
          onInput={handleInput}
          onKeyDown={handleKeydown}
          onBlur={onBlur}
        />

        <span
          data-slot="combobox-icon"
          className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-gray-500 dark:text-gray-400"
          aria-hidden="true"
        >
          {loading ? (
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="size-4 animate-spin motion-reduce:animate-none"
            >
              <path d="M17 10a7 7 0 1 1-2.05-4.95" strokeLinecap="round" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="size-4"
            >
              <path
                d="m6 8 4 4 4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </span>

      {name ? (
        <input
          type="hidden"
          name={name}
          value={serializedValue(currentValue)}
          disabled={disabled}
          form={form}
        />
      ) : null}

      <Popover
        ref={popoverRef}
        id={contentId}
        open={isOpen}
        onOpenChange={handlePopoverOpen}
        placement={placement}
        offset={offset}
        data-slot="combobox-content"
        className="max-h-80 overflow-hidden p-1"
        style={inputWidth ? { minWidth: inputWidth } : undefined}
      >
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={
            ariaLabel ? undefined : (ariaLabelledby ?? controlId)
          }
          aria-label={ariaLabel ? `${ariaLabel} options` : undefined}
          aria-busy={loading || undefined}
          data-slot="combobox-listbox"
          className="max-h-[19rem] overflow-y-auto overscroll-contain outline-none"
        >
          {error ? (
            <div
              role="status"
              data-slot="combobox-error"
              className="px-3 py-2 text-sm text-red-700 dark:text-red-400"
            >
              {renderError?.(error) ?? error}
            </div>
          ) : null}

          {groupedEntries.map((group, groupIndex) => (
            <div
              key={group.label ?? `ungrouped-${groupIndex}`}
              role={group.label ? 'group' : undefined}
              aria-label={group.label || undefined}
              data-slot="combobox-group"
            >
              {group.label ? (
                <p
                  data-slot="combobox-group-label"
                  className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {group.label}
                </p>
              ) : null}
              {group.entries.map(({ option, index }) => (
                <div
                  id={`${controlId}-option-${index}`}
                  key={index}
                  role="option"
                  aria-selected={index === selectedIndex}
                  aria-disabled={option.disabled || undefined}
                  data-slot="combobox-option"
                  data-option-index={index}
                  data-highlighted={index === highlightedIndex ? '' : undefined}
                  data-selected={index === selectedIndex ? '' : undefined}
                  data-disabled={option.disabled ? '' : undefined}
                  className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded px-3 py-2 text-sm text-gray-700 outline-none data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-950 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 dark:text-gray-200 dark:data-[highlighted]:bg-white/10 dark:data-[highlighted]:text-white"
                  onPointerMove={() =>
                    !option.disabled && setHighlightedIndex(index)
                  }
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => choose(index)}
                >
                  <span className="min-w-0 flex-1">
                    {renderOption ? (
                      renderOption(option, {
                        selected: index === selectedIndex,
                        highlighted: index === highlightedIndex
                      })
                    ) : (
                      <>
                        <span className="block truncate">{option.label}</span>
                        {option.description ? (
                          <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </span>
                        ) : null}
                      </>
                    )}
                  </span>
                  {index === selectedIndex ? (
                    <svg
                      data-slot="combobox-indicator"
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="size-4 shrink-0"
                    >
                      <path
                        d="m5 10 3 3 7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </div>
              ))}
            </div>
          ))}

          {!filteredEntries.length && !loading ? (
            <div
              data-slot="combobox-empty"
              className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              {renderEmpty?.(currentQuery) ?? emptyText}
            </div>
          ) : null}

          {loading ? (
            <div
              role="status"
              data-slot="combobox-loading"
              className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400"
            >
              {renderLoading?.() ?? loadingText}
            </div>
          ) : null}
        </div>
      </Popover>
    </span>
  )
})

export default Combobox
