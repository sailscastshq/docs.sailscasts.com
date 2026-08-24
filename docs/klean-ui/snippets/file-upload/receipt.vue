<script setup>
import { ref, shallowRef } from 'vue'
import FileUpload from '@/components/ui/file-upload/FileUpload.vue'

const receipt = shallowRef(null)
const error = ref('')

function validateReceipt(candidate) {
  return candidate.size <= 5 * 1024 * 1024
    ? true
    : 'Receipts must be 5 MB or smaller.'
}
</script>

<template>
  <FileUpload
    v-model="receipt"
    accept="image/jpeg,image/png,.pdf"
    capture="environment"
    :validate="validateReceipt"
    @change="error = ''"
    @reject="error = $event.message"
    v-slot="upload"
  >
    <div v-bind="upload.dropzone" class="border-2 border-dashed p-5">
      <img
        v-if="upload.file?.type.startsWith('image/')"
        :src="upload.previewUrl"
        alt="Selected receipt preview"
      />
      <p v-else>{{ upload.file?.name || 'Drop a receipt here' }}</p>
      <button type="button" @click="upload.choose">
        {{ upload.file ? 'Replace receipt' : 'Choose receipt' }}
      </button>
      <button v-if="upload.file" type="button" @click="upload.clear">
        Remove
      </button>
    </div>
    <p v-if="error" role="alert">{{ error }}</p>
  </FileUpload>
</template>
