<script setup>
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.vue'

const items = [
  { label: 'Projects', href: '/' },
  { label: 'Slipway', href: '/projects/slipway' },
  { label: 'Settings' }
]
</script>

<template>
  <Breadcrumb :items="items" />
</template>
