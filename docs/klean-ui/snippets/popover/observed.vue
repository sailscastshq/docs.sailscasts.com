<script setup>
import { ref } from 'vue'
import Button from '~/components/ui/button/Button.vue'
import Popover from '~/components/ui/popover/Popover.vue'

const filtersOpen = ref(false)
</script>

<template>
  <Button popovertarget="observed-filters">Inspect filters</Button>
  <Popover id="observed-filters" v-model:open="filtersOpen" class="w-64">
    <p class="text-sm leading-6">
      Observe visibility only when another part of the application needs it.
    </p>
  </Popover>

  <p aria-live="polite" class="text-sm text-gray-600">
    Popover is {{ filtersOpen ? 'open' : 'closed' }}.
  </p>
</template>
