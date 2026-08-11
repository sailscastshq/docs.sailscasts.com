<script setup>
import { ref } from 'vue'
import Tabs from '@/components/ui/tabs/Tabs.vue'

const active = ref('profile')
const sections = [
  { value: 'profile', label: 'Profile' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'billing', label: 'Billing' }
]
</script>

<template>
  <Tabs
    v-model="active"
    orientation="vertical"
    aria-label="Project settings"
    class="grid gap-8 sm:grid-cols-[11rem_1fr]"
  >
    <div class="flex flex-col gap-1">
      <button
        v-for="section in sections"
        :key="section.value"
        type="button"
        :data-value="section.value"
        class="min-h-11 cursor-pointer rounded-md border-l-2 border-transparent px-3 py-2 text-left text-sm font-medium text-gray-500 outline-none hover:bg-gray-50 hover:text-gray-950 focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:border-gray-950 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-950"
      >
        {{ section.label }}
      </button>
    </div>

    <section data-value="profile" class="outline-none focus-visible:ring-2">
      <h2 class="text-lg font-semibold">Profile</h2>
      <p class="mt-2 text-sm leading-6 text-gray-500">
        Change the name and contact details shown to your team.
      </p>
    </section>
    <section
      data-value="notifications"
      class="outline-none focus-visible:ring-2"
    >
      <h2 class="text-lg font-semibold">Notifications</h2>
      <p class="mt-2 text-sm leading-6 text-gray-500">
        Decide which project events should reach you.
      </p>
    </section>
    <section data-value="billing" class="outline-none focus-visible:ring-2">
      <h2 class="text-lg font-semibold">Billing</h2>
      <p class="mt-2 text-sm leading-6 text-gray-500">
        Review invoices and the payment method for this project.
      </p>
    </section>
  </Tabs>
</template>
