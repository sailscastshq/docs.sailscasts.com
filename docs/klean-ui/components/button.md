---
title: Button
titleTemplate: Klean UI
description: A native-first Klean UI action primitive with behavioral props and Tailwind as its visual API.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanButton from '../../.vitepress/theme/components/klean/Button.vue'
import buttonSource from '../../.vitepress/theme/components/klean/Button.vue?raw'
import basicUsage from '../snippets/button/usage.vue?raw'
import semanticUsage from '../snippets/button/semantics.vue?raw'
import productRecipes from '../snippets/button/products.vue?raw'
</script>

# Button

Button is a native-first action primitive. It owns truthful element selection, safe button type, disabled semantics, attribute forwarding, a stable `data-slot`, and conflict-aware class composition. Your application owns loading state, navigation decisions, business language, and the visual recipe.

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
  <template #source>

<<< ../../.vitepress/theme/components/klean/Button.vue

  </template>
</KleanPreview>

## Installation

The standard Boring Stack path requires no `init`, `klean-ui.json`, alias prompt, or generated `cn.js`. The installer detects the framework and conventional source paths.

<KleanInstallation id="button-installation" :source="buttonSource" />

## Usage

<CopyCode :code="basicUsage" label="usage.vue" />

Visual styling stays in the framework's ordinary class API. If the same product treatment repeats, create an application-owned component such as `PrimaryButton.vue` using Button as its semantic base.

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

Klean's neutral default stays motionless and uses tonal feedback. Hagfish deliberately adds an offset-shadow press; Slipway keeps its dense operational controls quiet. Those opinions are explicit Tailwind classes, not Klean variants.

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
