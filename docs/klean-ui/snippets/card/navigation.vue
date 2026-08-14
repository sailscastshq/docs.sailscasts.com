<script setup>
import { Link } from '@inertiajs/vue3'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
</script>

<template>
  <!-- One destination: the Card itself is the real Link. -->
  <Card
    :as="Link"
    href="/deployments/1842"
    class="block cursor-pointer no-underline hover:bg-gray-50 focus-visible:outline-2"
  >
    <h2 class="font-semibold">Deployment #1842</h2>
    <p class="mt-1 text-sm text-gray-500">main · a13e9c7</p>
  </Card>

  <!-- Multiple actions: keep the Card non-interactive. -->
  <Card as="article" aria-labelledby="service-title">
    <h2 id="service-title" class="font-semibold">API service</h2>
    <p class="mt-1 text-sm text-gray-500">Healthy · 3 replicas</p>
    <footer class="mt-5 flex gap-3">
      <Button type="button">Deploy</Button>
      <Link href="/services/api/settings">Settings</Link>
    </footer>
  </Card>
</template>
