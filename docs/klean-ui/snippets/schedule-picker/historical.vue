<script setup>
import { ref } from 'vue'
import SchedulePicker from '~/components/ui/schedule-picker/SchedulePicker.vue'

const recordedAt = ref('2020-02-29T13:35:00.000Z')
</script>

<template>
  <label for="recorded-at">Recorded at</label>
  <SchedulePicker
    id="recorded-at"
    v-model="recordedAt"
    name="recordedAt"
    allow-past
    time-zone="Africa/Lagos"
    locale="en-US"
    placeholder="February 29, 2020 at 2:35pm"
    class="**:data-[slot=input]:border-dashed **:data-[slot=input]:shadow-none"
  />
</template>
