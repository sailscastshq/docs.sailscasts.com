<script setup>
import { Link } from '@inertiajs/vue3'
import Button from '../Button.vue'
import Card from './Card.vue'

function keepPreview(event) {
  event.preventDefault()
}
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <article class="space-y-3">
      <p
        class="m-0! font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500"
      >
        Hagfish / financial summary
      </p>
      <Card
        as="article"
        aria-labelledby="docs-revenue-title"
        class="flex min-h-64 flex-col justify-between gap-8 rounded-lg border-2 border-black bg-black p-6 text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] dark:border-white dark:bg-white dark:text-black"
      >
        <header class="flex items-start justify-between gap-4">
          <h2
            id="docs-revenue-title"
            class="m-0! text-sm font-medium text-white/60 dark:text-black/60"
          >
            Revenue
          </h2>
          <Button
            type="button"
            class="min-h-8 min-w-0 border border-white/20 bg-white/10 px-2.5 py-1 text-xs text-white hover:bg-white/20 dark:border-black/20 dark:bg-black/10 dark:text-black dark:hover:bg-black/20"
          >
            USD ↔
          </Button>
        </header>
        <Link
          href="#card-products"
          class="block text-[clamp(2.2rem,7vw,4rem)] font-bold leading-none tracking-tight text-white no-underline tabular-nums dark:text-black"
          @click="keepPreview"
        >
          $128,420.00
        </Link>
      </Card>
    </article>

    <article class="space-y-3">
      <p
        class="m-0! font-mono text-[11px] uppercase tracking-[0.18em] text-gray-500"
      >
        Slipway / service panel
      </p>
      <Card as="section" aria-labelledby="docs-api-title" class="p-4">
        <header class="flex items-center justify-between gap-4">
          <div>
            <h2 id="docs-api-title" class="m-0! text-sm font-medium">api</h2>
            <p class="m-0! mt-1! text-xs text-gray-500 dark:text-gray-400">
              Production · Lagos
            </p>
          </div>
          <span
            class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400"
          >
            <span
              aria-hidden="true"
              class="size-1.5 rounded-full bg-emerald-500"
            ></span>
            Healthy
          </span>
        </header>
        <dl class="m-0! mt-5! grid grid-cols-3 gap-4 text-sm">
          <div>
            <dt class="text-xs text-gray-500 dark:text-gray-400">Replicas</dt>
            <dd class="m-0! mt-1! font-medium tabular-nums">3</dd>
          </div>
          <div>
            <dt class="text-xs text-gray-500 dark:text-gray-400">Memory</dt>
            <dd class="m-0! mt-1! font-medium tabular-nums">384 MB</dd>
          </div>
          <div>
            <dt class="text-xs text-gray-500 dark:text-gray-400">Region</dt>
            <dd class="m-0! mt-1! font-medium">LOS</dd>
          </div>
        </dl>
        <footer class="mt-5 flex items-center gap-3">
          <Button type="button" class="min-h-9 min-w-0 px-3 py-1.5 text-xs"
            >Deploy</Button
          >
          <Link
            href="#card-products"
            class="text-xs font-medium text-gray-600 underline underline-offset-4 dark:text-gray-300"
            @click="keepPreview"
          >
            Settings
          </Link>
        </footer>
      </Card>
    </article>
  </div>
</template>
