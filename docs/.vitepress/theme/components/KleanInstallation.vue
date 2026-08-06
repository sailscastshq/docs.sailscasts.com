<script setup>
import { computed, nextTick, ref } from 'vue'
import CopyCode from './CopyCode.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  component: {
    type: String,
    default: 'button'
  },
  filename: {
    type: String,
    default: 'Button.vue'
  },
  destination: {
    type: String,
    default: 'assets/js/components/ui/button/Button.vue'
  },
  files: {
    type: Array,
    default: undefined
  },
  dependencies: {
    type: Array,
    default: () => ['tailwind-merge']
  }
})

const methods = [
  { id: 'command', label: 'Command' },
  { id: 'manual', label: 'Manual' }
]

const packageManagers = computed(() => [
  {
    id: 'npm',
    label: 'npm',
    command: `npx klean-ui add ${props.component}`
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    command: `pnpm dlx klean-ui add ${props.component}`
  },
  {
    id: 'yarn',
    label: 'yarn',
    command: `yarn dlx klean-ui add ${props.component}`
  },
  {
    id: 'bun',
    label: 'bun',
    command: `bunx klean-ui add ${props.component}`
  }
])

const sourceFiles = computed(() =>
  props.files?.length
    ? props.files
    : [
        {
          filename: props.filename,
          destination: props.destination,
          source: props.source
        }
      ]
)

const dependencyCommand = computed(
  () => `npm install ${props.dependencies.join(' ')}`
)

const activeMethod = ref('command')
const activePackageManager = ref('npm')
const methodRefs = ref([])
const packageManagerRefs = ref([])

function methodTabId(method) {
  return `${props.id}-${method}-tab`
}

function methodPanelId(method) {
  return `${props.id}-${method}-panel`
}

function packageManagerTabId(packageManager) {
  return `${props.id}-${packageManager}-tab`
}

function packageManagerPanelId(packageManager) {
  return `${props.id}-${packageManager}-panel`
}

async function selectTab(value, refs, options, focusTab) {
  if (!focusTab) return

  await nextTick()
  refs.value[options.findIndex((option) => option.id === value)]?.focus()
}

function handleTabKeydown(event, index, options, activate) {
  let nextIndex

  if (event.key === 'ArrowRight') nextIndex = (index + 1) % options.length
  else if (event.key === 'ArrowLeft')
    nextIndex = (index - 1 + options.length) % options.length
  else if (event.key === 'Home') nextIndex = 0
  else if (event.key === 'End') nextIndex = options.length - 1
  else return

  event.preventDefault()
  activate(options[nextIndex].id, true)
}

function selectMethod(method, focusTab = false) {
  activeMethod.value = method
  selectTab(method, methodRefs, methods, focusTab)
}

function selectPackageManager(packageManager, focusTab = false) {
  activePackageManager.value = packageManager
  selectTab(packageManager, packageManagerRefs, packageManagers.value, focusTab)
}
</script>

