<script setup>
import { computed, ref, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const element = ref()

const forwardedAttrs = computed(() => {
  const { class: _class, 'data-slot': _dataSlot, ...rest } = attrs
  return rest
})

defineExpose({ element })
</script>

<template>
  <table
    ref="element"
    v-bind="forwardedAttrs"
    data-slot="table"
    :class="
      twMerge(
        'w-full border-collapse text-left text-sm text-gray-950 dark:text-white',
        attrs.class
      )
    "
  >
    <slot />
  </table>
</template>
