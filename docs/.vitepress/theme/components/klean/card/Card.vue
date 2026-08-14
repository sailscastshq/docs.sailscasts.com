<script setup>
import { computed, ref, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

defineProps({
  /** Native element or framework component that truthfully describes the surface. */
  as: { type: [String, Object, Function], default: 'div' }
})

const attrs = useAttrs()
const element = ref()

const forwardedAttrs = computed(() => {
  const { class: _class, 'data-slot': _dataSlot, ...rest } = attrs
  return rest
})

defineExpose({ element })
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="forwardedAttrs"
    data-slot="card"
    :class="
      twMerge(
        'rounded-lg border border-gray-200 bg-white p-5 text-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-white',
        attrs.class
      )
    "
  >
    <slot />
  </component>
</template>
