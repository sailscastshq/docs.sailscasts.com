<script setup>
import { ref } from 'vue'
import RichText from '@/components/ui/rich-text/RichText.vue'

const outline = ref(
  '## What we will build\n\n- A working feature\n- A recovery path\n- Tests for the edge cases\n'
)
</script>

<template>
  <label for="talk-outline">Talk outline</label>
  <RichText
    id="talk-outline"
    v-model="outline"
    format="markdown"
    name="outline"
  />
</template>
