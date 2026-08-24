---
title: Error State
titleTemplate: Klean UI
description: One shallow failed-content layout with caller-owned semantics, truthful recovery, safe diagnostics, and ordinary Tailwind across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import ErrorStateRecipes from '../../.vitepress/theme/components/klean/error-state/ErrorStateRecipes.vue'
import errorStateSource from '../../.vitepress/theme/components/klean/error-state/ErrorState.vue?raw'
import reactSource from '../sources/error-state/ErrorState.jsx?raw'
import svelteSource from '../sources/error-state/ErrorState.svelte?raw'
import vueUsage from '../snippets/error-state/usage.vue?raw'
import reactUsage from '../snippets/error-state/usage.jsx?raw'
import svelteUsage from '../snippets/error-state/usage.svelte?raw'
</script>

# Error State

Error State gives a failed page or content region a calm layout for a truthful explanation and a safe way forward. The application writes the heading, copy, recovery controls, announcement semantics, focus behavior, and ordinary Tailwind.

It is one component, not a family of title, description, icon, action, or details wrappers. It does not catch exceptions, normalize errors, retry requests, move focus, navigate, log, or expose diagnostic data.

<KleanPreview id="error-state-apps" :source="vueUsage" filename="ServicesError.vue">
  <template #preview>
    <ErrorStateRecipes />
  </template>
  <template #caption>
    Slipway and Hagfish keep distinct product treatments, while a dynamically appearing failure opts into a native alert only when the caller needs it.
  </template>
</KleanPreview>

## Installation

The command detects Vue, React, or Svelte and copies the matching one-file source into the conventional UI directory.

<KleanInstallation
  id="error-state-installation"
  component="error-state"
  :source="errorStateSource"
  filename="ErrorState.vue"
  destination="assets/js/components/ui/error-state/ErrorState.vue"
  :dependencies="['tailwind-merge']"
/>

The examples also use [Button](/klean-ui/components/button). Add it separately with `npx klean-ui add button`, or use an existing native button or framework-native Link.

## Usage

Use native alert semantics only when a failure appears dynamically and warrants interruption. Static error pages should use ordinary page or section semantics so their heading is not announced twice.

### Vue

<CopyCode :code="vueUsage" label="ServicesError.vue" />

### React

<CopyCode :code="reactUsage" label="ServicesError.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ServicesError.svelte" />

## API

| Purpose          | Vue          | React       | Svelte             |
| ---------------- | ------------ | ----------- | ------------------ |
| Truthful element | `as`         | `as`        | `as`               |
| Content          | default slot | `children`  | `children` snippet |
| Root styling     | `class`      | `className` | `class`            |

`as` defaults to `div`. Native attributes and events pass through unchanged, including a caller-authored `role="alert"`, `aria-labelledby`, click handler, or data attribute.

There are no `title`, `description`, `icon`, `actions`, `details`, `message`, `error`, `retry`, `variant`, `tone`, `compact`, or `fullPage` props. Those decisions remain visible in application markup.

## Static pages and dynamic alerts

A server-rendered 403, 404, 419, 429, 500, or 503 page already has normal document reading order. Use `as="section"` with a real heading, but do not add an alert merely because the page describes an error.

When a previously usable region changes into a failure after a request, add `role="alert"` in caller markup if immediate announcement is warranted. Keep the explanation specific and provide recovery only when recovery is real.

Do not automatically focus Error State. If the control that started the request remains useful, keep it mounted. If a focused retry control disappears after success, deliberately restore focus to a stable control or the newly loaded region.

## Recovery stays durable

- Retry commands are native buttons and keep their application-owned request logic.
- Destinations are native anchors or framework-native Inertia Links, preserving modified clicks, history, and server-rendered fallbacks.
- Preserve safe stale content, filters, and form values when recovery does not require clearing them.
- Render only actions the current server response authorizes.
- Do not label a permanent denial or missing page as retryable.

Klean does not accept an action array or convert descriptions into callbacks. Recovery is ordinary markup that remains understandable without client-side adaptation.

## Safe diagnostics

The caller may add a native `<details>` element for diagnostics that are safe and genuinely useful to the current user. Never pass raw stack traces, provider responses, secrets, tokens, SQL, internal identifiers, or unsanitized HTML into a user-facing Error State.

Log private diagnostics through the application's normal observability path. User copy should explain what failed, what was preserved, and what can happen next.

## Error State is not every error

- Field validation stays beside its control and may be summarized with links to the invalid fields.
- [Alert](/klean-ui/components/alert) gives contextual guidance while the surrounding content still exists.
- [Toast](/klean-ui/components/toast) gives transient feedback after a mutation.
- An application error boundary catches rendering exceptions; Error State may be the boundary's caller-authored fallback, but does not implement the boundary.
- A deployment with a failed status is domain content, not necessarily a failed page or region.

This separation keeps the user's input intact and avoids turning every red message into the same interaction.

## Accessibility

- Use a heading level that fits the surrounding document.
- Name a region with `aria-labelledby` when it should be discoverable.
- Use `role="alert"` only for a newly appearing failure that needs interruption.
- Do not combine `role="alert"` with another live region that repeats the same message.
- Keep retry and navigation controls native and keyboard reachable.
- Preserve focus by default; move it only when the interaction has a clear destination.
- Decorative error icons use `aria-hidden="true"`.
- Write specific recovery copy. “Something went wrong” alone is not actionable.

## Styling with Tailwind

The neutral baseline centers a wrapping column with comfortable space. `class` or `className` merges onto the root. Every icon, heading, paragraph, Link, button, and details disclosure is caller markup styled with ordinary Tailwind.

Slipway can use a calm dark region, Hagfish can keep its sharp monochrome borders, and a status page can become a left-aligned editorial layout. There is no visual-variant API.

## When to use

Use Error State when a page or meaningful content region failed and the user needs an explanation, a safe recovery action, or an honest destination.

## When not to use

- Use [Loading State](/klean-ui/components/loading-state) while content is pending.
- Use [Empty State](/klean-ui/components/empty-state) after a successful request returns no content.
- Use [Alert](/klean-ui/components/alert) when important content still exists around the message.
- Use Field validation for input-specific errors.
- Use [Toast](/klean-ui/components/toast) for transient action feedback.

## Complete framework source

### Vue

<CopyCode :code="errorStateSource" label="ErrorState.vue" />

### React

<CopyCode :code="reactSource" label="ErrorState.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="ErrorState.svelte" />

## Related components

- [Loading State](/klean-ui/components/loading-state) — represents pending content before success or failure is known.
- [Empty State](/klean-ui/components/empty-state) — represents a successfully loaded surface with no content.
- [Alert](/klean-ui/components/alert) — gives contextual guidance without replacing the surrounding region.
- [Button](/klean-ui/components/button) — supplies a native caller-owned retry command.
- [Toast](/klean-ui/components/toast) — announces transient mutation feedback.
- [DataTable](/klean-ui/components/data-table) — may preserve safe rows while a refresh failure is explained.
