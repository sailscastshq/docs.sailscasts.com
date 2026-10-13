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

function serializedValue(value) {
  return ['string', 'number', 'boolean'].includes(typeof value)
    ? String(value)
    : ''
}

const MultiSelect = forwardRef(function MultiSelect(
  {
    value: controlledValue,
    defaultValue,
    options = [],
    placeholder = 'Select options',
    name,
    required = false,
    disabled = false,
    id,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    onValueChange,
    onChange,
    placement = 'bottom-start',
    offset = 4,
    className,
    style,
    renderValue,
    renderOption,
    renderIcon,
    renderEmpty,
    onClick,
    onKeyDown,
    onBlur,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-invalid': ariaInvalid,
    ...triggerProps
  },
  forwardedRef
) {
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const controlId = id ?? `klean-multi-select-${generatedId}`
  const contentId = `${controlId}-content`
  const listboxId = `${controlId}-listbox`
  const triggerRef = useRef(null)
  const rootRef = useRef(null)
  const popoverRef = useRef(null)
  const typeahead = useRef('')
  const typeaheadTimer = useRef()
  const pendingEdge = useRef('selected')
  const [nativeReset, setNativeReset] = useState(0)
  const [invalid, setInvalid] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue ?? [])
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [triggerWidth, setTriggerWidth] = useState(0)
  const isValueControlled = controlledValue !== undefined
  const currentValue = isValueControlled ? controlledValue : internalValue
  const isOpenControlled = controlledOpen !== undefined
  const isOpen = isOpenControlled ? controlledOpen : internalOpen
  const selectedOptions = options.filter((option) =>
    (currentValue ?? []).some((item) => Object.is(item, option.value))
  )
  const selectedIndex = options.findIndex((option) =>
    selectedOptions.includes(option)
  )
  const hasSelection = selectedOptions.length > 0
  const isSelected = (index) => selectedOptions.includes(options[index])
  const activeDescendant =
    isOpen && highlightedIndex >= 0
      ? `${controlId}-option-${highlightedIndex}`
      : undefined
  const groups = useMemo(() => {
    const grouped = new Map()

    options.forEach((option, index) => {
      const label = option.group ?? null
      if (!grouped.has(label)) grouped.set(label, [])
      grouped.get(label).push({ option, index })
    })

    return [...grouped].map(([label, entries]) => ({ label, entries }))
  }, [options])

  const clearTypeahead = useCallback(() => {
    typeahead.current = ''
    clearTimeout(typeaheadTimer.current)
    typeaheadTimer.current = undefined
  }, [])

  const initialHighlight = useCallback(
    (edge = 'selected') => {
      const enabled = groups.flatMap((group) =>
        group.entries
          .filter(({ option }) => !option.disabled)
          .map(({ index }) => index)
      )
      if (!enabled.length) return -1
      if (
        edge === 'selected' &&
        selectedIndex >= 0 &&
        !options[selectedIndex]?.disabled
      ) {
        return selectedIndex
      }
      return edge === 'last' ? enabled.at(-1) : enabled[0]
    },
    [options, selectedIndex]
  )

  const syncTriggerWidth = useCallback(() => {
    setTriggerWidth(triggerRef.current?.getBoundingClientRect().width ?? 0)
  }, [])

  const revealHighlighted = useCallback((index) => {
    if (index < 0) return
    queueMicrotask(() => {
      popoverRef.current?.content
        ?.querySelector?.(`[data-option-index="${index}"]`)
        ?.scrollIntoView?.({ block: 'nearest' })
    })
  }, [])

  const requestOpen = useCallback(
    (nextOpen) => {
      if (!isOpenControlled) setInternalOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [isOpenControlled, onOpenChange]
  )

  const openMultiSelect = useCallback(
    (edge = 'selected') => {
      if (disabled) return
      pendingEdge.current = edge
      syncTriggerWidth()

      if (isOpen) {
        const next = initialHighlight(edge)
        setHighlightedIndex(next)
        revealHighlighted(next)
      } else {
        popoverRef.current?.open(triggerRef.current)
      }
    },
    [disabled, initialHighlight, isOpen, revealHighlighted, syncTriggerWidth]
  )

  const closeMultiSelect = useCallback(({ restoreFocus = false } = {}) => {
    popoverRef.current?.close({ restoreFocus })
  }, [])

  const choose = useCallback(
    (index) => {
      const option = options[index]
      if (!option || option.disabled || disabled) return

      setInvalid(false)
      const next = (currentValue ?? []).some((item) =>
        Object.is(item, option.value)
      )
        ? (currentValue ?? []).filter((item) => !Object.is(item, option.value))
        : [...(currentValue ?? []), option.value]
      if (!isValueControlled) setInternalValue(next)
      onValueChange?.(next, option)
      onChange?.(next, option)
      setHighlightedIndex(index)
      clearTypeahead()
    },
    [
      currentValue,
      clearTypeahead,
      closeMultiSelect,
      disabled,
      isValueControlled,
      onChange,
      onValueChange,
      options
    ]
  )

  const findTypeaheadMatch = useCallback(
    (text) => {
      const enabled = groups.flatMap((group) =>
        group.entries
          .filter(({ option }) => !option.disabled)
          .map(({ index }) => index)
      )
      if (!enabled.length) return -1
      const current = enabled.indexOf(isOpen ? highlightedIndex : selectedIndex)
      const ordered = [
        ...enabled.slice(current + 1),
        ...enabled.slice(0, current + 1)
      ]
      return (
        ordered.find((index) =>
          String(options[index]?.label ?? '')
            .trim()
            .toLocaleLowerCase()
            .startsWith(text)
        ) ?? -1
      )
    },
    [highlightedIndex, isOpen, options, selectedIndex]
  )

  const handleTypeahead = useCallback(
    (event) => {
      if (
        event.key.length !== 1 ||
        event.key === ' ' ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return false
      }

      event.preventDefault()
      clearTimeout(typeaheadTimer.current)
      typeahead.current += event.key.toLocaleLowerCase()
      typeaheadTimer.current = setTimeout(clearTypeahead, 500)
      let match = findTypeaheadMatch(typeahead.current)

      if (match < 0 && new Set(typeahead.current).size === 1) {
        typeahead.current = typeahead.current.at(-1)
        match = findTypeaheadMatch(typeahead.current)
      }

      if (match < 0) return true
      if (isOpen) {
        setHighlightedIndex(match)
        revealHighlighted(match)
      } else {
        openMultiSelect()
        setHighlightedIndex(match)
        revealHighlighted(match)
      }
      return true
    },
    [
      openMultiSelect,
      clearTypeahead,
      findTypeaheadMatch,
      isOpen,
      revealHighlighted
    ]
  )

  const moveHighlight = useCallback(
    (step) => {
      const enabled = groups.flatMap((group) =>
        group.entries
          .filter(({ option }) => !option.disabled)
          .map(({ index }) => index)
      )
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
    [highlightedIndex, options, revealHighlighted]
  )

  function handleKeydown(event) {
    onKeyDown?.(event)
    if (event.defaultPrevented || disabled) return

    if (!isOpen) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault()
        openMultiSelect(event.key === 'ArrowUp' ? 'last' : 'selected')
      } else {
        handleTypeahead(event)
      }
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      closeMultiSelect({ restoreFocus: true })
    } else if (event.key === 'Tab') {
      clearTypeahead()
      closeMultiSelect()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveHighlight(1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveHighlight(-1)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const next = initialHighlight(event.key === 'End' ? 'last' : 'first')
      setHighlightedIndex(next)
      revealHighlighted(next)
    } else if (['Enter', ' '].includes(event.key)) {
      event.preventDefault()
      if (highlightedIndex >= 0) choose(highlightedIndex)
    } else {
      handleTypeahead(event)
    }
  }

  useEffect(() => {
    clearTypeahead()
    if (!isOpen) {
      setHighlightedIndex(-1)
      return
    }

    const next =
      highlightedIndex >= 0 && !options[highlightedIndex]?.disabled
        ? highlightedIndex
        : initialHighlight(pendingEdge.current)
    pendingEdge.current = 'selected'
    setHighlightedIndex(next)
    syncTriggerWidth()
    revealHighlighted(next)
  }, [
    clearTypeahead,
    initialHighlight,
    isOpen,
    revealHighlighted,
    syncTriggerWidth
  ])

  useEffect(() => {
    if (!isOpen) return
    const next =
      highlightedIndex >= 0 && !options[highlightedIndex]?.disabled
        ? highlightedIndex
        : initialHighlight('selected')
    setHighlightedIndex(next)
    revealHighlighted(next)
  }, [initialHighlight, isOpen, options, revealHighlighted])

  useEffect(() => {
    const form = triggerProps.form
      ? document.getElementById(triggerProps.form)
      : rootRef.current?.closest?.('form')
    const handleReset = () => {
      setInvalid(false)
      setTimeout(() => {
        if (!isValueControlled) setInternalValue([...(defaultValue ?? [])])
        setNativeReset((version) => version + 1)
      }, 0)
      if (isOpen) closeMultiSelect()
    }
    form?.addEventListener('reset', handleReset)

    const observer =
      typeof ResizeObserver !== 'undefined' && triggerRef.current
        ? new ResizeObserver(syncTriggerWidth)
        : undefined
    if (triggerRef.current) observer?.observe(triggerRef.current)
    syncTriggerWidth()

    return () => {
      clearTypeahead()
      observer?.disconnect()
      form?.removeEventListener('reset', handleReset)
    }
  }, [
    clearTypeahead,
    closeMultiSelect,
    defaultValue,
    isOpen,
    isValueControlled,
    syncTriggerWidth
  ])

  useEffect(() => {
    if (disabled && isOpen) closeMultiSelect()
  }, [disabled, isOpen, closeMultiSelect])

  useImperativeHandle(
    forwardedRef,
    () => ({
      close: closeMultiSelect,
      focus: (focusOptions) => triggerRef.current?.focus(focusOptions),
      open: openMultiSelect,
      trigger: triggerRef.current
    }),
    [closeMultiSelect, openMultiSelect]
  )

  return (
    <span
      ref={rootRef}
      data-slot="multi-select"
      data-state={isOpen ? 'open' : 'closed'}
      data-placeholder={hasSelection ? undefined : ''}
      data-disabled={disabled ? '' : undefined}
      data-invalid={
        (ariaInvalid ?? invalid) === true || (ariaInvalid ?? invalid) === 'true'
          ? ''
          : undefined
      }
      className="relative grid w-full"
    >
      <button
        {...triggerProps}
        ref={triggerRef}
        id={controlId}
        type="button"
        role="combobox"
        disabled={disabled}
        popoverTarget={contentId}
        popoverTargetAction="toggle"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-invalid={ariaInvalid ?? (invalid || undefined)}
        aria-expanded={String(isOpen)}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-activedescendant={activeDescendant}
        aria-required={required || undefined}
        data-slot="multi-select-trigger"
        data-state={isOpen ? 'open' : 'closed'}
        data-placeholder={hasSelection ? undefined : ''}
        className={twMerge(
          'flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-base text-gray-950 shadow-sm outline-none transition-colors duration-150 hover:border-gray-400 focus-visible:border-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 aria-invalid:border-red-600 aria-invalid:focus-visible:outline-red-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:border-gray-600 dark:focus-visible:border-white dark:focus-visible:outline-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500 dark:aria-invalid:border-red-500 dark:aria-invalid:focus-visible:outline-red-500 motion-reduce:transition-none',
          className
        )}
        style={style}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented) return
          if (!isOpen) pendingEdge.current = 'selected'
          syncTriggerWidth()
        }}
        onKeyDown={handleKeydown}
        onBlur={onBlur}
      >
        <span
          data-slot="multi-select-value"
          className={
            hasSelection
              ? 'truncate'
              : 'truncate text-gray-500 dark:text-gray-400'
          }
        >
          {hasSelection
            ? (renderValue?.(selectedOptions) ??
              selectedOptions.map((option) => option.label).join(', '))
            : placeholder}
        </span>

        <span
          data-slot="multi-select-icon"
          className="shrink-0 text-gray-500 dark:text-gray-400"
        >
          {renderIcon?.(isOpen) ?? (
            <svg
              aria-hidden="true"
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
      </button>

      <select
        key={nativeReset}
        multiple
        aria-hidden="true"
        tabIndex={-1}
        className="sr-only"
        data-slot="multi-select-native"
        name={name}
        required={required}
        disabled={disabled}
        form={triggerProps.form}
        value={selectedOptions.map((option) => serializedValue(option.value))}
        onChange={() => {}}
        onInvalid={(event) => {
          event.preventDefault()
          setInvalid(true)
          triggerRef.current?.focus()
        }}
      >
        {options.map((option, index) => (
          <option
            key={index}
            value={serializedValue(option.value)}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      <Popover
        ref={popoverRef}
        id={contentId}
        open={isOpen}
        placement={placement}
        offset={offset}
        data-slot="multi-select-content"
        className="max-h-72 overflow-hidden p-1"
        style={triggerWidth ? { minWidth: `${triggerWidth}px` } : undefined}
        onOpenChange={requestOpen}
      >
        <div
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={
            ariaLabel ? undefined : (ariaLabelledby ?? controlId)
          }
          aria-label={ariaLabel ? `${ariaLabel} options` : undefined}
          data-slot="multi-select-listbox"
          className="max-h-68 overflow-y-auto overscroll-contain outline-none"
        >
          {options.length ? (
            groups.map((group, groupIndex) => (
              <div
                key={group.label ?? `ungrouped-${groupIndex}`}
                role={group.label ? 'group' : undefined}
                aria-label={group.label || undefined}
                data-slot="multi-select-group"
              >
                {group.label ? (
                  <p
                    data-slot="multi-select-group-label"
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
                    aria-label={String(option.label)}
                    aria-selected={String(isSelected(index))}
                    aria-disabled={option.disabled || undefined}
                    data-slot="multi-select-option"
                    data-option-index={index}
                    data-highlighted={
                      index === highlightedIndex ? '' : undefined
                    }
                    data-selected={isSelected(index) ? '' : undefined}
                    data-disabled={option.disabled ? '' : undefined}
                    className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded px-3 py-2 text-sm text-gray-700 outline-none data-highlighted:bg-gray-100 data-highlighted:text-gray-950 data-disabled:cursor-not-allowed data-disabled:opacity-40 dark:text-gray-200 dark:data-highlighted:bg-white/10 dark:data-highlighted:text-white"
                    onPointerMove={() => {
                      if (!option.disabled) setHighlightedIndex(index)
                    }}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() => choose(index)}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {renderOption?.(option, {
                        selected: isSelected(index),
                        highlighted: index === highlightedIndex
                      }) ?? option.label}
                    </span>
                    <span
                      data-slot="multi-select-indicator"
                      className="grid size-5 shrink-0 place-items-center"
                      aria-hidden="true"
                    >
                      {isSelected(index) ? (
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="size-4"
                        >
                          <path
                            d="m5 10 3 3 7-7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                    </span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div
              data-slot="multi-select-empty"
              className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              {renderEmpty?.() ?? 'No options available.'}
            </div>
          )}
        </div>
      </Popover>
    </span>
  )
})

export default MultiSelect
