<script setup>
import Button from '@/components/ui/button/Button.vue'
import Tooltip from '@/components/ui/tooltip/Tooltip.vue'
</script>

<template>
  <Tooltip text="Re-run query">
    <Button type="button" aria-label="Re-run query" class="size-10 min-h-0 p-0">
      <RefreshIcon aria-hidden="true" />
    </Button>
  </Tooltip>
</template>
