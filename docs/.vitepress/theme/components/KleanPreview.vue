<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useClipboard } from '../composables/useClipboard.js'
import previewStyles from '../klean.css?inline'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    default: 'Button.vue'
  }
})

const panels = [
  { id: 'preview', label: 'Preview' },
  { id: 'source', label: 'Source' }
]

const activePanel = ref('preview')
const tabRefs = ref([])
const previewHost = ref()
const previewTarget = ref()
const { copied, copyFailed, copy } = useClipboard()

let themeObserver

function extractPreviewStyles(source) {
  return [...source.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi)]
    .map(([, styles]) => styles.trim())
    .filter(Boolean)
    .join('\n')
}

function syncPreviewTheme() {
  previewTarget.value?.classList.toggle(
    'dark',
    document.documentElement.classList.contains('dark')
  )
}

onMounted(() => {
  const shadowRoot = previewHost.value.attachShadow({ mode: 'open' })
  const style = document.createElement('style')
  const stage = document.createElement('div')

  style.textContent = `${previewStyles}\n${extractPreviewStyles(props.source)}\n
    :host { display: block; }

    .klean-preview__stage {
      box-sizing: border-box;
      display: flex;
      min-height: 19rem;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 2rem;
    }

    @media (max-width: 480px) {
      .klean-preview__stage {
        min-height: 15rem;
        padding: 1.25rem;
      }
    }
  `
  stage.className = 'klean-preview__stage'
  shadowRoot.append(style, stage)
  previewTarget.value = stage
  syncPreviewTheme()

  themeObserver = new MutationObserver(syncPreviewTheme)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
})

function panelId(panel) {
  return `${props.id}-${panel}`
}

function tabId(panel) {
  return `${props.id}-${panel}-tab`
}

async function selectPanel(panel, focusTab = false) {
  activePanel.value = panel

  if (!focusTab) return

  await nextTick()
  tabRefs.value[panels.findIndex((item) => item.id === panel)]?.focus()
}

function handleTabKeydown(event, index) {
  let nextIndex

  if (event.key === 'ArrowRight') nextIndex = (index + 1) % panels.length
  else if (event.key === 'ArrowLeft')
    nextIndex = (index - 1 + panels.length) % panels.length
  else if (event.key === 'Home') nextIndex = 0
  else if (event.key === 'End') nextIndex = panels.length - 1
  else return

  event.preventDefault()
  selectPanel(panels[nextIndex].id, true)
}
</script>

<template>
  <figure class="klean-preview">
    <header class="klean-preview__toolbar">
      <div role="tablist" aria-label="Component example view">
        <button
          v-for="(panel, index) in panels"
          :id="tabId(panel.id)"
          :key="panel.id"
          :ref="(element) => (tabRefs[index] = element)"
          type="button"
          role="tab"
          :aria-selected="activePanel === panel.id"
          :aria-controls="panelId(panel.id)"
          :tabindex="activePanel === panel.id ? 0 : -1"
          @click="selectPanel(panel.id)"
          @keydown="handleTabKeydown($event, index)"
        >
          {{ panel.label }}
        </button>
      </div>

      <button
        v-if="activePanel === 'source'"
        type="button"
        class="klean-preview__copy"
        :aria-label="
          copied ? 'Source copied to clipboard' : 'Copy component source'
        "
        @click="copy(source)"
      >
        <svg
          v-if="!copied"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg
          v-else
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
        <span>{{ copied ? 'Copied' : 'Copy source' }}</span>
      </button>
      <span v-else class="klean-preview__filename">{{ filename }}</span>
    </header>

    <section
      v-show="activePanel === 'preview'"
      :id="panelId('preview')"
      role="tabpanel"
      :aria-labelledby="tabId('preview')"
      tabindex="0"
      class="klean-preview__panel"
    >
      <div ref="previewHost" class="klean-preview__canvas"></div>
      <Teleport v-if="previewTarget" :to="previewTarget">
        <slot name="preview" />
      </Teleport>
    </section>
    <section
      v-show="activePanel === 'source'"
      :id="panelId('source')"
      role="tabpanel"
      :aria-labelledby="tabId('source')"
      tabindex="0"
      class="klean-preview__panel klean-preview__source"
    >
      <p>{{ filename }}</p>
      <div v-if="$slots.source" class="klean-preview__highlighted">
        <slot name="source" />
      </div>
      <pre v-else tabindex="0"><code>{{ source }}</code></pre>
    </section>

    <figcaption v-if="$slots.caption">
      <slot name="caption" />
    </figcaption>

    <p class="klean-preview__status" role="status" aria-live="polite">
      {{
        copied
          ? `${filename} copied to clipboard.`
          : copyFailed
            ? 'Could not copy the source.'
            : ''
      }}
    </p>
  </figure>
