<script setup>
import { ref } from 'vue'
import MultiSelect from '@/components/ui/multi-select/MultiSelect.vue'
const teams = ref([])
const options = [
  { value: 'design', label: 'Design' },
  { value: 'support', label: 'Support' }
]
</script>
<template>
  <label for="teams">Teams</label
  ><MultiSelect
    id="teams"
    v-model="teams"
    :options="options"
    name="teams"
    required
  />
</template>
