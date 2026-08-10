<script>
  import Button from '$lib/components/ui/button/Button.svelte'
  import Tooltip from '$lib/components/ui/tooltip/Tooltip.svelte'
</script>

<Tooltip text="Re-run query">
  <Button type="button" aria-label="Re-run query" class="size-10 min-h-0 p-0">
    <RefreshIcon aria-hidden="true" />
  </Button>
</Tooltip>
