<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import CopyCode from './CopyCode.vue'
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

const previewHost = ref()
const previewTarget = ref()
let themeObserver
let sourceStyle

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
  sourceStyle = document.createElement('style')
  sourceStyle.textContent = extractPreviewStyles(props.source)

  style.textContent = `${previewStyles}\n
    :host { display: block; }

    /* Tailwind's property registration lives outside the shadow tree. Keep
       borders faithful to the application without overriding caller utilities. */
    @layer base {
      .klean-preview__stage,
      .klean-preview__stage *,
      .klean-preview__stage::before,
      .klean-preview__stage::after,
      .klean-preview__stage *::before,
      .klean-preview__stage *::after {
        --tw-border-style: solid;
      }
    }

    .klean-preview__stage {
      box-sizing: border-box;
      display: flex;
      min-height: 12rem;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 2rem;
    }

    @media (max-width: 480px) {
      .klean-preview__stage {
        min-height: 10rem;
        padding: 1.5rem 1rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .klean-preview__stage *,
      .klean-preview__stage *::before,
      .klean-preview__stage *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `
  stage.className = 'klean-preview__stage'
  shadowRoot.append(style, sourceStyle, stage)
  previewTarget.value = stage
  syncPreviewTheme()

  themeObserver = new MutationObserver(syncPreviewTheme)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

watch(
  () => props.source,
  (source) => {
    if (sourceStyle) sourceStyle.textContent = extractPreviewStyles(source)
  }
)

onBeforeUnmount(() => {
  themeObserver?.disconnect()
})
</script>

<template>
  <figure :id="id" :aria-labelledby="`${id}-label`" class="klean-preview">
    <header class="klean-preview__toolbar">
      <span :id="`${id}-label`" class="klean-preview__title">Preview</span>
      <span class="klean-preview__runtime">
        <span aria-hidden="true" class="klean-preview__live-dot"></span>
        Live · Vue
      </span>
    </header>

    <div class="klean-preview__panel">
      <div ref="previewHost" class="klean-preview__canvas"></div>
      <Teleport v-if="previewTarget" :to="previewTarget">
        <slot name="preview" />
      </Teleport>
    </div>

    <div v-if="$slots.usage" class="klean-preview__usage">
      <div class="klean-preview__usage-label">Usage</div>
      <slot name="usage" />
    </div>

    <details class="klean-preview__source">
      <summary :aria-controls="`${id}-source-code`">
        <span class="klean-preview__source-action">
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
          >
            <path d="m6 4 4 4-4 4" />
          </svg>
          View source
        </span>
        <span class="klean-preview__filename">{{ filename }}</span>
      </summary>
      <div :id="`${id}-source-code`" class="klean-preview__source-code">
        <CopyCode :code="source" :label="filename">
          <template v-if="$slots.source" #default>
            <slot name="source" />
          </template>
        </CopyCode>
      </div>
    </details>

    <figcaption v-if="$slots.caption" class="klean-preview__caption">
      <slot name="caption" />
    </figcaption>
  </figure>
</template>

<style scoped>
.klean-preview {
  margin: 1.5rem 0 2.25rem;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.75rem;
  background: var(--vp-c-bg);
}

.klean-preview__toolbar {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0.5rem 1rem;
}

.klean-preview__title {
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  font-weight: 550;
}

.klean-preview__runtime {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--vp-c-text-2);
  font-size: 0.6875rem;
  line-height: 1.5;
}

.klean-preview__live-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}

.klean-preview__canvas {
  min-height: 12rem;
  background-color: var(--vp-c-bg);
  background-image: radial-gradient(
    circle,
    var(--vp-c-divider) 0.65px,
    transparent 0.65px
  );
  background-size: 16px 16px;
}

.klean-preview__caption {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
  line-height: 1.6;
}

.klean-preview__usage {
  border-top: 1px solid var(--vp-c-divider);
}

.klean-preview__usage-label {
  padding: 0.75rem 1rem 0;
  color: var(--vp-c-text-2);
  font-size: 0.6875rem;
  font-weight: 550;
}

.klean-preview__usage :deep(.vp-code-group),
.klean-preview__usage :deep(div[class*='language-']) {
  margin: 0;
  border: 0;
  border-radius: 0;
}

.klean-preview__usage :deep(.vp-code-group .tabs) {
  margin: 0;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.klean-preview__usage :deep(.vp-code-group .blocks) {
  border-top: 1px solid var(--vp-c-divider);
}

.klean-preview__usage :deep(pre) {
  max-height: 20rem;
}

.klean-preview__source {
  border-top: 1px solid var(--vp-c-divider);
}

.klean-preview__source > summary {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  list-style: none;
  cursor: pointer;
  transition:
    background-color 120ms ease,
    color 120ms ease;
}

.klean-preview__source > summary::-webkit-details-marker {
  display: none;
}

.klean-preview__source > summary:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.klean-preview__source > summary:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -3px;
}

.klean-preview__source-action {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.klean-preview__source-action svg {
  width: 0.875rem;
  height: 0.875rem;
  stroke-width: 1.5;
  transition: transform 120ms ease;
}

.klean-preview__source[open] .klean-preview__source-action svg {
  transform: rotate(90deg);
}

.klean-preview__filename {
  overflow: hidden;
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.klean-preview__source-code :deep(.copy-code) {
  margin: 0;
  border: 0;
  border-top: 1px solid var(--vp-c-divider);
  border-radius: 0;
}

@media (max-width: 480px) {
  .klean-preview__canvas {
    min-height: 10rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .klean-preview__source > summary,
  .klean-preview__source-action svg {
    transition: none;
  }
}
</style>
