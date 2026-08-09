<script setup>
import { ref } from 'vue'
import Switch from '@/components/ui/switch/Switch.vue'

const publicRoadmap = ref(true)
</script>

<template>
  <label
    class="flex min-h-11 cursor-pointer items-center justify-between gap-6"
  >
    <span>
      <span class="block font-medium">Public roadmap</span>
      <span class="text-sm text-gray-500">
        Show planned work to customers.
      </span>
    </span>
    <Switch v-model="publicRoadmap" name="publicRoadmap" />
  </label>
</template>
