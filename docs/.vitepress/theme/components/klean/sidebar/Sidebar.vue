<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Stable landmark id and zero-configuration persistence namespace. */
  id: { type: String, default: 'app-sidebar' },
  /** Framework-native controlled visibility. Omit for remembered state. */
  open: { type: Boolean, default: undefined },
  /** Initial visibility before a remembered choice exists. */
  defaultOpen: { type: Boolean, default: true },
  /** Remember this desktop choice across visits and application tabs. */
  remember: { type: Boolean, default: true }
})

const emit = defineEmits(['update:open'])
const attrs = useAttrs()
const root = ref()
const internalOpen = ref(props.defaultOpen)
const restored = ref(false)
const controlled = computed(() => props.open !== undefined)
const visible = computed(() =>
  controlled.value ? props.open : internalOpen.value
)
const storageKey = computed(() => `klean:sidebar:${props.id}:open`)

const rootAttrs = computed(() => {
  const {
    class: _class,
    'data-slot': _dataSlot,
    'data-state': _dataState,
    'data-restored': _dataRestored,
    'aria-hidden': _ariaHidden,
    inert: _inert,
    ...rest
  } = attrs
  return rest
})

const rootClasses = computed(() =>
  twMerge(
    'min-w-0 shrink-0 overflow-hidden transition-[width,opacity] duration-200 ease-out motion-reduce:transition-none',
    attrs.class
  )
)

function readRemembered() {
  if (!props.remember || typeof window === 'undefined') return undefined
  try {
    const value = window.localStorage.getItem(storageKey.value)
    if (value === 'true') return true
    if (value === 'false') return false
  } catch {
    // Storage may be unavailable in private or constrained browser contexts.
  }
  return undefined
}

function rememberVisibility(next) {
  if (!props.remember || typeof window === 'undefined') return
  try {
    window.localStorage.setItem(storageKey.value, String(next))
  } catch {
    // Visibility still works when persistence is unavailable.
  }
}

function setOpen(next) {
  const normalized = Boolean(next)
  if (!controlled.value) internalOpen.value = normalized
  emit('update:open', normalized)
  rememberVisibility(normalized)
}

function show() {
  setOpen(true)
}

function hide() {
  setOpen(false)
}

function toggle() {
  setOpen(!visible.value)
}

function restore() {
  if (controlled.value) {
    rememberVisibility(visible.value)
    return
  }
  const remembered = readRemembered()
  const next = remembered ?? props.defaultOpen
  internalOpen.value = next
  emit('update:open', next)
}

function handleStorage(event) {
  if (
    !props.remember ||
    event.storageArea !== window.localStorage ||
    event.key !== storageKey.value
  ) {
    return
  }

  if (event.newValue === 'true') {
    if (!controlled.value) internalOpen.value = true
    emit('update:open', true)
  }
  if (event.newValue === 'false') {
    if (!controlled.value) internalOpen.value = false
    emit('update:open', false)
  }
}

onMounted(() => {
  restore()
  restored.value = true
  window.addEventListener('storage', handleStorage)
})

onBeforeUnmount(() => {
  window.removeEventListener('storage', handleStorage)
})

watch(
  () => props.open,
  (next) => {
    if (restored.value && next !== undefined) rememberVisibility(next)
  }
)

watch(
  () => [props.id, props.remember],
  () => {
    if (restored.value) restore()
  }
)

defineExpose({ root, show, hide, toggle })
</script>

<template>
  <aside
    ref="root"
    v-bind="rootAttrs"
    :id="props.id"
    data-slot="sidebar"
    :data-state="visible ? 'open' : 'closed'"
    :data-restored="restored ? 'true' : 'false'"
    :aria-hidden="visible ? undefined : 'true'"
    :inert="visible ? undefined : ''"
    :class="rootClasses"
  >
    <slot :open="visible" :show="show" :hide="hide" :toggle="toggle" />
  </aside>
</template>
