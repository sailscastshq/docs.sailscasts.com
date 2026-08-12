<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import Command from '@/components/ui/command/Command.vue'
import Dialog from '@/components/ui/dialog/Dialog.vue'

const palette = ref()
const query = ref('')
const commands = [
  { id: 'projects', title: 'Open projects', group: 'Navigation' },
  { id: 'lookout', title: 'Open Lookout', group: 'Navigation' },
  { id: 'deploy', title: 'Deploy application', group: 'Actions' }
]

function openPalette(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    palette.value?.showModal()
  }
}

function run(command) {
  query.value = ''
  palette.value?.close()
  console.log(command)
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
  >
    <Command
      v-model:query="query"
      :commands="commands"
      autofocus
      label="Application commands"
      @select="run"
    />
  </Dialog>
</template>
