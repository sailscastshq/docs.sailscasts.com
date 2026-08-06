---
title: Popover
titleTemplate: Klean UI
description: A native-first Klean UI floating surface with durable dismissal, focus return, and collision-aware positioning.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanButton from '../../.vitepress/theme/components/klean/Button.vue'
import KleanPopover from '../../.vitepress/theme/components/klean/popover/Popover.vue'
import popoverSource from '../../.vitepress/theme/components/klean/popover/Popover.vue?raw'
import usageSource from '../snippets/popover/usage.vue?raw'
import observedSource from '../snippets/popover/observed.vue?raw'
import productSource from '../snippets/popover/products.vue?raw'

const observedOpen = ref(false)
</script>

# Popover

Popover is Klean UI's non-modal floating surface. The browser owns top-layer display, the native `popovertarget` relationship, light dismissal, and Escape behavior. Klean fills the remaining gaps: collision-aware placement, an older-browser fallback, reliable focus return, and framework-native observable state.

The application owns the truthful content and every visual decision. There is no `PopoverTrigger`, `asChild`, `triggerClass`, visual variant, provider, or theme object.

<KleanPreview id="popover-source" :source="popoverSource" filename="Popover.vue">
  <template #preview>
    <KleanButton popovertarget="docs-filters-popover">
      Filters
      <svg
        aria-hidden="true"
        class="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="m7 10 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </KleanButton>
    <KleanPopover id="docs-filters-popover" class="w-72">
      <section aria-labelledby="docs-filters-title">
        <h2 id="docs-filters-title" class="font-semibold">Visible records</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
          Choose which records appear in this view.
        </p>
        <label class="mt-4 flex items-center gap-3 text-sm">
          <input type="checkbox" checked class="size-4 accent-gray-950" />
          Active projects
        </label>
        <KleanButton
          popovertarget="docs-filters-popover"
          popovertargetaction="hide"
          class="mt-5 w-full"
        >
          Done
        </KleanButton>
      </section>
    </KleanPopover>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/popover/Popover.vue

  </template>
  <template #caption>
    This preview runs inside an isolated Shadow DOM root. The native relationship,
    Tailwind source, top-layer rendering, dismissal, and collision handling remain
    intact.
  </template>
</KleanPreview>

## Installation

Run the same command in Vue, React, or Svelte. Klean detects the framework and conventional destination, writes one source file, and installs its direct dependencies.

<KleanInstallation
  id="popover-installation"
  component="popover"
  :source="popoverSource"
  filename="Popover.vue"
  destination="assets/js/components/ui/popover/Popover.vue"
  :dependencies="['@floating-ui/dom', 'tailwind-merge']"
/>

`@floating-ui/dom` performs geometry only: logical placement, collision flipping, viewport shifting, and position updates. It is not a component runtime or styling system.

## Usage

<CopyCode :code="usageSource" label="usage.vue" />

`popovertarget` and `id` are native HTML. A native button works too:

```html
<button type="button" popovertarget="filters">Filters</button>
```

Use a real button because opening interface content is an action. An anchor remains navigation and should not become a Popover invoker merely because it can be styled like a button.

## API

| Input                  | Default        | Purpose                                                                                  |
| ---------------------- | -------------- | ---------------------------------------------------------------------------------------- |
| `id`                   | generated      | Native target identifier. Supply a stable value when a button invokes the Popover.       |
| `placement`            | `bottom-start` | Preferred logical placement. It may flip or shift to remain visible.                     |
| `offset`               | `8`            | Pixel distance between the invoker and surface.                                          |
| framework open binding | uncontrolled   | Observe or control visibility only when application behavior genuinely needs it.         |
| `defaultOpen`          | `false`        | Initial uncontrolled state, useful for composition and testing.                          |
| `class` / `className`  | —              | Ordinary Tailwind classes merged last on the surface.                                    |
| default content        | —              | Ordinary semantic application markup with framework-native access to `open` and `close`. |

Vue uses `v-model:open`, React uses `open` with `onOpenChange`, and Svelte uses `bind:open`. The native uncontrolled relationship remains the default in every framework.

Placement and offset describe geometry, not appearance. Popover has no `variant`, `tone`, `size`, `radius`, `elevation`, or animation props.

## Closing the surface

Prefer the native close action when a button only dismisses the surface:

```vue
<Button popovertarget="filters" popovertargetaction="hide">Done</Button>
```

Use the framework-native `close` value when an application action already runs code:

