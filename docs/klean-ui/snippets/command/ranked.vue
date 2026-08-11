<script setup>
import { computed, ref } from 'vue'
import Command from '@/components/ui/command/Command.vue'
import { fuzzySearch } from '@/lib/search'

const query = ref('')
const recent = ref([])
const available = ref([])

const groups = computed(() => ({
  Recent: recent.value,
  Commands: fuzzySearch(available.value, query.value)
}))

function run(command) {
  command.action?.()
}
</script>

<template>
  <Command
    v-model:query="query"
    :groups="groups"
    label="Application commands"
    @select="run"
  />
</template>
