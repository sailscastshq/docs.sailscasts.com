<script setup>
import { ref } from 'vue'
import DateRangePicker from '~/components/ui/date-range-picker/DateRangePicker.vue'

const period = ref({ start: '', end: '' })
</script>

<template>
  <DateRangePicker
    v-model="period"
    name="period"
    label="Reporting period"
    start-label="From"
    end-label="To"
    required
  />
</template>
