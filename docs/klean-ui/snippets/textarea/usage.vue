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
      :aria-invalid="Boolean(form.errors.note)"
      aria-describedby="note-help note-error"
    />
    <p id="note-help">Plain text, up to 2,000 characters.</p>
    <p id="note-error" class="empty:hidden text-sm text-red-700">
      {{ form.errors.note }}
    </p>
  </div>
</template>
