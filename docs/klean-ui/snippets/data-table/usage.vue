<script setup>
import { ref } from 'vue'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'
import DataTable from '@/components/ui/data-table/DataTable.vue'

defineProps({ services: { type: Array, required: true } })

const selected = ref([])
</script>

<template>
  <DataTable
    v-model:selected="selected"
    :rows="services"
    class="rounded-lg border border-gray-200"
    table-class="min-w-160"
    v-slot="table"
  >
    <caption class="caption-top px-4 py-3 text-left font-semibold">
      Production services
    </caption>
    <thead class="border-y border-gray-200 bg-gray-50 text-xs text-gray-600">
      <tr>
        <th scope="col" class="w-12 px-4 py-3">
          <Checkbox v-bind="table.pageSelection()" />
        </th>
        <th scope="col" class="px-4 py-3 font-medium">Service</th>
        <th scope="col" class="px-4 py-3 font-medium">Status</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-100">
      <tr v-for="service in services" :key="service.id">
        <td class="px-4 py-3">
          <Checkbox
            v-bind="table.rowSelection(service, `Select ${service.name}`)"
          />
        </td>
        <th scope="row" class="px-4 py-3 font-medium">
          <a :href="`/services/${service.id}`">{{ service.name }}</a>
        </th>
        <td class="px-4 py-3">{{ service.status }}</td>
      </tr>
    </tbody>
  </DataTable>
</template>
