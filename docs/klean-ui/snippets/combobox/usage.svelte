<script>
  import Combobox from '$lib/components/ui/combobox/Combobox.svelte'

  let project = $state()
  const projects = [
    { value: 'slipway', label: 'Slipway', keywords: ['deployments'] },
    { value: 'hagfish', label: 'Hagfish', keywords: ['billing'] }
  ]
</script>

<label for="project">Project</label>
<Combobox id="project" bind:value={project} name="project" options={projects} />
