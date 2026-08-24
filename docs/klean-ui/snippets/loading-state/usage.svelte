<script>
  import LoadingState from '@/components/ui/loading-state/LoadingState.svelte'
  import Spinner from '@/components/ui/spinner/Spinner.svelte'
</script>

<section aria-busy="true" aria-labelledby="services-title">
  <h2 id="services-title">Services</h2>
  <LoadingState>
    <Spinner class="size-6" />
    <span>Loading services…</span>
  </LoadingState>
</section>
