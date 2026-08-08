<script setup>
import { ref } from 'vue'
import Select from '@/components/ui/select/Select.vue'

const invoiceStatus = ref('draft')
const environment = ref('production')
</script>

<template>
  <Select
    v-model="invoiceStatus"
    :options="[
      { value: 'draft', label: 'Draft' },
      { value: 'sent', label: 'Sent' },
      { value: 'paid', label: 'Paid' }
    ]"
    class="rounded-none border-2 border-black bg-white text-black shadow-[4px_4px_0_0_#000]"
  />

  <Select
    v-model="environment"
    :options="[
      { value: 'preview', label: 'Preview' },
      { value: 'staging', label: 'Staging' },
      { value: 'production', label: 'Production' }
    ]"
    class="min-h-9 border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-white shadow-none"
  />
</template>
