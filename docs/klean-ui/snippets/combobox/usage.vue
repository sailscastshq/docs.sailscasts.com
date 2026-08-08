<script setup>
import { ref } from 'vue'
import Combobox from '@/components/ui/combobox/Combobox.vue'

const project = ref()
const projects = [
  { value: 'slipway', label: 'Slipway', keywords: ['deployments'] },
  { value: 'hagfish', label: 'Hagfish', keywords: ['billing'] }
]
</script>

<template>
  <label for="project">Project</label>
  <Combobox id="project" v-model="project" name="project" :options="projects" />
</template>
