<script>
  import Spinner from '$lib/components/ui/spinner/Spinner.svelte'

  let { loading = false } = $props()
</script>

<span role="status" aria-live="polite" aria-atomic="true">
  {#if loading}
    <Spinner class="size-4" />
    <span>Loading deployments…</span>
  {/if}
</span>
