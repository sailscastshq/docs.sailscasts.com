<script setup>
import Button from '@/components/ui/button/Button.vue'
import Badge from '@/components/ui/badge/Badge.vue'
</script>

<template>
  <Button
    type="button"
    aria-label="Notifications, 3 unread"
    class="relative size-11 min-h-0 min-w-0 rounded-full p-0"
  >
    <svg aria-hidden="true" class="size-5"><!-- bell --></svg>
    <Badge
      aria-hidden="true"
      class="absolute -right-1 -top-1 min-w-5 justify-center border-white bg-red-600 px-1 text-[10px] text-white"
    >
      3
    </Badge>
  </Button>
</template>
