<script setup>
import { ref } from 'vue'
import Calendar from '~/components/ui/calendar/Calendar.vue'

const date = ref('2026-08-12')
</script>

<template>
  <Calendar v-model="date" :min="'2026-08-01'" />
</template>
