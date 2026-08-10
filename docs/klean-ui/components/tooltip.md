---
title: Tooltip
titleTemplate: Klean UI
description: Short supplementary text for a semantic button or link, with accessible hover, focus, dismissal, and caller-owned Tailwind styling.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanButton from '../../.vitepress/theme/components/klean/Button.vue'
import KleanTooltip from '../../.vitepress/theme/components/klean/tooltip/Tooltip.vue'
import tooltipSource from '../../.vitepress/theme/components/klean/tooltip/Tooltip.vue?raw'
import reactSource from '../sources/tooltip/Tooltip.jsx?raw'
import svelteSource from '../sources/tooltip/Tooltip.svelte?raw'
import vueUsage from '../snippets/tooltip/usage.vue?raw'
import reactUsage from '../snippets/tooltip/usage.jsx?raw'
import svelteUsage from '../snippets/tooltip/usage.svelte?raw'
import stylingUsage from '../snippets/tooltip/styling.vue?raw'
</script>

# Tooltip

Tooltip adds short supplementary text to one real button or link. Wrap the trigger, provide the text, and keep the trigger's semantics and Tailwind classes where they are visible.

Klean supplies the accessible description, hover and keyboard behavior, collision-safe placement, Escape dismissal, touch behavior, and cleanup. There are no trigger IDs, compound components, providers, visual variants, or configuration ceremony.

<KleanPreview id="tooltip-source" :source="tooltipSource" filename="Tooltip.vue">
  <template #preview>
    <div class="grid justify-items-center gap-4">
      <KleanTooltip text="Re-run query" placement="top">
        <KleanButton
          type="button"
          aria-label="Re-run query"
          class="size-11 min-h-0 min-w-0 p-0"
        >
          <svg
            aria-hidden="true"
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              d="M20 11a8 8 0 1 0-2.34 5.66M20 4v7h-7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </KleanButton>
      </KleanTooltip>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Hover the button or focus it with the keyboard.
      </p>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/tooltip/Tooltip.vue

  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte, writes the matching source, and installs its direct dependencies:

<KleanInstallation
  id="tooltip-installation"
  component="tooltip"
  :source="tooltipSource"
  filename="Tooltip.vue"
  destination="assets/js/components/ui/tooltip/Tooltip.vue"
  :dependencies="['@floating-ui/dom', 'tailwind-merge']"
/>

The installed source belongs to the application. There is no initializer, provider, generated ID to coordinate, configuration file, or shared class helper.

## Usage

The child is the trigger. Use a real button for an action and a real anchor or Boring Stack Link for navigation.

### Vue

<CopyCode :code="vueUsage" label="QueryToolbar.vue" />

### React

<CopyCode :code="reactUsage" label="QueryToolbar.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="QueryToolbar.svelte" />

The icon is decorative because the button already has the accessible name “Re-run query.” Tooltip text supplements the control; it does not replace the button's name.

## API

| Input                 | Default  | Purpose                                                                |
| --------------------- | -------- | ---------------------------------------------------------------------- |
| `text`                | required | Short, non-interactive supplementary text.                             |
| `placement`           | `top`    | Preferred `top`, `right`, `bottom`, or `left` side; may flip to fit.   |
| `offset`              | `8`      | Pixel distance between the trigger and tooltip.                        |
| `class` / `className` | —        | Ordinary Tailwind classes merged last on the tooltip surface.          |
| default child         | required | One semantic button, anchor, or framework Link that renders an anchor. |

Other non-conflicting attributes are forwarded to the tooltip surface. Trigger attributes and styling stay on the trigger itself.

## Semantics before appearance

Tooltip never decides what the trigger means:

- use `<button type="button">` for an action;
- use `<a href="…">` for navigation;
- use the Boring Stack Link component when navigation should retain client-side routing semantics;
- give an icon-only trigger its own accessible name with `aria-label` or visible text;
- keep the icon itself decorative with `aria-hidden="true"`.

Klean adds its generated description to the trigger without discarding an existing `aria-describedby` relationship. It removes only its own relationship when the component unmounts.

Do not put links, buttons, fields, headings, or long instructions inside a Tooltip. Use [Popover](/klean-ui/components/popover) for interactive or structured content.

## Styling with Tailwind

Style the trigger on the trigger. Style the floating surface through Tooltip's ordinary class input:

<CopyCode :code="stylingUsage" label="invoice-tooltip.vue" />

`data-slot="tooltip"` and `data-slot="tooltip-arrow"` are stable nearby styling hooks. The example hides the arrow with an ordinary Tailwind selector; there is no `arrow`, `tone`, `size`, `radius`, `elevation`, or `variant` prop.

Repeated product treatment can become a small application-owned wrapper. Hagfish and Slipway can therefore share the accessible behavior without sharing a visual identity.

## Accessible behavior

- Pointer hover and keyboard focus reveal the same supplementary text.
- Escape dismisses an open Tooltip without moving focus away from its trigger.
- Moving between the trigger and Tooltip does not dismiss it prematurely.
- Only one Tooltip is open at a time.
- Touch activation does not create a sticky synthetic hover surface.
- Placement flips or shifts when the preferred side would leave the viewport.
- Reduced-motion and forced-colors preferences retain a useful, readable result.
- The trigger remains the actual focusable element; Tooltip does not add a styled trigger wrapper.

The text remains supplementary. A critical label, validation error, destructive warning, or operation result must stay visible in the interface.

## Durable behavior

Tooltip visibility is ephemeral. It is derived from current hover or focus and is never written to local storage, the URL, cookies, or server state. Timers, position observers, generated accessibility relationships, and global listeners are cleaned up when no longer needed.

The durable state belongs to the application action or destination—not to whether its explanation happened to be visible.

## Complete framework source

Copy, inspect, and change the complete source for your framework.

### Vue source

<CopyCode :code="tooltipSource" label="Tooltip.vue" />

### React source

<CopyCode :code="reactSource" label="Tooltip.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Tooltip.svelte" />

## Related components

- [Button](/klean-ui/components/button) — supplies truthful button, anchor, and Boring Stack Link semantics.
- [Popover](/klean-ui/components/popover) — hosts interactive or structured non-modal content.
- [Menu](/klean-ui/components/menu) — presents a keyboard-navigable collection of actions or destinations.
