<script setup>
import { ref, shallowRef } from 'vue'
import FileUpload from '@/components/ui/file-upload/FileUpload.vue'

const props = defineProps({ currentLogoUrl: String })
const logo = shallowRef(null)
const removeCurrent = ref(false)
</script>

<template>
  <FileUpload v-model="logo" accept="image/*" v-slot="upload">
    <div class="flex items-center gap-4">
      <div class="size-20 overflow-hidden rounded-xl border-2 border-black">
        <img
          v-if="upload.previewUrl || (!removeCurrent && currentLogoUrl)"
          :src="upload.previewUrl || currentLogoUrl"
          alt="Current business logo"
          class="size-full object-cover"
        />
        <span v-else class="grid size-full place-items-center">HF</span>
      </div>
      <div>
        <button type="button" @click="upload.choose">
          {{ upload.file || currentLogoUrl ? 'Replace' : 'Choose logo' }}
        </button>
        <button
          v-if="upload.file || (!removeCurrent && currentLogoUrl)"
          type="button"
          @click="upload.file ? upload.clear() : (removeCurrent = true)"
        >
          Remove
        </button>
      </div>
    </div>
  </FileUpload>
</template>
