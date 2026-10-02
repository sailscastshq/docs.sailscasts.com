---
title: Button
titleTemplate: Klean UI
description: A native-first Klean UI action primitive for Vue, React, and Svelte with behavioral props and Tailwind as its visual API.
outline: [2, 3]
---

<script setup>
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanButton from '../../.vitepress/theme/components/klean/Button.vue'
import ProductLoader from '../../.vitepress/theme/components/klean/spinner/ProductLoader.vue'
import KleanSpinner from '../../.vitepress/theme/components/klean/spinner/Spinner.vue'
import buttonSource from '../../.vitepress/theme/components/klean/Button.vue?raw'
import reactSource from '../sources/button/Button.jsx?raw'
import svelteSource from '../sources/button/Button.svelte?raw'

import pendingUsage from '../snippets/button/pending.vue?raw'
import semanticUsage from '../snippets/button/semantics.vue?raw'
import productRecipes from '../snippets/button/products.vue?raw'

const buttonFrameworks = [
  {
    id: 'vue',
    label: 'Vue',
    code: buttonSource,
    filename: 'Button.vue',
    destination: 'assets/js/components/ui/button/Button.vue'
  },
  {
    id: 'react',
    label: 'React',
    code: reactSource,
    filename: 'Button.jsx',
    destination: 'assets/js/components/ui/button/Button.jsx'
  },
  {
    id: 'svelte',
    label: 'Svelte',
    code: svelteSource,
    filename: 'Button.svelte',
    destination: 'assets/js/components/ui/button/Button.svelte'
  }
]
</script>

# Button

Use Button for actions and links. It renders the appropriate native element, handles disabled behavior, and lets your Tailwind classes take precedence.

There are intentionally no `variant`, `size`, `color`, `tone`, `radius`, `elevated`, or `loading` props.

<KleanPreview id="button-source" :source="buttonSource" filename="Button.vue">
  <template #preview>
    <KleanButton>Continue</KleanButton>
    <KleanButton disabled>Processing</KleanButton>
    <KleanButton
      as="a"
      href="/klean-ui/components/button#semantic-elements"
      class="bg-white text-gray-950 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-800"
    >
      Button as a link
    </KleanButton>
  </template>
  <template #usage>

::: code-group

<<< ../snippets/button/usage.vue [Vue]

<<< ../snippets/button/usage.jsx [React]

<<< ../snippets/button/usage.svelte [Svelte]

:::

  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/Button.vue

  </template>
</KleanPreview>

## Installation

<KleanInstallation
  id="button-installation"
  component="button"
  :frameworks="buttonFrameworks"
/>

## Usage

Copy the [example above](#button-source) for your framework.

Visual styling stays in the framework's ordinary class API. If the same product treatment repeats, create an application-owned component such as `PrimaryButton.vue` using Button as its semantic base.

## Pending actions

Bind `disabled` and `aria-busy` to the request state, describe the work in the visible label, and add a decorative Spinner. You can pass your own loading mark to Spinner.

<KleanPreview id="button-pending" :source="pendingUsage" filename="pending-button.vue">
  <template #preview>
    <KleanButton type="button" disabled aria-busy="true">
      <KleanSpinner class="size-4">
        <ProductLoader />
      </KleanSpinner>
      Deploying service…
    </KleanButton>
  </template>
  <template #source>

<<< ../snippets/button/pending.vue

  </template>
</KleanPreview>

## API

| Input        | Default    | Purpose                                                                              |
| ------------ | ---------- | ------------------------------------------------------------------------------------ |
| `as`         | `'button'` | Render a native `button`, native `a`, or framework component such as Inertia `Link`. |
| `type`       | `'button'` | Native button behavior: `button`, `submit`, or `reset`. Ignored for non-buttons.     |
| `disabled`   | `false`    | Native disabled behavior for buttons and accessible disabled semantics for links.    |
| `class`      | —          | The visual API. Caller Tailwind classes merge last.                                  |
| default slot | —          | Label, decorative icon, spinner, or other accessible content.                        |

## Semantic elements

Appearance does not decide semantics. Use one truthful interactive element:

- `<button>` for actions, local state, dialogs, and form submission;
- `<a>` for external navigation, downloads, OAuth, or full-page requests;
- the Boring Stack `Link` for internal Inertia navigation.

Do not wrap a Button inside an anchor. Render Button **as** the anchor or Link.

<KleanPreview id="button-semantics" :source="semanticUsage" filename="semantic-usage.vue">
  <template #preview>
    <KleanButton type="button">Open dialog</KleanButton>
    <KleanButton type="submit">Save changes</KleanButton>
    <KleanButton as="a" href="https://sailsjs.com">Read Sails docs</KleanButton>
    <KleanButton
      as="a"
      href="/klean-ui/"
      class="bg-white text-gray-950 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-800"
    >
      View Klean UI
    </KleanButton>
  </template>
  <template #source>

<<< ../snippets/button/semantics.vue

  </template>
  <template #caption>
    Pass the Boring Stack Link component for internal navigation.
  </template>
</KleanPreview>

## Product recipes

Add an offset shadow for an expressive action or reduce padding for a compact toolbar. These treatments use ordinary Tailwind classes.

<KleanPreview id="button-product-recipes" :source="productRecipes" filename="product-buttons.vue">
  <template #preview>
    <KleanButton
      class="border-2 border-black bg-black px-6 text-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-white hover:text-black hover:shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none dark:border-white dark:bg-white dark:text-black dark:hover:bg-transparent dark:hover:text-white dark:hover:shadow-[4px_4px_0_0_#fff]"
    >
      Send invoice
    </KleanButton>
    <KleanButton class="min-h-9 min-w-0 rounded-md px-3 py-1.5 text-sm">
      Deploy
    </KleanButton>
  </template>
  <template #source>

<<< ../snippets/button/products.vue

  </template>
  <template #caption>
    Every class shown here is built into Tailwind or written as an explicit
    arbitrary value. There are no hidden Klean theme utilities.
  </template>
</KleanPreview>

## Accessibility contract

- The default is a real `<button type="button">`.
- Submit and reset behavior remain native.
- Keyboard focus is visible without relying on color alone.
- Icon-only usage needs an accessible name such as `aria-label`.
- Disabled links leave the tab order and cannot activate.
- Processing indicators are decorative when the visible label already describes the state.
- Base interaction is motionless, and transitions are removed for reduced-motion preferences.

## Complete framework source

The live preview demonstrates the shared semantic contract. Copy the complete framework-native source that belongs in your application:

::: code-group

<<< ../../.vitepress/theme/components/klean/Button.vue [Vue]

<<< ../sources/button/Button.jsx [React]

<<< ../sources/button/Button.svelte [Svelte]

:::

## Related components

- [Tooltip](/klean-ui/components/tooltip) — adds short supplementary text without changing the button or link semantics.
- [Spinner](/klean-ui/components/spinner) — a decorative pending mark inside a truthfully labelled busy button.
- [Slide](/klean-ui/components/slide) — higher-friction confirmation for consequential actions.
- [Menu](/klean-ui/components/menu) — a compact list of actions and destinations.
- [Popover](/klean-ui/components/popover) — a non-modal surface invoked by a button.
- [Dialog](/klean-ui/components/dialog) — a modal task or confirmation invoked by a native command.
- [Input](/klean-ui/components/input) — native form input with caller-owned labels and errors.
