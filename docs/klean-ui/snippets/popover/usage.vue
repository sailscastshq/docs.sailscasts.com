<script setup>
import Button from '~/components/ui/button/Button.vue'
import Popover from '~/components/ui/popover/Popover.vue'
</script>

<template>
  <Button popovertarget="filters">Filters</Button>

  <Popover id="filters" class="w-72">
    <section aria-labelledby="filters-title">
      <h2 id="filters-title" class="font-semibold">Visible records</h2>
      <p class="mt-1 text-sm text-gray-600">
        Choose which records appear in this view.
      </p>
      <label class="mt-4 flex items-center gap-3 text-sm">
        <input type="checkbox" checked class="size-4 accent-gray-950" />
        Active projects
      </label>
    </section>
  </Popover>
</template>
