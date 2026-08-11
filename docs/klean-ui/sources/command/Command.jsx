import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { twMerge } from 'tailwind-merge'

const CommandContext = createContext(null)
const CommandGroupContext = createContext(undefined)

function normalizeCommandText(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/\p{Diacritic}/gu, '')
}

function defaultCommandFilter(value, query, keywords = []) {
  const needle = normalizeCommandText(query).trim()
  if (!needle) return true
  return normalizeCommandText(
    [value, ...keywords].filter(Boolean).join(' ')
  ).includes(needle)
}

function useCommand(part) {
  const command = useContext(CommandContext)
  if (!command) throw new Error(`${part} must be used inside Command.`)
  return command
}

const Command = forwardRef(function Command(
  {
    query: controlledQuery,
    defaultQuery = '',
    filter = defaultCommandFilter,
    id,
    className,
    children,
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
  const [items, setItems] = useState([])
  const [activeId, setActiveId] = useState()
  const isControlled = controlledQuery !== undefined
  const currentQuery = isControlled ? controlledQuery : internalQuery
  const previousQueryRef = useRef(currentQuery)

  const visibleEntries = useMemo(
    () =>
      items.filter((item) => {
        const result = filter(item.value, currentQuery, item.keywords)
        return typeof result === 'number' ? result > 0 : Boolean(result)
      }),
    [currentQuery, filter, items]
  )
  const visibleIds = useMemo(
    () => new Set(visibleEntries.map((item) => item.id)),
    [visibleEntries]
  )
  const enabledEntries = useMemo(
    () => visibleEntries.filter((item) => !item.disabled),
    [visibleEntries]
  )
  const activeDescendant = enabledEntries.some((item) => item.id === activeId)
    ? activeId
    : undefined

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

  const registerItem = useCallback((item) => {
    setItems((current) => [...current, item])
    return () => {
      setItems((current) =>
        current.filter((candidate) => candidate.id !== item.id)
      )
    }
  }, [])

  const updateItem = useCallback((itemId, item) => {
    setItems((current) =>
      current.map((candidate) =>
        candidate.id === itemId ? { ...candidate, ...item } : candidate
      )
    )
  }, [])

  const revealActive = useCallback((itemId) => {
    if (!itemId) return
    queueMicrotask(() => {
      rootRef.current
        ?.querySelector?.(`[data-command-id="${itemId}"]`)
        ?.scrollIntoView?.({ block: 'nearest' })
    })
  }, [])

  useEffect(() => {
    if (!enabledEntries.some((item) => item.id === activeId)) {
      const next = enabledEntries[0]?.id
      setActiveId(next)
      revealActive(next)
    }
  }, [activeId, enabledEntries, revealActive])

  useEffect(() => {
    if (previousQueryRef.current === currentQuery) return
    previousQueryRef.current = currentQuery
    const next = enabledEntries[0]?.id
    setActiveId(next)
    revealActive(next)
  }, [currentQuery, enabledEntries, revealActive])

  const setActive = useCallback(
    (itemId) => {
      if (!enabledEntries.some((item) => item.id === itemId)) return
      setActiveId(itemId)
    },
    [enabledEntries]
  )

  const move = useCallback(
    (step) => {
      if (!enabledEntries.length) return
      const current = enabledEntries.findIndex((item) => item.id === activeId)
      const next =
        current < 0
          ? step > 0
            ? 0
            : enabledEntries.length - 1
          : (current + step + enabledEntries.length) % enabledEntries.length
      const itemId = enabledEntries[next].id
      setActiveId(itemId)
      revealActive(itemId)
    },
    [activeId, enabledEntries, revealActive]
  )

  const moveTo = useCallback(
    (edge) => {
      if (!enabledEntries.length) return
      const itemId =
        edge === 'last' ? enabledEntries.at(-1).id : enabledEntries[0].id
      setActiveId(itemId)
      revealActive(itemId)
    },
    [enabledEntries, revealActive]
  )

  const activate = useCallback(
    (itemId = activeId) => {
      const item = enabledEntries.find((candidate) => candidate.id === itemId)
      if (!item) return
      item.select()
      onSelect?.(item.value)
    },
    [activeId, enabledEntries, onSelect]
  )

  const handleKeyDown = useCallback(
    (event) => {
      onKeyDown?.(event)
      if (
        event.defaultPrevented ||
        event.isComposing ||
        event.keyCode === 229
      ) {
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
        event.preventDefault()
        activate()
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
    },
    [
      activate,
      currentQuery,
      move,
      moveTo,
      onBack,
      onEscape,
      onKeyDown,
      setQuery
    ]
  )

  const context = useMemo(
    () => ({
      currentQuery,
      inputRef,
      inputId,
      listId,
      activeId,
      activeDescendant,
      visibleEntries,
      visibleIds,
      registerItem,
      updateItem,
      setActive,
      activate,
      setQuery,
      handleKeyDown
    }),
    [
      activate,
      activeDescendant,
      activeId,
      currentQuery,
      handleKeyDown,
      inputId,
      listId,
      registerItem,
      setActive,
      setQuery,
      updateItem,
      visibleEntries,
      visibleIds
    ]
  )

  return (
    <CommandContext.Provider value={context}>
      <div
        {...rootProps}
        ref={rootRef}
        data-slot="command"
        data-state={visibleEntries.length ? 'results' : 'empty'}
        className={twMerge(
          'w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-950 shadow-lg dark:border-gray-700 dark:bg-gray-950 dark:text-white',
          className
        )}
      >
        {typeof children === 'function'
          ? children({ query: currentQuery, activeId })
          : children}
      </div>
    </CommandContext.Provider>
  )
})

const CommandInput = forwardRef(function CommandInput(
  {
    placeholder = 'Type a command or search…',
    className,
    onChange,
    onKeyDown,
    ...inputProps
  },
  forwardedRef
) {
  const command = useCommand('CommandInput')

  const setRef = useCallback(
    (element) => {
      command.inputRef.current = element
      if (typeof forwardedRef === 'function') forwardedRef(element)
      else if (forwardedRef) forwardedRef.current = element
    },
    [command.inputRef, forwardedRef]
  )

  function handleChange(event) {
    onChange?.(event)
    if (!event.defaultPrevented) command.setQuery(event.currentTarget.value)
  }

  function handleKeyDown(event) {
    onKeyDown?.(event)
    if (!event.defaultPrevented) command.handleKeyDown(event)
  }

  return (
    <input
      {...inputProps}
      ref={setRef}
      id={command.inputId}
      type="text"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded="true"
      aria-controls={command.listId}
      aria-activedescendant={command.activeDescendant}
      autoComplete="off"
      data-slot="command-input"
      value={command.currentQuery}
      placeholder={placeholder}
      className={twMerge(
        'min-h-11 w-full border-0 border-b border-gray-200 bg-transparent px-4 py-3 text-base text-gray-950 outline-none placeholder:text-gray-500 focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-950 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus-visible:outline-white',
        className
      )}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  )
})

const CommandList = forwardRef(function CommandList(
  { className, children, ...listProps },
  forwardedRef
) {
  const command = useCommand('CommandList')
  return (
    <div
      {...listProps}
      ref={forwardedRef}
      id={command.listId}
      role="listbox"
      data-slot="command-list"
      className={twMerge(
        'max-h-[min(22rem,60dvh)] overflow-y-auto overscroll-contain p-1',
        className
      )}
    >
      {children}
    </div>
  )
})

const CommandEmpty = forwardRef(function CommandEmpty(
  { className, children = 'No commands found.', ...emptyProps },
  forwardedRef
) {
  const command = useCommand('CommandEmpty')
  if (command.visibleEntries.length) return null

  return (
    <div
      {...emptyProps}
      ref={forwardedRef}
      role="status"
      data-slot="command-empty"
      className={twMerge(
        'px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400',
        className
      )}
    >
      {children}
    </div>
  )
})

const CommandGroup = forwardRef(function CommandGroup(
  { heading, className, children, ...groupProps },
  forwardedRef
) {
  const command = useCommand('CommandGroup')
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const groupId = `klean-command-group-${generatedId}`
  const labelId = `${groupId}-label`
  const visible = command.visibleEntries.some(
    (item) => item.groupId === groupId
  )

  return (
    <CommandGroupContext.Provider value={groupId}>
      <div
        {...groupProps}
        ref={forwardedRef}
        role="group"
        aria-labelledby={labelId}
        hidden={!visible}
        data-slot="command-group"
        className={twMerge('py-1', className)}
      >
        <div
          id={labelId}
          data-slot="command-group-heading"
          className="px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400"
        >
          {heading}
        </div>
        {children}
      </div>
    </CommandGroupContext.Provider>
  )
})

const CommandItem = forwardRef(function CommandItem(
  {
    value,
    keywords = [],
    disabled = false,
    id,
    className,
    children,
    onSelect,
    onClick,
    onPointerMove,
    onMouseDown,
    ...itemProps
  },
  forwardedRef
) {
  const command = useCommand('CommandItem')
  const groupId = useContext(CommandGroupContext)
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const itemId = id ?? `klean-command-item-${generatedId}`
  const selectRef = useRef(onSelect)
  selectRef.current = onSelect
  const keywordKey = keywords.join('\u0000')
  const visible = command.visibleIds.has(itemId)
  const active = command.activeId === itemId

  const select = useCallback(() => {
    selectRef.current?.(value)
  }, [value])

  useEffect(
    () =>
      command.registerItem({
        id: itemId,
        value,
        keywords,
        disabled,
        groupId,
        select
      }),
    [command.registerItem, itemId]
  )

  useEffect(() => {
    command.updateItem(itemId, {
      value,
      keywords,
      disabled,
      groupId,
      select
    })
  }, [command.updateItem, disabled, groupId, itemId, keywordKey, select, value])

  function handleClick(event) {
    onClick?.(event)
    if (!event.defaultPrevented && !disabled) command.activate(itemId)
  }

  function handlePointerMove(event) {
    onPointerMove?.(event)
    if (!event.defaultPrevented && !disabled && event.pointerType !== 'touch') {
      command.setActive(itemId)
    }
  }

  function handleMouseDown(event) {
    onMouseDown?.(event)
    if (!event.defaultPrevented) event.preventDefault()
  }

  return (
    <div
      {...itemProps}
      ref={forwardedRef}
      id={itemId}
      role="option"
      hidden={!visible}
      aria-selected={active}
      aria-disabled={disabled || undefined}
      data-slot="command-item"
      data-command-id={itemId}
      data-state={active ? 'active' : 'inactive'}
      data-highlighted={active ? '' : undefined}
      className={twMerge(
        'flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-gray-100 data-highlighted:text-gray-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 dark:data-highlighted:bg-gray-800 dark:data-highlighted:text-white',
        className
      )}
      onMouseDown={handleMouseDown}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      {typeof children === 'function'
        ? children({ active, disabled })
        : children}
    </div>
  )
})

const CommandSeparator = forwardRef(function CommandSeparator(
  { className, ...separatorProps },
  forwardedRef
) {
  return (
    <hr
      {...separatorProps}
      ref={forwardedRef}
      data-slot="command-separator"
      className={twMerge(
        '-mx-1 my-1 h-px border-0 bg-gray-200 dark:bg-gray-800',
        className
      )}
    />
  )
})

const CommandShortcut = forwardRef(function CommandShortcut(
  { className, children, ...shortcutProps },
  forwardedRef
) {
  return (
    <kbd
      {...shortcutProps}
      ref={forwardedRef}
      aria-hidden="true"
      data-slot="command-shortcut"
      className={twMerge(
        'ml-auto text-xs tracking-widest text-gray-500 dark:text-gray-400',
        className
      )}
    >
      {children}
    </kbd>
  )
})

export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
}

export default Command
