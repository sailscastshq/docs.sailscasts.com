<script>
  import Checkbox from '$lib/components/ui/checkbox/Checkbox.svelte'
  import DataTable from '$lib/components/ui/data-table/DataTable.svelte'

  let { services } = $props()
  let selected = $state([])
</script>

{#snippet content(table)}
  <caption class="caption-top px-4 py-3 text-left font-semibold">
    Production services
  </caption>
  <thead class="border-y border-gray-200 bg-gray-50 text-xs text-gray-600">
    <tr>
      <th scope="col" class="w-12 px-4 py-3">
        <Checkbox {...table.pageSelection()} />
      </th>
      <th scope="col" class="px-4 py-3 font-medium">Service</th>
      <th scope="col" class="px-4 py-3 font-medium">Status</th>
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-100">
    {#each services as service (service.id)}
      <tr>
        <td class="px-4 py-3">
          <Checkbox
            {...table.rowSelection(service, `Select ${service.name}`)}
          />
        </td>
        <th scope="row" class="px-4 py-3 font-medium">
          <a href={`/services/${service.id}`}>{service.name}</a>
        </th>
        <td class="px-4 py-3">{service.status}</td>
      </tr>
    {/each}
  </tbody>
{/snippet}

<DataTable
  rows={services}
  bind:selected
  class="rounded-lg border border-gray-200"
  tableClass="min-w-160"
  children={content}
/>
