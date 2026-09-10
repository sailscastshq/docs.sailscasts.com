<script setup>
import { ref } from 'vue'
import RichText from '@/components/ui/rich-text/RichText.vue'

const note = ref('<p>A short note for the review team.</p>')
</script>

<template>
  <label for="review-note">Review note</label>
  <RichText id="review-note" v-model="note">
    <template #toolbar="{ editor, mode, setMode, openLink }">
      <div
        role="group"
        class="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2 *:min-h-9 *:rounded *:px-3"
        aria-label="Text formatting"
      >
        <button
          type="button"
          :disabled="!editor?.isEditable || mode !== 'visual'"
          :aria-pressed="editor?.isActive('bold') || false"
          @click="editor?.chain().focus().toggleBold().run()"
        >
          Bold
        </button>
        <button
          type="button"
          :disabled="!editor?.isEditable || mode !== 'visual'"
          @click="openLink"
        >
          Link
        </button>
        <button
          type="button"
          :aria-pressed="mode === 'source'"
          @click="setMode(mode === 'source' ? 'visual' : 'source')"
        >
          Source
        </button>
      </div>
    </template>
  </RichText>
</template>
