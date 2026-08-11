<script setup>
import { computed, inject, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'
import { COMMAND_CONTEXT } from './context.js'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const command = inject(COMMAND_CONTEXT)
if (!command) throw new Error('CommandList must be used inside Command.')

const classes = computed(() =>
  twMerge(
    'max-h-[min(22rem,60dvh)] overflow-y-auto overscroll-contain p-1',
    attrs.class
  )
)
</script>

<template>
  <div
    v-bind="attrs"
    :id="command.listId.value"
    role="listbox"
    data-slot="command-list"
    :class="classes"
  >
    <slot />
  </div>
</template>
