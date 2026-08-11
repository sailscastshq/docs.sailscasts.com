<script setup>
import { computed, inject, provide, useAttrs, useId } from 'vue'
import { twMerge } from 'tailwind-merge'
import { COMMAND_CONTEXT, COMMAND_GROUP_CONTEXT } from './context.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Visible and accessible group label. */
  heading: { type: String, required: true }
})
const attrs = useAttrs()
const command = inject(COMMAND_CONTEXT)
if (!command) throw new Error('CommandGroup must be used inside Command.')

const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const groupId = `klean-command-group-${generatedId}`
const labelId = `${groupId}-label`
const visible = computed(() => command.groupHasVisibleItems(groupId))
const classes = computed(() => twMerge('py-1', attrs.class))

provide(COMMAND_GROUP_CONTEXT, groupId)
</script>

<template>
  <div
    v-show="visible"
    v-bind="attrs"
    role="group"
    :aria-labelledby="labelId"
    data-slot="command-group"
    :class="classes"
  >
    <div
      :id="labelId"
      data-slot="command-group-heading"
      class="px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400"
    >
      {{ heading }}
    </div>
    <slot />
  </div>
</template>
