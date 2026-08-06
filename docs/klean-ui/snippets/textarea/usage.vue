<script setup>
import Textarea from '@/components/ui/textarea/Textarea.vue'
</script>

<template>
  <div class="grid gap-2">
    <label for="note">Internal note</label>
    <Textarea
      id="note"
      v-model="form.note"
      name="note"
      rows="3"
      aria-describedby="note-help"
    />
    <p id="note-help">Plain text, up to 2,000 characters.</p>
  </div>
</template>
