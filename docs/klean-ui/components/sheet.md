---
title: Sheet
titleTemplate: Klean UI
description: A native off-canvas dialog for mobile navigation, comments, inspectors, and focused edge workflows across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanButton from '../../.vitepress/theme/components/klean/Button.vue'
import KleanSheet from '../../.vitepress/theme/components/klean/sheet/Sheet.vue'
import dialogSource from '../../.vitepress/theme/components/klean/dialog/Dialog.vue?raw'
import sheetSource from '../../.vitepress/theme/components/klean/sheet/Sheet.vue?raw'
import reactSource from '../sources/sheet/Sheet.jsx?raw'
import svelteSource from '../sources/sheet/Sheet.svelte?raw'
import vueUsage from '../snippets/sheet/usage.vue?raw'
import reactUsage from '../snippets/sheet/usage.jsx?raw'
import svelteUsage from '../snippets/sheet/usage.svelte?raw'
import leftNavigationSource from '../snippets/sheet/left-navigation.vue?raw'
import bottomCommentsSource from '../snippets/sheet/bottom-comments.vue?raw'

const open = ref(false)

const vueFiles = [
  {
    filename: 'Dialog.vue',
    destination: 'assets/js/components/ui/dialog/Dialog.vue',
    source: dialogSource
  },
  {
    filename: 'Sheet.vue',
    destination: 'assets/js/components/ui/sheet/Sheet.vue',
    source: sheetSource
  }
]
</script>

# Sheet

Sheet is one native off-canvas dialog. It gives a mobile navigation drawer,
comments thread, inspector, or focused form the same reliable modal behavior
without deciding what the application puts inside it.

The neutral default enters from the right. Ordinary Tailwind moves that same
component to the left or bottom. There is no `side`, `size`, `tone`, or product
variant API.

<KleanPreview id="sheet-source" :source="sheetSource" filename="Sheet.vue">
  <template #preview>
    <div class="grid w-full max-w-md justify-items-start gap-3">
      <KleanButton commandfor="docs-project-sheet" command="show-modal">
        Open project details
      </KleanButton>
      <p class="text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
        Sheet is {{ open ? 'open' : 'closed' }}.
      </p>
      <KleanSheet
        id="docs-project-sheet"
        v-model:open="open"
        aria-labelledby="docs-project-sheet-title"
        aria-describedby="docs-project-sheet-description"
      >
        <article class="grid h-full grid-rows-[auto_minmax(0,1fr)_auto]">
          <header class="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-5 dark:border-gray-800">
            <div>
              <p class="font-mono text-xs uppercase tracking-wider text-gray-500">Production</p>
              <h2 id="docs-project-sheet-title" class="mt-1 text-xl font-semibold">Project details</h2>
            </div>
            <KleanButton
              commandfor="docs-project-sheet"
              command="request-close"
              autofocus
              aria-label="Close project details"
              class="min-h-11 min-w-11 bg-transparent p-0 text-gray-600 hover:bg-gray-100 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <span aria-hidden="true" class="text-xl leading-none">×</span>
            </KleanButton>
          </header>
          <div class="overflow-y-auto px-5 py-6">
            <p id="docs-project-sheet-description" class="text-sm leading-6 text-gray-600 dark:text-gray-300">
              Inspect this service without leaving the deployment list.
            </p>
            <dl class="mt-7 grid gap-5 text-sm">
              <div><dt class="text-gray-500">Region</dt><dd class="mt-1 font-medium">Frankfurt</dd></div>
              <div><dt class="text-gray-500">Branch</dt><dd class="mt-1 font-mono">main</dd></div>
              <div><dt class="text-gray-500">Runtime</dt><dd class="mt-1 font-medium">Node.js 24</dd></div>
            </dl>
          </div>
          <footer class="border-t border-gray-200 px-5 py-4 dark:border-gray-800">
            <form method="dialog">
              <KleanButton type="submit" value="done" class="w-full">Done</KleanButton>
            </form>
          </footer>
        </article>
      </KleanSheet>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/sheet/Sheet.vue

  </template>
</KleanPreview>

## Installation

One command installs Dialog when it is missing, then copies the detected
framework's Sheet source into the conventional component directory:

<KleanInstallation
  id="sheet-installation"
  component="sheet"
  :source="sheetSource"
  filename="Sheet.vue"
  destination="assets/js/components/ui/sheet/Sheet.vue"
  :files="vueFiles"
  :dependencies="['tailwind-merge']"
/>

There is no provider, portal, focus-trap dependency, configuration file,
placement prop, or Klean runtime.

## When to use

Use Sheet for a modal surface attached to a viewport edge: mobile navigation,
comments on a narrow screen, contextual details, filters that need room, or a
focused supporting workflow that should not replace the current page.

