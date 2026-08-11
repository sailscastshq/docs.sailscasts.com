<script>
  import Radio from '$lib/components/ui/radio/Radio.svelte'

  let region = $state('lagos')
</script>

<fieldset>
  <legend class="font-medium">Deployment region</legend>
  <label class="mt-3 flex cursor-pointer items-center gap-3">
    <Radio bind:group={region} name="region" value="lagos" required />
    Lagos
  </label>
  <label class="mt-3 flex cursor-pointer items-center gap-3">
    <Radio bind:group={region} name="region" value="frankfurt" required />
    Frankfurt
  </label>
</fieldset>
