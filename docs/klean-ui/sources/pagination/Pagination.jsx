import { Link, usePage } from '@inertiajs/react'
import { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const LINK_CLASSES =
  'inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 no-underline transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-900 dark:focus-visible:outline-white'
const CURRENT_CLASSES =
  'border-gray-950 bg-gray-950 text-white hover:bg-gray-950 dark:border-white dark:bg-white dark:text-gray-950 dark:hover:bg-white'
const DISABLED_CLASSES =
  'inline-flex min-h-11 min-w-11 cursor-not-allowed items-center justify-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-400 opacity-70 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-600'

function assignRef(ref, value) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

function positiveInteger(value, fallback = 1) {
  const number = Math.trunc(Number(value))
  return Number.isFinite(number) && number > 0 ? number : fallback
}

function pageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)

  const visible = new Set([1, total, current - 1, current, current + 1])
  if (current <= 4) [2, 3, 4, 5].forEach((value) => visible.add(value))
  if (current >= total - 3) {
    ;[total - 4, total - 3, total - 2, total - 1].forEach((value) =>
      visible.add(value)
    )
  }

  const ordered = [...visible]
    .filter((value) => value >= 1 && value <= total)
    .sort((a, b) => a - b)

  return ordered.flatMap((value, index) => {
    const previous = ordered[index - 1]
    return index > 0 && value - previous > 1 ? [null, value] : [value]
  })
}

function browserUrl() {
  if (typeof window === 'undefined') return '/'
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

function hrefFor(source, target) {
  const raw = source || '/'
  const absolute = /^[a-z][a-z\d+.-]*:/i.test(raw)
  const url = new URL(raw, 'http://klean.invalid')

  if (target === 1) url.searchParams.delete('page')
  else url.searchParams.set('page', String(target))

  return absolute ? url.href : `${url.pathname}${url.search}${url.hash}`
}

function useInertiaUrl() {
  try {
    return usePage().url
  } catch (error) {
    if (!String(error).includes('usePage must be used within')) throw error
    return undefined
  }
}

const Pagination = forwardRef(function Pagination(
  {
    page,
    pages,
    only = [],
    className,
    'aria-label': ariaLabel = 'Pagination',
    'aria-busy': _ariaBusy,
    'data-slot': _dataSlot,
    ...navProps
  },
  forwardedRef
) {
  const rootRef = useRef(null)
  const lastIntentRef = useRef()
  const [pendingPage, setPendingPage] = useState()
  const inertiaUrl = useInertiaUrl()
  const totalPages = positiveInteger(pages)
  const currentPage = Math.min(positiveInteger(page), totalPages)
  const items = pageWindow(currentPage, totalPages)
  const currentUrl = inertiaUrl || browserUrl()

  useLayoutEffect(() => {
    if (lastIntentRef.current !== currentPage) return

    if (!rootRef.current?.contains(document.activeElement)) {
      rootRef.current
        ?.querySelector(`[data-slot="page"][data-page="${currentPage}"]`)
        ?.focus({ preventScroll: true })
    }

    lastIntentRef.current = undefined
  }, [currentPage])

  if (totalPages <= 1) return null

  function setRoot(node) {
    rootRef.current = node
    assignRef(forwardedRef, node)
  }

  function isPlainActivation(event) {
    return (
      (event.button === undefined || event.button === 0) &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    )
  }

  function rememberIntent(event, target) {
    if (!isPlainActivation(event)) return
    if (pendingPage === target) {
      event.preventDefault()
      return
    }
    lastIntentRef.current = target
  }

  function finish(target) {
    setPendingPage((pending) => (pending === target ? undefined : pending))
  }

  function linkProps(target) {
    return {
      href: hrefFor(currentUrl, target),
      only,
      preserveScroll: true,
      preserveState: true,
      onClick: (event) => rememberIntent(event, target),
      onStart: () => setPendingPage(target),
      onFinish: () => finish(target),
      onCancel: () => finish(target),
      onError: () => finish(target)
    }
  }

  function Chevron({ direction }) {
    const path =
      direction === 'previous' ? 'm12.5 15-5-5 5-5' : 'm7.5 5 5 5-5 5'
    return (
      <svg
        aria-hidden="true"
        className="size-4"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d={path}
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <nav
      {...navProps}
      ref={setRoot}
      data-slot="pagination"
      aria-label={ariaLabel}
      aria-busy={pendingPage ? 'true' : undefined}
      className={twMerge('w-full', className)}
    >
      <ul className="flex items-center justify-between gap-2 sm:justify-center">
        <li>
          {currentPage > 1 ? (
            <Link
              {...linkProps(currentPage - 1)}
              data-slot="previous"
              data-page={currentPage - 1}
              data-pending={pendingPage === currentPage - 1 ? '' : undefined}
              aria-label={`Go to page ${currentPage - 1}`}
              className={LINK_CLASSES}
            >
              <Chevron direction="previous" />
              <span className="hidden sm:inline">Previous</span>
            </Link>
          ) : (
            <span
              data-slot="previous"
              aria-disabled="true"
              className={DISABLED_CLASSES}
            >
              <Chevron direction="previous" />
              <span className="hidden sm:inline">Previous</span>
            </span>
          )}
        </li>

        <li className="sm:hidden">
          <span
            data-slot="summary"
            aria-current="page"
            className="px-2 text-sm text-gray-600 tabular-nums dark:text-gray-300"
          >
            Page {currentPage} of {totalPages}
          </span>
        </li>

        {items.map((item, index) => (
          <li key={item ?? `ellipsis-${index}`} className="hidden sm:block">
            {item === null ? (
              <span
                data-slot="ellipsis"
                className="inline-flex min-h-11 min-w-8 items-center justify-center text-sm text-gray-400 dark:text-gray-500"
              >
                <span aria-hidden="true">…</span>
                <span className="sr-only">More pages</span>
              </span>
            ) : (
              <Link
                {...linkProps(item)}
                data-slot="page"
                data-page={item}
                data-state={item === currentPage ? 'current' : undefined}
                data-pending={pendingPage === item ? '' : undefined}
                aria-current={item === currentPage ? 'page' : undefined}
                aria-label={
                  item === currentPage
                    ? `Page ${item}, current page`
                    : `Go to page ${item}`
                }
                className={twMerge(
                  LINK_CLASSES,
                  item === currentPage && CURRENT_CLASSES
                )}
              >
                {item}
              </Link>
            )}
          </li>
        ))}

        <li>
          {currentPage < totalPages ? (
            <Link
              {...linkProps(currentPage + 1)}
              data-slot="next"
              data-page={currentPage + 1}
              data-pending={pendingPage === currentPage + 1 ? '' : undefined}
              aria-label={`Go to page ${currentPage + 1}`}
              className={LINK_CLASSES}
            >
              <span className="hidden sm:inline">Next</span>
              <Chevron direction="next" />
            </Link>
          ) : (
            <span
              data-slot="next"
              aria-disabled="true"
              className={DISABLED_CLASSES}
            >
              <span className="hidden sm:inline">Next</span>
              <Chevron direction="next" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
})

export default Pagination
