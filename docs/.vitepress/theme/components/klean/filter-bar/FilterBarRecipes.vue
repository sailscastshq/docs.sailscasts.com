<script setup>
import { ref } from 'vue'
import FilterBar from './FilterBar.vue'

const filters = ref({
  environment: { operator: 'equals', value: 'production' }
})

function label(key, value) {
  return `${key}: ${value.value}`
}
</script>

<template>
  <div class="w-full rounded-xl bg-gray-950 p-4 text-white sm:p-6">
    <div class="flex items-end justify-between gap-4">
      <div>
        <h3 class="m-0 text-xl font-semibold text-white">Services</h3>
        <p class="mt-1 text-sm text-gray-400">24 records</p>
      </div>
      <span class="text-sm tabular-nums text-gray-400">
        {{ Object.keys(filters).length }} active
      </span>
    </div>

    <FilterBar
      v-model="filters"
      label="Service filters"
      class="mt-5 rounded-xl border border-gray-800 bg-gray-900 p-3"
      v-slot="filter"
    >
      <label class="relative min-w-48 flex-1">
        <span class="sr-only">Search services</span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          class="pointer-events-none absolute left-3 top-3.5 size-4 text-gray-500"
          aria-hidden="true"
        >
          <circle cx="8.5" cy="8.5" r="5.5" stroke-width="1.5" />
          <path d="m13 13 4 4" stroke-linecap="round" stroke-width="1.5" />
        </svg>
        <input
          type="search"
          placeholder="Search services"
          class="min-h-11 w-full rounded-lg border border-gray-700 bg-gray-950 pl-10 pr-3 text-sm text-white outline-none placeholder:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        />
      </label>

      <label>
        <span class="sr-only">Environment</span>
        <select
          :value="filter.draft.environment?.value || ''"
          class="min-h-11 cursor-pointer rounded-lg border border-gray-700 bg-gray-950 px-3 text-sm text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          @change="
            filter.update(
              'environment',
              $event.currentTarget.value
                ? { operator: 'equals', value: $event.currentTarget.value }
                : undefined
            )
          "
        >
          <option value="">All environments</option>
          <option value="production">Production</option>
          <option value="staging">Staging</option>
        </select>
      </label>

      <label>
        <span class="sr-only">Health</span>
        <select
          :value="filter.draft.health?.value || ''"
          class="min-h-11 cursor-pointer rounded-lg border border-gray-700 bg-gray-950 px-3 text-sm text-white outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          @change="
            filter.update(
              'health',
              $event.currentTarget.value
                ? { operator: 'equals', value: $event.currentTarget.value }
                : undefined
            )
          "
        >
          <option value="">Any health</option>
          <option value="healthy">Healthy</option>
          <option value="attention">Needs attention</option>
        </select>
      </label>

      <button
        v-bind="filter.applyAttrs"
        class="min-h-11 cursor-pointer rounded-lg bg-white px-4 text-sm font-semibold text-gray-950 hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Apply
      </button>
      <button
        v-bind="filter.cancelAttrs"
        class="min-h-11 cursor-pointer rounded-lg px-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Cancel
      </button>

      <div
        v-if="filter.entries.length"
        class="flex w-full flex-wrap gap-2 border-t border-gray-800 pt-3"
      >
        <button
          v-for="[key, value] in filter.entries"
          :key="key"
          v-bind="filter.removeAttrs(key, `Remove ${label(key, value)}`)"
          class="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-full bg-white/10 px-3 text-sm text-gray-200 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {{ label(key, value) }} <span aria-hidden="true">×</span>
        </button>
        <button
          v-bind="filter.clearAttrs"
          class="min-h-9 cursor-pointer px-2 text-sm text-gray-400 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Clear all
        </button>
      </div>
    </FilterBar>
  </div>
</template>
