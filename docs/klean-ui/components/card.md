---
title: Card
titleTemplate: Klean UI
description: One shallow semantic surface with caller-owned native content, truthful navigation and actions, and ordinary Tailwind styling across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import { Link } from '@inertiajs/vue3'
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanButton from '../../.vitepress/theme/components/klean/Button.vue'
import KleanCard from '../../.vitepress/theme/components/klean/card/Card.vue'
import CardRecipes from '../../.vitepress/theme/components/klean/card/CardRecipes.vue'
import cardSource from '../../.vitepress/theme/components/klean/card/Card.vue?raw'
import reactSource from '../sources/card/Card.jsx?raw'
import svelteSource from '../sources/card/Card.svelte?raw'
import vueUsage from '../snippets/card/usage.vue?raw'
import reactUsage from '../snippets/card/usage.jsx?raw'
import svelteUsage from '../snippets/card/usage.svelte?raw'
import navigationSource from '../snippets/card/navigation.vue?raw'
import productSource from '../snippets/card/products.vue?raw'

const lastAction = ref('')

function keepPreview(event) {
  event.preventDefault()
}
</script>

# Card

Card is one shallow visual surface. It renders one element, puts no anatomy around your content, and lets the application choose what that element truthfully means.

Use native headings, paragraphs, figures, lists, links, buttons, headers, and footers inside it. Use ordinary Tailwind for the product design. Card does not turn content into a “card schema.”

<KleanPreview id="card-source" :source="cardSource" filename="Card.vue">
  <template #preview>
    <KleanCard as="article" aria-labelledby="docs-release-title" class="mx-auto max-w-lg">
      <header>
        <p class="m-0! text-xs text-gray-500 dark:text-gray-400">Production</p>
        <h2 id="docs-release-title" class="m-0! mt-1! text-lg font-semibold">API release</h2>
      </header>
      <p class="m-0! mt-3! leading-6 text-gray-600 dark:text-gray-300">
        Healthy in Lagos with three replicas.
      </p>
    </KleanCard>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/card/Card.vue

  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and writes the matching one-file source into the conventional component directory:

<KleanInstallation
  id="card-installation"
  component="card"
  :source="cardSource"
  filename="Card.vue"
  destination="assets/js/components/ui/card/Card.vue"
  :dependencies="['tailwind-merge']"
/>

There is no initializer, provider, `klean-ui.json`, class helper, barrel file, card anatomy package, or runtime Klean dependency.

## Usage

Choose the native element from what the content is, then write the markup directly.

### Vue

<CopyCode :code="vueUsage" label="ReleaseCard.vue" />

### React

<CopyCode :code="reactUsage" label="ReleaseCard.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ReleaseCard.svelte" />

## API

| Input                 | Default | Purpose                                                                                   |
| --------------------- | ------- | ----------------------------------------------------------------------------------------- |
| `as`                  | `div`   | Native element or framework component that truthfully describes the complete surface.     |
| `class` / `className` | —       | Ordinary Tailwind classes merged after the calm monochrome baseline.                      |
| native attributes     | —       | Destinations, IDs, ARIA relationships, events, test hooks, and native element attributes. |
| default content       | —       | Native application markup, slots, children, or snippets with no inserted wrapper.         |
| element reference     | —       | Framework-native access to the rendered surface when the application genuinely needs it.  |

There is no `variant`, `tone`, `interactive`, `clickable`, `shadow`, `radius`, `padding`, `size`, `header`, or status API. There is also no `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, or `CardFooter`.

Those names mostly repeat HTML and move Tailwind away from the element it styles.

## Choose the truthful element

Card is not a semantic element. Its content determines the element:

| Content or intent                                             | Choose                                       |
| ------------------------------------------------------------- | -------------------------------------------- |
| Pure layout grouping with no stronger meaning                 | default `div`                                |
| Self-contained item that makes sense on its own               | `as="article"`                               |
| Labelled part of the current page                             | `as="section"` plus its heading relationship |
| Tangential or supporting content                              | `as="aside"`                                 |
| One destination for the whole surface                         | real `a` or framework `Link`                 |
| One command performed by the whole surface                    | real `button`                                |
| Several links, buttons, fields, or other interactive controls | non-interactive Card with explicit controls  |

Do not use `article` merely because the result looks like a card. Use it only when the content passes the standalone test. A grid cell or decorative grouping can remain a `div`.

## Navigation and actions

One destination can own the whole surface. Multiple actions cannot.

<KleanPreview id="card-navigation" :source="navigationSource" filename="CardNavigation.vue">
  <template #preview>
    <div class="grid gap-6 lg:grid-cols-2">
      <KleanCard
        :as="Link"
        href="#deployment-1842"
        class="block cursor-pointer no-underline transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:hover:bg-gray-900 dark:focus-visible:outline-white"
        @click="keepPreview"
      >
        <h2 class="m-0! font-semibold">Deployment #1842</h2>
        <p class="m-0! mt-1! text-sm text-gray-500 dark:text-gray-400">main · a13e9c7</p>
      </KleanCard>
      <KleanCard as="article" aria-labelledby="docs-service-title">
        <h2 id="docs-service-title" class="m-0! font-semibold">API service</h2>
        <p class="m-0! mt-1! text-sm text-gray-500 dark:text-gray-400">Healthy · 3 replicas</p>
        <footer class="mt-5 flex items-center gap-3">
          <KleanButton type="button" class="min-h-9 min-w-0 px-3 py-1.5 text-xs" @click="lastAction = 'Deploy selected'">
            Deploy
          </KleanButton>
          <Link href="#service-settings" class="text-sm font-medium underline underline-offset-4" @click="keepPreview">
            Settings
          </Link>
        </footer>
      </KleanCard>
    </div>
    <p role="status" aria-live="polite" class="sr-only">{{ lastAction }}</p>
  </template>
</KleanPreview>

A whole-card Link preserves the URL, browser history, modified clicks, open-in-new-tab, focus, and keyboard activation. Pass the official Inertia Link directly through `as`; Card does not need a `link`, `router`, or `navigate` prop.

Never put a button, link, field, or menu trigger inside a Card that already renders as a link or button. Keep the outer Card non-interactive and make every child action explicit instead.

## Styling with Tailwind

The neutral Card is deliberately calm: one light border, white surface, ordinary foreground, moderate padding, and matching dark classes. Caller Tailwind merges after that baseline and can replace every part:

```vue
<Card
  as="article"
  class="rounded-none border-2 border-black bg-[#f7f3eb] p-8 text-black shadow-[6px_6px_0_0_#000] dark:bg-[#f7f3eb] dark:text-black"
