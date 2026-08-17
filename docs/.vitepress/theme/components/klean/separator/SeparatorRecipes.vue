<script setup>
import Separator from './Separator.vue'

function keepPreview(event) {
  event.preventDefault()
}
</script>

<template>
  <div class="grid w-full gap-8 xl:grid-cols-2">
    <article class="space-y-3">
      <p
        class="m-0! font-mono text-[11px] text-gray-500 uppercase tracking-[0.18em]"
      >
        Hagfish / account menu
      </p>
      <div
        class="border-2 border-black bg-white p-2 shadow-[6px_6px_0_0_#000] dark:border-white dark:bg-gray-950 dark:shadow-[6px_6px_0_0_#fff]"
      >
        <a
          href="#profile"
          class="block px-4 py-3 font-medium text-gray-950 no-underline dark:text-white"
          @click="keepPreview"
        >
          Profile
        </a>
        <a
          href="#billing"
          class="block px-4 py-3 font-medium text-gray-950 no-underline dark:text-white"
          @click="keepPreview"
        >
          Billing
        </a>
        <Separator
          aria-hidden="true"
          class="my-1 bg-black/10 dark:bg-white/10"
        />
        <button
          type="button"
          class="w-full cursor-pointer border-0 bg-transparent px-4 py-3 text-left font-medium text-red-700 dark:text-red-400"
        >
          Sign out
        </button>
      </div>
    </article>

    <article class="space-y-3">
      <p
        class="m-0! font-mono text-[11px] text-gray-500 uppercase tracking-[0.18em]"
      >
        Slipway / command surface
      </p>
      <div
        class="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-950"
      >
        <div class="p-4">
          <p class="m-0! text-sm font-medium">Deploy production</p>
          <p class="m-0! mt-1! text-xs text-gray-500 dark:text-gray-400">
            main · Lagos · 3 replicas
          </p>
        </div>
        <Separator aria-hidden="true" class="bg-gray-100 dark:bg-gray-800" />
        <footer
          class="flex items-center justify-between gap-4 px-4 py-3 text-xs text-gray-500 dark:text-gray-400"
        >
          <span>Enter to deploy</span>
          <span>Esc to close</span>
        </footer>
      </div>

      <div
        role="toolbar"
        aria-label="Log actions"
        class="mt-5 flex h-10 items-stretch rounded-lg bg-gray-100 p-1 dark:bg-gray-900"
      >
        <button
          type="button"
          class="cursor-pointer rounded-md border-0 bg-transparent px-3 text-sm hover:bg-white dark:hover:bg-gray-800"
        >
          Pause
        </button>
        <button
          type="button"
          class="cursor-pointer rounded-md border-0 bg-transparent px-3 text-sm hover:bg-white dark:hover:bg-gray-800"
        >
          Clear
        </button>
        <Separator
          orientation="vertical"
          aria-hidden="true"
          class="mx-1 h-6 self-center bg-gray-300 dark:bg-gray-700"
        />
        <button
          type="button"
          class="cursor-pointer rounded-md border-0 bg-transparent px-3 text-sm hover:bg-white dark:hover:bg-gray-800"
        >
          Download
        </button>
      </div>
    </article>
  </div>
</template>
