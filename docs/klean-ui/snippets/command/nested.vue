<script setup>
import { computed, ref } from 'vue'
import Command from '@/components/ui/command/Command.vue'

const query = ref('')
const level = ref('root')
const applications = ['Storefront', 'Worker', 'Documentation']
const commands = computed(() =>
  level.value === 'root'
    ? [
        {
          id: 'deploy',
          title: 'Deploy application',
          group: 'Actions',
          children: () => applications
        }
      ]
    : applications.map((title) => ({
        id: title.toLowerCase(),
        title,
        group: 'Applications'
      }))
)

function select(command) {
  if (command.children) {
    level.value = 'applications'
    query.value = ''
    return
  }
  console.log(`Deploy ${command.title}`)
}

function back(event) {
  if (level.value === 'root') return
  event.preventDefault()
  level.value = 'root'
  query.value = ''
}
</script>

<template>
  <Command
    v-model:query="query"
    :commands="commands"
    :placeholder="
      level === 'root' ? 'Search commands' : 'Choose an application'
    "
    label="Deployment commands"
    @select="select"
    @back="back"
    @escape="back"
  />
</template>