```vue
<Popover id="filters" v-slot="{ close }">
  <Button @click="applyFilters(); close()">Apply</Button>
</Popover>
```

Escape and explicit dismissal return focus to the connected invoker. Outside pointer dismissal leaves focus with the element the person selected instead of moving it unexpectedly.

## Observable, never persisted

Most Popovers need no application state. Observe visibility only when another part of the interface truly responds to it.

<KleanPreview id="popover-observed" :source="observedSource" filename="observed.vue">
  <template #preview>
    <div class="grid justify-items-start gap-3">
      <KleanButton popovertarget="docs-observed-popover">
        Inspect filters
      </KleanButton>
      <KleanPopover
        id="docs-observed-popover"
        v-model:open="observedOpen"
        class="w-64"
      >
        <p class="text-sm leading-6">
          Observe visibility only when another part of the application needs it.
        </p>
      </KleanPopover>
      <p aria-live="polite" class="text-sm text-gray-600 dark:text-gray-400">
        Popover is {{ observedOpen ? 'open' : 'closed' }}.
      </p>
    </div>
  </template>
  <template #caption>
    Open state is ephemeral. Never write it to local storage, session storage,
    cookies, server data, or the URL. Persist a meaningful filter selection when
    required—not the temporary surface visibility.
  </template>
</KleanPreview>

## Popover is not every overlay

- **Popover** is a generic non-modal surface. It leaves content in ordinary document tab order and assigns no role.
- **Menu** composes this foundation with `menu` and `menuitem` semantics, arrow keys, Home/End, and typeahead.
- **Dialog** is modal. It uses native dialog behavior, labeling, focus containment, and an inert background.
- **Tooltip** describes a control on hover or focus and follows a different trigger and dismissal contract.

Do not add `role="menu"` merely because a Popover contains several links or buttons. A list, navigation region, form, heading, or group of ordinary buttons is usually more truthful.

## Product recipes

Hagfish's share surface and Slipway's operational filters need the same interaction behavior but intentionally different visual language. Their Tailwind stays visible at the call site.

<KleanPreview id="popover-products" :source="productSource" filename="product-popovers.vue">
  <template #preview>
    <div class="grid w-full max-w-2xl gap-8 sm:grid-cols-2">
      <div class="bg-[#f4f0e8] p-6">
        <p class="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-gray-600">
          Hagfish / share
        </p>
        <KleanButton
          popovertarget="docs-share-invoice"
          class="rounded-none border-2 border-black bg-black text-white hover:bg-white hover:text-black"
        >
          Share invoice
        </KleanButton>
        <KleanPopover
          id="docs-share-invoice"
          class="w-80 rounded-none border-2 border-black p-5 shadow-[6px_6px_0_0_#000]"
        >
          <h2 class="font-semibold">Public invoice link</h2>
          <p class="mt-2 break-all font-mono text-xs text-gray-600">
            https://example.com/i/INV-1042
          </p>
        </KleanPopover>
      </div>
      <div class="dark bg-gray-950 p-6 text-white">
        <p class="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-gray-400">
          Slipway / filter
        </p>
        <KleanButton
          popovertarget="docs-environment"
          class="min-h-9 min-w-0 bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-700"
        >
          Environment
        </KleanButton>
        <KleanPopover
          id="docs-environment"
          class="w-64 border-gray-700 bg-gray-900 p-3 text-white shadow-xl"
        >
          <h2 class="px-2 py-1 text-xs font-medium uppercase tracking-wide text-gray-400">
            Environment
          </h2>
          <label class="mt-2 flex items-center gap-3 rounded px-2 py-2 text-sm">
            <input type="checkbox" checked class="size-4" /> Production
          </label>
        </KleanPopover>
      </div>
    </div>

  </template>
  <template #caption>
    Every visual choice is ordinary Tailwind. There are no Klean variants or
    hidden theme utilities.
  </template>
</KleanPreview>

## Accessibility and Durable UI contract

- The invoker is a real button with native keyboard activation.
- `aria-controls` and `aria-expanded` stay synchronized automatically.
- Escape and light dismissal work without trapping focus or locking page scroll.
- Explicit and keyboard dismissal restore focus only when the invoker still exists.
- Global listeners and position observers exist only while the surface is open and are cleaned up on unmount.
- Popover assigns no Menu or Dialog role; the application's semantic content remains visible in its markup.
- Open state is ephemeral. Meaningful state inside the surface follows the [Durable UI contract](/klean-ui/durable-ui).
- Visual treatment follows the application-owned [theming convention](/klean-ui/theming).
