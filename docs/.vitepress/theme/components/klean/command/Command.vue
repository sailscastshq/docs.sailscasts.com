<script setup>
import { computed, nextTick, ref, toRaw, useAttrs, useId, watch } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

function normalize(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/\p{Diacritic}/gu, '')
}

function defaultFilter(command, query) {
  const needle = normalize(query).trim()
  if (!needle) return true
  return normalize(
    [command.title, ...(command.keywords ?? [])].filter(Boolean).join(' ')
  ).includes(needle)
}

const props = defineProps({
  /** Flat command records. Klean filters and groups these by `group`. */
  commands: { type: Array, default: () => [] },
  /** Caller-filtered groups. Useful for ranked search, Recent, and nested flows. */
  groups: { type: Object, default: undefined },
  /** Framework-native controlled search query. Omit for uncontrolled use. */
  query: { type: String, default: undefined },
  /** Initial query when `query` is not controlled. */
  defaultQuery: { type: String, default: '' },
  /** Accessible name for the real search input. */
  label: { type: String, default: 'Search commands' },
  placeholder: { type: String, default: 'Type a command or search…' },
  /** Boolean visibility predicate for flat `commands`. */
  filter: { type: Function, default: undefined },
  autofocus: { type: Boolean, default: false },
  /** Stable base ID for the input/listbox relationship. */
  id: { type: String, default: undefined }
})

const emit = defineEmits(['update:query', 'select', 'escape', 'back'])
const attrs = useAttrs()
const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const root = ref()
const input = ref()
const internalQuery = ref(props.defaultQuery)
const activeKey = ref()

const isControlled = computed(() => props.query !== undefined)
const currentQuery = computed(() =>
  isControlled.value ? props.query : internalQuery.value
)
const controlId = computed(() => props.id ?? `klean-command-${generatedId}`)
const inputId = computed(() => `${controlId.value}-input`)
const listId = computed(() => `${controlId.value}-list`)

const sourceGroups = computed(() => {
  if (props.groups !== undefined) {
    return Object.entries(props.groups).map(([heading, commands]) => ({
      heading,
      commands: Array.isArray(commands) ? commands : []
    }))
  }

  const groups = new Map()
  for (const command of props.commands) {
    if (!(props.filter ?? defaultFilter)(command, currentQuery.value)) continue
    const heading = command.group || 'Other'
    if (!groups.has(heading)) groups.set(heading, [])
    groups.get(heading).push(command)
  }
  return [...groups].map(([heading, commands]) => ({ heading, commands }))
})

