---
title: Badge
titleTemplate: Klean UI
description: One static inline metadata span for visible labels, counts, and compact statuses, with caller-owned Tailwind across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanBadge from '../../.vitepress/theme/components/klean/badge/Badge.vue'
import KleanButton from '../../.vitepress/theme/components/klean/Button.vue'
import BadgeRecipes from '../../.vitepress/theme/components/klean/badge/BadgeRecipes.vue'
import badgeSource from '../../.vitepress/theme/components/klean/badge/Badge.vue?raw'
import reactSource from '../sources/badge/Badge.jsx?raw'
import svelteSource from '../sources/badge/Badge.svelte?raw'
import vueUsage from '../snippets/badge/usage.vue?raw'
import reactUsage from '../snippets/badge/usage.jsx?raw'
import svelteUsage from '../snippets/badge/usage.svelte?raw'
import notificationSource from '../snippets/badge/notification.vue?raw'
import productSource from '../snippets/badge/products.vue?raw'
</script>

# Badge

Badge is one static inline label for compact metadata: a visible status, count, plan, environment, version, or category. It renders a `span`, stays out of the tab order, and says nothing to assistive technology beyond its content unless the application deliberately supplies native ARIA attributes.

The Badge is never the action. When a count belongs to notifications, messages, or logs, the enclosing Button or Link owns the destination, interaction, focus, and complete accessible name.

<KleanPreview id="badge-source" :source="badgeSource" filename="Badge.vue">
  <template #preview>
    <div class="flex flex-wrap items-center justify-center gap-3">
      <KleanBadge>Draft</KleanBadge>
      <KleanBadge class="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
        <span aria-hidden="true" class="size-1.5 rounded-full bg-emerald-500"></span>
        Healthy
      </KleanBadge>
      <KleanBadge class="rounded-none bg-black font-mono text-white uppercase tracking-[0.15em] dark:bg-white dark:text-black">
        Pro
      </KleanBadge>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/badge/Badge.vue

  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and writes the matching one-file source into the conventional component directory:

<KleanInstallation
  id="badge-installation"
  component="badge"
  :source="badgeSource"
  filename="Badge.vue"
  destination="assets/js/components/ui/badge/Badge.vue"
  :dependencies="['tailwind-merge']"
/>

There is no initializer, provider, `klean-ui.json`, class helper, barrel file, variant package, or runtime Klean dependency.

## Usage

Write the visible meaning in the content and put the product treatment directly on Badge with Tailwind.

### Vue

<CopyCode :code="vueUsage" label="ServiceStatus.vue" />

### React

<CopyCode :code="reactUsage" label="ServiceStatus.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ServiceStatus.svelte" />

## API

| Input                  | Default | Purpose                                                                                  |
| ---------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `class` / `className`  | —       | Ordinary Tailwind classes merged after the neutral monochrome baseline.                  |
| native span attributes | —       | IDs, titles, ARIA attributes, data attributes, event hooks, and other native attributes. |
| default content        | —       | Visible text and optional ordinary inline markup.                                        |
| element reference      | —       | Framework-native access to the rendered `span` when the application genuinely needs it.  |

There is no `as`, `variant`, `severity`, `tone`, `status`, `color`, `size`, `pill`, or `removable` API. Badge always renders one `span` because its contract is static inline metadata.

If the content must navigate, use a real anchor or framework Link. If it must perform work, use a real Button. Put Badge inside that control only when the metadata belongs to the control.

## Notifications and counts

A notification Badge is useful, but it is still not a link or button. The parent control carries the complete accessible name, while the visual count is hidden from accessibility APIs so it is not announced twice.

<KleanPreview id="badge-notification" :source="notificationSource" filename="NotificationButton.vue">
  <template #preview>
    <KleanButton
      type="button"
      aria-label="Notifications, 3 unread"
      class="relative mx-auto size-11 min-h-0 min-w-0 rounded-full p-0"
    >
      <svg aria-hidden="true" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </svg>
      <KleanBadge
        aria-hidden="true"
        class="absolute -right-1 -top-1 min-w-5 justify-center border-white bg-red-600 px-1 text-[10px] text-white dark:border-gray-950 dark:bg-red-500"
      >
        3
      </KleanBadge>
    </KleanButton>
  </template>
