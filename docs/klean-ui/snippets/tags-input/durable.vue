<script setup>
import { useForm } from '@inertiajs/vue3'
import { useFormDraft } from '@/composables/form-draft'
import TagsInput from '@/components/ui/tags-input/TagsInput.vue'

const form = useForm({
  tags: [],
  tagsDraft: ''
})

const draft = useFormDraft('expense:new', form)

function submit() {
  form
    .transform(({ tagsDraft: _draft, ...data }) => data)
    .post('/expenses', {
      onSuccess: () => draft.discardDraft()
    })
}
</script>

<template>
  <form @submit.prevent="submit">
    <label for="expense-tags">Tags</label>
    <TagsInput
      id="expense-tags"
      v-model="form.tags"
      v-model:draft="form.tagsDraft"
      :aria-invalid="Boolean(form.errors.tags)"
      aria-describedby="expense-tags-error"
    />
    <p id="expense-tags-error" class="empty:hidden text-sm text-red-700">
      {{ form.errors.tags }}
    </p>
    <button type="submit" :disabled="form.processing">Save expense</button>
  </form>
</template>
