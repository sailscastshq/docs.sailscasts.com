<script setup>
import { ref } from 'vue'
import RichText from '@/components/ui/rich-text/RichText.vue'

const abstract = ref(
  '<p>A practical look at building resilient web applications, with the decisions and trade-offs behind a working demo.</p>'
)
</script>

<template>
  <div class="grid gap-2">
    <label for="proposal-abstract" class="text-sm font-medium"
      >Talk abstract</label
    >
    <RichText
      id="proposal-abstract"
      v-model="abstract"
      name="abstract"
      required
      aria-describedby="proposal-abstract-help"
      placeholder="The problem, your approach, and why it matters."
    />
    <p id="proposal-abstract-help" class="text-sm text-gray-600">
      Explain what attendees will learn. Use headings, lists, and links where
      they help.
    </p>
  </div>
</template>