</template>

<style scoped>
.klean-preview {
  margin: 1.5rem 0 2.75rem;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.875rem;
  background: var(--vp-c-bg);
}

.klean-preview__toolbar {
  display: flex;
  min-height: 3.25rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0 0.5rem 0 0.75rem;
}

.klean-preview__toolbar [role='tablist'] {
  display: flex;
  align-self: stretch;
}

.klean-preview__toolbar [role='tab'] {
  position: relative;
  min-width: 4.5rem;
  border: 0;
  background: transparent;
  padding: 0 0.75rem;
  color: var(--vp-c-text-2);
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
}

.klean-preview__toolbar [role='tab']::after {
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

.klean-preview__toolbar [role='tab'][aria-selected='true'] {
  color: var(--vp-c-text-1);
}

.klean-preview__toolbar [role='tab'][aria-selected='true']::after {
  transform: scaleX(1);
}

.klean-preview__toolbar [role='tab']:focus-visible,
.klean-preview__copy:focus-visible {
  outline: 2px solid var(--vp-c-text-2);
  outline-offset: 2px;
}

.klean-preview__filename {
  padding-right: 0.75rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
}

.klean-preview__copy {
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  gap: 0.4rem;
  border: 0;
  border-radius: 0.5rem;
  background: var(--vp-c-bg-soft);
  padding: 0 0.7rem;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.klean-preview__copy:hover {
  background: var(--vp-c-bg-mute);
}

.klean-preview__copy svg {
  width: 1rem;
  height: 1rem;
  stroke-width: 1.8;
}

.klean-preview__panel {
  margin: 0;
  outline: none;
}

.klean-preview__panel:focus-visible {
  box-shadow: inset 0 0 0 2px var(--vp-c-text-3);
}

.klean-preview__canvas {
  min-height: 19rem;
  background-color: var(--vp-c-bg-soft);
  background-image: radial-gradient(
    circle,
    var(--vp-c-divider) 0.7px,
    transparent 0.7px
  );
  background-size: 18px 18px;
}

.klean-preview__source {
  min-height: 19rem;
  background: var(--vp-code-block-bg);
  color: var(--vp-code-block-color);
}

.klean-preview__source > p {
  margin: 0;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
}

.klean-preview__source :deep(div[class*='language-']) {
  margin: 0;
  border-radius: 0;
  background: transparent;
}

.klean-preview__source :deep(.copy),
.klean-preview__source :deep(.lang) {
  display: none;
}

.klean-preview__source :deep(pre) {
  max-height: 34rem;
  margin: 0;
  overflow: auto;
  padding: 1.25rem;
  background: transparent;
  color: inherit;
  font-size: 0.78rem;
  line-height: 1.65;
}

.klean-preview__source :deep(code) {
  padding: 0;
  background: transparent;
  color: inherit;
}

.klean-preview figcaption {
  padding: 0.8rem 1rem;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
  line-height: 1.55;
}

.klean-preview__status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (max-width: 480px) {
  .klean-preview__toolbar {
    gap: 0.25rem;
  }

  .klean-preview__toolbar [role='tab'] {
    min-width: 4rem;
    padding: 0 0.5rem;
  }

  .klean-preview__filename {
    display: none;
  }

  .klean-preview__copy span {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .klean-preview__canvas {
    min-height: 15rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .klean-preview__toolbar [role='tab']::after {
    transition: none;
  }
}
</style>
