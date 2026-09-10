<script setup>
import { reactive, ref } from 'vue'
import RichText from '@/components/ui/rich-text/RichText.vue'
import { useFormDraft } from '@/components/ui/durable-ui/useFormDraft.js'

// The page supplies a key scoped to the account, event, and proposal.
const props = defineProps({
  draftKey: { type: String, required: true },
  saveProposal: { type: Function, required: true }
})
const form = reactive({ abstract: '' })
const saving = ref(false)
const error = ref('')
const draft = useFormDraft(props.draftKey, form)

async function submit() {
  saving.value = true
  error.value = ''
  try {
    await props.saveProposal({ ...form })
    draft.clear()
  } catch {
    error.value = 'Your proposal could not be saved. Your draft is still here.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <aside
    v-if="draft.hasDraft.value && !draft.dirty.value && !draft.restored.value"
    aria-label="Recovered draft"
  >
    <p>A saved proposal draft is available.</p>
    <button type="button" @click="draft.restore">Restore draft</button>
    <button type="button" @click="draft.discard">Discard draft</button>
  </aside>
  <form class="grid gap-3" @submit.prevent="submit">
    <label for="draft-abstract">Talk abstract</label>
    <RichText
      id="draft-abstract"
      v-model="form.abstract"
      name="abstract"
      required
      :readonly="saving"
    />
    <p v-if="error" role="alert">{{ error }}</p>
    <button type="submit" :disabled="saving || !draft.dirty.value">
      {{ saving ? 'Saving…' : 'Save proposal' }}
    </button>
  </form>
</template>
