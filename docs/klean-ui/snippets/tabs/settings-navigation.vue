<script setup>
import { Link } from '@inertiajs/vue3'

defineProps({
  current: {
    type: String,
    required: true
  }
})

const sections = [
  { value: 'profile', label: 'Profile', href: '/settings/profile' },
  {
    value: 'notifications',
    label: 'Notifications',
    href: '/settings/notifications'
  },
  { value: 'billing', label: 'Billing', href: '/settings/billing' }
]
</script>

<template>
  <nav aria-label="Project settings">
    <ul class="flex flex-col gap-1">
      <li v-for="section in sections" :key="section.value">
        <Link
          :href="section.href"
          :aria-current="current === section.value ? 'page' : undefined"
          class="block min-h-11 rounded-md border-l-2 border-transparent px-3 py-2 text-sm font-medium text-gray-500 no-underline hover:bg-gray-50 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 aria-[current=page]:border-gray-950 aria-[current=page]:bg-gray-100 aria-[current=page]:text-gray-950"
        >
          {{ section.label }}
        </Link>
      </li>
    </ul>
  </nav>
</template>
