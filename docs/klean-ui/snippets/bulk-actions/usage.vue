<script setup>
import { Link, router } from '@inertiajs/vue3'
import { ref } from 'vue'
import BulkActions from '@/components/ui/bulk-actions/BulkActions.vue'

const selectedIds = ref(['svc_01J9api', 'svc_01J9worker'])
const processing = ref(false)

function archiveSelected() {
  if (processing.value) return
  processing.value = true
  router.post(
    '/services/archive',
    { ids: selectedIds.value },
    { onFinish: () => (processing.value = false) }
  )
}
</script>

<template>
  <input
    type="checkbox"
    aria-label="Select all services on this page"
    data-bulk-actions-focus
  />

  <BulkActions
    :count="selectedIds.length"
    :busy="processing"
    label="Actions for selected services"
    @clear="selectedIds = []"
  >
    <Link href="/services/export">Export</Link>
    <button type="button" :disabled="processing" @click="archiveSelected">
      Archive
    </button>
  </BulkActions>
</template>
