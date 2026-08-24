import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

const BASE_CLASSES =
  'flex min-h-12 w-full flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-white'

const BulkActions = forwardRef(function BulkActions(
  {
    count = 0,
    label = 'Bulk actions',
    busy = false,
    clearLabel = 'Clear selection',
    summary,
    className,
    children,
    onClear,
    'data-slot': _dataSlot,
    ...rootProps
  },
  forwardedRef
) {
  const element = useRef(null)
  const selectedCount = Math.max(0, Math.trunc(Number(count) || 0))
  const latestCount = useRef(selectedCount)
  latestCount.current = selectedCount

  useImperativeHandle(forwardedRef, () => element.current)

  useLayoutEffect(() => {
    if (selectedCount <= 0) return undefined

    const rootElement = element.current
    const root = rootElement?.getRootNode?.() ?? document

    return () => {
      if (latestCount.current > 0) return

      const activeElement = root.activeElement ?? document.activeElement
      const shouldRestore = rootElement?.contains(activeElement)
      if (!shouldRestore) return

      queueMicrotask(() => {
        root
          .querySelector?.('[data-bulk-actions-focus]')
          ?.focus?.({ preventScroll: true })
      })
    }
  }, [selectedCount])

  function clearSelection() {
    if (!busy) onClear?.()
  }

  if (selectedCount <= 0) return null

  const context = { count: selectedCount, busy, clear: clearSelection }

  return (
    <div
      {...rootProps}
      ref={element}
      role="region"
      aria-label={label}
      aria-busy={busy || undefined}
      data-slot="bulk-actions"
      className={twMerge(BASE_CLASSES, className)}
    >
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-slot="bulk-actions-summary"
        className="mr-auto text-sm font-medium tabular-nums"
      >
        {typeof summary === 'function'
          ? summary(context)
          : (summary ?? `${selectedCount} selected`)}
      </span>

      {typeof children === 'function' ? children(context) : children}

      <button
        type="button"
        disabled={busy}
        data-slot="bulk-actions-clear"
        className="min-h-9 cursor-pointer rounded-md px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white"
        onClick={clearSelection}
      >
        {clearLabel}
      </button>
    </div>
  )
})

export default BulkActions
