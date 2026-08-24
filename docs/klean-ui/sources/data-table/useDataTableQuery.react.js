import { useCallback, useEffect, useRef, useState } from 'react'
import { router } from '@inertiajs/react'

function sameValue(left, right) {
  if (Object.is(left, right)) return true
  if (left && right && typeof left === 'object' && typeof right === 'object') {
    return JSON.stringify(left) === JSON.stringify(right)
  }
  return false
}

function queryValue(value) {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

export function dataTableUrl(source, query, defaults = {}) {
  const raw = source || '/'
  const absolute = /^[a-z][a-z\d+.-]*:/i.test(raw)
  const url = new URL(raw, 'http://klean.invalid')
  const cleanDefaults = { page: 1, search: '', filters: {}, ...defaults }

  for (const [key, value] of Object.entries(query || {})) {
    if (sameValue(value, cleanDefaults[key])) {
      url.searchParams.delete(key)
      continue
    }
    const encoded = queryValue(value)
    if (encoded === undefined) url.searchParams.delete(key)
    else url.searchParams.set(key, encoded)
  }

  return absolute ? url.href : `${url.pathname}${url.search}${url.hash}`
}

function directionFor(sort, field) {
  const [activeField, direction = 'ASC'] = String(sort || '').split(/\s+/)
  return activeField === field ? direction.toUpperCase() : undefined
}

function restoreFocus(intent) {
  if (!intent || typeof document === 'undefined') return
  requestAnimationFrame(() => {
    if (intent.element?.isConnected) {
      intent.element.focus()
      return
    }
    const candidate = [...document.querySelectorAll('[data-table-focus]')].find(
      (element) => element.dataset.tableFocus === intent.key
    )
    candidate?.focus()
  })
}

export function useDataTableQuery(options) {
  const optionsRef = useRef(options)
  optionsRef.current = options
  const serverSearch = String(options.query?.search ?? '')
  const [search, setSearch] = useState(serverSearch)
  const [busy, setBusy] = useState(false)
  const searchRef = useRef(search)
  const focusIntent = useRef()
  searchRef.current = search

  useEffect(() => {
    setSearch(serverSearch)
  }, [serverSearch])

  const visit = useCallback((updates = {}, visitOptions = {}) => {
    const current = optionsRef.current
    const {
      replace = false,
      trigger,
      onStart,
      onFinish,
      ...forwardedOptions
    } = visitOptions
    const next = {
      ...(current.query || {}),
      search: searchRef.current,
      ...updates
    }
    const href = dataTableUrl(current.url, next, current.defaults || {})
    const only = current.only || []
    focusIntent.current = trigger
      ? { element: trigger, key: trigger.dataset?.tableFocus }
      : undefined

    router.visit(href, {
      preserveState: true,
      preserveScroll: true,
      ...(only.length ? { only } : {}),
      ...forwardedOptions,
      replace,
      onStart(event) {
        setBusy(true)
        onStart?.(event)
      },
      onFinish(event) {
        setBusy(false)
        const intent = focusIntent.current
        focusIntent.current = undefined
        restoreFocus(intent)
        onFinish?.(event)
      }
    })

    return href
  }, [])

  useEffect(() => {
    if (search === serverSearch) return
    const timer = setTimeout(() => {
      visit({ search, page: 1 }, { replace: true })
    }, 300)
    return () => clearTimeout(timer)
  }, [search, serverSearch, visit])

  function sort(field, trigger) {
    if (busy) return
    const direction = directionFor(options.query?.sort, field)
    const nextDirection = direction === 'ASC' ? 'DESC' : 'ASC'
    return visit({ sort: `${field} ${nextDirection}`, page: 1 }, { trigger })
  }

  function ariaSort(field) {
    const direction = directionFor(options.query?.sort, field)
    if (direction === 'ASC') return 'ascending'
    if (direction === 'DESC') return 'descending'
    return undefined
  }

  function sortButton(field, label = field) {
    const direction = directionFor(options.query?.sort, field)
    const nextDirection = direction === 'ASC' ? 'descending' : 'ascending'
    return {
      type: 'button',
      disabled: busy,
      'data-table-focus': `sort:${field}`,
      'aria-label': `Sort by ${label} ${nextDirection}`,
      onClick: (event) => sort(field, event.currentTarget)
    }
  }

  return {
    search,
    setSearch,
    busy,
    visit,
    sort,
    ariaSort,
    sortButton
  }
}
