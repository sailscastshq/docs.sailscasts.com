<script setup>
import { ref, shallowRef } from 'vue'
import FileUpload from '@/components/ui/file-upload/FileUpload.vue'

const file = shallowRef(null)
const error = ref('')

function validate(candidate) {
  return candidate.size <= 2 * 1024 * 1024 ? true : 'Choose a file under 2 MB.'
}
</script>

<template>
  <FileUpload
    v-model="file"
    accept="image/png,image/jpeg,.pdf"
    :validate="validate"
    @change="error = ''"
    @reject="error = $event.message"
    v-slot="upload"
  >
    <div
      v-bind="upload.dropzone"
      :class="[
        'rounded-xl border border-dashed p-6',
        upload.dragging ? 'border-gray-950 bg-gray-50' : 'border-gray-300'
      ]"
    >
      <p>{{ upload.file?.name || 'Drop one file here' }}</p>
      <button type="button" @click="upload.choose">
        {{ upload.file ? 'Replace file' : 'Choose file' }}
      </button>
      <button v-if="upload.file" type="button" @click="upload.clear">
        Remove
      </button>
    </div>
    <p v-if="error" role="alert">{{ error }}</p>
  </FileUpload>
</template>
