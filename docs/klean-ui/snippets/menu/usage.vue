<script setup>
import Button from '~/components/ui/button/Button.vue'
import Menu from '~/components/ui/menu/Menu.vue'
</script>

<template>
  <Button popovertarget="project-actions">Actions</Button>

  <Menu id="project-actions" aria-label="Project actions" class="w-56">
    <button
      type="button"
      class="flex w-full cursor-pointer rounded px-3 py-2 text-left text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
    >
      Redeploy
    </button>
    <a
      href="/deployments"
      class="flex w-full rounded px-3 py-2 text-sm no-underline outline-none hover:bg-gray-100 focus:bg-gray-100"
    >
      View deployments
    </a>
  </Menu>
</template>