<template>
  <div class="klean-installation">
    <div
      class="klean-installation__methods"
      role="tablist"
      aria-label="Installation method"
    >
      <button
        v-for="(method, index) in methods"
        :id="methodTabId(method.id)"
        :key="method.id"
        :ref="(element) => (methodRefs[index] = element)"
        type="button"
        role="tab"
        :aria-selected="activeMethod === method.id"
        :aria-controls="methodPanelId(method.id)"
        :tabindex="activeMethod === method.id ? 0 : -1"
        @click="selectMethod(method.id)"
        @keydown="handleTabKeydown($event, index, methods, selectMethod)"
      >
        {{ method.label }}
      </button>
    </div>

    <section
      v-if="activeMethod === 'command'"
      :id="methodPanelId('command')"
      role="tabpanel"
      :aria-labelledby="methodTabId('command')"
      tabindex="0"
      class="klean-installation__panel"
    >
      <p>
        Run one command from a Boring Stack application. Klean detects the
        framework and conventional destination, then adds the framework-native
        source and its direct dependencies.
      </p>

      <div
        class="klean-installation__packages"
        role="tablist"
        aria-label="Package manager"
      >
        <button
          v-for="(packageManager, index) in packageManagers"
          :id="packageManagerTabId(packageManager.id)"
          :key="packageManager.id"
          :ref="(element) => (packageManagerRefs[index] = element)"
          type="button"
          role="tab"
          :aria-selected="activePackageManager === packageManager.id"
          :aria-controls="packageManagerPanelId(packageManager.id)"
          :tabindex="activePackageManager === packageManager.id ? 0 : -1"
          @click="selectPackageManager(packageManager.id)"
          @keydown="
            handleTabKeydown(
              $event,
              index,
              packageManagers,
              selectPackageManager
            )
          "
        >
          {{ packageManager.label }}
        </button>
      </div>

      <div
        v-for="packageManager in packageManagers"
        v-show="activePackageManager === packageManager.id"
        :id="packageManagerPanelId(packageManager.id)"
        :key="packageManager.id"
        role="tabpanel"
        :aria-labelledby="packageManagerTabId(packageManager.id)"
        tabindex="0"
      >
        <CopyCode :code="packageManager.command" label="Terminal" />
      </div>

      <ul class="klean-installation__summary">
        <li>No initializer or configuration file</li>
        <li>No framework, alias, or theme questions</li>
        <li>No Klean runtime dependency</li>
      </ul>
    </section>

    <section
      v-else
      :id="methodPanelId('manual')"
      role="tabpanel"
      :aria-labelledby="methodTabId('manual')"
      tabindex="0"
      class="klean-installation__panel"
    >
      <ol class="klean-installation__steps">
        <li>
          <h3>Install direct dependencies</h3>
          <CopyCode :code="dependencyCommand" label="Terminal" />
        </li>
        <li v-for="file in sourceFiles" :key="file.destination">
          <h3>Copy {{ file.filename }}</h3>
          <CopyCode :code="file.source" :label="file.filename" />
          <CopyCode :code="file.destination" label="Destination" />
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.klean-installation {
  margin: 1.25rem 0 2.75rem;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.875rem;
  background: var(--vp-c-bg);
}

.klean-installation__methods {
  display: flex;
  min-height: 3.25rem;
  align-items: stretch;
  gap: 0.25rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0 0.75rem;
}

.klean-installation__methods button,
.klean-installation__packages button {
  position: relative;
  border: 0;
  background: transparent;
  color: var(--vp-c-text-2);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.klean-installation__methods button {
  min-width: 5.25rem;
  padding: 0 0.75rem;
  font-size: 0.8125rem;
}

.klean-installation__methods button::after {
  position: absolute;
  right: 0.75rem;
  bottom: -1px;
  left: 0.75rem;
  height: 2px;
  background: var(--vp-c-text-1);
  content: '';
  transform: scaleX(0);
  transition: transform 140ms ease;
}

.klean-installation__methods button[aria-selected='true'] {
  color: var(--vp-c-text-1);
}

.klean-installation__methods button[aria-selected='true']::after {
  transform: scaleX(1);
}

.klean-installation__panel {
  padding: 1.5rem;
  outline: none;
}

.klean-installation__panel:focus-visible {
  box-shadow: inset 0 0 0 2px var(--vp-c-text-3);
}

.klean-installation__panel > p {
  max-width: 42rem;
  margin: 0 0 1.25rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.klean-installation__packages {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.klean-installation__packages button {
  min-height: 2.5rem;
  border-radius: 0.5rem;
  padding: 0 0.8rem;
  font-size: 0.75rem;
}

.klean-installation__packages button:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.klean-installation__packages button[aria-selected='true'] {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.klean-installation__methods button:focus-visible,
.klean-installation__packages button:focus-visible {
  outline: 2px solid var(--vp-c-text-2);
  outline-offset: 2px;
}

.klean-installation__summary {
  display: grid;
  gap: 0.55rem;
  margin: 0.25rem 0 0;
  padding: 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  list-style: none;
}

.klean-installation__summary li::before {
  margin-right: 0.55rem;
  color: var(--vp-c-text-1);
  content: '✓';
}

.klean-installation__steps {
  display: grid;
  gap: 2rem;
  margin: 0;
  padding-left: 1.4rem;
}

.klean-installation__steps h3 {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: 0.95rem;
}

.klean-installation :deep(.copy-code) {
  margin-bottom: 0;
}

@media (max-width: 520px) {
  .klean-installation__panel {
    padding: 1rem;
  }

  .klean-installation__methods {
    padding: 0 0.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .klean-installation__methods button::after {
    transition: none;
  }
}
</style>
