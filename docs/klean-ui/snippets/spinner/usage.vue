<script setup>
import Spinner from '@/components/ui/spinner/Spinner.vue'
</script>

<template>
  <span role="status" aria-live="polite" aria-atomic="true">
    <template v-if="loading">
      <Spinner class="size-4" />
      <span>Loading deployments…</span>
    </template>
  </span>
</template>
