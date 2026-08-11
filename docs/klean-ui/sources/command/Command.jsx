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

function normalize(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/\p{Diacritic}/gu, '')
}

function defaultFilter(command, query) {
  const needle = normalize(query).trim()
  if (!needle) return true
  return normalize(
    [command.title, ...(command.keywords ?? [])].filter(Boolean).join(' ')
  ).includes(needle)
}

const Command = forwardRef(function Command(
  {
    commands = [],
    groups,
    query: controlledQuery,
    defaultQuery = '',
    label = 'Search commands',
    placeholder = 'Type a command or search…',
    filter = defaultFilter,
    autoFocus = false,
    id,
    className,
    prefix,
    suffix,
    before,
    footer,
    renderItem,
    renderEmpty,
    onQueryChange,
    onSelect,
    onEscape,
    onBack,
    onKeyDown,
    ...rootProps
  },
  forwardedRef
) {
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const controlId = id ?? `klean-command-${generatedId}`
  const inputId = `${controlId}-input`
  const listId = `${controlId}-list`
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const [internalQuery, setInternalQuery] = useState(defaultQuery)
  const [activeKey, setActiveKey] = useState()
  const isControlled = controlledQuery !== undefined
  const currentQuery = isControlled ? controlledQuery : internalQuery
  const previousQueryRef = useRef(currentQuery)

  const sourceGroups = useMemo(() => {
    if (groups !== undefined) {
      return Object.entries(groups).map(([heading, groupedCommands]) => ({
        heading,
        commands: Array.isArray(groupedCommands) ? groupedCommands : []
      }))
    }

    const collected = new Map()
    for (const command of commands) {
      if (!filter(command, currentQuery)) continue
      const heading = command.group || 'Other'
      if (!collected.has(heading)) collected.set(heading, [])
      collected.get(heading).push(command)
    }
    return [...collected].map(([heading, groupedCommands]) => ({
      heading,
      commands: groupedCommands
    }))
  }, [commands, currentQuery, filter, groups])

  const commandGroups = useMemo(
    () =>
      sourceGroups
        .map((group, groupIndex) => ({
          heading: group.heading,
          headingId: `${controlId}-group-${groupIndex}`,
          entries: group.commands.map((command, commandIndex) => {
            const identity = String(command.id ?? command.title ?? commandIndex)
              .replace(/[^a-zA-Z0-9_-]/g, '-')
              .replace(/-+/g, '-')
            return {
              command,
              key: `${groupIndex}:${commandIndex}:${identity}`,
              optionId: `${controlId}-option-${groupIndex}-${commandIndex}-${identity}`
            }
          })
        }))
        .filter((group) => group.entries.length),
    [controlId, sourceGroups]
  )
  const entries = useMemo(
    () => commandGroups.flatMap((group) => group.entries),
    [commandGroups]
  )
  const enabledEntries = useMemo(
    () => entries.filter((entry) => !entry.command.disabled),
    [entries]
  )
  const activeEntry = enabledEntries.find((entry) => entry.key === activeKey)

  const setQuery = useCallback(
    (nextQuery) => {
      if (!isControlled) setInternalQuery(nextQuery)
      onQueryChange?.(nextQuery)
    },
    [isControlled, onQueryChange]
  )

  useImperativeHandle(
    forwardedRef,
    () => ({
      focus: (options) => inputRef.current?.focus(options),
      clear: () => setQuery('')
    }),
    [setQuery]
  )

  const revealActive = useCallback((entry) => {
    if (!entry) return
    queueMicrotask(() => {
      rootRef.current
        ?.querySelector?.(`[data-command-key="${entry.key}"]`)
        ?.scrollIntoView?.({ block: 'nearest' })
    })
  }, [])

  useEffect(() => {
    const queryChanged = previousQueryRef.current !== currentQuery
    previousQueryRef.current = currentQuery
    if (
      queryChanged ||
      !enabledEntries.some((entry) => entry.key === activeKey)
    ) {
      const next = enabledEntries[0]
      setActiveKey(next?.key)
      revealActive(next)
    }
  }, [activeKey, currentQuery, enabledEntries, revealActive])

  const move = useCallback(
    (step) => {
      if (!enabledEntries.length) return
      const current = enabledEntries.findIndex(
        (entry) => entry.key === activeKey
      )
      const next =
        current < 0
          ? step > 0
            ? 0
            : enabledEntries.length - 1
          : (current + step + enabledEntries.length) % enabledEntries.length
      const entry = enabledEntries[next]
      setActiveKey(entry.key)
      revealActive(entry)
    },
    [activeKey, enabledEntries, revealActive]
  )

  const moveTo = useCallback(
    (edge) => {
      if (!enabledEntries.length) return
      const entry = edge === 'last' ? enabledEntries.at(-1) : enabledEntries[0]
      setActiveKey(entry.key)
      revealActive(entry)
    },
    [enabledEntries, revealActive]
  )

  const select = useCallback(
    (entry = activeEntry) => {
      if (!entry || entry.command.disabled) return
      onSelect?.(entry.command)
    },
    [activeEntry, onSelect]
  )

  function handleKeyDown(event) {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.isComposing || event.keyCode === 229) {
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      move(event.key === 'ArrowDown' ? 1 : -1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      moveTo('first')
    } else if (event.key === 'End') {
      event.preventDefault()
      moveTo('last')
    } else if (event.key === 'Enter') {
      if (!activeEntry) return
      event.preventDefault()
      select()
    } else if (event.key === 'Escape') {
      if (currentQuery) {
        event.preventDefault()
        event.stopPropagation()
        setQuery('')
      } else {
        onEscape?.(event)
      }
    } else if (event.key === 'Backspace' && !currentQuery) {
      onBack?.(event)
    }
  }

  return (
    <div
      {...rootProps}
      ref={rootRef}
      data-slot="command"
      data-state={entries.length ? 'results' : 'empty'}
      className={twMerge(
        'w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-950 shadow-lg dark:border-gray-700 dark:bg-gray-950 dark:text-white',
        className
      )}
    >
      <div
        data-slot="command-search"
        className="flex items-center border-b border-gray-200 px-4 dark:border-gray-800"
      >
        {prefix}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="true"
          aria-label={label}
          aria-controls={listId}
          aria-activedescendant={activeEntry?.optionId}
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={currentQuery}
          data-slot="command-input"
          className="min-h-11 w-full border-0 bg-transparent px-0 py-3 text-base text-gray-950 outline-none placeholder:text-gray-500 focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-950 dark:text-white dark:placeholder:text-gray-400 dark:focus-visible:outline-white"
          onChange={(event) => setQuery(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
        {suffix}
      </div>

      <div
        id={listId}
        role="listbox"
        aria-label={`${label} results`}
        data-slot="command-list"
        className="max-h-72 overflow-y-auto overscroll-contain p-1.5"
      >
        {before}
        {commandGroups.map((group) => (
          <div
            key={group.headingId}
            role="group"
            aria-labelledby={group.headingId}
            data-slot="command-group"
          >
            <div
              id={group.headingId}
              data-slot="command-group-heading"
              className="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              {group.heading}
            </div>
            {group.entries.map((entry) => {
              const active = entry.key === activeKey
              return (
                <div
                  key={entry.key}
                  id={entry.optionId}
                  role="option"
                  aria-selected={active}
                  aria-disabled={entry.command.disabled || undefined}
                  data-slot="command-item"
                  data-command-key={entry.key}
                  data-state={active ? 'active' : 'inactive'}
                  data-highlighted={active ? '' : undefined}
                  data-destructive={entry.command.destructive ? '' : undefined}
                  className="flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-gray-100 data-highlighted:text-gray-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 dark:data-highlighted:bg-gray-800 dark:data-highlighted:text-white"
                  onMouseDown={(event) => event.preventDefault()}
                  onPointerMove={(event) => {
                    if (
                      entry.command.disabled ||
                      event.pointerType === 'touch'
                    ) {
                      return
                    }
                    setActiveKey(entry.key)
                  }}
                  onClick={() => select(entry)}
                >
                  {renderItem?.({ command: entry.command, active }) ?? (
                    <>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate">{entry.command.title}</span>
                        {entry.command.subtitle ? (
                          <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {entry.command.subtitle}
                          </span>
                        ) : null}
                      </span>
                      {entry.command.shortcut ? (
                        <kbd
                          aria-hidden="true"
                          className="ml-auto shrink-0 font-mono text-xs text-gray-500 dark:text-gray-400"
                        >
                          {entry.command.shortcut}
                        </kbd>
                      ) : null}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        ))}

        {!entries.length ? (
          <div
            data-slot="command-empty"
            className="py-10 text-center text-sm text-gray-500 dark:text-gray-400"
            aria-live="polite"
          >
            {renderEmpty?.({ query: currentQuery }) ?? 'No matching command.'}
          </div>
        ) : null}
      </div>

      {footer}
    </div>
  )
})

export default Command
