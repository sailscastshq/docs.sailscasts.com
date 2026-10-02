---
title: Theming
titleTemplate: Klean UI
description: Theme Klean UI with application-owned CSS and Tailwind instead of providers, presets, or component variants.
outline: [2, 3]
---

# Theming

The application's CSS is the theme.

Neutral component defaults work without global Klean tokens. Products apply their visual language with ordinary Tailwind, and the copied source remains replaceable.

## Three levels of styling

### One local treatment: use classes

::: code-group

<<< ./snippets/theming/local.vue [Vue]

<<< ./snippets/theming/local.jsx [React]

<<< ./snippets/theming/local.svelte [Svelte]

:::

### One repeated product concept: create a component

::: code-group

<<< ./snippets/theming/product.vue [Vue]

<<< ./snippets/theming/product.jsx [React]

<<< ./snippets/theming/product.svelte [Svelte]

:::

This is the normal replacement for `variant="primary"`. The product concept receives a product name and stays inside the product. Caller classes still merge last when the product component needs a local adjustment.

### One shared value: use Tailwind's theme

```css
@import 'tailwindcss';

@theme {
  --color-brand: oklch(0.49 0.16 154);
  --color-on-brand: oklch(0.985 0 0);
}
```

```vue
<Button class="bg-brand text-on-brand hover:bg-brand/90">
  Approve invoice
</Button>
```

The token creates Tailwind utilities. It does not create component variants.

The Vue, React, and Svelte examples above all consume the same application CSS. Changing frameworks does not create a Klean theme layer.

## Optional semantic foundations

Applications with coordinated modes or white-label branding can define a short set of application-owned roles such as `canvas`, `ink`, `surface`, `muted`, `line`, and `focus`. Product signals should have paired foregrounds such as `brand` / `on-brand`.

These roles are optional application infrastructure. Klean does not generate them, prompt for them, or require them before a component works.

Avoid component-specific tokens such as `--button-primary-hover-background`. They recreate a variant matrix in CSS and make the primitive harder to replace.

## Light and dark

An application that follows the operating system can use Tailwind's ordinary `dark:` utilities. A manual switcher can expose one resolved mode on the root:

```html
<html data-mode="dark"></html>
```

```css
@custom-variant dark (&:where([data-mode="dark"], [data-mode="dark"] *));
```

If the stored preference is `system`, application-owned code resolves the media query and writes `light` or `dark` before paint. A server-readable cookie is the right convention when SSR must avoid a flash.

The mode preference is a Durable UI concern because a person chose it. Store that preference with the framework-native `useStoredState` or `createStoredState` source from the [Durable UI bundle](/klean-ui/durable-ui), resolve it before paint, and leave component source unaware of the storage mechanism.

## Your visual identity {#proving-applications-not-themes}

Choose your own typography, spacing, color, density, shadow, and motion. The same component can support a compact operational interface or an expressive editorial layout through ordinary Tailwind classes.

## Accessibility invariants

Every product mode must preserve:

- text, icon, boundary, and focus contrast;
- states communicated by more than color;
- readable disabled content;
- reduced-motion behavior independently of theme;
- native control rendering through the correct `color-scheme`;
- useful forced-colors behavior.

Klean does not guess contrast at runtime. Applications choose and test deliberate foreground/background pairs.

## The decision rule

| Question                                        | Use                              |
| ----------------------------------------------- | -------------------------------- |
| Is this unique here?                            | Direct Tailwind classes          |
| Is this a repeated product concept?             | Application-owned component      |
| Is this value shared across unrelated surfaces? | Tailwind `@theme` variable       |
| Is this light/dark user state?                  | CSS plus one root mode attribute |
| Does this change behavior?                      | A behavioral prop                |

Do not tokenize a value merely because it exists.
