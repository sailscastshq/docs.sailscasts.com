<script>
  import Select from '$lib/components/ui/select/Select.svelte'

  let role = $state('viewer')
  const roles = [
    { value: 'viewer', label: 'Viewer' },
    { value: 'editor', label: 'Editor' },
    { value: 'administrator', label: 'Administrator' }
  ]
</script>

<label for="member-role">Member role</label>
<Select id="member-role" bind:value={role} name="role" options={roles} />
