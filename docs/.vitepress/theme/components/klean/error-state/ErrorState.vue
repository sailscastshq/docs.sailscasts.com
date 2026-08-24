<script setup>
import { computed, ref, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

defineProps({
  /** Native element or framework component that truthfully fits the document. */
  as: { type: [String, Object, Function], default: 'div' }
})

const attrs = useAttrs()
const element = ref()
const rootAttrs = computed(() => {
  const { class: _class, 'data-slot': _dataSlot, ...rest } = attrs
  return rest
})

defineExpose({ element })
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="rootAttrs"
    data-slot="error-state"
    :class="
      twMerge(
        'flex min-h-48 w-full flex-col items-center justify-center gap-4 p-6 text-center text-gray-950 dark:text-white',
        attrs.class
      )
    "
  >
    <slot />
  </component>
</template>
