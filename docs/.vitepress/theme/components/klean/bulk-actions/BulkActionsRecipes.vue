<script setup>
import { ref } from 'vue'
import Menu from '../menu/Menu.vue'
import BulkActions from './BulkActions.vue'

const invoiceCount = ref(2)
const serviceCount = ref(3)
const notice = ref('Choose an action')
</script>

<template>
  <div class="grid w-full max-w-4xl gap-5 sm:grid-cols-2">
    <section
      aria-labelledby="bulk-actions-invoices"
      class="bg-[#f7f3eb] p-5 text-black sm:p-6"
    >
      <h3 id="bulk-actions-invoices" class="m-0 text-lg font-semibold">
        Invoices
      </h3>
      <label class="mt-4 flex items-center gap-3 text-sm font-medium">
        <input
          type="checkbox"
          :checked="invoiceCount > 0"
          data-bulk-actions-focus
          class="size-5 accent-black"
        />
        Select all invoices on this page
      </label>
      <BulkActions
        :count="invoiceCount"
        label="Actions for selected invoices"
        clear-label="Clear"
        class="mt-4 rounded-none border-2 border-black bg-white px-4 shadow-[4px_4px_0_0_#000]"
        @clear="invoiceCount = 0"
      >
        <a
          href="#download-invoices"
          class="inline-flex min-h-10 items-center border-2 border-black bg-black px-3 text-sm font-medium text-white no-underline hover:bg-white hover:text-black"
        >
          Download
        </a>
        <button
          type="button"
          class="min-h-10 cursor-pointer border-2 border-red-700 px-3 text-sm font-medium text-red-700 hover:bg-red-700 hover:text-white"
          @click="notice = 'Delete invoice confirmation opened'"
        >
          Delete
        </button>
      </BulkActions>
    </section>

    <section
      aria-labelledby="bulk-actions-services"
      class="dark bg-gray-950 p-5 text-white sm:p-6"
    >
      <h3
        id="bulk-actions-services"
        class="m-0 text-lg font-semibold text-white"
      >
        Bridge records
      </h3>
      <label class="mt-4 flex items-center gap-3 text-sm text-gray-300">
        <input
          type="checkbox"
          :checked="serviceCount > 0"
          data-bulk-actions-focus
          class="size-4 accent-white"
        />
        Select all records on this page
      </label>
      <BulkActions
        :count="serviceCount"
        label="Actions for selected records"
        clear-label="Clear"
        class="mt-4 border-gray-800 bg-gray-900 shadow-none"
        @clear="serviceCount = 0"
      >
        <button
          type="button"
          popovertarget="docs-bulk-actions-menu"
          class="min-h-9 cursor-pointer rounded-md bg-white px-3 text-sm font-medium text-gray-950 hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Actions
        </button>
        <Menu
          id="docs-bulk-actions-menu"
          aria-label="Actions for selected records"
          placement="bottom-end"
          class="w-56"
        >
          <button
            type="button"
            class="block w-full cursor-pointer rounded-sm px-3 py-2 text-left text-sm text-gray-200 hover:bg-white/10"
            @click="notice = 'Licenses regenerated'"
          >
            Regenerate licenses
          </button>
          <button
            type="button"
            class="block w-full cursor-pointer rounded-sm px-3 py-2 text-left text-sm text-red-400 hover:bg-red-950/60"
            @click="notice = 'Delete records confirmation opened'"
          >
            Delete selected
          </button>
        </Menu>
      </BulkActions>
    </section>

    <p class="sr-only" aria-live="polite">{{ notice }}</p>
  </div>
</template>
