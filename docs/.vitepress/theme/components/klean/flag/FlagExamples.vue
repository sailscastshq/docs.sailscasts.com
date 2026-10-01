<script setup>
import { ref } from 'vue'
import Flag from './Flag.vue'
import Select from '../select/Select.vue'
const country = ref('NG')
const options = [
  { value: 'NG', label: 'Nigeria' },
  { value: 'KE', label: 'Kenya' },
  { value: 'GH', label: 'Ghana' },
  { value: 'ZA', label: 'South Africa' }
]
</script>

<template>
  <div class="grid w-full max-w-sm gap-3">
    <label for="flag-example-country" class="font-medium">Country</label>
    <Select id="flag-example-country" v-model="country" :options="options">
      <template #value="{ option }"
        ><span class="flex items-center gap-2"
          ><Flag :country="option.value" alt="" class="w-5" />{{
            option.label
          }}</span
        ></template
      >
      <template #option="{ option }"
        ><span class="flex items-center gap-2"
          ><Flag :country="option.value" alt="" class="w-5" />{{
            option.label
          }}</span
        ></template
      >
    </Select>
  </div>
</template>