const commandGroups = computed(() =>
  sourceGroups.value
    .map((group, groupIndex) => ({
      heading: group.heading,
      headingId: `${controlId.value}-group-${groupIndex}`,
      entries: group.commands.map((command, commandIndex) => {
        const identity = String(command.id ?? command.title ?? commandIndex)
          .replace(/[^a-zA-Z0-9_-]/g, '-')
          .replace(/-+/g, '-')
        return {
          command,
          key: `${groupIndex}:${commandIndex}:${identity}`,
          optionId: `${controlId.value}-option-${groupIndex}-${commandIndex}-${identity}`
        }
      })
    }))
    .filter((group) => group.entries.length)
)
const entries = computed(() =>
  commandGroups.value.flatMap((group) => group.entries)
)
const enabledEntries = computed(() =>
  entries.value.filter((entry) => !entry.command.disabled)
)
const activeEntry = computed(() =>
  enabledEntries.value.find((entry) => entry.key === activeKey.value)
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

function revealActive() {
  nextTick(() => {
    if (!activeEntry.value) return
    root.value
      ?.querySelector?.(`[data-command-key="${activeEntry.value.key}"]`)
      ?.scrollIntoView?.({ block: 'nearest' })
  })
}

function setActive(key) {
  if (!enabledEntries.value.some((entry) => entry.key === key)) return
  activeKey.value = key
}

function move(step) {
  const enabled = enabledEntries.value
  if (!enabled.length) return
  const current = enabled.findIndex((entry) => entry.key === activeKey.value)
  const next =
    current < 0
      ? step > 0
        ? 0
        : enabled.length - 1
      : (current + step + enabled.length) % enabled.length
  activeKey.value = enabled[next].key
  revealActive()
}

function moveTo(edge) {
  const enabled = enabledEntries.value
  if (!enabled.length) return
  activeKey.value = edge === 'last' ? enabled.at(-1).key : enabled[0].key
  revealActive()
}

function select(entry = activeEntry.value) {
  if (!entry || entry.command.disabled) return
  emit('select', toRaw(entry.command))
}

function handleInput(event) {
  setQuery(event.currentTarget.value)
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
    if (!activeEntry.value) return
    event.preventDefault()
    select()
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

function handlePointermove(event, entry) {
  if (entry.command.disabled || event.pointerType === 'touch') return
  setActive(entry.key)
}

function handleMousedown(event) {
  event.preventDefault()
}

function focus(options) {
  input.value?.focus(options)
}

watch(
  [enabledEntries, currentQuery],
  ([enabled, query], previous = []) => {
    const queryChanged = query !== previous[1]
    if (
      queryChanged ||
      !enabled.some((entry) => entry.key === activeKey.value)
    ) {
      activeKey.value = enabled[0]?.key
    }
    revealActive()
  },
  { immediate: true, flush: 'post' }
)

defineExpose({ focus, clear: () => setQuery('') })
</script>

<template>
  <div
    v-bind="rootAttrs"
    ref="root"
    data-slot="command"
    :data-state="entries.length ? 'results' : 'empty'"
    :class="rootClasses"
  >
    <div
      data-slot="command-search"
      class="flex items-center border-b border-gray-200 px-4 dark:border-gray-800"
    >
      <slot name="prefix" />
      <input
        :id="inputId"
        ref="input"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="true"
        :aria-label="label"
        :aria-controls="listId"
        :aria-activedescendant="activeEntry?.optionId"
        autocomplete="off"
        :autofocus="autofocus"
        :placeholder="placeholder"
        :value="currentQuery"
        data-slot="command-input"
        class="min-h-11 w-full border-0 bg-transparent px-0 py-3 text-base text-gray-950 outline-none placeholder:text-gray-500 focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-950 dark:text-white dark:placeholder:text-gray-400 dark:focus-visible:outline-white"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      <slot name="suffix" />
    </div>

    <div
      :id="listId"
      role="listbox"
      :aria-label="`${label} results`"
      data-slot="command-list"
      class="max-h-72 overflow-y-auto overscroll-contain p-1.5"
    >
      <slot name="before" />

      <div
        v-for="group in commandGroups"
        :key="group.headingId"
        role="group"
        :aria-labelledby="group.headingId"
        data-slot="command-group"
      >
        <div
          :id="group.headingId"
          data-slot="command-group-heading"
          class="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
        >
          {{ group.heading }}
        </div>

        <div
          v-for="entry in group.entries"
          :id="entry.optionId"
          :key="entry.key"
          role="option"
          :aria-selected="entry.key === activeKey"
          :aria-disabled="entry.command.disabled || undefined"
          data-slot="command-item"
          :data-command-key="entry.key"
          :data-state="entry.key === activeKey ? 'active' : 'inactive'"
          :data-highlighted="entry.key === activeKey ? '' : undefined"
          :data-destructive="entry.command.destructive ? '' : undefined"
          class="flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-gray-100 data-highlighted:text-gray-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 dark:data-highlighted:bg-gray-800 dark:data-highlighted:text-white"
          @mousedown="handleMousedown"
          @pointermove="handlePointermove($event, entry)"
          @click="select(entry)"
        >
          <slot
            name="item"
            :command="entry.command"
            :active="entry.key === activeKey"
          >
            <span class="flex min-w-0 flex-1 flex-col">
              <span class="truncate">{{ entry.command.title }}</span>
              <span
                v-if="entry.command.subtitle"
                class="truncate text-xs text-gray-500 dark:text-gray-400"
              >
                {{ entry.command.subtitle }}
              </span>
            </span>
            <kbd
              v-if="entry.command.shortcut"
              aria-hidden="true"
              class="ml-auto shrink-0 font-mono text-xs text-gray-500 dark:text-gray-400"
            >
              {{ entry.command.shortcut }}
            </kbd>
          </slot>
        </div>
      </div>

      <div
        v-if="!entries.length"
        data-slot="command-empty"
        class="py-10 text-center text-sm text-gray-500 dark:text-gray-400"
        aria-live="polite"
      >
        <slot name="empty" :query="currentQuery"> No matching command. </slot>
      </div>
    </div>

    <slot name="footer" />
  </div>
</template>
