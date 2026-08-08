<script setup>
import { computed, ref, watch } from 'vue'
import { addDays, todayIso } from '~/components/ui/calendar/date.js'
import DatePicker from '~/components/ui/date-picker/DatePicker.vue'

const today = todayIso()
const issuedAt = ref(today)
const dueAt = ref(addDays(today, 30))
const minimumDueDate = computed(() => addDays(issuedAt.value, 1))
const maximumIssueDate = computed(() => addDays(dueAt.value, -1))

watch(issuedAt, () => {
  if (dueAt.value < minimumDueDate.value) {
    dueAt.value = minimumDueDate.value
  }
})

watch(dueAt, () => {
  if (issuedAt.value > maximumIssueDate.value) {
    issuedAt.value = maximumIssueDate.value
  }
})
</script>

<template>
  <form aria-describedby="invoice-date-rules">
    <label for="issued-date">Issued</label>
    <DatePicker
      id="issued-date"
      v-model="issuedAt"
      name="issuedAt"
      :min="today"
      :max="maximumIssueDate"
      required
    />

    <label for="due-date">Due</label>
    <DatePicker
      id="due-date"
      v-model="dueAt"
      name="dueAt"
      :min="minimumDueDate"
      required
    />

    <p id="invoice-date-rules">
      Issue dates start today. Due dates must be at least one day later.
    </p>
  </form>
</template>
