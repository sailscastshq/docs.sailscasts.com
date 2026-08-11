<script setup>
import { computed, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const classes = computed(() =>
  twMerge('-mx-1 my-1 h-px border-0 bg-gray-200 dark:bg-gray-800', attrs.class)
)
</script>

<template>
  <hr v-bind="attrs" data-slot="command-separator" :class="classes" />
</template>
