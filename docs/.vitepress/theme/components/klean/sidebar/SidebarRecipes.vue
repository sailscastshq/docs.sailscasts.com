<script setup>
import { ref } from 'vue'
import KleanButton from '../Button.vue'
import KleanSheet from '../sheet/Sheet.vue'
import KleanSidebar from './Sidebar.vue'

const active = ref('projects')
const desktopOpen = ref(true)
const desktopSidebar = ref()
const mobileSheet = ref()
const items = [
  { value: 'projects', label: 'Projects', icon: '▣' },
  { value: 'deployments', label: 'Deployments', icon: '↗' },
  { value: 'lookout', label: 'Lookout', icon: '◉' },
  { value: 'settings', label: 'Settings', icon: '⌘' }
]

function navigate(value) {
  active.value = value
  mobileSheet.value?.close()
}
</script>

<template>
  <div
    class="flex h-[34rem] w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-white"
  >
    <a
      href="#docs-sidebar-main"
      class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:px-4 focus:py-3 focus:text-gray-950"
      >Skip to content</a
    >

    <KleanSidebar
      id="docs-primary-sidebar"
      ref="desktopSidebar"
      :remember="false"
      aria-label="Slipway navigation"
      class="hidden w-52 border-r border-gray-200 bg-gray-50 data-[state=closed]:w-0 data-[state=closed]:opacity-0 dark:border-gray-800 dark:bg-gray-950 md:block"
      @update:open="desktopOpen = $event"
    >
      <div class="flex h-full w-52 flex-col">
        <header class="flex min-h-16 items-center gap-3 px-4">
          <span
            class="grid size-8 place-items-center rounded-lg bg-gray-950 text-xs font-bold text-white dark:bg-white dark:text-gray-950"
            >S</span
          >
          <div class="min-w-0">
            <strong class="block truncate text-sm">Slipway Labs</strong>
            <span class="block text-xs text-gray-500">Production</span>
          </div>
        </header>
        <nav
          aria-label="Workspace"
          class="min-h-0 flex-1 overflow-y-auto px-3 py-3"
        >
          <ul class="grid gap-1 text-sm">
            <li v-for="item in items" :key="item.value">
              <a
                :href="`#docs-${item.value}`"
                :aria-current="active === item.value ? 'page' : undefined"
                :class="[
                  'flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 no-underline transition-colors',
                  active === item.value
                    ? 'bg-gray-200 font-medium text-gray-950 dark:bg-gray-800 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
                ]"
                @click="navigate(item.value)"
              >
                <span
                  aria-hidden="true"
                  class="grid size-5 place-items-center text-xs"
                  >{{ item.icon }}</span
                >
                <span>{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </KleanSidebar>

    <main
      id="docs-sidebar-main"
      tabindex="-1"
      class="min-w-0 flex-1 overflow-y-auto"
    >
      <header
        class="flex min-h-16 items-center gap-3 border-b border-gray-200 px-4 dark:border-gray-800"
      >
        <KleanButton
          commandfor="docs-mobile-navigation"
          command="show-modal"
          aria-label="Open navigation"
          class="min-h-10 min-w-10 bg-transparent p-0 text-gray-700 hover:bg-gray-100 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-900 md:hidden"
        >
          <span aria-hidden="true">☰</span>
        </KleanButton>
        <KleanButton
          type="button"
          aria-controls="docs-primary-sidebar"
          :aria-expanded="String(desktopOpen)"
          :aria-label="desktopOpen ? 'Hide navigation' : 'Show navigation'"
          class="hidden min-h-10 min-w-10 bg-transparent p-0 text-gray-700 hover:bg-gray-100 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-900 md:inline-flex"
          @click="desktopSidebar.toggle()"
        >
          <span aria-hidden="true">◫</span>
        </KleanButton>
        <div class="min-w-0">
          <p class="truncate text-xs text-gray-500">Projects</p>
          <h2 class="truncate text-sm font-semibold">Sailscasts API</h2>
        </div>
      </header>
      <div class="p-5 sm:p-7">
        <h3 class="text-2xl font-semibold tracking-tight">Services</h3>
        <p
          class="mt-2 max-w-lg text-sm leading-6 text-gray-600 dark:text-gray-400"
        >
          The page stays ordinary and the current destination remains a real
          link.
        </p>
        <div class="mt-6 grid gap-3 xl:grid-cols-2">
          <article
            v-for="service in ['web', 'worker']"
            :key="service"
            class="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
          >
            <div class="flex items-center justify-between gap-3">
              <strong class="text-sm">{{ service }}</strong>
              <span class="size-2 rounded-full bg-emerald-500"
                ><span class="sr-only">Running</span></span
              >
            </div>
            <p class="mt-4 font-mono text-xs text-gray-500">
              fra · node 24 · main
            </p>
          </article>
        </div>
      </div>
    </main>

    <KleanSheet
      id="docs-mobile-navigation"
      ref="mobileSheet"
      aria-labelledby="docs-mobile-navigation-title"
      class="right-auto left-0 mr-auto ml-0 w-72 -translate-x-full border-r border-l-0 bg-gray-50 open:translate-x-0 starting:open:-translate-x-full dark:bg-gray-950 md:hidden"
    >
      <div class="flex h-full flex-col">
        <header class="flex min-h-16 items-center justify-between px-4">
          <h2 id="docs-mobile-navigation-title" class="text-sm font-semibold">
            Slipway Labs
          </h2>
          <KleanButton
            commandfor="docs-mobile-navigation"
            command="request-close"
            autofocus
            aria-label="Close navigation"
            class="min-h-10 min-w-10 bg-transparent p-0 text-gray-600 hover:bg-gray-200 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <span aria-hidden="true">×</span>
          </KleanButton>
        </header>
        <nav
          aria-label="Workspace"
          class="min-h-0 flex-1 overflow-y-auto px-3 py-3"
        >
          <ul class="grid gap-1 text-sm">
            <li v-for="item in items" :key="item.value">
              <a
                :href="`#docs-mobile-${item.value}`"
                :aria-current="active === item.value ? 'page' : undefined"
                :class="[
                  'flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 no-underline',
                  active === item.value
                    ? 'bg-gray-200 font-medium dark:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900'
                ]"
                @click="navigate(item.value)"
              >
                <span
                  aria-hidden="true"
                  class="grid size-5 place-items-center text-xs"
                  >{{ item.icon }}</span
                >
                <span>{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </KleanSheet>
  </div>
</template>
