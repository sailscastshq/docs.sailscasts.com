<script setup>
import { computed, nextTick, ref, useAttrs, watch } from 'vue'
import { twMerge } from 'tailwind-merge'
import { filtersEqual } from './filterState.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Accessible name for the native search form. */
  label: { type: String, default: 'Filters' },
  /** Prevents duplicate commits while an application visit is pending. */
  busy: { type: Boolean, default: false }
})

const emit = defineEmits(['apply', 'cancel', 'clear', 'remove'])
const value = defineModel({ default: () => ({}) })
const attrs = useAttrs()
const root = ref()
const draft = ref(clone(value.value))

function clone(source) {
  return JSON.parse(JSON.stringify(source ?? {}))
}

const entries = computed(() => Object.entries(value.value ?? {}))
const count = computed(() => entries.value.length)
const dirty = computed(() => !filtersEqual(draft.value, value.value))
const rootAttrs = computed(() => {
  const {
    class: _class,
    onSubmit: _onSubmit,
    onReset: _onReset,
    'data-slot': _dataSlot,
    'data-dirty': _dataDirty,
    'data-empty': _dataEmpty,
    ...rest
  } = attrs
  return rest
})

function setDraft(next) {
  draft.value = clone(
    typeof next === 'function' ? next(clone(draft.value)) : next
  )
}

function update(key, nextValue) {
  setDraft((current) => ({ ...current, [key]: nextValue }))
}

function commit(next, eventName) {
  if (props.busy) return
  const committed = clone(next)
  value.value = committed
  draft.value = clone(committed)
  emit(eventName, clone(committed))
}

function apply() {
  if (!dirty.value) return
  commit(draft.value, 'apply')
}

function cancel() {
  draft.value = clone(value.value)
  emit('cancel', clone(value.value))
}

function clear() {
  if (!count.value) return
  commit({}, 'clear')
}

function focusAfterRemoval(index) {
  nextTick(() => {
    const candidates = [
      ...(root.value?.querySelectorAll?.('[data-filter-remove]') ?? [])
    ]
    const next = candidates[Math.min(index, candidates.length - 1)]
    ;(
      next ??
      root.value?.querySelector?.('[data-filter-clear], [data-filter-trigger]')
    )?.focus?.()
  })
}

function remove(key, event) {
  if (props.busy || !(key in (value.value ?? {}))) return
  const buttons = [
    ...(root.value?.querySelectorAll?.('[data-filter-remove]') ?? [])
  ]
  const index = Math.max(0, buttons.indexOf(event?.currentTarget))
  const next = clone(value.value)
  delete next[key]
  commit(next, 'remove')
  focusAfterRemoval(index)
}

function handleSubmit(event) {
  for (const listener of Array.isArray(attrs.onSubmit)
    ? attrs.onSubmit
    : [attrs.onSubmit]) {
    listener?.(event)
  }
  if (!event.defaultPrevented) {
    event.preventDefault()
    apply()
  }
}

function handleReset(event) {
  for (const listener of Array.isArray(attrs.onReset)
    ? attrs.onReset
    : [attrs.onReset]) {
    listener?.(event)
  }
  if (!event.defaultPrevented) {
    event.preventDefault()
    cancel()
  }
}

function removeAttrs(key, label) {
  return {
    type: 'button',
    disabled: props.busy,
    'aria-label': label ?? `Remove ${key} filter`,
    'data-filter-remove': '',
    'data-filter-key': key,
    onClick: (event) => remove(key, event)
  }
}

const applyAttrs = computed(() => ({
  type: 'submit',
  disabled: props.busy || !dirty.value
}))
const cancelAttrs = computed(() => ({
  type: 'reset',
  disabled: props.busy || !dirty.value
}))
const clearAttrs = computed(() => ({
  type: 'button',
  disabled: props.busy || count.value === 0,
  'data-filter-clear': '',
  onClick: clear
}))

watch(
  value,
  (next) => {
    if (!filtersEqual(next, draft.value)) draft.value = clone(next)
  },
  { deep: true }
)

defineExpose({ root, setDraft, apply, cancel, clear, remove })
</script>

<template>
  <form
    ref="root"
    v-bind="rootAttrs"
    role="search"
    :aria-label="label"
    :aria-busy="busy ? 'true' : undefined"
    data-slot="filter-bar"
    :data-dirty="dirty ? '' : undefined"
    :data-empty="count === 0 ? '' : undefined"
    :class="twMerge('flex flex-wrap items-center gap-2', attrs.class)"
    @submit="handleSubmit"
    @reset="handleReset"
  >
    <slot
      :draft="draft"
      :entries="entries"
      :count="count"
      :dirty="dirty"
      :busy="busy"
      :set-draft="setDraft"
      :update="update"
      :apply="apply"
      :cancel="cancel"
      :clear="clear"
      :remove="remove"
      :remove-attrs="removeAttrs"
      :apply-attrs="applyAttrs"
      :cancel-attrs="cancelAttrs"
      :clear-attrs="clearAttrs"
    />
    <span class="sr-only" aria-live="polite" aria-atomic="true">
      {{ count }} active {{ count === 1 ? 'filter' : 'filters' }}.
    </span>
  </form>
</template>
