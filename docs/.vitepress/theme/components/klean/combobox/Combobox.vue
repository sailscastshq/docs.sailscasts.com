<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  useId,
  watch
} from 'vue'
import { twMerge } from 'tailwind-merge'
import Popover from '../popover/Popover.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Framework-native controlled value. Omit for uncontrolled use. */
  modelValue: { default: undefined },
  /** Initial value when `modelValue` is not controlled. */
  defaultValue: { default: undefined },
  /** Choices in the form `{ value, label, description?, disabled?, group?, keywords? }`. */
  options: { type: Array, default: () => [] },
  /** Framework-native controlled search text. Usually left uncontrolled. */
  query: { type: String, default: undefined },
  /** Initial search text when `query` is not controlled. */
  defaultQuery: { type: String, default: '' },
  /** Text shown while no value is selected and the user is not searching. */
  placeholder: { type: String, default: 'Search and choose' },
  /** Text shown when the current query has no matches. */
  emptyText: { type: String, default: 'No matches found.' },
  /** Text shown while application-owned results are loading. */
  loadingText: { type: String, default: 'Searching…' },
  /** Application-owned remote loading state. Existing results remain usable. */
  loading: { type: Boolean, default: false },
  /** Application-owned remote search error. */
  error: { type: String, default: '' },
  /** Delay before the application-owned `search` event, in milliseconds. */
  searchDelay: { type: Number, default: 300 },
  /** Native form field name for the committed value. */
  name: { type: String, default: undefined },
  /** Accessible required state for the committed application value. */
  required: { type: Boolean, default: false },
  /** Prevents searching, opening, and selection. */
  disabled: { type: Boolean, default: false },
  /** Stable input ID. */
  id: { type: String, default: undefined },
  /** Framework-native controlled popup state. */
  open: { type: Boolean, default: undefined },
  /** Initial popup state when `open` is not controlled. */
  defaultOpen: { type: Boolean, default: false },
  /** Preferred logical placement. Collision handling may flip it. */
  placement: { type: String, default: 'bottom-start' },
  /** Space in pixels between the input and popup. */
  offset: { type: Number, default: 4 }
})

const emit = defineEmits([
  'update:modelValue',
  'update:query',
  'update:open',
  'change',
  'search',
  'blur'
])
const attrs = useAttrs()
const generatedId = useId()
const root = ref()
const input = ref()
const popover = ref()
const internalValue = ref(props.defaultValue)
const internalQuery = ref(props.defaultQuery)
const internalOpen = ref(props.defaultOpen)
const highlightedIndex = ref(-1)
const inputWidth = ref(0)
let form
let resizeObserver
let searchTimer

const isValueControlled = computed(() => props.modelValue !== undefined)
const value = computed(() =>
  isValueControlled.value ? props.modelValue : internalValue.value
)
const isQueryControlled = computed(() => props.query !== undefined)
const currentQuery = computed(() =>
  isQueryControlled.value ? props.query : internalQuery.value
)
const isOpenControlled = computed(() => props.open !== undefined)
const isOpen = computed(() =>
  isOpenControlled.value ? props.open : internalOpen.value
)
const controlId = computed(
  () =>
    props.id ?? `klean-combobox-${generatedId.replace(/[^a-zA-Z0-9_-]/g, '')}`
)
const contentId = computed(() => `${controlId.value}-content`)
const listboxId = computed(() => `${controlId.value}-listbox`)
const selectedIndex = computed(() =>
  props.options.findIndex((option) => Object.is(option.value, value.value))
)
const selectedOption = computed(() => props.options[selectedIndex.value])
const visibleValue = computed(() =>
  isOpen.value ? currentQuery.value : String(selectedOption.value?.label ?? '')
)
const serializedValue = computed(() => {
  const current = value.value
  return ['string', 'number', 'boolean'].includes(typeof current)
    ? String(current)
    : ''
})
const inputClasses = computed(() =>
  twMerge(
    'min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-base text-gray-950 shadow-sm outline-none transition-colors duration-150 placeholder:text-gray-500 hover:border-gray-400 focus:border-gray-950 focus:outline-2 focus:outline-offset-2 focus:outline-gray-950 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 aria-invalid:border-red-600 aria-invalid:focus:outline-red-600 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-400 dark:hover:border-gray-600 dark:focus:border-white dark:focus:outline-white dark:disabled:bg-gray-900 dark:disabled:text-gray-500 dark:aria-invalid:border-red-500 dark:aria-invalid:focus:outline-red-500 motion-reduce:transition-none',
    attrs.class
  )
)
const forwardedInputAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    id: _id,
    role: _role,
    type: _type,
    value: _value,
    name: _name,
    required: _required,
    disabled: _disabled,
    autocomplete: _autocomplete,
    'data-slot': _dataSlot,
    ...rest
  } = attrs
  return rest
})

