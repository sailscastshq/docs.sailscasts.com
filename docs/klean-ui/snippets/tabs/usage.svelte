<script>
  import Tabs from '$lib/components/ui/tabs/Tabs.svelte'

  let active = $state('overview')
</script>

<Tabs bind:value={active} aria-label="Project sections">
  <div class="flex gap-6 border-b">
    <button type="button" data-value="overview">Overview</button>
    <button type="button" data-value="activity">Activity</button>
  </div>

  <section data-value="overview">Project health and ownership.</section>
  <section data-value="activity">Recent deployments and changes.</section>
</Tabs>
