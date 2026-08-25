<script setup>
import { ref, shallowRef } from 'vue'
import FileUpload from './FileUpload.vue'

defineProps({ recipe: { type: String, default: 'basic' } })

const basicFile = shallowRef(null)
const basicError = ref('')
const logo = shallowRef(null)
const removeCurrentLogo = ref(false)
const receipt = shallowRef(null)
const receiptError = ref('')
const images = shallowRef([])
const imagesError = ref('')

const portraitMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <rect width="160" height="160" fill="#dbeafe"/>
  <circle cx="80" cy="69" r="35" fill="#70412f"/>
  <path d="M35 160c4-34 20-53 45-53s41 19 45 53" fill="#172554"/>
  <path d="M47 66c0-31 15-47 34-47 24 0 36 17 34 49-8-3-15-9-20-18-13 12-28 18-48 16Z" fill="#0a0a0a"/>
  <circle cx="68" cy="72" r="3" fill="#111827"/>
  <circle cx="93" cy="72" r="3" fill="#111827"/>
  <path d="M70 89c8 6 16 6 23 0" fill="none" stroke="#4c291f" stroke-width="3" stroke-linecap="round"/>
</svg>`
const currentLogoUrl = `data:image/svg+xml,${encodeURIComponent(portraitMarkup)}`

function formatSize(size) {
  if (size < 1024) return `${size} B`
  return `${(size / 1024).toFixed(1)} KB`
}

function validateBasic(candidate) {
  return candidate.size <= 2 * 1024 * 1024 ? true : 'Choose a file under 2 MB.'
}

function validateReceipt(candidate) {
  return candidate.size <= 5 * 1024 * 1024
    ? true
    : 'Receipts must be 5 MB or smaller.'
}

function imageSignature(candidate) {
  return [
    candidate.name,
    candidate.size,
    candidate.type,
    candidate.lastModified
  ].join(':')
}

function validateImage(candidate, { files }) {
  if (candidate.size > 5 * 1024 * 1024) {
    return 'Each image must be 5 MB or smaller.'
  }
  if (
    files.some((file) => imageSignature(file) === imageSignature(candidate))
  ) {
    return { reason: 'duplicate', message: 'That image is already attached.' }
  }
  return files.length < 4 ? true : 'Attach up to 4 images.'
}
</script>

<template>
  <FileUpload
    v-if="recipe === 'basic'"
    v-model="basicFile"
    accept="image/png,image/jpeg,.pdf"
    :validate="validateBasic"
    @change="basicError = ''"
    @reject="basicError = $event.message"
    v-slot="upload"
    class="mx-auto w-full max-w-xl"
  >
    <div
      v-bind="upload.dropzone"
      :class="[
        'rounded-2xl border border-dashed bg-white p-6 text-center shadow-sm transition-colors duration-150 dark:bg-gray-950 motion-reduce:transition-none sm:p-8',
        upload.dragging
          ? 'border-gray-950 bg-gray-50 dark:border-white dark:bg-gray-900'
          : 'border-gray-300 dark:border-gray-700'
      ]"
    >
      <div
        class="mx-auto grid size-12 place-items-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          class="size-6"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15"
          />
        </svg>
      </div>
      <h3 class="mt-4 text-lg font-semibold tracking-tight">
        {{ upload.file ? 'Ready to upload' : 'Add a file' }}
      </h3>
      <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
        Drop one file here, or use the native picker.
      </p>
      <button
        type="button"
        class="mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-gray-950 px-4 text-sm font-medium text-white no-underline outline-none hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:outline-white"
        @click="upload.choose"
      >
        {{ upload.file ? 'Replace file' : 'Choose file' }}
      </button>

      <div
        v-if="upload.file"
        class="mt-6 flex items-center gap-3 rounded-xl bg-gray-50 p-3 text-left dark:bg-gray-900"
      >
        <div
          class="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-gray-500 shadow-sm dark:bg-gray-950 dark:text-gray-400"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            class="size-5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
          >
            <path d="M7 3.75h7l3 3V20.25H7z" />
            <path d="M14 3.75v3h3" />
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <p class="m-0 truncate text-sm font-medium">{{ upload.file.name }}</p>
          <p class="m-0 mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {{ formatSize(upload.file.size) }}
          </p>
        </div>
        <button
          type="button"
          class="min-h-10 cursor-pointer rounded-lg px-3 text-sm text-gray-600 no-underline hover:bg-gray-200 hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white"
          @click="upload.clear"
        >
          Remove
        </button>
      </div>
    </div>
    <p
      v-if="basicError"
      role="alert"
      class="mt-3 text-sm text-red-700 dark:text-red-400"
    >
      {{ basicError }}
    </p>
  </FileUpload>

  <FileUpload
    v-else-if="recipe === 'logo'"
    v-model="logo"
    accept="image/*"
    v-slot="upload"
  >
    <div
      class="mx-auto max-w-md border-2 border-black bg-[#f7f3eb] p-5 text-gray-950 shadow-[6px_6px_0_0_#000] sm:p-6"
    >
      <h3 class="m-0 text-xl font-semibold">Business logo</h3>
      <p class="m-0 mt-2 text-sm leading-6 text-gray-600">
        Shown on every invoice.
      </p>
      <div class="mt-6 flex items-center gap-4">
        <div
          class="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-black bg-white"
        >
          <img
            v-if="upload.previewUrl || !removeCurrentLogo"
            :src="upload.previewUrl || currentLogoUrl"
            alt="Current business logo"
            class="size-full object-cover"
          />
          <span v-else class="text-xl font-semibold">HF</span>
        </div>
        <div class="min-w-0">
          <p class="m-0 truncate text-sm font-medium">
            {{
              upload.file?.name ||
              (!removeCurrentLogo ? 'hagfish-studio.png' : 'No logo selected')
            }}
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              class="min-h-10 cursor-pointer border-2 border-black bg-black px-3 text-sm font-medium text-white no-underline hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              @click="upload.choose"
            >
              {{
                upload.file || !removeCurrentLogo ? 'Replace' : 'Choose logo'
              }}
            </button>
            <button
              v-if="upload.file || !removeCurrentLogo"
              type="button"
              class="min-h-10 cursor-pointer border-2 border-black bg-white px-3 text-sm font-medium no-underline hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              @click="upload.file ? upload.clear() : (removeCurrentLogo = true)"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </FileUpload>

  <FileUpload
    v-else-if="recipe === 'attachments'"
    v-model="images"
    multiple
    accept="image/avif,image/gif,image/jpeg,image/png,image/webp"
    :validate="validateImage"
    @change="imagesError = ''"
    @reject="imagesError = $event.message"
    v-slot="upload"
    class="mx-auto max-w-3xl"
  >
    <section
      class="rounded-2xl border border-gray-200 bg-white p-5 text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-white sm:p-7"
      aria-labelledby="file-upload-attachments-title"
    >
      <h3
        id="file-upload-attachments-title"
        class="m-0 text-xl font-semibold tracking-tight"
      >
        Attach screenshots
      </h3>
      <p
        class="m-0 mt-2 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400"
      >
        Add up to four images. Paste can update this same file array.
      </p>

      <div
        v-bind="upload.dropzone"
        :class="[
          'mt-6 rounded-xl border border-dashed p-5 transition-colors duration-150 motion-reduce:transition-none',
          upload.dragging
            ? 'border-gray-950 bg-gray-50 dark:border-white dark:bg-gray-900'
            : 'border-gray-300 dark:border-gray-700'
        ]"
      >
        <div
          v-if="upload.previews.length"
          class="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <figure
            v-for="preview in upload.previews"
            :key="preview.file.name + preview.file.lastModified"
            class="group relative m-0 min-w-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900"
          >
            <img
              :src="preview.previewUrl"
              :alt="preview.file.name"
              class="m-0 aspect-square w-full object-cover"
            />
            <figcaption
              class="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gray-950/80 px-2 py-1.5 text-white backdrop-blur-sm"
            >
              <span class="min-w-0 flex-1 truncate text-xs">
                {{ preview.file.name }}
              </span>
              <button
                type="button"
                class="grid size-8 shrink-0 cursor-pointer place-items-center rounded-md no-underline hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
                :aria-label="`Remove ${preview.file.name}`"
                @click="upload.remove(preview.file)"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  class="size-4"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                >
                  <path d="m6 6 8 8m0-8-8 8" stroke-linecap="round" />
                </svg>
              </button>
            </figcaption>
          </figure>
        </div>

        <div
          :class="
            upload.previews.length
              ? 'mt-5 flex flex-wrap items-center justify-between gap-3'
              : 'py-7 text-center'
          "
        >
          <div :class="upload.previews.length ? '' : 'mx-auto'">
            <p class="m-0 text-sm font-medium">
              {{
                upload.previews.length
                  ? `${upload.files.length} of 4 attached`
                  : 'Drop screenshots here'
              }}
            </p>
            <p class="m-0 mt-1 text-xs text-gray-500 dark:text-gray-400">
              AVIF, GIF, JPEG, PNG, or WebP · 5 MB each
            </p>
          </div>
          <button
            type="button"
            :class="[
              'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-gray-950 px-4 text-sm font-medium text-white no-underline hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:outline-white',
              upload.previews.length ? 'mt-0' : 'mt-4'
            ]"
            @click="upload.choose"
          >
            {{ upload.previews.length ? 'Add more' : 'Choose images' }}
          </button>
        </div>
      </div>
      <p
        v-if="imagesError"
        role="alert"
        class="m-0 mt-3 text-sm font-medium text-red-700 dark:text-red-400"
      >
        {{ imagesError }}
      </p>
    </section>
  </FileUpload>

  <FileUpload
    v-else
    v-model="receipt"
    accept="image/jpeg,image/png,.pdf"
    capture="environment"
    :validate="validateReceipt"
    @change="receiptError = ''"
    @reject="receiptError = $event.message"
    v-slot="upload"
  >
    <div
      class="mx-auto max-w-xl border-2 border-black bg-[#f7f3eb] p-5 text-gray-950 shadow-[6px_6px_0_0_#000] sm:p-6"
    >
      <h3 class="m-0 text-xl font-semibold">Expense receipt</h3>
      <p class="m-0 mt-2 text-sm leading-6 text-gray-600">
        JPG, PNG, or PDF. Up to 5 MB.
      </p>
      <div
        v-bind="upload.dropzone"
        :class="[
          'mt-6 border-2 border-dashed p-5 transition-colors duration-150 motion-reduce:transition-none',
          upload.dragging
            ? 'border-black bg-amber-50'
            : 'border-gray-400 bg-white'
        ]"
      >
        <div v-if="upload.file" class="flex items-center gap-4">
          <img
            v-if="upload.file.type.startsWith('image/')"
            :src="upload.previewUrl"
            alt="Selected receipt preview"
            class="size-20 shrink-0 border-2 border-black object-cover"
          />
          <div
            v-else
            class="grid size-20 shrink-0 place-items-center border-2 border-black bg-white font-mono text-sm font-semibold"
          >
            PDF
          </div>
          <div class="min-w-0 flex-1">
            <p class="m-0 truncate font-medium">{{ upload.file.name }}</p>
            <p class="m-0 mt-1 text-sm text-gray-600">
              {{ formatSize(upload.file.size) }}
            </p>
          </div>
        </div>
        <div v-else class="py-4 text-center">
          <p class="m-0 font-medium">Drop a receipt here</p>
          <p class="m-0 mt-1 text-sm text-gray-600">
            The choose button remains the keyboard path.
          </p>
        </div>
        <div class="mt-5 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            class="min-h-10 cursor-pointer border-2 border-black bg-black px-4 text-sm font-medium text-white no-underline hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            @click="upload.choose"
          >
            {{ upload.file ? 'Replace receipt' : 'Choose receipt' }}
          </button>
          <button
            v-if="upload.file"
            type="button"
            class="min-h-10 cursor-pointer border-2 border-black bg-white px-4 text-sm font-medium no-underline hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            @click="upload.clear"
          >
            Remove
          </button>
        </div>
      </div>
      <p
        v-if="receiptError"
        role="alert"
        class="m-0 mt-3 text-sm font-medium text-red-700"
      >
        {{ receiptError }}
      </p>
    </div>
  </FileUpload>
</template>
