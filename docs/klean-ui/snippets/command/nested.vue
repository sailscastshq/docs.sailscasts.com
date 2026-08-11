<script setup>
import { ref } from 'vue'
import Command from '@/components/ui/command/Command.vue'
import CommandEmpty from '@/components/ui/command/CommandEmpty.vue'
import CommandGroup from '@/components/ui/command/CommandGroup.vue'
import CommandInput from '@/components/ui/command/CommandInput.vue'
import CommandItem from '@/components/ui/command/CommandItem.vue'
import CommandList from '@/components/ui/command/CommandList.vue'

const level = ref('root')
const query = ref('')
const applications = ['Storefront', 'Worker', 'Documentation']

function enterApplications() {
  level.value = 'applications'
  query.value = ''
}

function back(event) {
  if (level.value === 'root') return
  event.preventDefault()
  level.value = 'root'
  query.value = ''
}

function deploy(application) {
  console.log(`Deploy ${application}`)
}
</script>

<template>
  <Command v-model:query="query" @back="back" @escape="back">
    <CommandInput
      :placeholder="
        level === 'root' ? 'Search commands' : 'Choose an application'
      "
      aria-label="Deployment commands"
    />
    <CommandList aria-label="Available commands">
      <CommandEmpty>No matching command.</CommandEmpty>
      <CommandGroup v-if="level === 'root'" heading="Actions">
        <CommandItem value="Deploy application" @select="enterApplications">
          Deploy application <span aria-hidden="true" class="ml-auto">→</span>
        </CommandItem>
      </CommandGroup>
      <CommandGroup v-else heading="Applications">
        <CommandItem
          v-for="application in applications"
          :key="application"
          :value="application"
          @select="deploy(application)"
        >
          {{ application }}
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>
