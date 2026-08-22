<script setup>
import { computed, ref } from 'vue'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'
import DataTable from '@/components/ui/data-table/DataTable.vue'
import Input from '@/components/ui/input/Input.vue'

const props = defineProps({ services: { type: Array, required: true } })
const selected = ref([])
const search = ref('')

const rows = computed(() => {
  const query = search.value.trim().toLowerCase()
  return props.services.filter((service) =>
    [service.name, service.owner, service.status, service.region]
      .join(' ')
      .toLowerCase()
      .includes(query)
  )
})
</script>

<template>
  <section class="bg-gray-950 p-6 text-white">
    <header
      class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Bridge services</h2>
        <p class="mt-1 text-sm text-gray-400">
          Search, inspect, and act on server-owned records.
        </p>
      </div>
      <a
        href="/services/new"
        class="inline-flex min-h-11 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-gray-950 no-underline"
      >
        New service
      </a>
    </header>

    <div
      class="mt-6 flex items-center justify-between gap-4 border-y border-gray-800 py-4"
    >
      <Input
        v-model="search"
        type="search"
        aria-label="Search services"
        placeholder="Search services..."
        class="border-gray-700 bg-gray-900 text-white sm:max-w-xs"
      />
      <span class="text-sm text-gray-400">
        {{ selected.length ? `${selected.length} selected · ` : ''
        }}{{ rows.length }} records
      </span>
    </div>

    <DataTable
      v-model:selected="selected"
      :rows="rows"
      class="border-x border-b border-gray-800"
      table-class="min-w-180 text-gray-100 dark:text-gray-100"
      v-slot="table"
    >
      <caption class="sr-only">
        Bridge service records
      </caption>
      <thead class="border-b border-gray-800 bg-gray-900 text-xs text-gray-400">
        <tr>
          <th scope="col" class="w-12 px-4 py-3">
            <Checkbox
              v-bind="table.pageSelection('Select all services on this page')"
            />
          </th>
          <th scope="col" class="px-4 py-3 text-left font-medium">Service</th>
          <th scope="col" class="px-4 py-3 text-left font-medium">Owner</th>
          <th scope="col" class="px-4 py-3 text-left font-medium">Status</th>
          <th scope="col" class="px-4 py-3 text-left font-medium">Region</th>
        </tr>
      </thead>
      <tbody v-if="rows.length" class="divide-y divide-gray-900 bg-gray-950">
        <tr v-for="row in rows" :key="row.id" class="hover:bg-white/5">
          <td class="px-4 py-3">
            <Checkbox v-bind="table.rowSelection(row, `Select ${row.name}`)" />
          </td>
          <th scope="row" class="px-4 py-3 text-left font-medium">
            <a
              :href="`/services/${row.id}`"
              class="text-white no-underline hover:underline"
            >
              {{ row.name }}
            </a>
          </th>
          <td class="px-4 py-3 text-gray-300">{{ row.owner }}</td>
          <td class="px-4 py-3">{{ row.status }}</td>
          <td class="px-4 py-3 font-mono text-xs text-gray-400">
            {{ row.region }}
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="5" class="px-4 py-16 text-center text-sm text-gray-400">
            No matching services.
          </td>
        </tr>
      </tbody>
    </DataTable>
  </section>
</template>
