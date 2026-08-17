<script setup>
import Separator from '@/components/ui/separator/Separator.vue'
</script>

<template>
  <div
    role="toolbar"
    aria-label="Document actions"
    class="flex h-10 items-stretch"
  >
    <button type="button">Undo</button>
    <button type="button">Redo</button>
    <Separator
      orientation="vertical"
      aria-hidden="true"
      class="mx-2 h-6 self-center bg-gray-300 dark:bg-gray-700"
    />
    <button type="button">Share</button>
  </div>
</template>