>
  <!-- native product markup -->
</Card>
```

If a treatment repeats inside one application, make a small application-owned component or shared class recipe. Do not turn it into a Klean variant.

## Hagfish and Slipway recipes

These treatments are proof that one source can serve different products. They are not Klean themes.

<KleanPreview id="card-products" :source="productSource" filename="ProductCards.vue">
  <template #preview>
    <CardRecipes />
  </template>
  <template #caption>
    <span>Hagfish keeps multiple controls explicit on a non-interactive article. Slipway keeps a compact operational section. Neither expands the Card API.</span>
  </template>
</KleanPreview>

Hagfish's existing summary-card behavior—currency cycling, compact financial formatting, tooltips, and invoice filters—remains product logic around Card. Slipway's health state, deployment work, density, and dark application chrome remain Slipway logic.

## Accessibility

- Choose the native element before adding ARIA. Card supplies no role by default.
- Give every `section` or `aside` an accessible name through a visible heading and `aria-labelledby` when needed.
- Keep heading levels aligned with the page outline; Card never chooses a heading.
- Use a real anchor or framework Link for navigation and a real button for commands.
- Give a whole-card anchor or button a visible `focus-visible` treatment when caller classes replace the baseline.
- Keep interactive targets large enough and preserve readable contrast in caller-owned colors.
- Do not communicate status through color alone; pair dots and tones with visible words.
- Do not nest interactive content inside a whole-card link or button.

## Durable behavior

Card owns no client state. It does not remember selection, expansion, dismissal, filters, or a destination.

This is deliberate:

- a linked Card keeps its destination in markup and lets Inertia and the browser own history;
- filter and pagination state belongs in the URL when another visit should reproduce the same view;
- user preferences belong in durable storage only when they should survive visits;
- expansion belongs to the component that actually owns disclosure behavior;
- pending and server outcomes belong to the real button, form, Toast, or Alert that communicates the operation.

The same inputs produce the same server-rendered element. Card adds no mount-time state, storage read, event listener, or cleanup lifecycle.

## When to use

Use Card for a repeated visual boundary around self-contained summaries, linked resources, account panels, pricing choices, release notes, dashboard metrics, and compact operational groups.

Use it when the outer surface is genuinely shared while the content remains ordinary application markup.

## When not to use

- Use plain layout markup when a one-off `div` with spacing is clearer than introducing a component.
- Use [Alert](/klean-ui/components/alert) when the surface communicates guidance, an operation result, or an urgent failure.
- Use [Table](/klean-ui/components/table) when rows and columns describe comparable data relationships.
- Use [Dialog](/klean-ui/components/dialog) or [Popover](/klean-ui/components/popover) for an overlay with focus and dismissal behavior.
- Use [Button](/klean-ui/components/button) for an action without a card-sized content group.
- Do not use Card to hide finance formatting, data fetching, status maps, route construction, carousel behavior, or application state.

## Complete framework source

Copy, inspect, and change the complete one-file source for your framework.

### Vue source

<CopyCode :code="cardSource" label="Card.vue" />

### React source

<CopyCode :code="reactSource" label="Card.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Card.svelte" />

## Related components

- [Button](/klean-ui/components/button) — supplies truthful child actions or a whole-card button command.
- [Breadcrumb](/klean-ui/components/breadcrumb) and [Tabs](/klean-ui/components/tabs) — describe location and peer navigation outside card content.
- [Alert](/klean-ui/components/alert) — communicates guidance, status, or failure with explicit announcement semantics.
- [Table](/klean-ui/components/table) — preserves two-dimensional data instead of turning every row into a card.
- [Dialog](/klean-ui/components/dialog) and [Popover](/klean-ui/components/popover) — add native overlay and dismissal behavior when a surface must float.
