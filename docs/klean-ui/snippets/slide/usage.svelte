<script>
  import Slide from '@/components/ui/slide/Slide.svelte'

  let { ready = true } = $props()
  let deploying = $state(false)

  async function deploy() {
    deploying = true

    try {
      await fetch('/deployments', { method: 'POST' })
    } finally {
      deploying = false
    }
  }
</script>

<Slide
  pending={deploying}
  disabled={!ready}
  class="w-72"
  aria-describedby="deploy-help"
  onconfirm={deploy}
>
  {deploying ? 'Sliding to production…' : 'Slide to production'}
</Slide>
<p id="deploy-help">Release near the end to start deployment.</p>