## When not to use

Use [Dialog](/klean-ui/components/dialog) for a centered task or consequential
confirmation. Use [Popover](/klean-ui/components/popover) for an anchored
non-modal surface. A persistent desktop navigation rail is ordinary
`<aside>` and `<nav>` layout—not Sheet.

## Usage

### Vue

<CopyCode :code="vueUsage" label="ProjectDetails.vue" />

### React

<CopyCode :code="reactUsage" label="ProjectDetails.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ProjectDetails.svelte" />

The application supplies the heading, description, scroll region, actions,
and semantic content. Sheet supplies only the native modal and off-canvas
contract.

## API

| Purpose           | Vue            | React                   | Svelte            |
| ----------------- | -------------- | ----------------------- | ----------------- |
| Native target     | `id`           | `id`                    | `id`              |
| Open state        | `v-model:open` | `open`, `onOpenChange`  | `bind:open`       |
| Initial state     | `default-open` | `defaultOpen`           | `defaultOpen`     |
| Ambient dismissal | `dismissible`  | `dismissible`           | `dismissible`     |
| Styling           | `class`        | `className`             | `class`           |
| Native capability | component ref  | `HTMLDialogElement` ref | component binding |

Vue and Svelte expose `showModal()`, `close(returnValue)`, and
`requestClose(returnValue)`. React forwards the native Dialog ref. Prefer a
real Button with `commandfor` and `command`, plus native
`<form method="dialog">`, for ordinary opening and completion.

Every Sheet needs an accessible name. Point `aria-labelledby` at its visible
heading or provide `aria-label`. Add `aria-describedby` only when a short
description helps explain the surface.

## Native and durable behavior

Sheet composes Klean Dialog rather than duplicating its behavioral engine. The
browser puts the native `<dialog>` in the top layer, makes the background inert,
contains focus, and handles Escape. Klean preserves controlled or uncontrolled
state, backdrop policy, invoker focus return, scroll restoration, and clean
unmounting.

The open state is normally ephemeral. A route can decide whether the mobile
navigation is open, but navigation history should represent the destination,
not every drawer animation. Drafts and filters inside a Sheet remain
caller-owned state and follow the same persistence rules they would anywhere
else.

## Placement is Tailwind

The right edge is a useful neutral default. Move the component without a
placement prop:

- Left: replace right alignment with `left-0`, change the border edge, and use
  negative x translation.
- Bottom: use `bottom-0`, full width, auto height, and y translation.
- Responsive: use Tailwind breakpoints to move or resize the same surface.

The complete transform must cover both the closed and `starting:open` states so
entry and exit originate from the same edge. Caller classes win through
`tailwind-merge`.

## Slipway mobile navigation

Slipway's desktop rail stays in normal document layout. Only its narrow-screen
presentation is a Sheet. Both presentations can render the same application-owned
links, permissions, active state, and team context.

<KleanPreview id="sheet-slipway-navigation" :source="leftNavigationSource" filename="MobileNavigation.vue">
  <template #preview>
    <section class="w-full max-w-lg rounded-xl bg-gray-950 p-6 text-white">
      <p class="font-mono text-xs uppercase tracking-wider text-gray-400">Slipway / mobile</p>
      <h3 class="mt-3 text-lg font-semibold">Project navigation</h3>
      <p class="mt-2 text-sm leading-6 text-gray-400">The desktop Sidebar remains persistent. This modal presentation is for narrow screens.</p>
      <KleanButton commandfor="docs-slipway-sheet" command="show-modal" class="mt-6 bg-white text-gray-950 hover:bg-gray-200">
        Open navigation
      </KleanButton>
    </section>
    <KleanSheet
      id="docs-slipway-sheet"
      aria-labelledby="docs-slipway-sheet-title"
      class="right-auto left-0 mr-auto ml-0 w-72 -translate-x-full border-r border-l-0 bg-gray-50 open:translate-x-0 starting:open:-translate-x-full dark:bg-gray-950"
    >
      <header class="flex min-h-16 items-center justify-between px-4">
        <h2 id="docs-slipway-sheet-title" class="text-sm font-semibold">Slipway team</h2>
        <KleanButton commandfor="docs-slipway-sheet" command="request-close" autofocus aria-label="Close Slipway navigation" class="min-h-11 min-w-11 bg-transparent p-0 text-gray-600 hover:bg-gray-200 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800">
          <span aria-hidden="true" class="text-xl leading-none">×</span>
        </KleanButton>
      </header>
      <nav aria-label="Slipway" class="px-3 py-2">
        <ul class="grid gap-1 text-sm">
          <li><a href="#projects" aria-current="page" class="block min-h-11 rounded-md bg-gray-200 px-3 py-3 font-medium no-underline dark:bg-gray-800">Projects</a></li>
          <li><a href="#lookout" class="block min-h-11 rounded-md px-3 py-3 no-underline hover:bg-gray-200 dark:hover:bg-gray-800">Lookout</a></li>
          <li><a href="#settings" class="block min-h-11 rounded-md px-3 py-3 no-underline hover:bg-gray-200 dark:hover:bg-gray-800">Settings</a></li>
        </ul>
      </nav>
    </KleanSheet>
  </template>
