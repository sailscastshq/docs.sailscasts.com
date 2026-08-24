<script>
  import { Link, router } from '@inertiajs/svelte'
  import RowActions from '@/components/ui/row-actions/RowActions.svelte'

  let { service, busy = false } = $props()

  function redeploy() {
    router.post(
      `/services/${service.id}/deployments`,
      {},
      { preserveScroll: true }
    )
  }
</script>

{#snippet visibleActions()}
  <Link href={`/services/${service.id}/logs`}>Logs</Link>
{/snippet}

{#snippet overflowActions()}
  <Link href={`/services/${service.id}/settings`}>Settings</Link>
  <button type="button" onclick={redeploy}>Redeploy</button>
  <button
    type="button"
    command="show-modal"
    commandfor={`delete-${service.id}`}
  >
    Delete service
  </button>
{/snippet}

<RowActions
  label={`Actions for ${service.name}`}
  {busy}
  children={visibleActions}
  menu={overflowActions}
/>
