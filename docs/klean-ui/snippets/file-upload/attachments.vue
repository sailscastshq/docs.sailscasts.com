<script setup>
import { ref, shallowRef } from 'vue'
import FileUpload from '@/components/ui/file-upload/FileUpload.vue'

const images = shallowRef([])
const error = ref('')

function signature(file) {
  return [file.name, file.size, file.type, file.lastModified].join(':')
}

function validateImage(file, { files }) {
  if (file.size > 5 * 1024 * 1024) return 'Each image must be 5 MB or smaller.'
  if (files.some((current) => signature(current) === signature(file))) {
    return { reason: 'duplicate', message: 'That image is already attached.' }
  }
  return files.length < 4 ? true : 'Attach up to 4 images.'
}
</script>

<template>
  <FileUpload
    v-model="images"
    multiple
    accept="image/avif,image/gif,image/jpeg,image/png,image/webp"
    :validate="validateImage"
    @change="error = ''"
    @reject="error = $event.message"
    v-slot="upload"
  >
    <div v-bind="upload.dropzone" class="rounded-xl border border-dashed p-5">
      <div class="flex flex-wrap gap-3">
        <figure v-for="preview in upload.previews" :key="preview.file.name">
          <img
            :src="preview.previewUrl"
            :alt="preview.file.name"
            class="size-24 rounded-lg object-cover"
          />
          <button type="button" @click="upload.remove(preview.file)">
            Remove {{ preview.file.name }}
          </button>
        </figure>
      </div>

      <button type="button" @click="upload.choose">
        {{ upload.files.length ? 'Add more' : 'Choose images' }}
      </button>
    </div>
    <p v-if="error" role="alert">{{ error }}</p>
  </FileUpload>
</template>
