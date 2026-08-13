<script setup>
import Table from '@/components/ui/table/Table.vue'

const services = [
  { name: 'api', status: 'Healthy', memory: '384 MB' },
  { name: 'worker', status: 'Deploying', memory: '192 MB' },
  { name: 'web', status: 'Healthy', memory: '256 MB' }
]
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200">
    <Table class="min-w-128">
      <caption class="caption-top px-4 py-3 text-left font-semibold">
        Production services
      </caption>
      <thead class="bg-gray-50 text-xs uppercase tracking-wider text-gray-600">
        <tr>
          <th scope="col" class="px-4 py-3 font-medium">Service</th>
          <th scope="col" class="px-4 py-3 font-medium">Status</th>
          <th scope="col" class="px-4 py-3 text-right font-medium">Memory</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="service in services" :key="service.name">
          <th scope="row" class="px-4 py-3 font-mono font-medium">
            {{ service.name }}
          </th>
          <td class="px-4 py-3">{{ service.status }}</td>
          <td class="px-4 py-3 text-right tabular-nums">
            {{ service.memory }}
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
</template>
