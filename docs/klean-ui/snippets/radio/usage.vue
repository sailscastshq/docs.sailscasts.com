<script setup>
import { ref } from 'vue'
import Radio from '@/components/ui/radio/Radio.vue'

const region = ref('lagos')
</script>

<template>
  <fieldset>
    <legend class="font-medium">Deployment region</legend>
    <label class="mt-3 flex cursor-pointer items-center gap-3">
      <Radio v-model="region" name="region" value="lagos" required />
      Lagos
    </label>
    <label class="mt-3 flex cursor-pointer items-center gap-3">
      <Radio v-model="region" name="region" value="frankfurt" required />
      Frankfurt
    </label>
  </fieldset>
</template>
