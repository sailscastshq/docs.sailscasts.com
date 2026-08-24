<script setup>
import { ref } from 'vue'
import Button from '../Button.vue'
import ErrorState from './ErrorState.vue'

const bridgeFailed = ref(true)
const invoicesFailed = ref(true)
const dynamicFailure = ref(false)
const notice = ref('')

function retryBridge() {
  bridgeFailed.value = false
  notice.value = 'Bridge records loaded'
}

function retryInvoices() {
  invoicesFailed.value = false
  notice.value = 'Invoices loaded'
}
</script>

<template>
  <div class="grid w-full max-w-4xl gap-5 sm:grid-cols-2">
    <section
      aria-labelledby="error-state-bridge-title"
      class="dark bg-gray-950 p-5 text-white sm:p-6"
    >
      <ErrorState
        v-if="bridgeFailed"
        class="min-h-80 rounded-xl border border-gray-800 bg-gray-900 px-6 text-white"
      >
        <span
          aria-hidden="true"
          class="grid size-12 place-items-center rounded-lg bg-red-950 text-xl text-red-300"
        >
          !
        </span>
        <div class="max-w-sm">
          <h3 id="error-state-bridge-title" class="m-0 text-lg font-semibold">
            Bridge records could not load
          </h3>
          <p class="mt-2 text-sm leading-6 text-gray-400">
            Slipway could not reach this datastore. Your filters have been
            preserved.
          </p>
        </div>
        <Button
          type="button"
          class="min-h-10 min-w-0 bg-white px-4 py-2 text-gray-950 hover:bg-gray-200 dark:bg-white dark:text-gray-950"
          @click="retryBridge"
        >
          Try again
        </Button>
      </ErrorState>
      <p
        v-else
        class="m-0 grid min-h-80 place-items-center text-sm text-gray-300"
      >
        Bridge records loaded.
      </p>
    </section>

    <section
      aria-labelledby="error-state-invoices-title"
      class="border-2 border-black bg-[#f4f0e8] p-5 text-black shadow-[5px_5px_0_0_#000] sm:p-6"
    >
      <ErrorState
        v-if="invoicesFailed"
        class="min-h-80 rounded-none border-2 border-black bg-white px-6 text-black"
      >
        <span aria-hidden="true" class="text-5xl leading-none">×</span>
        <div class="max-w-sm">
          <h3 id="error-state-invoices-title" class="m-0 text-xl font-bold">
            Invoices could not load
          </h3>
          <p class="mt-2 text-sm leading-6 text-black/60">
            Hagfish kept your current work. Check the connection and try again.
          </p>
        </div>
        <Button
          type="button"
          class="min-h-11 min-w-0 rounded-none border-2 border-black bg-black px-5 font-semibold text-white hover:bg-white hover:text-black dark:bg-black dark:text-white"
          @click="retryInvoices"
        >
          Try again
        </Button>
      </ErrorState>
      <p v-else class="m-0 grid min-h-80 place-items-center text-sm">
        Invoices loaded.
      </p>
    </section>

    <section
      aria-labelledby="error-state-dynamic-title"
      class="rounded-lg border border-gray-200 bg-white p-5 text-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-white sm:col-span-2 sm:p-6"
    >
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 id="error-state-dynamic-title" class="m-0 font-semibold">
            Deployment activity
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            A dynamic failure opts into alert semantics in caller markup.
          </p>
        </div>
        <Button
          type="button"
          class="min-h-10 min-w-0 px-4 py-2"
          @click="dynamicFailure = true"
        >
          Simulate failure
        </Button>
      </div>
      <ErrorState
        v-if="dynamicFailure"
        role="alert"
        aria-labelledby="error-state-dynamic-message"
        class="mt-5 min-h-0 items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-left dark:border-red-900/50 dark:bg-red-950/20"
      >
        <h4 id="error-state-dynamic-message" class="m-0 text-sm font-semibold">
          Activity could not refresh
        </h4>
        <p class="m-0 text-sm text-gray-600 dark:text-gray-300">
          Existing activity remains available. Try again when the connection is
          restored.
        </p>
        <Button
          type="button"
          class="mt-1 min-h-9 min-w-0 px-3 py-1.5 text-sm"
          @click="dynamicFailure = false"
        >
          Dismiss
        </Button>
      </ErrorState>
    </section>

    <p class="sr-only" aria-live="polite">{{ notice }}</p>
  </div>
</template>
