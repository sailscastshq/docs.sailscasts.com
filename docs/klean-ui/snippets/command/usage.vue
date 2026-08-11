<script setup>
import { ref } from 'vue'
import Command from '@/components/ui/command/Command.vue'
import CommandEmpty from '@/components/ui/command/CommandEmpty.vue'
import CommandGroup from '@/components/ui/command/CommandGroup.vue'
import CommandInput from '@/components/ui/command/CommandInput.vue'
import CommandItem from '@/components/ui/command/CommandItem.vue'
import CommandList from '@/components/ui/command/CommandList.vue'
import CommandShortcut from '@/components/ui/command/CommandShortcut.vue'

const query = ref('')
const commands = [
  { value: 'Open projects', keywords: ['apps'], shortcut: 'G P' },
  {
    value: 'Open Lookout',
    keywords: ['metrics', 'monitoring'],
    shortcut: 'G L'
  },
  { value: 'Deploy application', keywords: ['ship', 'release'], shortcut: 'D' }
]

function run(command) {
  // Route, open a nested step, or begin application work.
  console.log(command)
}
</script>

<template>
  <Command v-model:query="query" @select="run">
    <CommandInput aria-label="Application commands" />
    <CommandList aria-label="Available commands">
      <CommandEmpty>No matching command.</CommandEmpty>
      <CommandGroup heading="Commands">
        <CommandItem
          v-for="command in commands"
          :key="command.value"
          :value="command.value"
          :keywords="command.keywords"
        >
          <span>{{ command.value }}</span>
          <CommandShortcut>{{ command.shortcut }}</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>
