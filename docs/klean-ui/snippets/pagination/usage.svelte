<script>
  import Pagination from '$lib/components/ui/pagination/Pagination.svelte'

  let { pagination } = $props()
</script>

<Pagination
  page={pagination.page}
  pages={pagination.totalPages}
  only={['projects', 'pagination']}
  aria-label="Project pages"
/>
