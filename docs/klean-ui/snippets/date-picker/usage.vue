<script setup>
import { ref } from 'vue'
import DatePicker from '~/components/ui/date-picker/DatePicker.vue'

const dueAt = ref('')
</script>

<template>
  <label for="due-date">Due date</label>
  <DatePicker id="due-date" v-model="dueAt" name="dueAt" required />
</template>
