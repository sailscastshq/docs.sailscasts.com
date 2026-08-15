<script setup>
import Badge from '@/components/ui/badge/Badge.vue'

const statusClasses = {
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-blue-50 text-blue-800',
  paid: 'bg-emerald-50 text-emerald-800'
}
</script>

<template>
  <Badge :class="statusClasses[invoice.status]">
    {{ invoice.status }}
  </Badge>

  <Badge class="bg-emerald-50 px-3 py-1 text-emerald-700">
    <span aria-hidden="true" class="size-1.5 rounded-full bg-emerald-500" />
    Healthy
  </Badge>
</template>
