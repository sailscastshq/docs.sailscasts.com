<script setup>
import { ref } from 'vue'
import SchedulePicker from '~/components/ui/schedule-picker/SchedulePicker.vue'

const reviewAt = ref('2020-02-29T13:35:00.000Z')
</script>

<template>
  <label for="review-at">Review time</label>
  <SchedulePicker
    id="review-at"
    v-model="reviewAt"
    name="reviewAt"
    allow-past
    min="2020-02-29T08:00:00.000Z"
    max="2020-02-29T16:00:00.000Z"
    time-zone="Africa/Lagos"
    locale="en-US"
  />
</template>
