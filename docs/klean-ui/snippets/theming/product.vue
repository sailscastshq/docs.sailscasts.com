<!-- assets/js/components/DeployButton.vue -->
<script setup>
import Button from './ui/button/Button.vue'
</script>

<template>
  <Button
    class="min-h-11 bg-emerald-700 px-5 font-semibold text-white hover:bg-emerald-800"
  >
    <slot />
  </Button>
</template>
