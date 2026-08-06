<script setup>
import Button from '~/components/ui/button/Button.vue'
import Popover from '~/components/ui/popover/Popover.vue'
</script>

<template>
  <div>
    <Button
      popovertarget="share-invoice"
      class="rounded-none border-2 border-black bg-black text-white hover:bg-white hover:text-black"
    >
      Share invoice
    </Button>
    <Popover
      id="share-invoice"
      class="w-80 rounded-none border-2 border-black p-5 shadow-[6px_6px_0_0_#000]"
    >
      <h2 id="share-title" class="font-semibold">Public invoice link</h2>
      <p class="mt-2 break-all font-mono text-xs text-gray-600">
        https://example.com/i/INV-1042
      </p>
    </Popover>
  </div>

  <div class="dark bg-gray-950 p-6 text-white">
    <Button
      popovertarget="environment"
      class="min-h-9 min-w-0 bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700"
    >
      Environment
    </Button>
    <Popover
      id="environment"
      class="w-64 border-gray-700 bg-gray-900 p-3 text-white shadow-xl"
    >
      <h2
        id="env-title"
        class="px-2 py-1 text-xs font-medium uppercase tracking-wide text-gray-400"
      >
        Environment
      </h2>
      <label class="mt-2 flex items-center gap-3 rounded px-2 py-2 text-sm">
        <input type="checkbox" checked class="size-4" /> Production
      </label>
    </Popover>
  </div>
</template>
