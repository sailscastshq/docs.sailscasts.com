<script setup>
import { Link, router } from '@inertiajs/vue3'
import RowActions from '@/components/ui/row-actions/RowActions.vue'

defineProps({ service: Object, busy: Boolean })

function redeploy(service) {
  router.post(
    `/services/${service.id}/deployments`,
    {},
    { preserveScroll: true }
  )
}
</script>

<template>
  <RowActions :label="`Actions for ${service.name}`" :busy="busy">
    <Link :href="`/services/${service.id}/logs`">Logs</Link>

    <template #menu>
      <Link :href="`/services/${service.id}/settings`">Settings</Link>
      <button type="button" @click="redeploy(service)">Redeploy</button>
      <button
        type="button"
        command="show-modal"
        :commandfor="`delete-${service.id}`"
      >
        Delete service
      </button>
    </template>
  </RowActions>
</template>
