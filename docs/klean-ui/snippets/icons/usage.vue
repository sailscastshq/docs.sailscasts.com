<script setup>
import Trash from '@/components/ui/icons/Trash.vue'
</script>

<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
    aria-label="Delete invoice"
  >
    <Trash class="size-4" />
    Delete
  </button>
</template>
