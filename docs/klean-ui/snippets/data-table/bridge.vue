<script setup>
import { computed, ref } from 'vue'
import Checkbox from '@/components/ui/checkbox/Checkbox.vue'
import DataTable from '@/components/ui/data-table/DataTable.vue'
import Input from '@/components/ui/input/Input.vue'
import Select from '@/components/ui/select/Select.vue'

const props = defineProps({ services: { type: Array, required: true } })
const selected = ref([])
const search = ref('')
const view = ref('all')
const attentionOnly = ref(false)
const sort = ref('name ASC')

const rows = computed(() => {
  const query = search.value.trim().toLowerCase()
  const result = props.services.filter((service) => {
    if (view.value === 'platform' && service.owner !== 'Platform') return false
    if (attentionOnly.value && service.status !== 'Attention') return false

    return (
      !query ||
      [service.name, service.owner, service.status, service.region]
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

function sortState(field) {
  const [active, direction] = sort.value.split(' ')
  return active === field ? direction : undefined
}

function statusClasses(status) {
  return {
    Healthy: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20',
    Deploying: 'bg-sky-400/10 text-sky-300 ring-sky-400/20',
    Attention: 'bg-amber-400/10 text-amber-300 ring-amber-400/20'
  }[status]
}
</script>

<template>
  <section
    class="bg-gray-950 p-6 text-white"
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
        <p class="mt-2 text-sm leading-6 text-gray-400">
          Production services connected to this environment.
        </p>
      </div>
      <a
        href="/services/new"
        class="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg bg-white px-4 text-sm font-medium text-gray-950 no-underline transition-colors hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          class="size-4"
          aria-hidden="true"
        >
          <path
            d="M10 4v12M4 10h12"
            stroke-linecap="round"
            stroke-width="1.75"
          />
        </svg>
        New service
      </a>
    </header>

    <div
      class="mt-6 flex flex-col gap-3 rounded-xl bg-gray-900/60 p-3 ring-1 ring-white/10 lg:flex-row lg:items-center lg:justify-between"
    >
      <div class="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Input
          v-model="search"
          type="search"
          aria-label="Search services"
          placeholder="Search services..."
          class="border-gray-700 bg-gray-950 text-white sm:w-64"
        />
        <div class="sm:w-52">
          <Select
            v-model="view"
            aria-label="Saved view"
            :options="[
              { value: 'all', label: 'All services' },
              { value: 'platform', label: 'Platform services' }
            ]"
            class="border-gray-700 bg-gray-950 text-white"
          />
        </div>
        <button
          type="button"
          :aria-pressed="attentionOnly"
          class="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-gray-700 px-4 text-sm text-gray-300 transition-colors hover:border-gray-600 hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white aria-pressed:border-amber-400/50 aria-pressed:bg-amber-400/10 aria-pressed:text-amber-200 motion-reduce:transition-none sm:w-auto"
          @click="attentionOnly = !attentionOnly"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            class="size-4"
            aria-hidden="true"
          >
            <path
              d="M3 4h14l-5.5 6.2v4.3l-3 1.5v-5.8L3 4Z"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
          </svg>
          Needs attention
        </button>
      </div>
      <div
        class="flex min-h-11 items-center justify-between gap-3 px-1 text-sm text-gray-400 lg:justify-end"
      >
        <span>{{ rows.length }} records</span>
        <span
          v-if="selected.length"
          class="rounded-full bg-white/10 px-2.5 py-1 font-medium text-white"
        >
          {{ selected.length }} selected
        </span>
        <button
          v-if="selected.length"
          type="button"
          class="cursor-pointer rounded-md px-2 py-1 font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
        >
          Actions
        </button>
      </div>
    </div>

    <div
      class="mt-6 overflow-hidden rounded-xl bg-gray-950 ring-1 ring-white/10"
    >
      <DataTable
        v-model:selected="selected"
        :rows="rows"
        class="overscroll-x-contain"
        table-class="min-w-200 text-gray-100 dark:text-gray-100"
        v-slot="table"
      >
        <caption class="sr-only">
          Bridge service records
        </caption>
        <thead
          class="border-b border-gray-800 bg-gray-900 text-xs uppercase tracking-wider text-gray-400"
        >
          <tr>
            <th
              scope="col"
              class="sticky left-0 z-20 w-12 bg-gray-900 px-4 py-3"
            >
              <Checkbox
                v-bind="table.pageSelection('Select all services on this page')"
                class="text-white focus-visible:outline-white"
              />
            </th>
            <th
              scope="col"
              :aria-sort="ariaSort('name')"
              class="sticky left-12 z-20 min-w-36 border-r border-gray-800 bg-gray-900 px-4 py-3 text-left font-medium"
            >
              <button
                v-bind="sortButton('name', 'service')"
                class="inline-flex cursor-pointer items-center gap-2 rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Service
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  class="size-3.5"
                  aria-hidden="true"
                >
                  <path
                    v-if="sortState('name') === 'ASC'"
                    d="m7 14 5-5 5 5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <path
                    v-else-if="sortState('name') === 'DESC'"
                    d="m7 10 5 5 5-5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                  <path
                    v-else
                    d="m8 9 4-4 4 4m0 6-4 4-4-4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.75"
                  />
                </svg>
              </button>
            </th>
            <th scope="col" class="px-4 py-3 text-left font-medium">Owner</th>
            <th scope="col" class="px-4 py-3 text-left font-medium">Status</th>
            <th scope="col" class="px-4 py-3 text-left font-medium">Region</th>
            <th scope="col" class="w-16 px-4 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody v-if="rows.length" class="divide-y divide-gray-900 bg-gray-950">
          <tr
            v-for="row in rows"
            :key="row.id"
            class="group hover:bg-white/5 focus-within:bg-white/5"
          >
            <td
              :class="[
                'sticky left-0 z-10 px-4 py-3',
                table.isSelected(row)
                  ? 'bg-gray-900'
                  : 'bg-gray-950 group-hover:bg-gray-900 group-focus-within:bg-gray-900'
              ]"
            >
              <Checkbox
                v-bind="table.rowSelection(row, `Select ${row.name}`)"
                class="text-white focus-visible:outline-white"
              />
            </td>
            <th
              scope="row"
              :class="[
                'sticky left-12 z-10 border-r border-gray-900 px-4 py-3 text-left font-medium',
                table.isSelected(row)
                  ? 'bg-gray-900'
                  : 'bg-gray-950 group-hover:bg-gray-900 group-focus-within:bg-gray-900'
              ]"
            >
              <a
                :href="`/services/${row.id}`"
                class="rounded-sm text-white no-underline hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {{ row.name }}
              </a>
            </th>
            <td class="px-4 py-3 text-gray-300">{{ row.owner }}</td>
            <td class="px-4 py-3">
              <span
                :class="[
                  'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
                  statusClasses(row.status)
                ]"
              >
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
            <td class="px-4 py-3 text-right">
              <a
                :href="`/services/${row.id}/actions`"
                :aria-label="`Actions for ${row.name}`"
                class="inline-grid size-10 place-items-center rounded-lg text-gray-400 no-underline transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="size-4"
                  aria-hidden="true"
                >
                  <circle cx="4" cy="10" r="1.5" />
                  <circle cx="10" cy="10" r="1.5" />
                  <circle cx="16" cy="10" r="1.5" />
                </svg>
              </a>
            </td>
          </tr>
        </tbody>
        <tbody v-else class="bg-gray-950">
          <tr>
            <td
              colspan="6"
              class="px-4 py-16 text-center text-sm text-gray-400"
            >
              No matching services.
            </td>
          </tr>
        </tbody>
      </DataTable>

      <footer
        class="flex items-center justify-between border-t border-gray-800 bg-gray-900/40 px-4 py-3 text-sm text-gray-400"
      >
        <span class="tabular-nums">Page 1 of 8</span>
        <nav aria-label="Service pages" class="flex gap-2">
          <span
            aria-disabled="true"
            class="inline-flex min-h-10 items-center px-3 text-gray-600"
          >
            Previous
          </span>
          <a
            href="?page=2"
            class="inline-flex min-h-10 items-center gap-1 rounded-lg px-3 font-medium text-white no-underline transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
          >
            Next
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              class="size-4"
              aria-hidden="true"
            >
              <path
                d="m7 4 6 6-6 6"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.75"
              />
            </svg>
          </a>
        </nav>
      </footer>
    </div>
  </section>
</template>
