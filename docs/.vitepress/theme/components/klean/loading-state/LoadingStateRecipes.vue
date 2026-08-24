<script setup>
import LoadingState from './LoadingState.vue'
import ProductLoader from '../spinner/ProductLoader.vue'
import Spinner from '../spinner/Spinner.vue'
</script>

<template>
  <div class="grid w-full max-w-4xl gap-5 sm:grid-cols-2">
    <section
      aria-busy="true"
      aria-labelledby="loading-state-deployments-title"
      class="dark bg-gray-950 text-white"
    >
      <h3 id="loading-state-deployments-title" class="sr-only">Deployments</h3>
      <LoadingState class="min-h-72 text-gray-300 dark:text-gray-300">
        <Spinner class="size-10 text-white">
          <ProductLoader />
        </Spinner>
        <span class="text-sm">Loading deployments…</span>
      </LoadingState>
    </section>

    <section
      aria-busy="true"
      aria-labelledby="loading-state-invoices-title"
      class="border-2 border-black bg-[#f4f0e8] p-6 text-black shadow-[4px_4px_0_0_#000]"
    >
      <h3 id="loading-state-invoices-title" class="m-0 text-xl font-semibold">
        Invoices
      </h3>
      <LoadingState
        class="min-h-56 items-stretch gap-4 p-0 pt-6 text-left text-black dark:text-black"
      >
        <span class="sr-only">Loading invoices…</span>
        <div aria-hidden="true" class="space-y-3">
          <div
            v-for="row in 3"
            :key="row"
            class="h-12 animate-pulse bg-black/10 motion-reduce:animate-none"
          ></div>
        </div>
      </LoadingState>
    </section>

    <section
      aria-busy="true"
      aria-labelledby="loading-state-services-title"
      aria-describedby="loading-state-services-status"
      class="rounded-lg border border-gray-200 bg-white p-6 text-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-white sm:col-span-2"
    >
      <div
        class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4 dark:border-gray-800"
      >
        <h3 id="loading-state-services-title" class="m-0 text-lg font-semibold">
          Services
        </h3>
        <LoadingState
          id="loading-state-services-status"
          class="min-h-0 w-auto flex-row justify-start gap-2 p-0 text-left text-sm text-gray-500 dark:text-gray-400"
        >
          <Spinner class="size-4" />
          Refreshing…
        </LoadingState>
      </div>
      <ul class="m-0 divide-y divide-gray-200 p-0 dark:divide-gray-800">
        <li class="flex items-center justify-between gap-4 py-4 first:mt-0">
          <span>api.sailscasts.com</span>
          <span class="text-sm text-emerald-700 dark:text-emerald-400">
            Healthy
          </span>
        </li>
        <li class="flex items-center justify-between gap-4 py-4">
          <span>docs.sailscasts.com</span>
          <span class="text-sm text-emerald-700 dark:text-emerald-400">
            Healthy
          </span>
        </li>
        <li class="flex items-center justify-between gap-4 py-4">
          <span>workers</span>
          <span class="text-sm text-gray-500">Updating</span>
        </li>
      </ul>
    </section>
  </div>
</template>
