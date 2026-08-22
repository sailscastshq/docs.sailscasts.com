import { router } from '@inertiajs/svelte'

function valueOf(value) {
  return typeof value === 'function' ? value() : value
}

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

export function createDataTableQuery(options) {
  const currentQuery = () => valueOf(options.query) || {}
  let search = $state(String(currentQuery().search ?? ''))
  let busy = $state(false)
  let previousServerSearch = String(currentQuery().search ?? '')
  let focusIntent

  function visit(updates = {}, visitOptions = {}) {
    const {
      replace = false,
      trigger,
      onStart,
      onFinish,
      ...forwardedOptions
    } = visitOptions
    const next = { ...currentQuery(), search, ...updates }
    const href = dataTableUrl(
      valueOf(options.url),
      next,
      valueOf(options.defaults) || {}
    )
    const only = valueOf(options.only) || []
    focusIntent = trigger
      ? { element: trigger, key: trigger.dataset?.tableFocus }
      : undefined

    router.visit(href, {
      preserveState: true,
      preserveScroll: true,
      ...(only.length ? { only } : {}),
      ...forwardedOptions,
      replace,
      onStart(event) {
        busy = true
        onStart?.(event)
      },
      onFinish(event) {
        busy = false
        const intent = focusIntent
        focusIntent = undefined
        restoreFocus(intent)
        onFinish?.(event)
      }
    })

    return href
  }

  function sort(field, trigger) {
    if (busy) return
    const direction = directionFor(currentQuery().sort, field)
    const nextDirection = direction === 'ASC' ? 'DESC' : 'ASC'
    return visit({ sort: `${field} ${nextDirection}`, page: 1 }, { trigger })
  }

  function ariaSort(field) {
    const direction = directionFor(currentQuery().sort, field)
    if (direction === 'ASC') return 'ascending'
    if (direction === 'DESC') return 'descending'
    return undefined
  }

  function sortButton(field, label = field) {
    const direction = directionFor(currentQuery().sort, field)
    const nextDirection = direction === 'ASC' ? 'descending' : 'ascending'
    return {
      type: 'button',
      disabled: busy,
      'data-table-focus': `sort:${field}`,
      'aria-label': `Sort by ${label} ${nextDirection}`,
      onclick: (event) => sort(field, event.currentTarget)
    }
  }

  $effect(() => {
    const next = String(currentQuery().search ?? '')
    if (next === previousServerSearch) return
    previousServerSearch = next
    search = next
  })

  $effect(() => {
    const value = search
    const serverValue = String(currentQuery().search ?? '')
    if (value === serverValue) return
    const timer = setTimeout(() => {
      visit({ search: value, page: 1 }, { replace: true })
    }, 300)
    return () => clearTimeout(timer)
  })

  return {
    get search() {
      return search
    },
    set search(value) {
      search = String(value ?? '')
    },
    get busy() {
      return busy
    },
    visit,
    sort,
    ariaSort,
    sortButton
  }
}
