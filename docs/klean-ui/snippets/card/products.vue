<script setup>
import { Link } from '@inertiajs/vue3'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <Card
      as="article"
      aria-labelledby="revenue-title"
      class="flex min-h-64 flex-col justify-between gap-8 rounded-lg border-2 border-black bg-black p-6 text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]"
    >
      <header class="flex items-start justify-between gap-4">
        <h2 id="revenue-title" class="text-sm font-medium text-white/60">
          Revenue
        </h2>
        <Button
          type="button"
          class="min-h-8 min-w-0 border border-white/20 bg-white/10 px-2.5 py-1 text-xs"
        >
          USD ↔
        </Button>
      </header>
      <Link
        href="/invoices?status=paid"
        class="block text-5xl font-bold leading-none tracking-tight text-white no-underline tabular-nums"
      >
        $128,420.00
      </Link>
    </Card>

    <Card as="section" aria-labelledby="api-title" class="p-4">
      <header class="flex items-center justify-between gap-4">
        <div>
          <h2 id="api-title" class="text-sm font-medium">api</h2>
          <p class="mt-1 text-xs text-gray-500">Production · Lagos</p>
        </div>
        <span class="text-xs font-medium text-emerald-700">Healthy</span>
      </header>
      <dl class="mt-5 grid grid-cols-3 gap-4 text-sm">
        <div>
          <dt class="text-xs text-gray-500">Replicas</dt>
          <dd>3</dd>
        </div>
        <div>
          <dt class="text-xs text-gray-500">Memory</dt>
          <dd>384 MB</dd>
        </div>
        <div>
          <dt class="text-xs text-gray-500">Region</dt>
          <dd>LOS</dd>
        </div>
      </dl>
    </Card>
  </div>
</template>
