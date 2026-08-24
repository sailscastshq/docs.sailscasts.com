<script setup>
import { router } from '@inertiajs/vue3'
import { ref } from 'vue'
import FilterBar from '@/components/ui/filter-bar/FilterBar.vue'
import {
  filterUrl,
  filtersFromUrl
} from '@/components/ui/filter-bar/filterState.js'

const filters = ref(filtersFromUrl(window.location.href))
const busy = ref(false)

function visit(nextFilters) {
  router.visit(filterUrl(window.location.href, nextFilters), {
    replace: false,
    preserveScroll: true,
    preserveState: true,
    only: ['services', 'filters'],
    onStart: () => (busy.value = true),
    onFinish: () => (busy.value = false)
  })
}
</script>

<template>
  <FilterBar
    v-model="filters"
    :busy="busy"
    @apply="visit"
    @remove="visit"
    @clear="visit"
    v-slot="filter"
  >
    <!-- App-owned controls use filter.draft and filter.update(). -->
  </FilterBar>
</template>
