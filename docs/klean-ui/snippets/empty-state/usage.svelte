<script>
  import { Link } from '@inertiajs/svelte'
  import EmptyState from '@/components/ui/empty-state/EmptyState.svelte'
</script>

<EmptyState as="section" aria-labelledby="projects-empty-title">
  <svg aria-hidden="true"><!-- Application icon --></svg>
  <div>
    <h2 id="projects-empty-title">No projects yet</h2>
    <p>Create your first project to deploy an application.</p>
  </div>
  <Link href="/projects/new">Create project</Link>
</EmptyState>
