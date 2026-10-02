<script setup>
import { computed, ref } from 'vue'
import {
  componentGroups,
  components,
  filterComponents
} from '../../kleanNavigation.mjs'

const query = ref('')
const activeCategory = ref('All components')
const categories = [
  'All components',
  ...componentGroups.map((group) => group.title)
]
const filtered = computed(() =>
  filterComponents(query.value, activeCategory.value)
)

const groups = computed(() =>
  componentGroups
    .map((group) => ({
      ...group,
      items: filtered.value.filter((item) => item.category === group.title)
    }))
    .filter((group) => group.items.length)
)
function reset() {
  query.value = ''
  activeCategory.value = 'All components'
}
</script>

<template>
  <div class="klean-catalog">
    <div class="klean-catalog__search">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
      <label for="klean-component-search" class="klean-catalog__sr"
        >Find a component</label
      >
      <input
        id="klean-component-search"
        v-model="query"
        type="search"
        placeholder="Find a component…"
        autocomplete="off"
      />
      <span aria-hidden="true">{{ components.length }}</span>
    </div>
    <div class="klean-catalog__filters" aria-label="Component categories">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        :aria-pressed="activeCategory === category"
        @click="activeCategory = category"
      >
        {{ category }}
      </button>
    </div>
    <p class="klean-catalog__count" role="status">
      {{ filtered.length }}
      {{ filtered.length === 1 ? 'component' : 'components'
      }}{{ query.trim() ? ` matching “${query.trim()}”` : '' }}
    </p>
    <section
      v-for="group in groups"
      :key="group.title"
      class="klean-catalog__group"
      :aria-label="group.title"
    >
      <h2>
        {{ group.title }} <span>{{ group.items.length }}</span>
      </h2>
      <div class="klean-catalog__grid">
        <a
          v-for="item in group.items"
          :key="item.slug"
          :href="`/klean-ui/components/${item.slug}`"
          class="klean-catalog__card"
        >
          <span class="klean-catalog__title"
            >{{ item.name }} <span aria-hidden="true">↗</span></span
          >
          <span class="klean-catalog__description">{{ item.description }}</span>
        </a>
      </div>
    </section>
    <div v-if="!filtered.length" class="klean-catalog__empty">
      <p>No components match your search</p>
      <button type="button" @click="reset">Clear filters</button>
    </div>
  </div>
</template>

<style scoped>
.klean-catalog {
  margin-top: 28px;
}
.klean-catalog__search {
  display: flex;
  gap: 10px;
  align-items: center;
  min-height: 48px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0 14px;
  background: var(--vp-c-bg);
}
.klean-catalog__search:focus-within {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
.klean-catalog__search svg {
  width: 18px;
  height: 18px;
  stroke-width: 1.5;
  color: var(--vp-c-text-3);
}
.klean-catalog__search input {
  flex: 1;
  width: 0;
  outline: none !important;
  padding: 12px 0;
  font-size: 14px;
  color: var(--vp-c-text-1);
}
.klean-catalog__search > span {
  font: 11px var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
}
.klean-catalog__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 16px;
}
.klean-catalog__filters button {
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 6px 10px;
  min-height: 36px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.klean-catalog__filters button:hover {
  background: var(--vp-c-bg-soft);
}
.klean-catalog__filters button[aria-pressed='true'] {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-divider);
}
.klean-catalog .klean-catalog__count {
  margin: 16px 0 0;
  color: var(--vp-c-text-3);
  font-size: 12px;
}
.klean-catalog__group h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 28px 0 14px !important;
  font-size: 17px !important;
}
.klean-catalog__group h2 span {
  font: 11px var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
}
.klean-catalog__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.klean-catalog__card {
  display: block;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none !important;
  background: var(--vp-c-bg);
  transition:
    background 120ms ease,
    border-color 120ms ease;
}
.klean-catalog__card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}
.klean-catalog__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 600;
}
.klean-catalog__title > span {
  color: var(--vp-c-text-3);
  font-size: 15px;
  font-weight: 400;
}
.klean-catalog__description {
  display: block;
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.65;
  font-weight: 400;
}
.klean-catalog__empty {
  padding: 40px 20px;
  border: 1px dashed var(--vp-c-divider);
  margin-top: 24px;
  border-radius: 8px;
  text-align: center;
}
.klean-catalog__empty button {
  color: var(--vp-c-brand-1);
  font-size: 13px;
  text-decoration: underline;
}
.klean-catalog__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  clip-path: inset(50%);
  overflow: hidden;
}
@media (max-width: 520px) {
  .klean-catalog__grid {
    grid-template-columns: 1fr;
  }
  .klean-catalog__filters button {
    min-height: 40px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .klean-catalog__card {
    transition: none;
  }
}
</style>
