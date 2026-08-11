<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import Command from '@/components/ui/command/Command.vue'
import CommandEmpty from '@/components/ui/command/CommandEmpty.vue'
import CommandGroup from '@/components/ui/command/CommandGroup.vue'
import CommandInput from '@/components/ui/command/CommandInput.vue'
import CommandItem from '@/components/ui/command/CommandItem.vue'
import CommandList from '@/components/ui/command/CommandList.vue'

const palette = ref()
const query = ref('')
const commands = ['Open projects', 'Open Lookout', 'Deploy application']

function openPalette(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    palette.value?.showModal()
  }
}

function run(command) {
  query.value = ''
  palette.value?.close()
  // Route or begin work after accepting the command.
  console.log(command)
}

function handleOpen(open) {
  if (open) query.value = ''
}

onMounted(() => document.addEventListener('keydown', openPalette))
onBeforeUnmount(() => document.removeEventListener('keydown', openPalette))
</script>

<template>
  <Button commandfor="application-palette" command="show-modal">
    Open commands <kbd aria-hidden="true">⌘ K</kbd>
  </Button>

  <Dialog
    id="application-palette"
    ref="palette"
    aria-label="Application commands"
    class="max-w-xl border-0 bg-transparent p-0 shadow-none"
    @update:open="handleOpen"
  >
    <Command v-model:query="query" @select="run">
      <CommandInput autofocus aria-label="Search commands" />
      <CommandList aria-label="Available commands">
        <CommandEmpty>No matching command.</CommandEmpty>
        <CommandGroup heading="Commands">
          <CommandItem
            v-for="command in commands"
            :key="command"
            :value="command"
          >
            {{ command }}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </Dialog>
</template>
