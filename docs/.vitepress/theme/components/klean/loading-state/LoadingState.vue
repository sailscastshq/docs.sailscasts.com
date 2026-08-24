<script setup>
import { computed, ref, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const element = ref()
const rootAttrs = computed(() => {
  const {
    class: _class,
    role: _role,
    'aria-live': _ariaLive,
    'aria-atomic': _ariaAtomic,
    'data-slot': _dataSlot,
    ...rest
  } = attrs
  return rest
})

defineExpose({ element })
</script>

<template>
  <div
    ref="element"
    v-bind="rootAttrs"
    role="status"
    aria-live="polite"
    aria-atomic="true"
    data-slot="loading-state"
    :class="
      twMerge(
        'flex min-h-32 w-full flex-col items-center justify-center gap-3 p-6 text-center text-gray-600 dark:text-gray-300',
        attrs.class
      )
    "
  >
    <slot />
  </div>
</template>
