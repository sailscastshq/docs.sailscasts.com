<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useKleanFramework } from '../../../composables/useKleanFramework.js'
import { iconSource, icons } from './icons.js'

const frameworks = [
  { id: 'vue', label: 'Vue' },
  { id: 'react', label: 'React' },
  { id: 'svelte', label: 'Svelte' }
]

const query = ref('')
const size = ref(32)
const color = ref('#111827')
const copiedKey = ref('')
const copyStatus = ref('')
const frameworkRefs = ref([])
const urlReady = ref(false)
const { activeFramework, selectFramework } = useKleanFramework(frameworks)

let copyResetTimer

const activeFrameworkLabel = computed(
  () =>
    frameworks.find(({ id }) => id === activeFramework.value)?.label ?? 'Vue'
)

const filteredIcons = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return icons

  return icons.filter((icon) =>
    [icon.name, icon.description, ...icon.keywords]
      .join(' ')
      .toLowerCase()
      .includes(term)
  )
})

const resultSummary = computed(() => {
  const count = filteredIcons.value.length
  return `${count} ${count === 1 ? 'icon' : 'icons'}`
})

function syncQueryFromUrl() {
  query.value = new URL(window.location.href).searchParams.get('icons') ?? ''
}

function syncQueryToUrl(value) {
  const url = new URL(window.location.href)
  if (value.trim()) url.searchParams.set('icons', value.trim())
  else url.searchParams.delete('icons')
  window.history.replaceState(window.history.state, '', url)
}

onMounted(() => {
  syncQueryFromUrl()
  urlReady.value = true
  window.addEventListener('popstate', syncQueryFromUrl)
})

onBeforeUnmount(() => {
  clearTimeout(copyResetTimer)
  window.removeEventListener('popstate', syncQueryFromUrl)
})

watch(query, (value) => {
  if (urlReady.value) syncQueryToUrl(value)
})

async function chooseFramework(framework, focusButton = false) {
  selectFramework(framework)
  if (!focusButton) return

  await nextTick()
  frameworkRefs.value[
    frameworks.findIndex(({ id }) => id === framework)
  ]?.focus()
}

function handleFrameworkKeydown(event, index) {
  let nextIndex

  if (event.key === 'ArrowRight') nextIndex = (index + 1) % frameworks.length
  else if (event.key === 'ArrowLeft')
    nextIndex = (index - 1 + frameworks.length) % frameworks.length
  else if (event.key === 'Home') nextIndex = 0
  else if (event.key === 'End') nextIndex = frameworks.length - 1
  else return

  event.preventDefault()
  chooseFramework(frameworks[nextIndex].id, true)
}

async function copy(text, key, message) {
  copiedKey.value = ''
  copyStatus.value = ''

  try {
    await navigator.clipboard.writeText(text)
    copiedKey.value = key
    copyStatus.value = message
    clearTimeout(copyResetTimer)
    copyResetTimer = setTimeout(() => {
      copiedKey.value = ''
    }, 2000)
  } catch {
    copyStatus.value =
      'Could not copy. Select the source and copy it manually instead.'
  }
}

function copySvg(icon) {
  copy(icon.svg, `${icon.slug}-svg`, `${icon.name} SVG copied.`)
}

function copyComponent(icon) {
  copy(
    iconSource(icon, activeFramework.value),
    `${icon.slug}-${activeFramework.value}`,
    `${icon.name} ${activeFrameworkLabel.value} component copied.`
  )
}

function copyCommand(icon) {
  copy(
    `npx klean-ui add icon ${icon.slug}`,
    `${icon.slug}-command`,
    `${icon.name} installation command copied.`
  )
}
</script>

<template>
  <section class="icon-gallery" aria-labelledby="icon-gallery-title">
    <header class="icon-gallery__header">
      <div>
        <h2 id="icon-gallery-title">Icon catalog</h2>
        <p>
          Search by name or intent, then copy exactly the source your app needs.
        </p>
      </div>

      <div
        class="icon-gallery__frameworks"
        role="toolbar"
        aria-label="Component framework"
      >
        <button
          v-for="(framework, index) in frameworks"
          :key="framework.id"
          :ref="(element) => (frameworkRefs[index] = element)"
          type="button"
          :aria-pressed="activeFramework === framework.id"
          :tabindex="activeFramework === framework.id ? 0 : -1"
          @click="chooseFramework(framework.id)"
          @keydown="handleFrameworkKeydown($event, index)"
        >
          {{ framework.label }}
        </button>
      </div>
    </header>

    <form class="icon-gallery__controls" role="search" @submit.prevent>
      <label class="icon-gallery__search">
        <span>Search icons</span>
        <input
          v-model="query"
          type="search"
          name="icons"
          placeholder="Try calendar, delete, or deploy"
          autocomplete="off"
        />
      </label>

      <label class="icon-gallery__size">
        <span
          >Size <output for="icon-size">{{ size }}px</output></span
        >
        <input
          id="icon-size"
          v-model="size"
          type="range"
          min="16"
          max="48"
          step="1"
        />
      </label>

      <label class="icon-gallery__color">
        <span>Color</span>
        <input v-model="color" type="color" aria-label="Preview color" />
      </label>
    </form>

    <p class="icon-gallery__count" aria-live="polite">{{ resultSummary }}</p>

    <ul v-if="filteredIcons.length" class="icon-gallery__grid">
      <li v-for="icon in filteredIcons" :key="icon.slug">
        <article class="icon-gallery__card">
          <div class="icon-gallery__preview">
            <span
              class="icon-gallery__mark"
              aria-hidden="true"
              :style="{ color, fontSize: `${size}px` }"
              v-html="icon.svg"
            ></span>
          </div>

          <div class="icon-gallery__identity">
            <h3>{{ icon.name }}</h3>
            <p>{{ icon.description }}</p>
          </div>

          <div class="icon-gallery__actions">
            <button type="button" @click="copySvg(icon)">
              {{ copiedKey === `${icon.slug}-svg` ? 'Copied' : 'Copy SVG' }}
            </button>
            <button type="button" @click="copyComponent(icon)">
              {{
                copiedKey === `${icon.slug}-${activeFramework}`
                  ? 'Copied'
                  : `Copy ${activeFrameworkLabel}`
              }}
            </button>
            <button type="button" @click="copyCommand(icon)">
              {{
                copiedKey === `${icon.slug}-command` ? 'Copied' : 'Copy command'
              }}
            </button>
          </div>
        </article>
      </li>
    </ul>

    <div v-else class="icon-gallery__empty">
      <h3>No matching icons</h3>
      <p>Try a name such as “Bell” or an intent such as “notification”.</p>
      <button type="button" @click="query = ''">Show all icons</button>
    </div>

    <p class="icon-gallery__status" role="status" aria-live="polite">
      {{ copyStatus }}
    </p>
  </section>
