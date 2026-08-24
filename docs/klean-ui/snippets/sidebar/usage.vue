<script setup>
import { Link } from '@inertiajs/vue3'
import { ref } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import Sidebar from '@/components/ui/sidebar/Sidebar.vue'

const sidebar = ref()
const open = ref()
</script>

<div class="flex h-screen overflow-hidden">
  <Sidebar
    id="primary-navigation"
    ref="sidebar"
    aria-label="Project navigation"
    class="w-56 border-r data-[state=closed]:w-0 data-[state=closed]:opacity-0"
    @update:open="open = $event"
  >
    <nav aria-label="Workspace" class="w-56 p-3">
      <Link href="/" aria-current="page" class="block min-h-11 px-3 py-3">
        Projects
      </Link>
      <Link href="/lookout" class="block min-h-11 px-3 py-3">
        Lookout
      </Link>
    </nav>
  </Sidebar>

  <main class="min-w-0 flex-1">
    <Button
      type="button"
      aria-controls="primary-navigation"
      :aria-expanded="String(open)"
      @click="sidebar.toggle()"
    >
      {{ open ? 'Hide navigation' : 'Show navigation' }}
    </Button>
  </main>
</div>
