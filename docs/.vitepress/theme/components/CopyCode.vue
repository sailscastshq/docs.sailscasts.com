<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useClipboard } from '../composables/useClipboard.js'
import {
  highlightCode,
  inferCodeLanguage
} from '../composables/highlightCode.js'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Code'
  },
  language: {
    type: String,
    default: undefined
  }
})

const { copied, copyFailed, copy } = useClipboard()
const highlighted = ref('')
const resolvedLanguage = computed(
  () => props.language ?? inferCodeLanguage(props.label)
)
let highlightRequest = 0

async function updateHighlight() {
  const request = ++highlightRequest

  try {
    const html = await highlightCode(props.code, resolvedLanguage.value)
    if (request === highlightRequest) highlighted.value = html
  } catch {
    if (request === highlightRequest) highlighted.value = ''
  }
}

onMounted(updateHighlight)
watch(() => [props.code, props.language, props.label], updateHighlight)
</script>

<template>
  <figure class="copy-code">
    <figcaption>{{ label }}</figcaption>
    <pre
      tabindex="0"
    ><code v-if="highlighted" v-html="highlighted"></code><code v-else>{{ code }}</code></pre>
    <button
      type="button"
      class="copy-code__button"
      :aria-label="copied ? 'Copied to clipboard' : `Copy ${label}`"
      @click="copy(code)"
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
      <span>{{ copied ? 'Copied' : 'Copy' }}</span>
    </button>
    <p class="copy-code__status" role="status" aria-live="polite">
      {{
        copied
          ? `${label} copied to clipboard.`
          : copyFailed
            ? `Could not copy ${label.toLowerCase()}.`
            : ''
      }}
    </p>
  </figure>
</template>

<style scoped>
.copy-code {
  position: relative;
  margin: 1rem 0 2rem;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.75rem;
  background: #111;
  color: #f5f5f5;
}

.copy-code figcaption {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgb(255 255 255 / 12%);
  color: #a3a3a3;
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
}

.copy-code pre {
  margin: 0;
  overflow-x: auto;
  padding: 1.15rem 4.75rem 1.15rem 1rem;
  background: transparent;
  color: inherit;
  font-size: 0.8125rem;
  line-height: 1.65;
}

.copy-code code {
  padding: 0;
  background: transparent;
  color: inherit;
}

.copy-code__button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.4rem;
  border: 0;
  border-radius: 0.5rem;
  background: #262626;
  padding: 0 0.75rem;
  color: #f5f5f5;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 120ms ease,
    color 120ms ease;
}

.copy-code__button:hover {
  background: #404040;
}

.copy-code__button:focus-visible {
  outline: 2px solid #a3a3a3;
  outline-offset: 2px;
}

.copy-code__button svg {
  width: 1rem;
  height: 1rem;
  stroke-width: 1.8;
}

.copy-code__status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .copy-code__button {
    transition: none;
  }
}
</style>
