<script setup>
import LoadingState from '@/components/ui/loading-state/LoadingState.vue'
import Spinner from '@/components/ui/spinner/Spinner.vue'
</script>

<template>
  <section aria-busy="true" aria-labelledby="services-title">
    <h2 id="services-title">Services</h2>
    <LoadingState>
      <Spinner class="size-6" />
      <span>Loading services…</span>
    </LoadingState>
  </section>
</template>
