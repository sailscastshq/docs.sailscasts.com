<script setup>
import { computed, inject, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'
import { COMMAND_CONTEXT } from './context.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Search prompt. */
  placeholder: { type: String, default: 'Type a command or search…' }
})

const attrs = useAttrs()
const command = inject(COMMAND_CONTEXT)
if (!command) throw new Error('CommandInput must be used inside Command.')

const inputClasses = computed(() =>
  twMerge(
    'min-h-11 w-full border-0 border-b border-gray-200 bg-transparent px-4 py-3 text-base text-gray-950 outline-none placeholder:text-gray-500 focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-gray-950 dark:border-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus-visible:outline-white',
    attrs.class
  )
)
const inputAttrs = computed(() => {
  const {
    class: _class,
    id: _id,
    role: _role,
    value: _value,
    type: _type,
    autocomplete: _autocomplete,
    onInput: _onInput,
    onKeydown: _onKeydown,
    onKeyDown: _onKeyDown,
    'data-slot': _dataSlot,
    ...rest
  } = attrs
  return rest
})

function handleInput(event) {
  for (const callback of Array.isArray(attrs.onInput)
    ? attrs.onInput
    : [attrs.onInput]) {
    callback?.(event)
  }
  if (!event.defaultPrevented) command.setQuery(event.currentTarget.value)
}

function handleKeydown(event) {
  const listener = attrs.onKeydown ?? attrs.onKeyDown
  for (const callback of Array.isArray(listener) ? listener : [listener]) {
    callback?.(event)
  }
  if (!event.defaultPrevented) command.handleKeydown(event)
}
</script>

<template>
  <input
    :id="command.inputId.value"
    :ref="(element) => (command.input.value = element)"
    v-bind="inputAttrs"
    type="text"
    role="combobox"
    aria-autocomplete="list"
    aria-expanded="true"
    :aria-controls="command.listId.value"
    :aria-activedescendant="command.activeDescendant.value"
    autocomplete="off"
    data-slot="command-input"
    :value="command.currentQuery.value"
    :placeholder="placeholder"
    :class="inputClasses"
    @input="handleInput"
    @keydown="handleKeydown"
  />
</template>
