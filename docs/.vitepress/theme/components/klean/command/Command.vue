<script setup>
import { computed, nextTick, provide, ref, useAttrs, useId, watch } from 'vue'
import { twMerge } from 'tailwind-merge'
import { COMMAND_CONTEXT, defaultCommandFilter } from './context.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Framework-native controlled search query. Omit for uncontrolled use. */
  query: { type: String, default: undefined },
  /** Initial query when `query` is not controlled. */
  defaultQuery: { type: String, default: '' },
  /** Optional visibility filter. Return false or a score <= 0 to hide an item. */
  filter: { type: Function, default: defaultCommandFilter },
  /** Stable base ID for the input/listbox relationship. */
  id: { type: String, default: undefined }
})

const emit = defineEmits(['update:query', 'select', 'escape', 'back'])
const attrs = useAttrs()
const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const root = ref()
const input = ref()
const internalQuery = ref(props.defaultQuery)
const items = ref([])
const activeId = ref()

const isControlled = computed(() => props.query !== undefined)
const currentQuery = computed(() =>
  isControlled.value ? props.query : internalQuery.value
)
const controlId = computed(() => props.id ?? `klean-command-${generatedId}`)
const inputId = computed(() => `${controlId.value}-input`)
const listId = computed(() => `${controlId.value}-list`)
const visibleEntries = computed(() =>
  items.value.filter((item) => {
    const result = props.filter(item.value, currentQuery.value, item.keywords)
    return typeof result === 'number' ? result > 0 : Boolean(result)
  })
)
const visibleIds = computed(
  () => new Set(visibleEntries.value.map((item) => item.id))
)
const enabledEntries = computed(() =>
  visibleEntries.value.filter((item) => !item.disabled)
)
const activeDescendant = computed(() =>
  enabledEntries.value.some((item) => item.id === activeId.value)
    ? activeId.value
    : undefined
)
const rootClasses = computed(() =>
  twMerge(
    'w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-950 shadow-lg dark:border-gray-700 dark:bg-gray-950 dark:text-white',
    attrs.class
  )
)
const rootAttrs = computed(() => {
  const {
    class: _class,
    onKeydown: _onKeydown,
    onKeyDown: _onKeyDown,
    'data-slot': _dataSlot,
    'data-state': _dataState,
    ...rest
  } = attrs
  return rest
})

function setQuery(nextQuery) {
  if (!isControlled.value) internalQuery.value = nextQuery
  emit('update:query', nextQuery)
}

function registerItem(item) {
  items.value = [...items.value, item]

  return () => {
    items.value = items.value.filter((candidate) => candidate.id !== item.id)
  }
}

function updateItem(id, item) {
  items.value = items.value.map((candidate) =>
    candidate.id === id ? { ...candidate, ...item } : candidate
  )
}

function setActive(id) {
  const item = enabledEntries.value.find((candidate) => candidate.id === id)
  if (!item) return
  activeId.value = item.id
}

async function revealActive() {
  await nextTick()
  if (!activeId.value) return
  root.value
    ?.querySelector?.(`[data-command-id="${activeId.value}"]`)
    ?.scrollIntoView?.({ block: 'nearest' })
}

function move(step) {
  const enabled = enabledEntries.value
  if (!enabled.length) return

  const current = enabled.findIndex((item) => item.id === activeId.value)
  const next =
    current < 0
      ? step > 0
        ? 0
        : enabled.length - 1
      : (current + step + enabled.length) % enabled.length
  activeId.value = enabled[next].id
  revealActive()
}

function moveTo(edge) {
  const enabled = enabledEntries.value
  if (!enabled.length) return
  activeId.value = edge === 'last' ? enabled.at(-1).id : enabled[0].id
  revealActive()
}

function activate(id = activeId.value) {
  const item = enabledEntries.value.find((candidate) => candidate.id === id)
  if (!item) return
  item.select()
  emit('select', item.value)
}

function handleKeydown(event) {
  const listener = attrs.onKeydown ?? attrs.onKeyDown
  for (const callback of Array.isArray(listener) ? listener : [listener]) {
    callback?.(event)
  }
  if (event.defaultPrevented || event.isComposing || event.keyCode === 229) {
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    move(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Home') {
    event.preventDefault()
    moveTo('first')
  } else if (event.key === 'End') {
    event.preventDefault()
    moveTo('last')
  } else if (event.key === 'Enter') {
    event.preventDefault()
    activate()
  } else if (event.key === 'Escape') {
    if (currentQuery.value) {
      event.preventDefault()
      event.stopPropagation()
      setQuery('')
    } else {
      emit('escape', event)
    }
  } else if (event.key === 'Backspace' && !currentQuery.value) {
    emit('back', event)
  }
}

function groupHasVisibleItems(groupId) {
  return visibleEntries.value.some((item) => item.groupId === groupId)
}

function focus(options) {
  input.value?.focus(options)
}

watch(
  enabledEntries,
  (enabled) => {
    if (!enabled.some((item) => item.id === activeId.value)) {
      activeId.value = enabled[0]?.id
    }
    revealActive()
  },
  { immediate: true, flush: 'post' }
)

watch(currentQuery, () => {
  activeId.value = enabledEntries.value[0]?.id
  revealActive()
})

provide(COMMAND_CONTEXT, {
  currentQuery,
  input,
  inputId,
  listId,
  activeId,
  activeDescendant,
  visibleIds,
  visibleCount: computed(() => visibleEntries.value.length),
  registerItem,
  updateItem,
  setActive,
  activate,
  setQuery,
  handleKeydown,
  groupHasVisibleItems
})

defineExpose({ focus, clear: () => setQuery('') })
</script>

<template>
  <div
    ref="root"
    v-bind="rootAttrs"
    data-slot="command"
    :data-state="visibleEntries.length ? 'results' : 'empty'"
    :class="rootClasses"
  >
    <slot :query="currentQuery" :active-id="activeId" />
  </div>
</template>
