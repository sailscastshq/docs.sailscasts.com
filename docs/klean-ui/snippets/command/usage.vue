<script setup>
import { ref } from 'vue'
import Command from '@/components/ui/command/Command.vue'

const query = ref('')
const commands = [
  {
    id: 'projects',
    title: 'Open projects',
    subtitle: 'View every application and service',
    keywords: ['apps'],
    group: 'Navigation',
    shortcut: 'G P',
    href: '/projects'
  },
  {
    id: 'deploy',
    title: 'Deploy application',
    keywords: ['ship', 'release'],
    group: 'Actions',
    shortcut: 'D',
    action: () => console.log('Choose an application')
  }
]

function run(command) {
  if (command.href) window.location.assign(command.href)
  else command.action?.()
}
</script>

<template>
  <Command
    v-model:query="query"
    :commands="commands"
    label="Application commands"
    @select="run"
  />
</template>
