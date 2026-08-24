<script>
  import FilterBar from '$lib/components/ui/filter-bar/FilterBar.svelte'

  let filters = $state({ status: 'running' })
</script>

<FilterBar bind:value={filters}>
  {#snippet children(filter)}
    <label for="status" class="sr-only">Status</label>
    <select
      id="status"
      value={filter.draft.status ?? ''}
      onchange={(event) => filter.update('status', event.currentTarget.value)}
    >
      <option value="">Any status</option>
      <option value="running">Running</option>
      <option value="stopped">Stopped</option>
    </select>

    <button {...filter.applyProps}>Apply</button>
    <button {...filter.cancelProps}>Cancel</button>

    {#each filter.entries as [key, value] (key)}
      <button {...filter.removeProps(key)}>{key}: {value} ×</button>
    {/each}
  {/snippet}
</FilterBar>
