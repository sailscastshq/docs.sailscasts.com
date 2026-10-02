<script setup>
import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
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

const slots = useSlots()
const { copied, copyFailed, copy } = useClipboard()
const highlighted = ref('')
const resolvedLanguage = computed(
  () => props.language ?? inferCodeLanguage(props.label)
)
let highlightRequest = 0

async function updateHighlight() {
  const request = ++highlightRequest
  highlighted.value = ''
  if (slots.default) return

  try {
    const html = await highlightCode(props.code, resolvedLanguage.value)
    if (request === highlightRequest) highlighted.value = html
  } catch {
    if (request === highlightRequest) highlighted.value = ''
  }
}

onMounted(updateHighlight)
watch(() => [props.code, props.language, props.label], updateHighlight)
onBeforeUnmount(() => {
  highlightRequest += 1
})
</script>

<template>
  <figure class="copy-code">
    <figcaption>
      <span class="copy-code__label">{{ label }}</span>
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
    </figcaption>
    <div v-if="$slots.default" class="copy-code__highlighted">
      <slot />
    </div>
    <pre
      v-else
      tabindex="0"
      :aria-label="`${label} code`"
    ><code v-if="highlighted" v-html="highlighted"></code><code v-else>{{ code }}</code></pre>
    <p v-if="copyFailed" class="copy-code__error">
      Couldn’t copy. Select the code to copy it manually.
    </p>
    <p class="copy-code__status" role="status" aria-live="polite">
      {{
        copied
          ? `${label} copied to clipboard.`
          : copyFailed
            ? `Could not copy ${label.toLowerCase()}. Select the code to copy it manually.`
            : ''
      }}
    </p>
  </figure>
</template>

<style scoped>
.copy-code {
  position: relative;
  margin: 1rem 0 1.5rem;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.625rem;
  background: #171719;
  color: #f5f5f5;
}

.copy-code figcaption {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 0;
  border-bottom: 1px solid rgb(255 255 255 / 10%);
  padding: 0.25rem 0.5rem 0.25rem 1rem;
  color: #b4b4bb;
  font-family: var(--vp-font-family-mono);
  font-size: 0.6875rem;
}

.copy-code__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy-code pre,
.copy-code__highlighted :deep(pre) {
  max-height: 28rem;
  margin: 0;
  overflow: auto;
  padding: 1rem;
  background: transparent;
  color: inherit;
  font-size: 0.78125rem;
  line-height: 1.75;
  tab-size: 2;
}

.copy-code code,
.copy-code__highlighted :deep(code) {
  padding: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font-family: var(--vp-font-family-mono);
}

.copy-code__highlighted :deep(div[class*='language-']) {
  margin: 0;
  border-radius: 0;
  background: transparent;
}

.copy-code__highlighted :deep(.copy),
.copy-code__highlighted :deep(.lang) {
  display: none;
}

/* Native VitePress snippets have dual palettes. This surface is always dark. */
.copy-code__highlighted :deep(.vp-code span) {
  color: var(--shiki-dark, inherit);
}

.copy-code__button {
  display: inline-flex;
  min-height: 2.25rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  background: transparent;
  padding: 0 0.6rem;
  color: #c7c7ce;
  font-family: var(--vp-font-family-base);
  font-size: 0.6875rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 120ms ease,
    color 120ms ease;
}

.copy-code__button:hover {
  border-color: rgb(255 255 255 / 12%);
  background: rgb(255 255 255 / 6%);
  color: #fff;
}

.copy-code__button:focus-visible,
.copy-code pre:focus-visible,
.copy-code__highlighted :deep(pre:focus-visible) {
  outline: 2px solid #02b7ed;
  outline-offset: -2px;
}

.copy-code__button svg {
  width: 0.875rem;
  height: 0.875rem;
  stroke-width: 1.7;
}

.copy-code__error {
  margin: 0;
  border-top: 1px solid rgb(255 255 255 / 10%);
  padding: 0.75rem 1rem;
  color: #fecb05;
  font-size: 0.75rem;
  line-height: 1.5;
}

.copy-code__status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (pointer: coarse) {
  .copy-code__button {
    min-width: 2.75rem;
    min-height: 2.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .copy-code__button {
    transition: none;
  }
}
</style>
