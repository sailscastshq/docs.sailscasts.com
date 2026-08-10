<script setup>
import Button from '@/components/ui/button/Button.vue'
import Spinner from '@/components/ui/spinner/Spinner.vue'
import SlippyLoader from '@/components/SlippyLoader.vue'
</script>

<template>
  <Button
    type="submit"
    :disabled="form.processing"
    :aria-busy="form.processing"
  >
    <Spinner v-if="form.processing" class="size-4">
      <SlippyLoader />
    </Spinner>
    {{ form.processing ? 'Deploying service…' : 'Deploy service' }}
  </Button>
</template>
