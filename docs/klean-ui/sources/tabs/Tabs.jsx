import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import { twMerge } from 'tailwind-merge'

function assignRef(ref, value) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

const Tabs = forwardRef(function Tabs(
  {
    value,
    defaultValue,
    onValueChange,
    orientation = 'horizontal',
    activation = 'automatic',
    className,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    onClick,
    onFocus,
    onKeyDown,
    'data-slot': _dataSlot,
    'data-orientation': _dataOrientation,
    ...rootProps
  },
  forwardedRef
) {
  const rawComponentId = useId()
  const componentId = rawComponentId.replace(/[^a-zA-Z0-9_-]/g, '')
  const rootRef = useRef(null)
  const observerRef = useRef()
  const previousValuesRef = useRef([])
  const lastFocusedValueRef = useRef()
  const syncingRef = useRef(false)
  const controlled = value !== undefined
  const [localValue, setLocalValue] = useState(defaultValue)
  const resolvedValue = controlled ? value : localValue

  const setRoot = useCallback(
    (node) => {
      rootRef.current = node
      assignRef(forwardedRef, node)
    },
    [forwardedRef]
  )

  const listElement = useCallback(() => rootRef.current?.firstElementChild, [])

  const tabValue = useCallback(
    (element) => element?.getAttribute('data-value') ?? '',
    []
  )

  const tabs = useCallback(() => {
    const list = listElement()
    if (!list) return []
    return [...list.querySelectorAll('button[data-value]')].filter(
      (tab) =>
        tab.closest('[role="tablist"]') === list ||
        !tab.closest('[role="tablist"]')
    )
  }, [listElement])

  const panels = useCallback(() => {
    const list = listElement()
    if (!rootRef.current || !list) return []
    return [...rootRef.current.children]
      .slice(1)
      .filter((element) => element.hasAttribute('data-value'))
  }, [listElement])

  const disabled = useCallback(
    (tab) => tab.disabled || tab.getAttribute('aria-disabled') === 'true',
    []
  )

  const enabledTabs = useCallback(
    () => tabs().filter((tab) => !disabled(tab)),
    [disabled, tabs]
  )

  const tabFor = useCallback(
    (candidate) => tabs().find((tab) => tabValue(tab) === candidate),
    [tabValue, tabs]
  )

  const panelFor = useCallback(
    (candidate) => panels().find((panel) => tabValue(panel) === candidate),
    [panels, tabValue]
  )

  const fallbackValue = useCallback(
    (current) => {
      const available = enabledTabs()
      if (!available.length) return undefined

      const oldIndex = previousValuesRef.current.indexOf(current)
      const index = oldIndex < 0 ? 0 : Math.min(oldIndex, available.length - 1)
      return tabValue(available[index])
    },
    [enabledTabs, tabValue]
  )

  const requestValue = useCallback(
    (nextValue, { user = false } = {}) => {
      if (!nextValue || nextValue === resolvedValue) return
      if (!controlled) setLocalValue(nextValue)
      onValueChange?.(nextValue, { user })
    },
    [controlled, onValueChange, resolvedValue]
  )

  const generatedPairId = useCallback(
    (candidate, index) => {
      const slug = candidate.replace(/[^a-zA-Z0-9_-]/g, '-') || String(index)
      return `klean-tabs-${componentId}-${slug}-${index}`
    },
    [componentId]
  )

  const sync = useCallback(() => {
    if (!rootRef.current || syncingRef.current) return
    syncingRef.current = true

    const list = listElement()
    const allTabs = tabs()
    const allPanels = panels()
    const current = resolvedValue
    const currentTab = tabFor(current)
    const nextValue =
      currentTab && !disabled(currentTab) ? current : fallbackValue(current)

    if (nextValue && nextValue !== current) {
      if (!controlled) setLocalValue(nextValue)
      else onValueChange?.(nextValue, { user: false })
    }

    if (list) {
      list.setAttribute('role', 'tablist')
      list.setAttribute('data-slot', 'tabs-list')
      list.setAttribute('data-orientation', orientation)
      list.setAttribute('aria-orientation', orientation)
      if (ariaLabel) list.setAttribute('aria-label', ariaLabel)
      else list.removeAttribute('aria-label')
      if (ariaLabelledby) list.setAttribute('aria-labelledby', ariaLabelledby)
      else list.removeAttribute('aria-labelledby')
    }

    allTabs.forEach((tab, index) => {
      const candidate = tabValue(tab)
      const panel = panelFor(candidate)
      const pairId = generatedPairId(candidate, index)
      const selected = candidate === nextValue

      if (!tab.hasAttribute('type')) tab.setAttribute('type', 'button')
      tab.setAttribute('role', 'tab')
      tab.setAttribute('data-slot', 'tab')
      tab.setAttribute('data-state', selected ? 'active' : 'inactive')
      tab.setAttribute('data-orientation', orientation)
      tab.setAttribute('aria-selected', String(selected))
      tab.tabIndex = selected ? 0 : -1
      if (!tab.id) tab.id = `${pairId}-tab`

      if (panel) {
        if (!panel.id) panel.id = `${pairId}-panel`
        tab.setAttribute('aria-controls', panel.id)
        panel.setAttribute('role', 'tabpanel')
        panel.setAttribute('data-slot', 'tab-panel')
        panel.setAttribute('data-state', selected ? 'active' : 'inactive')
        panel.setAttribute('data-orientation', orientation)
        panel.setAttribute('aria-labelledby', tab.id)
        panel.hidden = !selected
        if (!panel.hasAttribute('tabindex')) panel.tabIndex = 0
      } else {
        tab.removeAttribute('aria-controls')
      }
    })

    allPanels.forEach((panel) => {
      if (!tabFor(tabValue(panel))) panel.hidden = true
    })

    const shouldRestoreFocus =
      lastFocusedValueRef.current === current &&
      current &&
      !tabFor(current) &&
      nextValue
    previousValuesRef.current = allTabs.map(tabValue)
    syncingRef.current = false

    if (shouldRestoreFocus) {
      queueMicrotask(() => tabFor(nextValue)?.focus({ preventScroll: true }))
    }
  }, [
    ariaLabel,
    ariaLabelledby,
    controlled,
    disabled,
    fallbackValue,
    generatedPairId,
    listElement,
    onValueChange,
    orientation,
    panelFor,
    panels,
    resolvedValue,
    tabFor,
    tabs,
    tabValue
  ])

  useLayoutEffect(sync)

  useEffect(() => {
    if (!rootRef.current) return undefined
    observerRef.current = new MutationObserver(sync)
    observerRef.current.observe(rootRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-value', 'disabled', 'aria-disabled']
    })
    return () => observerRef.current?.disconnect()
  }, [sync])

  function reveal(tab) {
    tab.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  }

  function focusTab(tab) {
    if (!tab) return
    tab.focus({ preventScroll: true })
    reveal(tab)
    if (activation === 'automatic') {
      requestValue(tabValue(tab), { user: true })
    }
  }

  function eventTab(event) {
    const candidate = event.target.closest?.('button[data-value]')
    return candidate && listElement()?.contains(candidate)
      ? candidate
      : undefined
  }

  function handleClick(event) {
    onClick?.(event)
    if (event.defaultPrevented) return
    const tab = eventTab(event)
    if (!tab || disabled(tab)) return
    lastFocusedValueRef.current = tabValue(tab)
    requestValue(tabValue(tab), { user: true })
  }

  function handleFocus(event) {
    onFocus?.(event)
    if (event.defaultPrevented) return
    const tab = eventTab(event)
    if (!tab || disabled(tab)) return
    lastFocusedValueRef.current = tabValue(tab)
  }

  function handleKeydown(event) {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const tab = eventTab(event)
    if (!tab || disabled(tab)) return
    const available = enabledTabs()
    const index = available.indexOf(tab)
    let next

    if (
      (orientation === 'horizontal' && event.key === 'ArrowRight') ||
      (orientation === 'vertical' && event.key === 'ArrowDown')
    ) {
      next = available[(index + 1) % available.length]
    } else if (
      (orientation === 'horizontal' && event.key === 'ArrowLeft') ||
      (orientation === 'vertical' && event.key === 'ArrowUp')
    ) {
      next = available[(index - 1 + available.length) % available.length]
    } else if (event.key === 'Home') {
      next = available[0]
    } else if (event.key === 'End') {
      next = available.at(-1)
    } else if (activation === 'manual' && ['Enter', ' '].includes(event.key)) {
      event.preventDefault()
      requestValue(tabValue(tab), { user: true })
      return
    } else {
      return
    }

    event.preventDefault()
    focusTab(next)
  }

  return (
    <div
      {...rootProps}
      ref={setRoot}
      data-slot="tabs"
      data-orientation={orientation}
      className={twMerge(className)}
      onClick={handleClick}
      onFocus={handleFocus}
      onKeyDown={handleKeydown}
    >
      {children}
    </div>
  )
})

export default Tabs
