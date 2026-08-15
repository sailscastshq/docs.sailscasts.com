<script setup>
import { ref } from 'vue'
import Button from '../Button.vue'
import Badge from './Badge.vue'

const deployment = ref('Deploying')

function finishDeployment() {
  deployment.value = 'Deployment complete'
}
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <article class="space-y-3">
      <p
        class="m-0! font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500"
      >
        Hagfish / invoices
      </p>
      <div
        class="border-2 border-black bg-white p-6 shadow-[6px_6px_0_0_#000] dark:border-white dark:bg-gray-950 dark:shadow-[6px_6px_0_0_#fff]"
      >
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="m-0! font-semibold">August invoices</h2>
            <p class="m-0! mt-1! text-sm text-gray-600 dark:text-gray-300">
              Three customer records
            </p>
          </div>
          <Badge
            class="rounded-none border-2 border-black bg-black px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white dark:border-white dark:bg-white dark:text-black"
          >
            3 invoices
          </Badge>
        </div>
        <ul
          class="m-0! mt-6! list-none! divide-y divide-gray-200 p-0! dark:divide-gray-800"
        >
          <li class="m-0! flex items-center justify-between gap-4 py-3">
            <span class="text-sm font-medium">INV-1044</span>
            <Badge>Draft</Badge>
          </li>
          <li class="m-0! flex items-center justify-between gap-4 py-3">
            <span class="text-sm font-medium">INV-1042</span>
            <Badge
              class="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              >Paid</Badge
            >
          </li>
        </ul>
      </div>
    </article>

    <article class="space-y-3">
      <p
        class="m-0! font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500"
      >
        Slipway / service
      </p>
      <div
        class="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950"
      >
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="m-0! text-sm font-medium">api</h2>
            <p class="m-0! mt-1! text-xs text-gray-500 dark:text-gray-400">
              Production · Lagos
            </p>
          </div>
          <Badge
            class="bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
          >
            <span
              aria-hidden="true"
              class="size-1.5 rounded-full bg-emerald-500"
            ></span>
            Healthy
          </Badge>
        </div>
        <Button
          type="button"
          class="mt-6 flex w-full justify-between bg-white px-3 text-gray-950 hover:bg-gray-50 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-900"
        >
          <span>Deployment logs</span>
          <Badge class="bg-gray-100 text-gray-500 dark:bg-gray-800">
            12 <span class="sr-only">log entries</span>
          </Badge>
        </Button>
      </div>
    </article>
  </div>

  <div
    class="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950"
  >
    <div>
      <p class="m-0! text-sm font-medium">Deliberate live status</p>
      <p class="m-0! mt-1! text-sm text-gray-500 dark:text-gray-400">
        The mounted Badge changes its existing text.
      </p>
    </div>
    <div class="flex items-center gap-3">
      <Badge role="status" aria-live="polite" aria-atomic="true">
        {{ deployment }}
      </Badge>
      <Button
        type="button"
        class="min-h-9 min-w-0 px-3 py-1.5 text-sm"
        @click="finishDeployment"
      >
        Finish deployment
      </Button>
    </div>
  </div>
</template>
