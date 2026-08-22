<script setup>
import { computed, ref } from 'vue'
import Checkbox from '../checkbox/Checkbox.vue'
import Input from '../input/Input.vue'
import Select from '../select/Select.vue'
import DataTable from './DataTable.vue'

const services = [
  {
    id: 'svc_01J9api',
    service: 'api',
    owner: 'Platform',
    status: 'Healthy',
    region: 'fra1',
    updated: '2 minutes ago'
  },
  {
    id: 'svc_01J9worker',
    service: 'worker',
    owner: 'Billing',
    status: 'Deploying',
    region: 'iad1',
    updated: '8 minutes ago'
  },
  {
    id: 'svc_01J9events',
    service: 'events',
    owner: 'Platform',
    status: 'Healthy',
    region: 'fra1',
    updated: '21 minutes ago'
  },
  {
    id: 'svc_01J9mail',
    service: 'mail',
    owner: 'Growth',
    status: 'Attention',
    region: 'sin1',
    updated: '34 minutes ago'
  }
]

const selected = ref([])
const search = ref('')
const view = ref('all')
const attentionOnly = ref(false)
const sort = ref('service ASC')

const rows = computed(() => {
  const query = search.value.trim().toLowerCase()
  const result = services.filter((service) => {
    if (view.value === 'platform' && service.owner !== 'Platform') return false
    if (attentionOnly.value && service.status !== 'Attention') return false

    return (
      !query ||
      [service.service, service.owner, service.status, service.region]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  })
  const [field, direction] = sort.value.split(' ')

  return result.sort((left, right) => {
    const order = String(left[field]).localeCompare(String(right[field]))
    return direction === 'ASC' ? order : -order
  })
})

function ariaSort(field) {
  const [active, direction] = sort.value.split(' ')
  if (active !== field) return undefined
  return direction === 'ASC' ? 'ascending' : 'descending'
}

function sortButton(field, label) {
  const [active, direction] = sort.value.split(' ')
  const next = active === field && direction === 'ASC' ? 'DESC' : 'ASC'

  return {
    type: 'button',
    'aria-label': `Sort by ${label} ${next === 'ASC' ? 'ascending' : 'descending'}`,
    onClick: () => {
      sort.value = `${field} ${next}`
    }
  }
}
</script>

<template>
  <section
    class="w-full bg-gray-950 px-4 py-8 text-white sm:px-6"
    aria-labelledby="bridge-services-title"
  >
    <header
      class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h2
          id="bridge-services-title"
          class="text-2xl font-semibold tracking-tight"
        >
          Bridge services
        </h2>
        <p class="mt-1 text-sm leading-6 text-gray-400">
          Search, inspect, and act on server-owned records.
        </p>
      </div>
      <a
        href="#new-service"
        class="inline-flex min-h-11 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-gray-950 no-underline"
      >
        New service
      </a>
    </header>

    <div
      class="mt-6 flex flex-col gap-3 border-y border-gray-800 py-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="flex flex-1 flex-col gap-3 sm:flex-row">
        <Input
          v-model="search"
          type="search"
          aria-label="Search services"
          placeholder="Search services..."
          class="border-gray-700 bg-gray-900 text-white sm:max-w-xs"
        />
        <Select
          v-model="view"
          aria-label="Saved view"
          :options="[
            { value: 'all', label: 'All services' },
            { value: 'platform', label: 'Platform services' }
          ]"
          class="border-gray-700 bg-gray-900 text-white sm:max-w-52"
        />
        <button
          type="button"
          :aria-pressed="attentionOnly"
          class="min-h-11 cursor-pointer rounded-md border border-gray-700 px-4 text-sm text-gray-300 hover:bg-gray-900 aria-pressed:border-white aria-pressed:text-white"
          @click="attentionOnly = !attentionOnly"
        >
          Needs attention
        </button>
      </div>
      <div class="flex min-h-11 items-center gap-3 text-sm text-gray-400">
        <span v-if="selected.length">{{ selected.length }} selected</span>
        <button
          v-if="selected.length"
          type="button"
          class="cursor-pointer font-medium text-white underline underline-offset-4"
        >
          Actions
        </button>
        <span>{{ rows.length }} records</span>
      </div>
    </div>

    <DataTable
      v-model:selected="selected"
      :rows="rows"
      class="border-x border-b border-gray-800"
      table-class="min-w-200 text-gray-100 dark:text-gray-100"
      v-slot="table"
    >
      <caption class="sr-only">
        Bridge service records
      </caption>
      <thead
        class="border-b border-gray-800 bg-gray-900/80 text-xs text-gray-400"
      >
        <tr>
          <th scope="col" class="w-12 px-4 py-3">
            <Checkbox
              v-bind="table.pageSelection('Select all services on this page')"
              class="text-white focus-visible:outline-white"
            />
          </th>
          <th
            scope="col"
            :aria-sort="ariaSort('service')"
            class="px-4 py-3 text-left font-medium"
          >
            <button
              v-bind="sortButton('service', 'service')"
              class="inline-flex cursor-pointer items-center gap-2 hover:text-white"
            >
              Service <span aria-hidden="true">↕</span>
            </button>
          </th>
          <th scope="col" class="px-4 py-3 text-left font-medium">Owner</th>
          <th
            scope="col"
            :aria-sort="ariaSort('status')"
            class="px-4 py-3 text-left font-medium"
          >
            <button
              v-bind="sortButton('status', 'status')"
              class="inline-flex cursor-pointer items-center gap-2 hover:text-white"
            >
              Status <span aria-hidden="true">↕</span>
            </button>
          </th>
          <th scope="col" class="px-4 py-3 text-left font-medium">Region</th>
          <th scope="col" class="px-4 py-3 text-left font-medium">Updated</th>
          <th scope="col" class="w-16 px-4 py-3">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody v-if="rows.length" class="divide-y divide-gray-900 bg-gray-950">
        <tr v-for="row in rows" :key="row.id" class="hover:bg-white/5">
          <td class="px-4 py-3">
            <Checkbox
              v-bind="table.rowSelection(row, `Select ${row.service}`)"
              class="text-white focus-visible:outline-white"
            />
          </td>
          <th scope="row" class="px-4 py-3 text-left font-medium">
            <a
              :href="`#${row.id}`"
              class="text-white no-underline hover:underline"
            >
              {{ row.service }}
            </a>
          </th>
          <td class="px-4 py-3 text-gray-300">{{ row.owner }}</td>
          <td class="px-4 py-3">
            <span class="inline-flex items-center gap-2">
              <span
                class="size-1.5 rounded-full bg-current"
                aria-hidden="true"
              ></span>
              {{ row.status }}
            </span>
          </td>
          <td class="px-4 py-3 font-mono text-xs text-gray-400">
            {{ row.region }}
          </td>
          <td class="px-4 py-3 text-gray-400">{{ row.updated }}</td>
          <td class="px-4 py-3 text-right">
            <a
              :href="`#actions-${row.id}`"
              :aria-label="`Actions for ${row.service}`"
              class="inline-grid size-10 place-items-center rounded-md text-xl text-gray-400 no-underline hover:bg-gray-900 hover:text-white"
            >
              ⋯
            </a>
          </td>
        </tr>
      </tbody>
      <tbody v-else class="bg-gray-950">
        <tr>
          <td colspan="7" class="px-4 py-16 text-center text-sm text-gray-400">
            No matching services.
          </td>
        </tr>
      </tbody>
    </DataTable>

    <footer
      class="flex items-center justify-between border-x border-b border-gray-800 px-4 py-4 text-sm text-gray-400"
    >
      <span>Page 1 of 8</span>
      <nav aria-label="Service pages" class="flex gap-2">
        <span
          aria-disabled="true"
          class="inline-flex min-h-11 items-center px-3 text-gray-600"
        >
          Previous
        </span>
        <a
          href="?page=2"
          class="inline-flex min-h-11 items-center rounded-md border border-gray-700 px-3 text-white no-underline"
        >
          Next
        </a>
      </nav>
    </footer>
  </section>
</template>
