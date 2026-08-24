<script setup>
import { ref } from 'vue'
import AppNavigation from '@/components/AppNavigation.vue'
import Button from '@/components/ui/button/Button.vue'
import Sheet from '@/components/ui/sheet/Sheet.vue'
import Sidebar from '@/components/ui/sidebar/Sidebar.vue'

const sidebar = ref()
const sheet = ref()
const desktopOpen = ref()
</script>

<div class="flex h-screen overflow-hidden">
  <Sidebar
    id="primary-navigation"
    ref="sidebar"
    aria-label="Project navigation"
    class="hidden w-56 border-r data-[state=closed]:w-0 md:block"
    @update:open="desktopOpen = $event"
  >
    <AppNavigation />
  </Sidebar>

  <main id="main-content" class="min-w-0 flex-1">
    <Button
      commandfor="mobile-navigation"
      command="show-modal"
      class="md:hidden"
    >
      Open navigation
    </Button>
    <Button
      type="button"
      class="hidden md:inline-flex"
      aria-controls="primary-navigation"
      :aria-expanded="String(desktopOpen)"
      @click="sidebar.toggle()"
    >
      {{ desktopOpen ? 'Hide navigation' : 'Show navigation' }}
    </Button>
    <slot />
  </main>

  <Sheet
    id="mobile-navigation"
    ref="sheet"
    aria-label="Project navigation"
    class="right-auto left-0 mr-auto ml-0 w-72 -translate-x-full border-r border-l-0 open:translate-x-0 starting:open:-translate-x-full md:hidden"
  >
    <AppNavigation @navigate="sheet.close()" />
  </Sheet>
</div>
