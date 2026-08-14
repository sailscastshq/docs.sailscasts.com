<script>
  import Breadcrumb from '$lib/components/ui/breadcrumb/Breadcrumb.svelte'

  const items = [
    { label: 'Projects', href: '/' },
    { label: 'Slipway', href: '/projects/slipway' },
    { label: 'Settings' }
  ]
</script>

<Breadcrumb {items} />
