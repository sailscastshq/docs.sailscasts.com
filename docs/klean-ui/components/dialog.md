---
title: Dialog
titleTemplate: Klean UI
description: A native modal dialog with durable dismissal, focus behavior, and application-owned semantic content.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanButton from '../../.vitepress/theme/components/klean/Button.vue'
import KleanDialog from '../../.vitepress/theme/components/klean/dialog/Dialog.vue'
import dialogSource from '../../.vitepress/theme/components/klean/dialog/Dialog.vue?raw'
import reactSource from '../sources/dialog/Dialog.jsx?raw'
import svelteSource from '../sources/dialog/Dialog.svelte?raw'
import vueUsage from '../snippets/dialog/usage.vue?raw'
import reactUsage from '../snippets/dialog/usage.jsx?raw'
import svelteUsage from '../snippets/dialog/usage.svelte?raw'
import productSource from '../snippets/dialog/products.vue?raw'

const result = ref('No choice yet.')

function recordResult(event) {
  result.value = event.target.returnValue || 'Dismissed'
}
</script>

# Dialog

Dialog is one native `<dialog>`, not a family of trigger, portal, overlay,
content, title, description, and action components. A real Button targets its
`id` with the platform's `command="show-modal"` relationship. The application
writes the truthful heading, description, form, actions, and Tailwind classes.

<KleanPreview id="dialog-source" :source="dialogSource" filename="Dialog.vue">
  <template #preview>
    <div class="grid justify-items-start gap-4">
      <KleanButton commandfor="docs-delete-project" command="show-modal">
        Delete project
      </KleanButton>
      <KleanDialog
        id="docs-delete-project"
        aria-labelledby="docs-delete-project-title"
        aria-describedby="docs-delete-project-description"
        @close="recordResult"
      >
        <h2 id="docs-delete-project-title" class="text-xl font-semibold">
          Delete this project?
        </h2>
        <p id="docs-delete-project-description" class="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
          This removes the project and its deployment history. This cannot be undone.
        </p>
        <form method="dialog" class="mt-6 flex justify-end gap-3">
          <KleanButton type="submit" value="cancel" autofocus class="bg-white text-gray-950 ring-1 ring-gray-300 hover:bg-gray-50 dark:bg-gray-950 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-900">
            Cancel
          </KleanButton>
          <KleanButton type="submit" value="delete" class="bg-red-700 text-white hover:bg-red-800">
            Delete project
          </KleanButton>
        </form>
      </KleanDialog>
      <output class="text-sm text-gray-600 dark:text-gray-400">{{ result }}</output>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/dialog/Dialog.vue

  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and installs the framework-native source:

<KleanInstallation
  id="dialog-installation"
  component="dialog"
  :source="dialogSource"
  filename="Dialog.vue"
  destination="assets/js/components/ui/dialog/Dialog.vue"
  :dependencies="['tailwind-merge']"
/>

There is no provider, portal, focus-trap package, trigger component,
configuration file, or Klean runtime.

## When to use

Use Dialog for a modal task, consequential confirmation, or focused interaction
that must make the page behind it inert.

## When not to use

Use [Popover](/klean-ui/components/popover) for non-modal content, [Menu](/klean-ui/components/menu)
for a compact action list, and [Toast](/klean-ui/components/toast) for feedback that
must not interrupt the current task.

## Usage

### Vue

<CopyCode :code="vueUsage" label="DeleteProject.vue" />

### React

<CopyCode :code="reactUsage" label="DeleteProject.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="DeleteProject.svelte" />

## Native contract

Opening with `showModal()` puts the element in the top layer. The browser owns
the inert background, modal focus containment, initial focus, Escape behavior,
and the native `<form method="dialog">` completion path. Klean adds controlled
state observation, exact invoker focus return, a `closedby` fallback, safe scroll
restoration, and caller-winning Tailwind defaults.

Every Dialog needs an accessible name. Point `aria-labelledby` at a visible
heading or provide `aria-label`. Use `aria-describedby` for a short description;
let longer structured content speak through its native headings and paragraphs.
Put `autofocus` on the safest initial action—usually Cancel for destructive work.

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
`requestClose(returnValue)`. React forwards the real `HTMLDialogElement`.
Prefer native commands and `<form method="dialog">` for ordinary opening and
completion; observe state only when application behavior genuinely needs it.

