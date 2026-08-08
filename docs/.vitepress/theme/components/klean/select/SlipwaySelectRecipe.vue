<script setup>
import { ref } from 'vue'
import KleanSelect from './Select.vue'

const category = ref('feature')
const categoryOptions = [
  { value: 'feature', label: 'Feature' },
  { value: 'bug', label: 'Bug' }
]
</script>

<template>
  <div
    class="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-7"
  >
    <div
      class="flex items-center gap-3 [&_[data-slot=select]]:w-auto [&_[data-slot=select-content]]:max-h-64 [&_[data-slot=select-content]]:min-w-44 [&_[data-slot=select-content]]:max-w-[min(20rem,calc(100vw-2.5rem))] [&_[data-slot=select-content]]:rounded-xl [&_[data-slot=select-content]]:border-gray-200 [&_[data-slot=select-content]]:bg-white [&_[data-slot=select-content]]:p-1 [&_[data-slot=select-content]]:shadow-xl [&_[data-slot=select-content]]:shadow-gray-950/10 dark:[&_[data-slot=select-content]]:border-gray-700 dark:[&_[data-slot=select-content]]:bg-gray-900 dark:[&_[data-slot=select-content]]:shadow-black/30 [&_[data-slot=select-option]]:min-h-10 [&_[data-slot=select-option]]:rounded-none [&_[data-slot=select-option]]:px-3.5 [&_[data-slot=select-option]]:py-2 [&_[data-slot=select-option]]:text-gray-700 dark:[&_[data-slot=select-option]]:text-gray-300 [&_[data-slot=select-option][data-highlighted]]:bg-gray-50 dark:[&_[data-slot=select-option][data-highlighted]]:bg-gray-800 [&_[data-slot=select-indicator]]:text-gray-500 dark:[&_[data-slot=select-indicator]]:text-gray-400"
    >
      <span
        role="img"
        aria-label="Posting as Kelvin"
        title="Posting as Kelvin"
        class="grid size-10 shrink-0 place-items-center rounded-full bg-gray-950 text-xs font-semibold text-white dark:bg-white dark:text-gray-950"
      >
        <span aria-hidden="true">KO</span>
      </span>

      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        class="size-4 shrink-0 text-gray-300 dark:text-gray-700"
        fill="none"
      >
        <path
          d="m6 3.5 4.5 4.5L6 12.5"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
        />
      </svg>

      <div>
        <span id="docs-slipway-category-label" class="sr-only">Category</span>
        <KleanSelect
          id="docs-slipway-category"
          v-model="category"
          :options="categoryOptions"
          aria-labelledby="docs-slipway-category-label"
          class="min-h-10 w-auto max-w-[16rem] rounded-lg border-0 bg-gray-100 px-3.5 py-2 text-sm font-semibold text-gray-950 shadow-none hover:border-transparent hover:bg-gray-200 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 dark:bg-gray-900 dark:text-white dark:hover:border-transparent dark:hover:bg-gray-800 dark:focus-visible:border-transparent dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-950"
        />
      </div>
    </div>

    <label for="docs-slipway-feedback-summary" class="sr-only">Summary</label>
    <input
      id="docs-slipway-feedback-summary"
      type="text"
      placeholder="What would make this better?"
      class="mt-7 w-full border-0 bg-transparent p-0 text-xl font-semibold tracking-tight text-gray-950 placeholder:font-medium placeholder:text-gray-300 focus:ring-0 dark:text-white dark:placeholder:text-gray-500 sm:text-2xl"
    />
  </div>
</template>
