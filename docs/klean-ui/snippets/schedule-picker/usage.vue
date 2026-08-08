<script setup>
import { ref } from 'vue'
import SchedulePicker from '~/components/ui/schedule-picker/SchedulePicker.vue'

const publishAt = ref('')
</script>

<template>
  <label for="publish-at">Publish at</label>
  <SchedulePicker
    id="publish-at"
    v-model="publishAt"
    name="publishAt"
    time-zone="Africa/Lagos"
    required
  />
</template>
