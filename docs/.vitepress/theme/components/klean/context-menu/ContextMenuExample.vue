<script setup>
import { ref } from 'vue'
import ContextMenu from './ContextMenu.vue'
const actions = ref()
const disabled = ref(false)
const itemClass =
  'block w-full cursor-pointer rounded px-3 py-2 text-left text-sm outline-none focus:bg-gray-100 dark:focus:bg-gray-800'
</script>
<template>
  <div class="w-72 space-y-4">
    <div
      id="docs-context-project"
      tabindex="0"
      class="rounded-lg border border-gray-200 p-8 outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-700"
    >
      <p class="font-medium">Northstar project</p>
      <p class="mt-2 text-sm text-gray-500">Right-click or press Shift+F10</p>
    </div>
    <div class="flex items-center gap-4">
      <button
        type="button"
        @click="actions.show($event.currentTarget)"
        :disabled="disabled"
        class="cursor-pointer rounded border border-gray-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-gray-700"
      >
        Actions
      </button>
      <label class="flex items-center gap-2 text-sm"
        ><input type="checkbox" v-model="disabled" /> Disable</label
      >
    </div>
    <ContextMenu
      ref="actions"
      target="docs-context-project"
      :disabled="disabled"
      aria-label="Project actions"
      class="w-52"
    >
      <button type="button" :class="itemClass">Rename</button>
      <button type="button" disabled :class="[itemClass, 'opacity-40']">
        Archive
      </button>
      <a href="#keyboard-and-focus" :class="itemClass">Open project</a>
    </ContextMenu>
  </div>
</template>