function searchableText(option) {
  return [option.label, option.description, ...(option.keywords ?? [])]
    .filter(Boolean)
    .join(' ')
    .normalize('NFKD')
    .toLocaleLowerCase()
}

const filteredEntries = computed(() => {
  const needle = currentQuery.value.trim().normalize('NFKD').toLocaleLowerCase()

  return props.options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => !needle || searchableText(option).includes(needle))
})
const groupedEntries = computed(() => {
  const groups = new Map()
  for (const entry of filteredEntries.value) {
    const label = entry.option.group ?? null
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label).push(entry)
  }
  return [...groups].map(([label, entries]) => ({ label, entries }))
})
const activeDescendant = computed(() =>
  isOpen.value && highlightedIndex.value >= 0
    ? optionId(highlightedIndex.value)
    : undefined
)

function optionId(index) {
  return `${controlId.value}-option-${index}`
}

function enabledIndexes() {
  return filteredEntries.value
    .filter(({ option }) => !option.disabled)
    .map(({ index }) => index)
}

function initialHighlight(edge = 'selected') {
  const enabled = enabledIndexes()
  if (!enabled.length) return -1
  if (edge === 'selected' && enabled.includes(selectedIndex.value)) {
    return selectedIndex.value
  }
  return edge === 'last' ? enabled.at(-1) : enabled[0]
}

function syncInputWidth() {
  inputWidth.value = input.value?.getBoundingClientRect().width ?? 0
}

async function revealHighlighted() {
  await nextTick()
  if (highlightedIndex.value < 0) return
  const content = popover.value?.content?.value ?? popover.value?.content
  content
    ?.querySelector?.(`[data-option-index="${highlightedIndex.value}"]`)
    ?.scrollIntoView?.({ block: 'nearest' })
}

function setQuery(nextQuery, { search = false } = {}) {
  if (!isQueryControlled.value) internalQuery.value = nextQuery
  emit('update:query', nextQuery)
  clearTimeout(searchTimer)
  searchTimer = undefined
  if (!search) return

  searchTimer = setTimeout(
    () => {
      emit('search', nextQuery)
      searchTimer = undefined
    },
    Math.max(0, props.searchDelay)
  )
}

function requestOpen(nextOpen) {
  if (!isOpenControlled.value) internalOpen.value = nextOpen
  emit('update:open', nextOpen)
}

function openCombobox(edge = 'first') {
  if (props.disabled) return
  syncInputWidth()
  if (!isOpen.value) {
    setQuery('', { search: true })
    popover.value?.open(input.value)
  } else {
    highlightedIndex.value = initialHighlight(edge)
    revealHighlighted()
  }
}

function closeCombobox({ restoreFocus = false } = {}) {
  setQuery('')
  popover.value?.close({ restoreFocus })
}

function handlePopoverOpen(nextOpen) {
  requestOpen(nextOpen)
  if (!nextOpen) setQuery('')
}

function moveHighlight(step) {
  const enabled = enabledIndexes()
  if (!enabled.length) return
  const current = enabled.indexOf(highlightedIndex.value)
  const next =
    current < 0
      ? step > 0
        ? 0
        : enabled.length - 1
      : (current + step + enabled.length) % enabled.length
  highlightedIndex.value = enabled[next]
  revealHighlighted()
}

