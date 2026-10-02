<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { components } from '../../kleanNavigation.mjs'

const { page } = useData()
const isKlean = computed(() => page.value.relativePath.startsWith('klean-ui/'))
const component = computed(() => {
  const slug = page.value.relativePath.match(
    /^klean-ui\/components\/([^/]+)\.md$/
  )?.[1]
  return components.find((item) => item.slug === slug)
})
</script>

<template>
  <DefaultTheme.Layout :class="{ 'klean-docs': isKlean }">
    <template #sidebar-nav-before>
      <div v-if="isKlean" class="klean-identity">
        <a href="/klean-ui/" class="klean-identity__name">
          <span class="klean-identity__mark" aria-hidden="true">k.</span>
          <span>Klean UI <small>By Sailscasts</small></span>
        </a>
        <p>Source you own. Tailwind you know.</p>
        <a class="klean-identity__browse" href="/klean-ui/components/">
          Browse components <span aria-hidden="true">↗</span>
        </a>
      </div>
    </template>
    <template #doc-before>
      <nav v-if="isKlean" class="klean-breadcrumb" aria-label="Breadcrumb">
        <a href="/klean-ui/">Klean UI</a>
        <span aria-hidden="true">/</span>
        <a v-if="component" href="/klean-ui/components/">{{
          component.category
        }}</a>
        <span v-else>{{
          page.title === 'Klean UI' ? 'Introduction' : page.title
        }}</span>
      </nav>
    </template>
    <template #aside-outline-after>
      <div v-if="isKlean" class="klean-aside-note">
        <span>Made to be yours</span>
        <p>
          Native Vue, React, and Svelte source. Appearance stays in your
          classes.
        </p>
        <a href="/klean-ui/doctrine"
          >The Klean approach <span aria-hidden="true">↗</span></a
        >
      </div>
    </template>
  </DefaultTheme.Layout>
</template>
