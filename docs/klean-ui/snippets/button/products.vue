<script setup>
import Button from '@/components/ui/button/Button.vue'
</script>

<template>
  <!-- Hagfish owns this expressive motion. -->
  <Button
    class="border-2 border-black bg-black px-6 text-white hover:bg-white hover:text-black hover:shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
  >
    Send invoice
  </Button>

  <!-- Slipway stays compact and motionless. -->
  <Button class="min-h-9 min-w-0 rounded-md px-3 py-1.5 text-sm">
    Deploy
  </Button>
</template>
