<script setup>
import { ref } from 'vue'
import Slide from '@/components/ui/slide/Slide.vue'

const deploying = ref(false)

async function deploy() {
  deploying.value = true

  try {
    await fetch('/deployments', { method: 'POST' })
  } finally {
    deploying.value = false
  }
}
</script>

<template>
  <Slide
    :pending="deploying"
    :disabled="!ready"
    class="w-72"
    aria-describedby="deploy-help"
    @confirm="deploy"
  >
    {{ deploying ? 'Sliding to production…' : 'Slide to production' }}
  </Slide>
  <p id="deploy-help">Release near the end to start deployment.</p>
</template>
