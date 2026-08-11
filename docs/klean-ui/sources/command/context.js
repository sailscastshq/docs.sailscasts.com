export const COMMAND_CONTEXT = Symbol('klean-command')
export const COMMAND_GROUP_CONTEXT = Symbol('klean-command-group')

export function normalizeCommandText(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/\p{Diacritic}/gu, '')
}

export function defaultCommandFilter(value, query, keywords = []) {
  const needle = normalizeCommandText(query).trim()
  if (!needle) return true
  return normalizeCommandText(
    [value, ...keywords].filter(Boolean).join(' ')
  ).includes(needle)
}
