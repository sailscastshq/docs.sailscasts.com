<script setup>
import { computed, inject, onBeforeUnmount, useAttrs, useId, watch } from 'vue'
import { twMerge } from 'tailwind-merge'
import { COMMAND_CONTEXT, COMMAND_GROUP_CONTEXT } from './context.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Searchable item text and value emitted on activation. */
  value: { type: String, required: true },
  /** Additional searchable words. */
  keywords: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: undefined }
})
const emit = defineEmits(['select'])
const attrs = useAttrs()
const command = inject(COMMAND_CONTEXT)
if (!command) throw new Error('CommandItem must be used inside Command.')
const groupId = inject(COMMAND_GROUP_CONTEXT, undefined)
const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const itemId = props.id ?? `klean-command-item-${generatedId}`
const visible = computed(() => command.visibleIds.value.has(itemId))
const active = computed(() => command.activeId.value === itemId)
const classes = computed(() =>
  twMerge(
    'flex min-h-11 cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2 text-sm outline-none data-highlighted:bg-gray-100 data-highlighted:text-gray-950 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 dark:data-highlighted:bg-gray-800 dark:data-highlighted:text-white',
    attrs.class
  )
)
const itemAttrs = computed(() => {
  const {
    class: _class,
    id: _id,
    role: _role,
    onClick: _onClick,
    onPointermove: _onPointermove,
    onPointerMove: _onPointerMove,
    'data-slot': _dataSlot,
    'data-state': _dataState,
    ...rest
  } = attrs
  return rest
})

function select() {
  emit('select', props.value)
}

const unregister = command.registerItem({
  id: itemId,
  value: props.value,
  keywords: props.keywords,
  disabled: props.disabled,
  groupId,
  select
})

watch(
  () => [props.value, props.keywords, props.disabled],
  () => {
    command.updateItem(itemId, {
      value: props.value,
      keywords: props.keywords,
      disabled: props.disabled,
      groupId,
      select
    })
  },
  { deep: true }
)

function callListener(listener, event) {
  for (const callback of Array.isArray(listener) ? listener : [listener]) {
    callback?.(event)
  }
}

function handleClick(event) {
  callListener(attrs.onClick, event)
  if (!event.defaultPrevented && !props.disabled) command.activate(itemId)
}

function handlePointermove(event) {
  callListener(attrs.onPointermove ?? attrs.onPointerMove, event)
  if (
    !event.defaultPrevented &&
    !props.disabled &&
    event.pointerType !== 'touch'
  ) {
    command.setActive(itemId)
  }
}

onBeforeUnmount(unregister)
</script>

<template>
  <div
    v-bind="itemAttrs"
    :id="itemId"
    role="option"
    :hidden="visible ? undefined : true"
    :aria-selected="active"
    :aria-disabled="disabled || undefined"
    data-slot="command-item"
    :data-command-id="itemId"
    :data-state="active ? 'active' : 'inactive'"
    :data-highlighted="active ? '' : undefined"
    :class="classes"
    @mousedown.prevent
    @pointermove="handlePointermove"
    @click="handleClick"
  >
    <slot :active="active" :disabled="disabled" />
  </div>
</template>
