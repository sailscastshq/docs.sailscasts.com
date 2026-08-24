<script setup>
import { computed, ref, useAttrs, useId, useSlots, watch } from 'vue'
import { twMerge } from 'tailwind-merge'
import Menu from '../menu/Menu.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Accessible name for this row's actions and overflow menu. */
  label: { type: String, default: 'Actions' },
  /** Prevents duplicate overflow interaction while application work is pending. */
  busy: { type: Boolean, default: false },
  /** Optional stable id for the overflow menu. */
  id: { type: String, default: undefined },
  /** Preferred logical menu placement. Collision handling may flip it. */
  placement: { type: String, default: 'bottom-end' },
  /** Space in pixels between the trigger and menu. */
  offset: { type: Number, default: 4 }
})

const attrs = useAttrs()
const slots = useSlots()
const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const menuId = computed(() => props.id ?? `klean-row-actions-${generatedId}`)
const open = ref(false)
const hasMenu = computed(() => Boolean(slots.menu))
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

function stopPropagation(event) {
  event.stopPropagation()
}

watch(
  () => props.busy,
  (busy) => {
    if (busy) open.value = false
  }
)
</script>

<template>
  <div
    v-bind="rootAttrs"
    role="group"
    :aria-label="label"
    :aria-busy="busy ? 'true' : undefined"
    data-slot="row-actions"
    :class="twMerge('inline-flex items-center gap-1', attrs.class)"
    @pointerdown="stopPropagation"
    @click="stopPropagation"
  >
    <slot />

    <button
      v-if="hasMenu"
      type="button"
      :disabled="busy"
      :aria-label="label"
      :aria-controls="menuId"
      :aria-expanded="open ? 'true' : 'false'"
      :popovertarget="menuId"
      data-slot="row-actions-trigger"
      class="inline-grid size-9 cursor-pointer place-items-center rounded-md text-current hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10"
    >
      <slot name="trigger">
        <svg
          class="size-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M6 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
          />
        </svg>
      </slot>
    </button>

    <Menu
      v-if="hasMenu"
      :id="menuId"
      v-model:open="open"
      :aria-label="label"
      :placement="placement"
      :offset="offset"
      data-row-actions-menu=""
      class="min-w-40"
      v-slot="{ close }"
    >
      <slot name="menu" :close="close" />
    </Menu>
  </div>
</template>
