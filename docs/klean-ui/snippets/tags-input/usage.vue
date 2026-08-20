<script setup>
import { ref } from 'vue'
import TagsInput from '@/components/ui/tags-input/TagsInput.vue'

const tags = ref(['billing', 'invoice'])
const draft = ref('')
</script>

<template>
  <div class="grid gap-2">
    <label for="expense-tags" class="text-sm font-medium">Tags</label>
    <TagsInput
      id="expense-tags"
      v-model="tags"
      v-model:draft="draft"
      name="tags"
      aria-describedby="expense-tags-help"
    />
    <p id="expense-tags-help" class="text-sm text-gray-500">
      Press Enter or comma to add. Paste a comma-separated list.
    </p>
  </div>
</template>
