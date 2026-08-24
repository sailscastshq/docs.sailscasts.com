---
title: Loading State
titleTemplate: Klean UI
description: One truthful pending-content status layout with caller-owned busy regions, request state, useful copy, skeleton markup, and Tailwind across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import LoadingStateRecipes from '../../.vitepress/theme/components/klean/loading-state/LoadingStateRecipes.vue'
import loadingStateSource from '../../.vitepress/theme/components/klean/loading-state/LoadingState.vue?raw'
import reactSource from '../sources/loading-state/LoadingState.jsx?raw'
import svelteSource from '../sources/loading-state/LoadingState.svelte?raw'
import vueUsage from '../snippets/loading-state/usage.vue?raw'
import reactUsage from '../snippets/loading-state/usage.jsx?raw'
import svelteUsage from '../snippets/loading-state/usage.svelte?raw'
</script>

# Loading State

Loading State gives pending content one calm, useful status surface. The application marks the region that is busy, names the work in plain language, and decides whether to show a product mark, caller-written skeletons, or content that is already useful.

It is one component. There is no request prop, timer, data-fetching hook, skeleton component, visual variant, full-page mode, or product copy hidden behind its API.

<KleanPreview id="loading-state-apps" :source="vueUsage" filename="ServicesLoading.vue">
  <template #preview>
    <LoadingStateRecipes />
  </template>
  <template #caption>
    An initial load, a caller-shaped skeleton, and a refresh that preserves useful rows share the same truthful status contract.
  </template>
</KleanPreview>

## Installation

The command detects Vue, React, or Svelte and copies the matching one-file source into the conventional UI directory.

<KleanInstallation
  id="loading-state-installation"
  component="loading-state"
  :source="loadingStateSource"
  filename="LoadingState.vue"
  destination="assets/js/components/ui/loading-state/LoadingState.vue"
  :dependencies="['tailwind-merge']"
/>

The examples also use [Spinner](/klean-ui/components/spinner). Add it separately with `npx klean-ui add spinner`, or place an application-owned mark or skeleton inside Loading State.

## Usage

Put `aria-busy` on the region whose content is changing. Loading State provides the persistent polite status; the caller supplies useful words and optional visuals.

### Vue

<CopyCode :code="vueUsage" label="ServicesLoading.vue" />

### React

<CopyCode :code="reactUsage" label="ServicesLoading.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ServicesLoading.svelte" />

## API

| Purpose        | Vue          | React           | Svelte             |
| -------------- | ------------ | --------------- | ------------------ |
| Content        | default slot | `children`      | `children` snippet |
| Root styling   | `class`      | `className`     | `class`            |
| Element access | template ref | forwarded `ref` | component binding  |

Native `div` attributes and events pass through. The root remains a polite, atomic status so the same content is not accidentally made assertive by styling code.

There are no `loading`, `delay`, `promise`, `skeleton`, `title`, `description`, `variant`, `tone`, `compact`, `fullPage`, `retry`, or `cancel` props. Request state, timing, content, and recovery stay visible in application code.

## Loading State, Spinner, and skeletons

- **Loading State** is the semantic and layout boundary for pending content.
- **Spinner** is an optional decorative mark inside a button or Loading State.
- **Skeletons** describe the shape of one application's content, so write them as ordinary caller markup inside Loading State.

Spinner alone does not name the work. A skeleton alone should be hidden from assistive technology and paired with useful status text. Loading State can contain either, both, or neither.

## Initial loads and refreshes

For the first load, it is reasonable for Loading State to occupy the content region. Keep the region's heading available and mark that region busy.

For a refresh, preserve content that is still useful. Place a compact Loading State beside the region heading and keep the existing rows, chart, or summary readable until the new response arrives. This avoids destructive flicker and retains context during Inertia partial reloads.

The application decides when pending work starts and ends. Loading State does not delay its appearance or invent a minimum duration; those decisions depend on the real request and whether stale content is safe.

## Accessibility

- The root is a persistent `role="status"` with polite, atomic announcements.
- Put `aria-busy="true"` on the affected button, form, table region, or section—not on an unrelated page wrapper.
- Write specific text such as “Loading invoices…” or “Refreshing deployments…”.
- Hide decorative spinners and skeleton shapes from assistive technology.
- Respect reduced motion on caller-authored skeleton animation with `motion-reduce:animate-none`.
- Do not move focus when loading begins or ends. Preserve the control or content context the user already has.
- When a submission failure needs immediate attention, use a contextual error surface rather than changing Loading State into an alert.

## Styling with Tailwind

The baseline is a centered, wrapping column with a useful minimum height. `class` or `className` merges onto the root, so applications can create compact refresh text, a full content-region loader, or a left-aligned skeleton with ordinary Tailwind.

The visual content remains caller markup. Slipway can keep its animated Slippy mark, Hagfish can keep its sharp invoice skeletons, and neither product treatment becomes a Klean prop.

## When to use

Use Loading State when a named region is waiting for content or refreshing existing content and a visible, accessible status will help the user understand what is happening.

## When not to use

- Use [Spinner](/klean-ui/components/spinner) directly inside a pending button when the button text already names the work.
- Use [Empty State](/klean-ui/components/empty-state) only after a request succeeds and there is genuinely nothing to show.
- Use [Alert](/klean-ui/components/alert) for contextual warnings or recoverable failures.
- Use [Toast](/klean-ui/components/toast) for transient feedback after an action completes.
- Use native `<progress>` when meaningful progress can be measured.

## Complete framework source

### Vue

<CopyCode :code="loadingStateSource" label="LoadingState.vue" />

### React

<CopyCode :code="reactSource" label="LoadingState.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="LoadingState.svelte" />

## Related components

- [Spinner](/klean-ui/components/spinner) — supplies an optional decorative loading mark.
- [Empty State](/klean-ui/components/empty-state) — represents a successfully loaded surface with no content.
- [DataTable](/klean-ui/components/data-table) — can preserve rows and expose a compact refresh status.
- [Button](/klean-ui/components/button) — owns truthful pending and disabled state for commands.
- [Alert](/klean-ui/components/alert) — communicates a warning or recoverable failure instead of pending work.
- [Toast](/klean-ui/components/toast) — announces transient completion feedback.
