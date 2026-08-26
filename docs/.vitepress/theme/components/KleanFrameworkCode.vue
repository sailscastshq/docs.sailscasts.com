<script setup>
import { nextTick, ref, toRef } from 'vue'
import { useKleanFramework } from '../composables/useKleanFramework.js'
import CopyCode from './CopyCode.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  frameworks: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: 'Framework example'
  }
})

const tabs = toRef(props, 'frameworks')
const tabRefs = ref([])
const { activeFramework, selectFramework } = useKleanFramework(tabs)

function tabId(framework) {
  return `${props.id}-${framework}-tab`
}

function panelId(framework) {
  return `${props.id}-${framework}-panel`
}

async function select(framework, focusTab = false) {
  selectFramework(framework)
  if (!focusTab) return

  await nextTick()
  tabRefs.value[
    props.frameworks.findIndex(({ id }) => id === framework)
  ]?.focus()
}

function handleKeydown(event, index) {
  let nextIndex

  if (event.key === 'ArrowRight') {
    nextIndex = (index + 1) % props.frameworks.length
  } else if (event.key === 'ArrowLeft') {
    nextIndex = (index - 1 + props.frameworks.length) % props.frameworks.length
  } else if (event.key === 'Home') nextIndex = 0
  else if (event.key === 'End') nextIndex = props.frameworks.length - 1
  else return

  event.preventDefault()
  select(props.frameworks[nextIndex].id, true)
}
</script>

<template>
  <div class="klean-framework-code">
    <div role="tablist" :aria-label="label">
      <button
        v-for="(framework, index) in frameworks"
        :id="tabId(framework.id)"
        :key="framework.id"
        :ref="(element) => (tabRefs[index] = element)"
        type="button"
        role="tab"
        :aria-selected="activeFramework === framework.id"
        :aria-controls="panelId(framework.id)"
        :tabindex="activeFramework === framework.id ? 0 : -1"
        @click="select(framework.id)"
        @keydown="handleKeydown($event, index)"
      >
        {{ framework.label }}
      </button>
    </div>

    <section
      v-for="framework in frameworks"
      v-show="activeFramework === framework.id"
      :id="panelId(framework.id)"
      :key="framework.id"
      role="tabpanel"
      :aria-labelledby="tabId(framework.id)"
      tabindex="0"
    >
      <CopyCode
        :code="framework.code"
        :label="framework.filename"
        :language="framework.language"
      />
    </section>
  </div>
</template>

<style scoped>
.klean-framework-code {
  margin: 1rem 0 2.75rem;
}

.klean-framework-code > [role='tablist'] {
  display: flex;
  width: fit-content;
  max-width: 100%;
  gap: 0.25rem;
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.65rem;
  background: var(--vp-c-bg-soft);
  padding: 0.25rem;
}

.klean-framework-code [role='tab'] {
  min-height: 2.5rem;
  border: 0;
  border-radius: 0.45rem;
  background: transparent;
  padding: 0 0.85rem;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

.klean-framework-code [role='tab']:hover {
  color: var(--vp-c-text-1);
}

.klean-framework-code [role='tab'][aria-selected='true'] {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 1px 2px rgb(0 0 0 / 8%);
}

.klean-framework-code [role='tab']:focus-visible,
.klean-framework-code [role='tabpanel']:focus-visible {
  outline: 2px solid var(--vp-c-text-2);
  outline-offset: 2px;
}

.klean-framework-code [role='tabpanel'] {
  outline: none;
}

.klean-framework-code :deep(.copy-code) {
  margin-top: 0.75rem;
  margin-bottom: 0;
}
</style>
