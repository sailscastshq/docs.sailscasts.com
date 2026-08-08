<script setup>
import { ref } from 'vue'
import Select from '@/components/ui/select/Select.vue'

const category = ref('feature')
const categories = [
  { value: 'feature', label: 'Feature' },
  { value: 'bug', label: 'Bug' }
]
</script>

<template>
  <Select
    v-model="category"
    :options="categories"
    aria-label="Feedback category"
    class="min-h-10 w-auto max-w-[16rem] rounded-lg border-0 bg-gray-100 px-3.5 py-2 text-sm font-semibold text-gray-950 shadow-none hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2"
  />
</template>