</template>

<style scoped>
.icon-gallery {
  margin: 1.5rem 0 3rem;
}

.icon-gallery__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
}

.icon-gallery__header h2 {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: 1.4rem;
}

.icon-gallery__header p {
  max-width: 38rem;
  margin: 0.4rem 0 0;
  color: var(--vp-c-text-2);
}

.icon-gallery__frameworks {
  display: flex;
  flex: none;
  gap: 0.25rem;
  border-radius: 0.7rem;
  background: var(--vp-c-bg-soft);
  padding: 0.25rem;
}

.icon-gallery__frameworks button,
.icon-gallery__actions button,
.icon-gallery__empty button {
  min-height: 2.75rem;
  border: 0;
  border-radius: 0.5rem;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 650;
  cursor: pointer;
}

.icon-gallery__frameworks button {
  background: transparent;
  padding: 0 0.8rem;
  color: var(--vp-c-text-2);
}

.icon-gallery__frameworks button[aria-pressed='true'] {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
}

.icon-gallery__controls {
  display: grid;
  grid-template-columns: minmax(16rem, 1fr) minmax(10rem, 0.45fr) auto;
  gap: 1rem;
  align-items: end;
  margin-top: 1.5rem;
  border-radius: 0.9rem;
  background: var(--vp-c-bg-soft);
  padding: 1rem;
}

.icon-gallery__controls label {
  display: grid;
  gap: 0.45rem;
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  font-weight: 650;
}

.icon-gallery__search input {
  width: 100%;
  min-height: 2.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.6rem;
  background: var(--vp-c-bg);
  padding: 0 0.85rem;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 0.875rem;
}

.icon-gallery__size span {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.icon-gallery__size output {
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}

.icon-gallery__size input {
  min-height: 2.75rem;
  accent-color: var(--vp-c-text-1);
  cursor: pointer;
}

.icon-gallery__color input {
  width: 3rem;
  height: 2.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.6rem;
  background: var(--vp-c-bg);
  padding: 0.25rem;
  cursor: pointer;
}

.icon-gallery__count {
  margin: 1rem 0 0.75rem;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}

.icon-gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: 0.85rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.icon-gallery__card {
  display: grid;
  height: 100%;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.9rem;
  background: var(--vp-c-bg);
  padding: 0.75rem;
}

.icon-gallery__preview {
  display: grid;
  min-height: 8.5rem;
  place-items: center;
  border-radius: 0.65rem;
  background: #fff;
}

.icon-gallery__mark {
  display: grid;
  place-items: center;
  line-height: 1;
}

.icon-gallery__mark :deep(svg) {
  width: 1em;
  height: 1em;
}

.icon-gallery__identity {
  text-align: center;
}

.icon-gallery__identity h3 {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: 0.95rem;
}

.icon-gallery__identity p {
  margin: 0.35rem auto 0;
  color: var(--vp-c-text-2);
  font-size: 0.76rem;
  line-height: 1.45;
}

.icon-gallery__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem;
}

.icon-gallery__actions button {
  background: var(--vp-c-bg-soft);
  padding: 0 0.55rem;
  color: var(--vp-c-text-1);
}

.icon-gallery__actions button:last-child {
  grid-column: 1 / -1;
}

.icon-gallery__frameworks button:hover,
.icon-gallery__actions button:hover,
.icon-gallery__empty button:hover {
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.icon-gallery button:focus-visible,
.icon-gallery input:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.icon-gallery__empty {
  display: grid;
  min-height: 14rem;
  place-items: center;
  align-content: center;
  gap: 0.5rem;
  border-radius: 0.9rem;
  background: var(--vp-c-bg-soft);
  padding: 2rem;
  text-align: center;
}

.icon-gallery__empty h3,
.icon-gallery__empty p {
  margin: 0;
}

.icon-gallery__empty p {
  color: var(--vp-c-text-2);
}

.icon-gallery__empty button {
  margin-top: 0.5rem;
  background: var(--vp-c-bg-mute);
  padding: 0 0.85rem;
  color: var(--vp-c-text-1);
}

.icon-gallery__status {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (max-width: 760px) {
  .icon-gallery__header {
    align-items: stretch;
    flex-direction: column;
  }

  .icon-gallery__frameworks {
    width: fit-content;
  }

  .icon-gallery__controls {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .icon-gallery__search {
    grid-column: 1 / -1;
  }
}

@media (max-width: 420px) {
  .icon-gallery__controls {
    grid-template-columns: 1fr;
  }

  .icon-gallery__search {
    grid-column: auto;
  }

  .icon-gallery__color input {
    width: 100%;
  }
}
</style>
