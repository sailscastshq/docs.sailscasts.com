<script setup>
import ErrorState from '@/components/ui/error-state/ErrorState.vue'
import Button from '@/components/ui/button/Button.vue'

defineProps({ failed: Boolean })
defineEmits(['retry'])
</script>

<template>
  <ErrorState v-if="failed" role="alert" aria-labelledby="services-error-title">
    <h2 id="services-error-title">Services could not load</h2>
    <p>Slipway could not reach the deployment service.</p>
    <Button type="button" @click="$emit('retry')">Try again</Button>
  </ErrorState>
</template>