</KleanPreview>

## Hagfish mobile comments

Hagfish uses the same contract as a bottom Sheet. The invoice thread, draft,
submission, and comment count remain ordinary Hagfish markup and state.

<KleanPreview id="sheet-hagfish-comments" :source="bottomCommentsSource" filename="InvoiceComments.vue">
  <template #preview>
    <section class="w-full max-w-lg rounded-none border-2 border-gray-950 bg-[#f7f3eb] p-6 text-gray-950 shadow-[5px_5px_0_#111]">
      <p class="font-mono text-xs uppercase tracking-wider text-gray-600">Hagfish / invoice</p>
      <h3 class="mt-3 text-lg font-semibold">Invoice comments</h3>
      <p class="mt-2 text-sm leading-6 text-gray-600">The compact discussion enters from the bottom without replacing the invoice.</p>
      <KleanButton commandfor="docs-hagfish-sheet" command="show-modal" class="mt-6 rounded-none border-2 border-gray-950 bg-gray-950 text-white hover:bg-white hover:text-gray-950">
        Open comments
      </KleanButton>
    </section>
    <KleanSheet
      id="docs-hagfish-sheet"
      aria-labelledby="docs-hagfish-sheet-title"
      class="inset-x-0 top-auto bottom-0 m-0 mt-auto h-auto max-h-[70dvh] w-full max-w-none translate-x-0 translate-y-full rounded-t-2xl border-x-2 border-t-2 border-b-0 border-gray-950 bg-white open:translate-y-0 starting:open:translate-x-0 starting:open:translate-y-full dark:border-white dark:bg-gray-950"
    >
      <div class="mx-auto mt-3 h-1 w-10 rounded-full bg-black/20 dark:bg-white/20" aria-hidden="true"></div>
      <header class="flex items-center justify-between px-4 py-3">
        <h2 id="docs-hagfish-sheet-title" class="text-sm font-bold">Comments <span class="ml-1 rounded-full bg-black/10 px-2 py-1 text-xs">3</span></h2>
        <KleanButton commandfor="docs-hagfish-sheet" command="request-close" autofocus aria-label="Close invoice comments" class="min-h-11 min-w-11 rounded-lg bg-transparent p-0 text-black/50 hover:bg-black/5 dark:bg-transparent dark:text-white/50 dark:hover:bg-white/5">
          <span aria-hidden="true" class="text-xl leading-none">×</span>
        </KleanButton>
      </header>
      <section aria-label="Invoice discussion" class="max-h-[50dvh] overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <article v-for="name in ['Ada', 'Kelvin', 'Grace']" :key="name" class="border-t border-black/10 py-4 text-sm dark:border-white/10">
          <strong>{{ name }}</strong>
          <p class="mt-1 text-black/60 dark:text-white/60">This invoice is ready for review.</p>
        </article>
      </section>
    </KleanSheet>
  </template>
</KleanPreview>

## Viewport, scrolling, and motion

- `h-dvh` follows the dynamic mobile viewport for the default full-height frame.
- Put scrolling on the content region, not the whole document.
- Bottom actions can use `env(safe-area-inset-bottom)` through ordinary Tailwind arbitrary values.
- Entry and exit use discrete display and overlay transitions with a short x-axis default.
- `prefers-reduced-motion` removes the transition automatically.
- Swipe-to-dismiss is not implied. Add gestures only when the application proves they do not conflict with scrolling, selection, or assistive technology.

## Styling

`class` or `className` merges after the neutral right-side frame. The component
also exposes `data-klean-sheet`, inherited `data-slot="dialog"`, and
`data-state="open|closed"` for application-owned selectors. Repeated product
treatments belong in a local wrapper or copied source, not a variant prop.

## Related components

- [Dialog](/klean-ui/components/dialog) — the native modal contract Sheet composes.
- [Popover](/klean-ui/components/popover) — an anchored non-modal surface.
- [Menu](/klean-ui/components/menu) — compact actions or destinations.
- [Button](/klean-ui/components/button) — native commands for opening and closing.
- Sidebar — persistent application navigation; its future mobile recipe can compose Sheet.

## Complete framework source

### Vue

<CopyCode :code="sheetSource" label="Sheet.vue" />

### React

<CopyCode :code="reactSource" label="Sheet.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="Sheet.svelte" />
