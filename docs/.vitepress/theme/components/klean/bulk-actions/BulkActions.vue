<script setup>
import { computed, nextTick, ref, useAttrs, watch } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Number of records in the caller-owned selection. */
  count: { type: Number, default: 0 },
  /** Accessible name for the selected-record action region. */
  label: { type: String, default: 'Bulk actions' },
  /** Truthful pending state for work that makes clearing unsafe. */
  busy: { type: Boolean, default: false },
  /** Visible and accessible copy for the default clear button. */
  clearLabel: { type: String, default: 'Clear selection' }
})

const emit = defineEmits(['clear'])
const attrs = useAttrs()
const element = ref()
const selectedCount = computed(() =>
  Math.max(0, Math.trunc(Number(props.count) || 0))
)
const rootAttrs = computed(() => {
  const {
    class: _class,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-busy': _ariaBusy,
    'data-slot': _dataSlot,
    ...rest
  } = attrs
  return rest
})

function focusTarget(root) {
  return root?.querySelector?.('[data-bulk-actions-focus]')
}

function clearSelection() {
  if (props.busy) return
  emit('clear')
}

watch(
  selectedCount,
  async (nextCount, previousCount) => {
    if (previousCount <= 0 || nextCount > 0) return

    const rootElement = element.value
    const root = rootElement?.getRootNode?.() ?? document
    const activeElement = root.activeElement ?? document.activeElement
    const shouldRestore = rootElement?.contains(activeElement)

    await nextTick()
    if (shouldRestore) focusTarget(root)?.focus?.({ preventScroll: true })
  },
  { flush: 'pre' }
)

defineExpose({ clear: clearSelection, element })
</script>

<template>
  <div
    v-if="selectedCount > 0"
    ref="element"
    v-bind="rootAttrs"
    role="region"
    :aria-label="label"
    :aria-busy="busy ? 'true' : undefined"
    data-slot="bulk-actions"
    :class="
      twMerge(
        'flex min-h-12 w-full flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-white',
        attrs.class
      )
    "
  >
    <span
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-slot="bulk-actions-summary"
      class="mr-auto text-sm font-medium tabular-nums"
    >
      <slot name="summary" :count="selectedCount">
        {{ selectedCount }} selected
      </slot>
    </span>

    <slot :count="selectedCount" :busy="busy" :clear="clearSelection" />

    <button
      type="button"
      :disabled="busy"
      data-slot="bulk-actions-clear"
      class="min-h-9 cursor-pointer rounded-md px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white"
      @click="clearSelection"
    >
      {{ clearLabel }}
    </button>
  </div>
</template>
