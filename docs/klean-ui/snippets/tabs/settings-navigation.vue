<script setup>
import { Link } from '@inertiajs/vue3'
import Tabs from '@/components/ui/tabs/Tabs.vue'

defineProps({
  current: {
    type: String,
    required: true
  }
})

const sections = [
  { value: 'profile', label: 'Profile', href: '/settings/profile' },
  { value: 'billing', label: 'Billing', href: '/settings/billing' },
  { value: 'schedule', label: 'Schedule', href: '/settings/schedule' }
]
</script>

<template>
  <Tabs
    as="nav"
    :model-value="current"
    orientation="vertical"
    aria-label="Account settings"
    class="flex flex-col gap-1"
  >
    <Link
      v-for="section in sections"
      :key="section.value"
      :href="section.href"
      :data-value="section.value"
      prefetch
      class="block min-h-11 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-black/60 no-underline outline-none hover:bg-black/5 hover:text-black focus-visible:ring-2 focus-visible:ring-black data-[state=active]:bg-black data-[state=active]:text-white"
    >
      {{ section.label }}
    </Link>
  </Tabs>
</template>
