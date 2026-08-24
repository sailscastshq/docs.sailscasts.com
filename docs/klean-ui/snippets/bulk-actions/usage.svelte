<script>
  import { Link, router } from '@inertiajs/svelte'
  import BulkActions from '@/components/ui/bulk-actions/BulkActions.svelte'

  let selectedIds = $state(['svc_01J9api', 'svc_01J9worker'])
  let processing = $state(false)

  function archiveSelected() {
    if (processing) return
    processing = true
    router.post(
      '/services/archive',
      { ids: selectedIds },
      { onFinish: () => (processing = false) }
    )
  }
</script>

{#snippet actions()}
  <Link href="/services/export">Export</Link>
  <button type="button" disabled={processing} onclick={archiveSelected}>
    Archive
  </button>
{/snippet}

<input
  type="checkbox"
  aria-label="Select all services on this page"
  data-bulk-actions-focus
/>
<BulkActions
  count={selectedIds.length}
  busy={processing}
  label="Actions for selected services"
  onclear={() => (selectedIds = [])}
  children={actions}
/>
