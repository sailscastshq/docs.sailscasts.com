<script setup>
import Button from '~/components/ui/button/Button.vue'
import Menu from '~/components/ui/menu/Menu.vue'
</script>

<template>
  <div class="bg-[#f4f0e8] p-6">
    <p class="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-gray-600">
      Hagfish / invoice
    </p>
    <Button
      popovertarget="invoice-actions"
      class="rounded-none border-2 border-black bg-black text-white hover:bg-white hover:text-black"
    >
      Invoice actions
    </Button>
    <Menu
      id="invoice-actions"
      aria-label="Invoice actions"
      class="w-64 rounded-none border-2 border-black p-2 shadow-[6px_6px_0_0_#000]"
    >
      <a
        href="/invoices/42"
        class="flex w-full border-2 border-transparent px-3 py-2 text-sm font-medium text-black no-underline outline-none hover:border-black focus:border-black"
      >
        Preview invoice
      </a>
      <button
        type="button"
        class="flex w-full border-2 border-transparent px-3 py-2 text-left text-sm font-medium text-red-700 outline-none hover:border-red-700 focus:border-red-700"
      >
        Void invoice
      </button>
    </Menu>
  </div>

  <div class="dark bg-gray-950 p-6 text-white">
    <p class="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-gray-400">
      Slipway / deploy
    </p>
    <Button
      popovertarget="deploy-actions"
      class="min-h-9 min-w-0 bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700"
    >
      Actions
    </Button>
    <Menu
      id="deploy-actions"
      aria-label="Deployment actions"
      class="w-52 border-gray-700 bg-gray-900 p-1 text-white shadow-xl"
    >
      <button
        type="button"
        class="flex w-full rounded px-2 py-2 text-left text-sm text-gray-200 outline-none hover:bg-white/10 focus:bg-white/10"
      >
        Redeploy
      </button>
      <a
        href="/deployments/42/logs"
        class="flex w-full rounded px-2 py-2 text-sm text-gray-200 no-underline outline-none hover:bg-white/10 focus:bg-white/10"
      >
        View logs
      </a>
      <button
        type="button"
        disabled
        class="flex w-full cursor-not-allowed rounded px-2 py-2 text-left text-sm text-gray-500 outline-none"
      >
        Stop provisioning
      </button>
    </Menu>
  </div>
</template>
