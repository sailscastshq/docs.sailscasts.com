<script setup>
import { ref } from 'vue'
import EmptyState from './EmptyState.vue'

const query = ref('worker')
const notice = ref('')

function clearFilters() {
  query.value = ''
  notice.value = 'Filters cleared'
}
</script>

<template>
  <div class="grid w-full max-w-4xl gap-5 sm:grid-cols-2">
    <section
      aria-labelledby="empty-state-projects-title"
      class="dark bg-gray-950 p-5 text-white sm:p-6"
    >
      <EmptyState
        class="min-h-80 rounded-lg border border-gray-800 bg-gray-900 px-5 text-white"
      >
        <span
          aria-hidden="true"
          class="grid size-11 place-items-center rounded-lg bg-gray-800 text-lg"
        >
          ＋
        </span>
        <div class="max-w-xs">
          <h3
            id="empty-state-projects-title"
            class="m-0 text-lg font-semibold text-white"
          >
            No projects yet
          </h3>
          <p class="mt-2 text-sm leading-6 text-gray-400">
            Create your first project to deploy an application with Slipway.
          </p>
        </div>
        <a
          href="#create-project"
          class="inline-flex min-h-10 items-center rounded-md bg-white px-4 text-sm font-medium text-gray-950 no-underline hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Create project
        </a>
      </EmptyState>
    </section>

    <section
      aria-labelledby="empty-state-clients-title"
      class="bg-[#f7f3eb] p-5 text-black sm:p-6"
    >
      <EmptyState
        class="min-h-80 rounded-none border-2 border-black bg-white px-5 text-black shadow-[5px_5px_0_0_#000]"
      >
        <span aria-hidden="true" class="text-4xl leading-none">◎</span>
        <div class="max-w-xs">
          <h3
            id="empty-state-clients-title"
            class="m-0 text-xl font-bold tracking-tight"
          >
            No clients yet
          </h3>
          <p class="mt-2 text-sm leading-6 text-black/60">
            Add a client before sending your first beautifully boring invoice.
          </p>
        </div>
        <a
          href="#add-client"
          class="inline-flex min-h-10 items-center border-2 border-black bg-black px-4 text-sm font-semibold text-white no-underline hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Add client
        </a>
      </EmptyState>
    </section>

    <section
      aria-labelledby="empty-state-records-title"
      class="overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-white sm:col-span-2"
    >
      <header class="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <h3 id="empty-state-records-title" class="m-0 text-sm font-semibold">
          Bridge records
        </h3>
      </header>
      <EmptyState
        v-if="query"
        class="min-h-0 gap-2 px-4 py-9 text-sm text-gray-500 dark:text-gray-400"
      >
        <p>No records match “{{ query }}”.</p>
        <button
          type="button"
          class="min-h-9 cursor-pointer rounded-md px-3 font-medium text-gray-950 underline underline-offset-4 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:text-white dark:hover:bg-gray-900 dark:focus-visible:outline-white"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </EmptyState>
      <p v-else class="m-0 px-4 py-9 text-center text-sm text-gray-500">
        Filters cleared. Records can render here.
      </p>
    </section>

    <p class="sr-only" aria-live="polite">{{ notice }}</p>
  </div>
</template>