</KleanPreview>

When terse text appears outside a completely labelled control, add context in the Badge content:

```vue
<p>
  Inbox
  <Badge>3 <span class="sr-only">unread messages</span></Badge>
</p>
```

## Styling with Tailwind

The default is deliberately neutral: a compact monochrome pill with a transparent high-contrast border. Caller classes can replace every visual choice.

```vue
<Badge
  class="rounded-none border-2 border-black bg-black px-3 py-1 font-mono text-[10px] font-bold text-white uppercase tracking-[0.18em]"
>
  Paid
</Badge>
```

Keep repeated status-to-class maps in the application, next to the domain values they describe. A financial product may distinguish draft, sent, and paid; an infrastructure product may distinguish healthy, deploying, and failed. Klean does not pretend those taxonomies are universal variants.

## Hagfish and Slipway recipes

The same Badge can keep Hagfish expressive and Slipway operational without teaching Klean either product's status model.

<KleanPreview id="badge-products" :source="productSource" filename="ProductBadges.vue">
  <template #preview>
    <BadgeRecipes />
  </template>
  <template #caption>
    <span>Hagfish owns invoice classes. Slipway owns service health and the surrounding logs button. The Badge remains one static span.</span>
  </template>
</KleanPreview>

## Accessibility

- Use visible words such as “Healthy,” “Paid,” or “Failed.” A dot or color alone does not carry meaning.
- Badge has no `role`, `aria-live`, or tab stop by default. Static page metadata must not announce itself like a new event.
- Add `sr-only` context when a terse count would otherwise be ambiguous.
- When Badge sits inside an already labelled Button or Link, use `aria-hidden="true"` if its content is already included in the parent's accessible name.
- For a non-urgent status that changes after an operation, keep the same Badge mounted with `role="status"`, `aria-live="polite"`, and `aria-atomic="true"`, then update its text. The live region must exist before the change.
- Use an Alert or existing page-level status region when the message needs more context than a compact label can hold.
- Let native forced-colors mode keep a visible boundary; do not remove the caller-visible text.

## Durable behavior

Badge owns no state and needs none. Counts, statuses, and labels come from server data or application state, so server rendering and the next visit reproduce the truth without a browser-only cache.

If a Badge appears inside navigation, the real anchor or Boring Stack Link owns the URL. If it appears in a notification button, the surrounding application owns unread state and the complete accessible name. Badge adds no storage, query parameter, event listener, or hydration decision.

## When to use

Use Badge for compact visible metadata beside or inside richer content: invoice state, service health, environment, plan, version, unread count, category, or a short feature label.

Use it when the text remains understandable at a glance and when the inline pill treatment improves scanning.

## When not to use

- Use plain text when the pill adds no useful scanning boundary.
- Use [Button](/klean-ui/components/button) for a command and a real anchor or Boring Stack Link for navigation.
- Use [Alert](/klean-ui/components/alert) for visible guidance, warnings, failures, or results that need explanatory content.
- Use [Toast](/klean-ui/components/toast) for a transient application event.
- Use [Tabs](/klean-ui/components/tabs) or [Menu](/klean-ui/components/menu) when a compact label is actually choosing or navigating.
- Do not use Badge as a removable tag. A future tags-input contract must own editing, keyboard removal, focus, and form state.

## Complete framework source

Copy, inspect, and change the complete one-file source for your framework.

### Vue source

<CopyCode :code="badgeSource" label="Badge.vue" />

### React source

<CopyCode :code="reactSource" label="Badge.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Badge.svelte" />

## Related components

- [Button](/klean-ui/components/button) — owns notification commands and other interactive Badge compositions.
- [Card](/klean-ui/components/card) and [Table](/klean-ui/components/table) — supply the richer content where compact metadata often appears.
- [Alert](/klean-ui/components/alert) — communicates guidance, results, warnings, and failures that need a real content surface.
- [Toast](/klean-ui/components/toast) — announces transient application events instead of turning a static Badge into a notification system.
- [Tooltip](/klean-ui/components/tooltip) — supplements a semantic control when its visible label cannot carry enough context.