## Durable behavior

- Escape, platform close, and backdrop dismissal follow `dismissible`.
- The native dialog owns focus entry and containment. Klean remembers the exact
  external invoker for native-command, imperative, and controlled opening, then
  restores it after close when it is still connected.
- Background scroll returns to its previous value after close and unmount.
- Explicit completion remains available when ambient dismissal is disabled.
- Open state stays ephemeral unless the Dialog represents a shareable resource.
- No motion, product tone, or action layout is imposed by Klean.

## Product recipes

Hagfish and Slipway share the native modal contract while keeping their product language in visible Tailwind classes. The heading, consequence, safest initial action, and completion value remain ordinary application markup.

<KleanPreview id="dialog-products" :source="productSource" filename="product-dialogs.vue">
  <template #preview>
    <div class="grid w-full max-w-3xl gap-8 sm:grid-cols-2">
      <section class="bg-[#f7f3eb] p-8">
        <p class="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-black/60">
          Hagfish / invoice editor
        </p>
        <KleanButton commandfor="docs-delete-invoice" command="show-modal" class="rounded-lg border-2 border-black bg-black text-white hover:bg-white hover:text-black hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          Delete draft
        </KleanButton>
        <KleanDialog id="docs-delete-invoice" aria-labelledby="docs-delete-invoice-title" aria-describedby="docs-delete-invoice-description" class="max-w-md rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          <p class="text-xs font-medium uppercase tracking-wider text-red-700">Permanent action</p>
          <h2 id="docs-delete-invoice-title" class="mt-1 text-xl font-semibold">Delete this draft invoice?</h2>
          <p id="docs-delete-invoice-description" class="mt-4 text-sm leading-6 text-black/60">INV-1042 and its public link will be permanently removed.</p>
          <form method="dialog" class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <KleanButton type="submit" value="cancel" autofocus class="border-2 border-black bg-white text-black hover:bg-black hover:text-white">Cancel</KleanButton>
            <KleanButton type="submit" value="delete" class="border-2 border-red-700 bg-red-700 text-white hover:bg-white hover:text-red-700">Delete invoice</KleanButton>
          </form>
        </KleanDialog>
      </section>
      <section class="dark bg-gray-950 p-8 text-white">
        <p class="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-gray-400">Slipway / project settings</p>
        <KleanButton commandfor="docs-delete-slipway-project" command="show-modal" class="min-h-9 min-w-0 bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700">Delete project</KleanButton>
        <KleanDialog id="docs-delete-slipway-project" aria-labelledby="docs-delete-slipway-title" aria-describedby="docs-delete-slipway-description" class="max-w-sm border-gray-700 bg-gray-900 p-6 text-white shadow-xl">
          <h2 id="docs-delete-slipway-title" class="text-lg font-semibold">Delete project?</h2>
          <p id="docs-delete-slipway-description" class="mt-2 text-sm text-gray-400">Recovery data remains unless you choose to purge it.</p>
          <form method="dialog" class="mt-5 flex justify-end gap-3">
            <KleanButton type="submit" value="cancel" autofocus class="min-h-9 min-w-0 border border-gray-600 bg-transparent px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800">Cancel</KleanButton>
            <KleanButton type="submit" value="delete" class="min-h-9 min-w-0 bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700">Delete</KleanButton>
          </form>
        </KleanDialog>
      </section>
    </div>
  </template>
  <template #caption>
    Klean owns the modal behavior. Each app keeps its hierarchy, density, color, and action language at the call site.
  </template>
</KleanPreview>

## Complete framework source

### Vue

<CopyCode :code="dialogSource" label="Dialog.vue" />

### React

<CopyCode :code="reactSource" label="Dialog.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="Dialog.svelte" />

## Related components

- [Button](/klean-ui/components/button) — use native commands to open, close, or submit a Dialog.
- [Popover](/klean-ui/components/popover) — choose for non-modal content that leaves the page interactive.
- [Menu](/klean-ui/components/menu) — choose for a compact list of actions or destinations.
- [Toast](/klean-ui/components/toast) — report completion without interrupting the current task.
