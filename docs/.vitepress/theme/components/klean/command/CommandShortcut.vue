<script setup>
import { computed, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const classes = computed(() =>
  twMerge(
    'ml-auto text-xs tracking-widest text-gray-500 dark:text-gray-400',
    attrs.class
  )
)
</script>

<template>
  <kbd
    v-bind="attrs"
    aria-hidden="true"
    data-slot="command-shortcut"
    :class="classes"
  >
    <slot />
  </kbd>
</template>
