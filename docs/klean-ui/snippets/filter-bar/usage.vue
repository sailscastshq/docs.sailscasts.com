<script setup>
import { ref } from 'vue'
import FilterBar from '@/components/ui/filter-bar/FilterBar.vue'

const filters = ref({ status: 'running' })
</script>

<template>
  <FilterBar v-model="filters" v-slot="filter">
    <label for="status" class="sr-only">Status</label>
    <select
      id="status"
      :value="filter.draft.status || ''"
      @change="filter.update('status', $event.currentTarget.value)"
    >
      <option value="">Any status</option>
      <option value="running">Running</option>
      <option value="stopped">Stopped</option>
    </select>

    <button v-bind="filter.applyAttrs">Apply</button>
    <button v-bind="filter.cancelAttrs">Cancel</button>

    <button
      v-for="[key, value] in filter.entries"
      :key="key"
      v-bind="filter.removeAttrs(key)"
    >
      {{ key }}: {{ value }} ×
    </button>
  </FilterBar>
</template>
