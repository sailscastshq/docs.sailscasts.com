<script setup>
import { computed, inject, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'
import { COMMAND_CONTEXT } from './context.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  text: { type: String, default: 'No commands found.' }
})
const attrs = useAttrs()
const command = inject(COMMAND_CONTEXT)
if (!command) throw new Error('CommandEmpty must be used inside Command.')

const classes = computed(() =>
  twMerge(
    'px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400',
    attrs.class
  )
)
</script>

<template>
  <div
    v-if="command.visibleCount.value === 0"
    v-bind="attrs"
    role="status"
    data-slot="command-empty"
    :class="classes"
  >
    <slot>{{ text }}</slot>
  </div>
</template>
