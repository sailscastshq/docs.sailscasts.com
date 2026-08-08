<script setup>
import { ref } from 'vue'
import Select from '@/components/ui/select/Select.vue'

const role = ref('viewer')
const roles = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'administrator', label: 'Administrator' }
]
</script>

<template>
  <label for="member-role">Member role</label>
  <Select id="member-role" v-model="role" name="role" :options="roles" />
</template>
