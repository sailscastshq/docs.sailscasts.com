<script setup>
import { reactive, ref } from 'vue'
import { useFormDraft } from '@/components/ui/durable-ui/useFormDraft.js'

const form = reactive({ customer: '', note: '' })
const saved = ref(false)

const { hasDraft, restore, discard } = useFormDraft('invoice:new', form, {
  clearWhen: () => saved.value
})

async function submit() {
  await saveInvoice(form)
  saved.value = true
}
</script>

<template>
  <aside v-if="hasDraft" aria-label="Recovered draft">
    <p>A saved invoice draft is available.</p>
    <button type="button" @click="restore">Restore</button>
    <button type="button" @click="discard">Discard</button>
  </aside>

  <form @submit.prevent="submit">
    <!-- ordinary application fields -->
  </form>
</template>
