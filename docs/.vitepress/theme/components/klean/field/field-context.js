import { inject } from 'vue'

export const FIELD_CONTEXT_KEY = Symbol.for('klean-ui.field')

export function useFieldContext() {
  return inject(FIELD_CONTEXT_KEY, null)
}

export function mergeDescribedBy(...values) {
  const ids = values
    .flatMap((value) => (value ? String(value).trim().split(/\s+/) : []))
    .filter(Boolean)

  return [...new Set(ids)].join(' ') || undefined
}
