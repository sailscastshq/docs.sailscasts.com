import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { filtersEqual, stableFilters } from './filterState.js'

function clone(value) {
  return JSON.parse(JSON.stringify(value ?? {}))
}

const FilterBar = forwardRef(function FilterBar(
  {
    value,
    defaultValue = {},
    onChange,
    onApply,
    onCancel,
    onClear,
    onRemove,
    label = 'Filters',
    busy = false,
    className,
    children,
    onSubmit,
    onReset,
    ...formProps
  },
  forwardedRef
) {
  const formRef = useRef(null)
  const [internalValue, setInternalValue] = useState(() => clone(defaultValue))
  const controlled = value !== undefined
  const committed = controlled ? value : internalValue
  const committedSignature = stableFilters(committed)
  const [draft, setDraftState] = useState(() => clone(committed))
  const entries = useMemo(
    () => Object.entries(committed ?? {}),
    [committedSignature]
  )
  const count = entries.length
  const dirty = !filtersEqual(draft, committed)

  useEffect(() => {
    setDraftState(clone(committed))
  }, [committedSignature])

  function setRef(node) {
    formRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }

  function setDraft(next) {
    setDraftState((current) =>
      clone(typeof next === 'function' ? next(clone(current)) : next)
    )
  }

  function update(key, nextValue) {
    setDraftState((current) => ({ ...current, [key]: nextValue }))
  }

  function commit(next, callback) {
    if (busy) return
    const committedNext = clone(next)
    if (!controlled) setInternalValue(committedNext)
    setDraftState(clone(committedNext))
    onChange?.(clone(committedNext))
    callback?.(clone(committedNext))
  }

  function apply() {
    if (!dirty) return
    commit(draft, onApply)
  }

  function cancel() {
    const next = clone(committed)
    setDraftState(next)
    onCancel?.(clone(next))
  }

  function clear() {
    if (!count) return
    commit({}, onClear)
  }

  function focusAfterRemoval(index) {
    window.setTimeout(() => {
      const buttons = [
        ...(formRef.current?.querySelectorAll?.('[data-filter-remove]') ?? [])
      ]
      const next = buttons[Math.min(index, buttons.length - 1)]
      ;(
        next ??
        formRef.current?.querySelector?.(
          '[data-filter-clear], [data-filter-trigger]'
        )
      )?.focus?.()
    })
  }

  function remove(key, event) {
    if (busy || !(key in (committed ?? {}))) return
    const buttons = [
      ...(formRef.current?.querySelectorAll?.('[data-filter-remove]') ?? [])
    ]
    const index = Math.max(0, buttons.indexOf(event?.currentTarget))
    const next = clone(committed)
    delete next[key]
    commit(next, (filters) => onRemove?.(filters, key))
    focusAfterRemoval(index)
  }

  function handleSubmit(event) {
    onSubmit?.(event)
    if (!event.defaultPrevented) {
      event.preventDefault()
      apply()
    }
  }

  function handleReset(event) {
    onReset?.(event)
    if (!event.defaultPrevented) {
      event.preventDefault()
      cancel()
    }
  }

  function removeProps(key, removeLabel) {
    return {
      type: 'button',
      disabled: busy,
      'aria-label': removeLabel ?? `Remove ${key} filter`,
      'data-filter-remove': '',
      'data-filter-key': key,
      onClick: (event) => remove(key, event)
    }
  }

  const state = {
    draft,
    setDraft,
    entries,
    count,
    dirty,
    busy,
    update,
    apply,
    cancel,
    clear,
    remove,
    removeProps,
    applyProps: { type: 'submit', disabled: busy || !dirty },
    cancelProps: { type: 'reset', disabled: busy || !dirty },
    clearProps: {
      type: 'button',
      disabled: busy || count === 0,
      'data-filter-clear': '',
      onClick: clear
    }
  }

  return (
    <form
      {...formProps}
      ref={setRef}
      role="search"
      aria-label={label}
      aria-busy={busy || undefined}
      data-slot="filter-bar"
      data-dirty={dirty ? '' : undefined}
      data-empty={count === 0 ? '' : undefined}
      className={twMerge('flex flex-wrap items-center gap-2', className)}
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      {children?.(state)}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {count} active {count === 1 ? 'filter' : 'filters'}.
      </span>
    </form>
  )
})

export default FilterBar
