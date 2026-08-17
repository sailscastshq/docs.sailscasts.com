---
title: Separator
titleTemplate: Klean UI
description: One native-first semantic boundary with a native horizontal rule, a correct vertical ARIA bridge, and caller-owned Tailwind across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanSeparator from '../../.vitepress/theme/components/klean/separator/Separator.vue'
import SeparatorRecipes from '../../.vitepress/theme/components/klean/separator/SeparatorRecipes.vue'
import separatorSource from '../../.vitepress/theme/components/klean/separator/Separator.vue?raw'
import reactSource from '../sources/separator/Separator.jsx?raw'
import svelteSource from '../sources/separator/Separator.svelte?raw'
import vueUsage from '../snippets/separator/usage.vue?raw'
import reactUsage from '../snippets/separator/usage.jsx?raw'
import svelteUsage from '../snippets/separator/usage.svelte?raw'
import verticalSource from '../snippets/separator/vertical.vue?raw'
</script>

# Separator

Separator is one honest boundary for the rare places where spacing is not enough. It renders a native `hr` horizontally and supplies the semantics HTML does not have when the boundary is vertical.

Use ordinary Tailwind for length, thickness, color, spacing, opacity, and responsive behavior. Separator has no visual variants and should not replace every border in an application.

<KleanPreview id="separator-source" :source="separatorSource" filename="Separator.vue">
  <template #preview>
    <div class="w-full max-w-lg">
      <section aria-labelledby="separator-profile-title">
        <h2 id="separator-profile-title" class="m-0! text-lg font-semibold">Profile</h2>
        <p class="m-0! mt-2! text-sm text-gray-600 dark:text-gray-300">Personal account details.</p>
      </section>
      <KleanSeparator class="my-8" />
      <section aria-labelledby="separator-security-title">
        <h2 id="separator-security-title" class="m-0! text-lg font-semibold">Security</h2>
        <p class="m-0! mt-2! text-sm text-gray-600 dark:text-gray-300">Sign-in and recovery settings.</p>
      </section>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/separator/Separator.vue

  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and writes the matching one-file source into the conventional component directory:

<KleanInstallation
  id="separator-installation"
  component="separator"
  :source="separatorSource"
  filename="Separator.vue"
  destination="assets/js/components/ui/separator/Separator.vue"
  :dependencies="['tailwind-merge']"
/>

There is no initializer, provider, `klean-ui.json`, class helper, barrel file, orientation package, or runtime Klean dependency.

## Usage

Use Separator between adjacent regions only when the boundary carries meaning that spacing alone does not communicate.

### Vue

<CopyCode :code="vueUsage" label="AccountSettings.vue" />

### React

<CopyCode :code="reactUsage" label="AccountSettings.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="AccountSettings.svelte" />

## API

| Input                 | Default      | Purpose                                                                                          |
| --------------------- | ------------ | ------------------------------------------------------------------------------------------------ |
| `orientation`         | `horizontal` | Semantic direction. Horizontal renders `hr`; vertical renders the correct ARIA separator bridge. |
| `class` / `className` | —            | Ordinary Tailwind classes merged after the neutral monochrome baseline.                          |
| native attributes     | —            | IDs, titles, `aria-hidden`, data attributes, test hooks, and other ordinary attributes.          |
| element reference     | —            | Framework-native access to the actual `hr` or vertical separator when genuinely needed.          |

There is no `variant`, `tone`, `color`, `size`, `thickness`, `length`, `decorative`, `inset`, or theme API. Those decisions are Tailwind classes or native attributes at the call site.

`orientation` is not a visual variant. It determines which semantic element and accessibility attributes are correct.

## Why this is a component

A horizontal rule alone would not justify an abstraction: native `hr` already has implicit separator semantics and a horizontal orientation.

The component earns its small API by safely joining two representations:

```html
<!-- Separator renders this horizontally -->
<hr />

<!-- Separator renders this vertically -->
<div role="separator" aria-orientation="vertical"></div>
```

The vertical case is easy to make visually correct while forgetting `role="separator"` or `aria-orientation="vertical"`. Klean protects that semantic boundary consistently in Vue, React, and Svelte while still letting the browser own the horizontal case.

## Horizontal and vertical boundaries

The horizontal default is a real thematic break. Do not add a redundant explicit role or `aria-orientation` to it.

Use `orientation="vertical"` only inside a layout with a real vertical boundary. The component changes to a `div`, owns `role="separator"`, and fixes `aria-orientation="vertical"` so caller attributes cannot accidentally contradict it.

<KleanPreview id="separator-vertical" :source="verticalSource" filename="DocumentToolbar.vue">
  <template #preview>
    <div role="toolbar" aria-label="Document actions" class="flex h-10 items-stretch rounded-lg bg-gray-100 p-1 dark:bg-gray-900">
      <button type="button" class="cursor-pointer rounded-md border-0 bg-transparent px-3 text-sm hover:bg-white dark:hover:bg-gray-800">Undo</button>
      <button type="button" class="cursor-pointer rounded-md border-0 bg-transparent px-3 text-sm hover:bg-white dark:hover:bg-gray-800">Redo</button>
      <KleanSeparator orientation="vertical" aria-hidden="true" class="mx-1 h-6 self-center bg-gray-300 dark:bg-gray-700" />
      <button type="button" class="cursor-pointer rounded-md border-0 bg-transparent px-3 text-sm hover:bg-white dark:hover:bg-gray-800">Share</button>
    </div>
  </template>
