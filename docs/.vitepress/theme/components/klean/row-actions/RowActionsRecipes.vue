<script setup>
import { ref } from 'vue'
import RowActions from './RowActions.vue'

const notice = ref('Choose an action')
</script>

<template>
  <div class="grid w-full max-w-4xl gap-5 sm:grid-cols-2">
    <section
      aria-labelledby="row-actions-invoices"
      class="bg-[#f7f3eb] p-5 text-black sm:p-6"
    >
      <h3 id="row-actions-invoices" class="m-0 text-lg font-semibold">
        Invoices
      </h3>
      <div
        class="mt-4 flex items-center justify-between gap-3 border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]"
      >
        <div class="min-w-0">
          <a
            href="#invoice-inv-1042"
            class="whitespace-nowrap font-semibold text-black no-underline hover:underline"
          >
            INV-1042
          </a>
          <p class="mt-1 truncate text-sm text-black/60">Acme Studio · Draft</p>
        </div>
        <RowActions label="Actions for invoice INV-1042">
          <a
            href="#preview-inv-1042"
            class="inline-flex min-h-10 items-center border-2 border-black px-3 text-sm font-medium text-black no-underline hover:bg-black hover:text-white"
          >
            Preview
          </a>
          <template #menu>
            <a
              href="#edit-inv-1042"
              class="block px-3 py-2 text-sm text-black no-underline hover:bg-black hover:text-white"
            >
              Edit invoice
            </a>
            <button
              type="button"
              class="block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-black hover:text-white"
              @click="notice = 'Invoice duplicated'"
            >
              Duplicate
            </button>
            <button
              type="button"
              class="block w-full cursor-pointer px-3 py-2 text-left text-sm text-red-700 hover:bg-red-700 hover:text-white"
              @click="notice = 'Delete confirmation opened'"
            >
              Delete draft
            </button>
          </template>
        </RowActions>
      </div>
    </section>

    <section
      aria-labelledby="row-actions-services"
      class="dark bg-gray-950 p-5 text-white sm:p-6"
    >
      <h3
        id="row-actions-services"
        class="m-0 text-lg font-semibold text-white"
      >
        Bridge services
      </h3>
      <div
        class="mt-4 divide-y divide-gray-800 overflow-visible rounded-lg border border-gray-800 bg-gray-900"
      >
        <div
          v-for="service in ['api', 'worker']"
          :key="service"
          class="flex items-center justify-between gap-3 p-3"
        >
          <div>
            <a
              :href="`#service-${service}`"
              class="font-mono text-sm font-medium text-white no-underline hover:underline"
            >
              {{ service }}
            </a>
            <p class="mt-1 text-xs text-gray-400">Healthy · fra1</p>
          </div>
          <RowActions :label="`Actions for ${service}`">
            <a
              :href="`#logs-${service}`"
              class="inline-flex min-h-9 items-center rounded-md px-3 text-sm font-medium text-gray-200 no-underline hover:bg-white/10"
            >
              Logs
            </a>
            <template #menu>
              <a
                :href="`#settings-${service}`"
                class="block rounded-sm px-3 py-2 text-sm text-gray-200 no-underline hover:bg-white/10"
              >
                Settings
              </a>
              <button
                type="button"
                class="block w-full cursor-pointer rounded-sm px-3 py-2 text-left text-sm text-gray-200 hover:bg-white/10"
                @click="notice = `${service} redeploy requested`"
              >
                Redeploy
              </button>
              <button
                type="button"
                class="block w-full cursor-pointer rounded-sm px-3 py-2 text-left text-sm text-red-400 hover:bg-red-950/60"
                @click="notice = `Delete ${service} confirmation opened`"
              >
                Delete service
              </button>
            </template>
          </RowActions>
        </div>
      </div>
    </section>

    <p class="sr-only" aria-live="polite">{{ notice }}</p>
  </div>
</template>
