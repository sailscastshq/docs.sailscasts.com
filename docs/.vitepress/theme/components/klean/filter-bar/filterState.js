function ordered(value) {
  if (Array.isArray(value)) return value.map(ordered)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(
    Object.keys(value)
      .sort((left, right) => left.localeCompare(right))
      .map((key) => [key, ordered(value[key])])
  )
}

export function stableFilters(filters = {}) {
  return JSON.stringify(ordered(filters ?? {}))
}

export function filtersEqual(left, right) {
  return stableFilters(left) === stableFilters(right)
}

export function filtersFromUrl(url, defaults = {}) {
  const parsed = new URL(url, 'https://klean.local')
  const encoded = parsed.searchParams.get('filters')
  if (!encoded) return structuredClone(defaults ?? {})

  try {
    const filters = JSON.parse(encoded)
    if (!filters || Array.isArray(filters) || typeof filters !== 'object') {
      return structuredClone(defaults ?? {})
    }
    return filters
  } catch {
    return structuredClone(defaults ?? {})
  }
}

export function filterUrl(url, filters, defaults = {}) {
  const parsed = new URL(url, 'https://klean.local')
  if (
    filtersEqual(filters, defaults) ||
    Object.keys(filters ?? {}).length === 0
  ) {
    parsed.searchParams.delete('filters')
  } else {
    parsed.searchParams.set('filters', stableFilters(filters))
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(url)) return parsed.href
  return `${parsed.pathname}${parsed.search}${parsed.hash}`
}