function choose(index) {
  const option = props.options[index]
  if (!option || option.disabled || props.disabled) return
  if (!isValueControlled.value) internalValue.value = option.value
  emit('update:modelValue', option.value)
  emit('change', option.value, option)
  highlightedIndex.value = index
  closeCombobox({ restoreFocus: true })
}

function handleInput(event) {
  const nextQuery = event.currentTarget.value
  if (!isOpen.value) openCombobox()
  setQuery(nextQuery, { search: true })
}

function handleKeydown(event) {
  if (props.disabled) return

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!isOpen.value) openCombobox(event.key === 'ArrowUp' ? 'last' : 'first')
    else moveHighlight(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Home' && isOpen.value) {
    event.preventDefault()
    highlightedIndex.value = initialHighlight('first')
    revealHighlighted()
  } else if (event.key === 'End' && isOpen.value) {
    event.preventDefault()
    highlightedIndex.value = initialHighlight('last')
    revealHighlighted()
  } else if (event.key === 'Enter' && isOpen.value) {
    event.preventDefault()
    if (highlightedIndex.value >= 0) choose(highlightedIndex.value)
  } else if (event.key === 'Escape' && isOpen.value) {
    event.preventDefault()
    event.stopPropagation()
    closeCombobox({ restoreFocus: true })
  } else if (event.key === 'Tab' && isOpen.value) {
    closeCombobox()
  }
}

function handleFormReset() {
  clearTimeout(searchTimer)
  if (!isValueControlled.value) internalValue.value = props.defaultValue
  setQuery(props.defaultQuery)
  if (isOpen.value) closeCombobox()
}

watch(
  isOpen,
  async (nextOpen) => {
    if (!nextOpen) {
      highlightedIndex.value = -1
      return
    }
    highlightedIndex.value = initialHighlight('selected')
    syncInputWidth()
    await revealHighlighted()
  },
  { flush: 'post' }
)

watch(filteredEntries, () => {
  if (!isOpen.value) return
  const enabled = enabledIndexes()
  if (!enabled.includes(highlightedIndex.value)) {
    highlightedIndex.value = enabled[0] ?? -1
  }
  revealHighlighted()
})

onMounted(() => {
  form = root.value?.closest?.('form')
  form?.addEventListener('reset', handleFormReset)
  if (typeof ResizeObserver !== 'undefined' && input.value) {
    resizeObserver = new ResizeObserver(syncInputWidth)
    resizeObserver.observe(input.value)
  }
  syncInputWidth()
})

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  resizeObserver?.disconnect()
  form?.removeEventListener('reset', handleFormReset)
})

defineExpose({
  close: closeCombobox,
  focus: (options) => input.value?.focus(options),
  input,
  open: openCombobox
})
</script>