</KleanPreview>

The example is decorative because the toolbar's buttons are already understandable without the line. A vertical separator that conveys a meaningful grouping can remain exposed to accessibility APIs by omitting `aria-hidden`.

## Semantic or decorative

Separator is semantic by default. Use it when the break helps describe a change in topic or grouping.

When the line is visual reinforcement only, use the native attribute:

```vue
<Separator aria-hidden="true" class="my-4" />
```

Klean intentionally has no `decorative` prop. `aria-hidden` is already the platform vocabulary, remains visible in the markup, and works identically across the supported frameworks.

Do not use `role="presentation"` to override Separator. The component protects its orientation semantics; use `aria-hidden="true"` when the entire line should leave the accessibility tree.

## Styling with Tailwind

The neutral baseline is one monochrome pixel. Caller classes merge after it and can replace every visual decision:

```vue
<Separator class="my-8 h-0.5 bg-black dark:bg-white" />

<Separator
  orientation="vertical"
  class="mx-3 h-8 w-0.5 self-center bg-emerald-500"
/>
```

Repeated application treatments can become an application-owned wrapper or shared class recipe. They do not become Klean variants.

## Hagfish and Slipway recipes

Hagfish can replace its PrimeVue-backed Divider with native Klean source and preserve its expressive contrast. Slipway can keep compact command and operational boundaries. Most existing borders in both applications should remain ordinary Tailwind markup.

<KleanPreview id="separator-products" :source="separatorSource" filename="Separator.vue">
  <template #preview>
    <SeparatorRecipes />
  </template>
  <template #caption>
    <span>The same semantic seam accepts both product voices. The account and command layouts remain application markup.</span>
  </template>
</KleanPreview>

The component is not a migration target for every `border-t`, `border-b`, `divide-y`, table row, field underline, card edge, or Tabs indicator. Those lines belong to the element whose shape they describe.

## Accessibility

- Prefer native HTML. Horizontal Separator is an `hr` and keeps its implicit separator role.
- Do not redundantly add `role="separator"` or `aria-orientation="horizontal"` to the native `hr`.
- Vertical Separator renders `role="separator"` with `aria-orientation="vertical"` because HTML has no native vertical rule.
- Add `aria-hidden="true"` only when the boundary is entirely decorative.
- Do not put Separator in the tab order. A static separator is not a resizer, slider, or other control.
- Do not rely on the line alone to label regions. Keep real headings, landmarks, lists, fieldsets, and other document structure.
- Caller colors should remain visible in light, dark, and forced-colors modes.

## Durable behavior

Separator owns no client state and needs none. It has no mount-time state, storage, URL parameter, event listener, animation, focus work, or cleanup lifecycle.

Its durability is structural: server rendering and hydration produce the same native element and orientation semantics. State belongs to the surrounding Tabs, Menu, toolbar, page region, or application feature—not to the line between them.

## When to use

Use Separator for:

- a real thematic change between adjacent content regions;
- a dense menu or command surface where a visual group boundary remains useful;
- a vertical boundary whose ARIA orientation should not be reimplemented at every call site;
- removing a styled-divider dependency while preserving correct semantics and caller-owned design.

## When not to use

- Prefer spacing when proximity already makes the groups clear.
- Use a background change when large page regions need stronger visual separation.
- Keep ordinary borders on headers, footers, cards, inputs, tables, and rows when the line describes that element's edge.
- Keep `divide-y` on dense lists or table bodies when it is the clearest row treatment.
- Use [Tabs](/klean-ui/components/tabs) for peer views; its active indicator is not a Separator.
- Use [Menu](/klean-ui/components/menu) for actions and destinations; Separator adds no menu behavior.
- Do not use Separator as a draggable pane resizer or slider. Those are interactive controls with different keyboard and value semantics.

## Complete framework source

Copy, inspect, and change the complete one-file source for your framework.

### Vue source

<CopyCode :code="separatorSource" label="Separator.vue" />

### React source

<CopyCode :code="reactSource" label="Separator.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Separator.svelte" />

## Related components

- [Menu](/klean-ui/components/menu) and [Command](/klean-ui/components/command) — may contain rare visual group boundaries while retaining their own keyboard behavior.
- [Tabs](/klean-ui/components/tabs) — owns peer navigation and active indication rather than composing those from separators.
- [Card](/klean-ui/components/card) — provides a surface boundary when a line alone is not enough.
- [Table](/klean-ui/components/table) — preserves dense row and column relationships where native borders and divisions remain appropriate.
- [Breadcrumb](/klean-ui/components/breadcrumb) — uses its own presentational path markers; those are not thematic separators.
