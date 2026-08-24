<script>
  import { Link } from '@inertiajs/svelte'
  import Sidebar from '@/components/ui/sidebar/Sidebar.svelte'

  let sidebar
  let open
</script>

<div class="flex h-screen overflow-hidden">
  <Sidebar
    bind:this={sidebar}
    bind:open
    id="primary-navigation"
    aria-label="Project navigation"
    class="w-56 border-r data-[state=closed]:w-0 data-[state=closed]:opacity-0"
  >
    <nav aria-label="Workspace" class="w-56 p-3">
      <Link href="/" aria-current="page" class="block min-h-11 px-3 py-3">
        Projects
      </Link>
      <Link href="/lookout" class="block min-h-11 px-3 py-3">Lookout</Link>
    </nav>
  </Sidebar>

  <main class="min-w-0 flex-1">
    <button
      type="button"
      aria-controls="primary-navigation"
      aria-expanded={Boolean(open)}
      onclick={() => sidebar?.toggle()}
    >
      {open ? 'Hide navigation' : 'Show navigation'}
    </button>
  </main>
</div>