<template>
  <span
    ref="root"
    data-slot="combobox"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="
      attrs['aria-invalid'] === true || attrs['aria-invalid'] === 'true'
        ? ''
        : undefined
    "
    class="relative grid w-full"
  >
    <span data-slot="combobox-control" class="relative grid">
      <input
        ref="input"
        v-bind="forwardedInputAttrs"
        :id="controlId"
        type="text"
        role="combobox"
        autocomplete="off"
        :disabled="disabled"
        :value="visibleValue"
        :placeholder="placeholder"
        :popovertarget="contentId"
        popovertargetaction="show"
        :aria-expanded="String(isOpen)"
        :aria-controls="listboxId"
        aria-haspopup="listbox"
        aria-autocomplete="list"
        :aria-required="required || undefined"
        :aria-activedescendant="activeDescendant"
        data-slot="combobox-input"
        :data-state="isOpen ? 'open' : 'closed'"
        :class="inputClasses"
        :style="attrs.style"
        @focus="openCombobox('selected')"
        @click="openCombobox('selected')"
        @input="handleInput"
        @keydown="handleKeydown"
        @blur="emit('blur', $event)"
      />

      <span
        data-slot="combobox-icon"
        class="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-gray-500 dark:text-gray-400"
        aria-hidden="true"
      >
        <svg
          v-if="loading"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          class="size-4 animate-spin motion-reduce:animate-none"
        >
          <path d="M17 10a7 7 0 1 1-2.05-4.95" stroke-linecap="round" />
        </svg>
        <svg
          v-else
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          class="size-4"
        >
          <path
            d="m6 8 4 4 4-4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </span>

    <input
      v-if="name"
      type="hidden"
      :name="name"
      :value="serializedValue"
      :disabled="disabled"
      :form="attrs.form"
    />

    <Popover
      ref="popover"
      :id="contentId"
      :open="isOpen"
      :placement="placement"
      :offset="offset"
      data-slot="combobox-content"
      class="max-h-80 overflow-hidden p-1"
      :style="inputWidth ? { minWidth: `${inputWidth}px` } : undefined"
      @update:open="handlePopoverOpen"
    >
      <div
        :id="listboxId"
        role="listbox"
        :aria-labelledby="
          attrs['aria-label']
            ? undefined
            : (attrs['aria-labelledby'] ?? controlId)
        "
        :aria-label="
          attrs['aria-label'] ? `${attrs['aria-label']} options` : undefined
        "
        :aria-busy="loading || undefined"
        data-slot="combobox-listbox"
        class="max-h-76 overflow-y-auto overscroll-contain outline-none"
      >
        <div
          v-if="error"
          role="status"
          data-slot="combobox-error"
          class="px-3 py-2 text-sm text-red-700 dark:text-red-400"
        >
          <slot name="error" :error="error">{{ error }}</slot>
        </div>

        <template v-if="filteredEntries.length">
          <div
            v-for="(group, groupIndex) in groupedEntries"
            :key="group.label ?? `ungrouped-${groupIndex}`"
            :role="group.label ? 'group' : undefined"
            :aria-label="group.label || undefined"
            data-slot="combobox-group"
          >
            <p
              v-if="group.label"
              data-slot="combobox-group-label"
              class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {{ group.label }}
            </p>

            <div
              v-for="{ option, index } in group.entries"
              :id="optionId(index)"
              :key="index"
              role="option"
              :aria-selected="String(index === selectedIndex)"
              :aria-disabled="option.disabled || undefined"
              data-slot="combobox-option"
              :data-option-index="index"
              :data-highlighted="index === highlightedIndex ? '' : undefined"
              :data-selected="index === selectedIndex ? '' : undefined"
              :data-disabled="option.disabled ? '' : undefined"
              class="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded px-3 py-2 text-sm text-gray-700 outline-none data-highlighted:bg-gray-100 data-highlighted:text-gray-950 data-disabled:cursor-not-allowed data-disabled:opacity-40 dark:text-gray-200 dark:data-highlighted:bg-white/10 dark:data-highlighted:text-white"
              @pointermove="!option.disabled && (highlightedIndex = index)"
              @pointerdown.prevent
              @click="choose(index)"
            >
              <span class="min-w-0 flex-1">
                <slot
                  name="option"
                  :option="option"
                  :selected="index === selectedIndex"
                  :highlighted="index === highlightedIndex"
                >
                  <span class="block truncate">{{ option.label }}</span>
                  <span
                    v-if="option.description"
                    class="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400"
                  >
                    {{ option.description }}
                  </span>
                </slot>
              </span>

              <svg
                v-if="index === selectedIndex"
                data-slot="combobox-indicator"
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="size-4 shrink-0"
              >
                <path
                  d="m5 10 3 3 7-7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </template>

        <div
          v-else-if="!loading"
          data-slot="combobox-empty"
          class="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <slot name="empty" :query="currentQuery">{{ emptyText }}</slot>
        </div>

        <div
          v-if="loading"
          role="status"
          data-slot="combobox-loading"
          class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400"
        >
          <slot name="loading">{{ loadingText }}</slot>
        </div>
      </div>
    </Popover>
  </span>
</template>
