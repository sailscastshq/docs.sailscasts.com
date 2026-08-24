---
title: Empty State
titleTemplate: Klean UI
description: One shallow empty-result layout with caller-owned semantic headings, truthful reasons, real next actions, and ordinary Tailwind across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import EmptyStateRecipes from '../../.vitepress/theme/components/klean/empty-state/EmptyStateRecipes.vue'
import emptyStateSource from '../../.vitepress/theme/components/klean/empty-state/EmptyState.vue?raw'
import reactSource from '../sources/empty-state/EmptyState.jsx?raw'
import svelteSource from '../sources/empty-state/EmptyState.svelte?raw'
import vueUsage from '../snippets/empty-state/usage.vue?raw'
import reactUsage from '../snippets/empty-state/usage.jsx?raw'
import svelteUsage from '../snippets/empty-state/usage.svelte?raw'
</script>

# Empty State

Empty State gives a valid surface a calm layout when it currently has nothing to show. The application writes the semantic heading, the specific reason, and the real next action. Klean does not hide those decisions behind component anatomy.

It is one component, not a family of `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, or `EmptyContent` wrappers. There is no media variant, action schema, loading prop, error prop, illustration package, or product copy.

<KleanPreview id="empty-state-products" :source="vueUsage" filename="ProjectsEmptyState.vue">
  <template #preview>
    <EmptyStateRecipes />
  </template>
  <template #caption>
    First use, filtered zero results, and different product voices share a layout boundary without becoming the same message.
  </template>
</KleanPreview>

## Installation

The command detects Vue, React, or Svelte and copies the matching one-file source into the conventional UI directory.

<KleanInstallation
  id="empty-state-installation"
  component="empty-state"
  :source="emptyStateSource"
  filename="EmptyState.vue"
  destination="assets/js/components/ui/empty-state/EmptyState.vue"
  :dependencies="['tailwind-merge']"
/>

There is no initializer, provider, `klean-ui.json`, class helper, barrel file, or runtime Klean dependency.

## Usage

Write the same ordinary document markup you would use without a component. Empty State supplies the surrounding layout and class-merging seam.

### Vue

<CopyCode :code="vueUsage" label="ProjectsEmptyState.vue" />

### React

<CopyCode :code="reactUsage" label="ProjectsEmptyState.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ProjectsEmptyState.svelte" />

## API

| Purpose          | Vue          | React       | Svelte             |
| ---------------- | ------------ | ----------- | ------------------ |
| Truthful element | `as`         | `as`        | `as`               |
| Content          | default slot | `children`  | `children` snippet |
| Root styling     | `class`      | `className` | `class`            |

`as` defaults to `div`, which adds no landmark or heading assumption. Pass `section`, `article`, or a framework component only when that element truthfully fits the surrounding document. Native attributes and events pass through unchanged.

There are no `title`, `description`, `icon`, or `actions` props. Those are content, and content should remain visible in the caller's markup.

## Name the reason

“Nothing here” is rarely enough. Tell the user which condition they are in and what can happen next.

- **First use:** “No projects yet” may offer a Create project Link.
- **Filtered zero:** “No records match ‘worker’” should offer Clear filters when possible.
- **Completed work:** “You are all caught up” may need no action.
- **Unavailable capability:** explain the prerequisite or authorized next destination rather than pretending the collection is merely empty.

Keep the title scannable and the description short. Do not reuse cheerful onboarding copy for a filtered search that found nothing.

## Loading, empty, and error are different

Render Empty State only after the request has succeeded and the valid surface is genuinely empty.

- While content is pending, preserve the region and use Spinner or the forthcoming Loading State composition.
- When the request failed, show a recoverable error with a truthful retry or navigation action.
- When stale content remains visible during a partial reload, do not replace it with Empty State.

This boundary prevents empty content from flashing during navigation and prevents failures from being mistaken for “zero records.”

## Links, buttons, and authorization

Use a native anchor or framework-native Inertia Link for destinations. Use a button for commands such as clearing filters or retrying a local derivation. Empty State never converts an action description into a callback.

Render only actions authorized by the current server response. If an action is unavailable, update the explanation too; hiding “Create project” while leaving “Get started by creating a project” is misleading.

## Keyboard and accessibility

- The root has no role or live region by default, so server-rendered empty content is not announced twice.
- The caller owns heading hierarchy. Use the heading level that fits the surrounding page or region.
- Name a `section` with `aria-labelledby` when it should be a discoverable region.
- Decorative icons use `aria-hidden="true"`; meaningful images receive useful alternative text.
- Links and buttons retain native focus, keyboard activation, and modified-click behavior.
- Dynamically appearing emptiness normally does not need interruption. Add a targeted status message only when the interaction genuinely requires an announcement.

## Styling with Tailwind

The baseline centers a wrapping column with comfortable space. `class` or `className` merges onto that root. Every icon, heading, description, Link, and button is caller markup styled with ordinary Tailwind.

Use classes such as `min-h-0 py-8` for a compact table state, a border and background for a card, or a larger minimum height for a page. There is no `variant`, `compact`, `fullPage`, `media`, `tone`, or product theme prop.

## When to use

Use Empty State when a successfully loaded collection, page, panel, table, or workflow has nothing meaningful to render and a short explanation helps the user understand why.

## When not to use

- Use [Spinner](/klean-ui/components/spinner) or preserve stale content while data is loading.
- Use [Alert](/klean-ui/components/alert) for important contextual guidance around content that still exists.
- Use [Toast](/klean-ui/components/toast) for transient feedback after an action.
- Use [Command](/klean-ui/components/command) or [Combobox](/klean-ui/components/combobox) built-in no-result content inside those interactions.
- Do not use an illustration-heavy first-use panel for a frequently repeated filtered-zero result.

## Complete framework source

### Vue

<CopyCode :code="emptyStateSource" label="EmptyState.vue" />

### React

<CopyCode :code="reactSource" label="EmptyState.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="EmptyState.svelte" />

## Related components

- [DataTable](/klean-ui/components/data-table) — owns the successfully loaded collection and selection around a table empty state.
- [Filter Bar](/klean-ui/components/filter-bar) — owns the committed filters that a filtered-zero action may clear.
- [Button](/klean-ui/components/button) — represents a caller-owned command such as clearing filters.
- [Card](/klean-ui/components/card) — can provide a visual surface around an Empty State without changing its meaning.
- [Spinner](/klean-ui/components/spinner) — communicates pending work instead of absent content.
- [Alert](/klean-ui/components/alert) — provides contextual warning or guidance when content still exists.
