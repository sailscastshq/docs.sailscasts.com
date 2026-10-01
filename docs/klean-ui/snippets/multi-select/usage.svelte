<script>
  import MultiSelect from '$lib/components/ui/multi-select/MultiSelect.svelte'
  let teams = $state([])
  const options = [
    { value: 'design', label: 'Design' },
    { value: 'support', label: 'Support' }
  ]
</script>

<label for="teams">Teams</label><MultiSelect
  id="teams"
  bind:value={teams}
  {options}
  name="teams"
  required
/>
