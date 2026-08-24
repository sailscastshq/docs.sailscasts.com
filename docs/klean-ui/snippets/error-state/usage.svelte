<script>
  import ErrorState from '@/components/ui/error-state/ErrorState.svelte'
  import Button from '@/components/ui/button/Button.svelte'

  let { failed, retry } = $props()
</script>

{#if failed}
  <ErrorState role="alert" aria-labelledby="services-error-title">
    <h2 id="services-error-title">Services could not load</h2>
    <p>Slipway could not reach the deployment service.</p>
    <Button type="button" onclick={retry}>Try again</Button>
  </ErrorState>
{/if}
