import { computed, nextTick, onBeforeUnmount, ref, toValue, watch } from 'vue'
import { router } from '@inertiajs/vue3'

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
  requestAnimationFrame(async () => {
    await nextTick()
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
  const busy = ref(false)
  const search = ref('')
  const currentQuery = computed(() => toValue(options.query) || {})
  const currentDefaults = computed(() => toValue(options.defaults) || {})
  let searchTimer
  let syncingSearch = false
  let focusIntent

  function cancelSearch() {
    clearTimeout(searchTimer)
    searchTimer = undefined
  }

  function visit(updates = {}, visitOptions = {}) {
    cancelSearch()
    const {
      replace = false,
      trigger,
      onStart,
      onFinish,
      ...forwardedOptions
    } = visitOptions
    const next = {
      ...currentQuery.value,
      search: search.value,
      ...updates
    }
    const href = dataTableUrl(toValue(options.url), next, currentDefaults.value)
    const only = toValue(options.only) || []
    const key = trigger?.dataset?.tableFocus
    focusIntent = trigger ? { element: trigger, key } : undefined

    router.visit(href, {
      preserveState: true,
      preserveScroll: true,
      ...(only.length ? { only } : {}),
      ...forwardedOptions,
      replace,
      onStart(event) {
        busy.value = true
        onStart?.(event)
      },
      onFinish(event) {
        busy.value = false
        const intent = focusIntent
        focusIntent = undefined
        restoreFocus(intent)
        onFinish?.(event)
      }
    })

    return href
  }

  function sort(field, trigger) {
    if (busy.value) return
    const direction = directionFor(currentQuery.value.sort, field)
    const nextDirection = direction === 'ASC' ? 'DESC' : 'ASC'
    return visit({ sort: `${field} ${nextDirection}`, page: 1 }, { trigger })
  }

  function ariaSort(field) {
    const direction = directionFor(currentQuery.value.sort, field)
    if (direction === 'ASC') return 'ascending'
    if (direction === 'DESC') return 'descending'
    return undefined
  }

  function sortButton(field, label = field) {
    const direction = directionFor(currentQuery.value.sort, field)
    const nextDirection = direction === 'ASC' ? 'descending' : 'ascending'
    return {
      type: 'button',
      disabled: busy.value,
      'data-table-focus': `sort:${field}`,
      'aria-label': `Sort by ${label} ${nextDirection}`,
      onClick: (event) => sort(field, event.currentTarget)
    }
  }

  watch(
    () => String(currentQuery.value.search ?? ''),
    (value) => {
      cancelSearch()
      syncingSearch = true
      search.value = value
      syncingSearch = false
    },
    { immediate: true, flush: 'sync' }
  )

  watch(
    search,
    (value) => {
      if (
        syncingSearch ||
        String(currentQuery.value.search ?? '') === String(value)
      ) {
        return
      }
      cancelSearch()
      searchTimer = setTimeout(() => {
        visit({ search: value, page: 1 }, { replace: true })
      }, 300)
    },
    { flush: 'sync' }
  )

  onBeforeUnmount(cancelSearch)

  return {
    search,
    busy,
    visit,
    sort,
    ariaSort,
    sortButton,
    cancelSearch
  }
}
