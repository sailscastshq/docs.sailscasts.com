---
title: Doctrine
titleTemplate: Klean UI
description: The design and engineering rules that make Klean UI lean, accessible, durable, and source-owned.
outline: [2, 3]
---

# Doctrine

Klean UI means Kelvin's Lean UI. “Lean” is a boundary: Klean owns excellent markup and reusable behavior, then gets out of the application's way.

> Own the source. Keep the markup. Style it with Tailwind.

Vue, React, and Svelte share the same outcomes without sharing a lowest-common-denominator runtime. Each component is native to its framework and recognizable to developers who already know that framework.

## The non-negotiables

1. **The application owns the source.** Klean copies readable files; it does not retain runtime ownership.
2. **Conventions are the configuration.** Run the add command from a Boring Stack application; Klean detects its framework and component directory.
3. **HTML comes first.** Native elements and browser behavior are the starting contract.
4. **Tailwind is the visual API.** Visual decisions belong in `class` or `className`.
5. **There are no visual variants.** Klean does not ship `variant`, `size`, `tone`, `color`, `radius`, or elevation props.
6. **Behavior earns props.** A prop must express semantics or interaction that native attributes, slots, and classes cannot express clearly.
7. **Accessibility is correctness.** Keyboard, focus, naming, state, contrast, and reduced-motion behavior are correctness.
8. **Application classes win.** Neutral defaults stay easy to replace and caller classes merge last.
9. **Anatomy stays obvious.** Slots, parts, state, and rendered elements remain visible in the copied source.
10. **Durability is part of correctness.** Useful state survives, navigation context is shareable, focus recovers, and failed optimistic work rolls back.

## What Klean owns

Klean owns:

- sound semantic markup;
- accessible behavior and state;
- Durable UI components and state utilities;
- neutral, usable defaults;
- stable slots and `data-*` hooks;
- safe native attribute forwarding;
- readable framework-native source;
- Boring Stack conventions and recipes.

The application owns:

- brand color, typography, density, radius, and shadow;
- business language and request state;
- product concepts such as `PrimaryButton` or `DeleteProjectButton`;
- server interaction and navigation decisions;
- the final composition of primitives into product UI.

Shared behavior leaves your application free to choose its own visual identity.

## Ownership survives updates

Source ownership is meaningful only when an updater respects it. Klean's [update workflow](/klean-ui/updating) distinguishes exact Klean source from local changes before writing. Known historical source can adopt an upstream fix safely; locally modified and untracked source remains untouched for human review.

Updates stay progressive and component-scoped. Patch releases repair correctness, minor releases add capability, and breaking changes come with migration guidance. Updates preserve source ownership and keep visual decisions in your application.

## Use the platform

An action begins as `<button>`. Navigation remains `<a>` or the Boring Stack Link. A field uses a real `<label>`. Related choices use `<fieldset>` and `<legend>`. Headings describe document structure rather than font size.

Native HTML provides browser behavior before JavaScript enhancement, accepts native attributes without a parallel Klean vocabulary, and keeps the source legible. Custom interaction is justified only when the platform cannot satisfy the complete contract.

## Tailwind is the visual API

Do not hide visual choices behind props:

```vue
<!-- Not Klean -->
<Button variant="danger" size="large" radius="full">
  Delete project
</Button>
```

Write the treatment directly:

```vue
<Button
  class="min-h-11 rounded-md bg-red-700 px-5 font-semibold text-white hover:bg-red-800"
>
  Delete project
</Button>
```

This is not an escape hatch around the API. It is the visual API.

When the same treatment expresses a recurring product concept, create an application-owned component:

```vue
<!-- assets/js/components/PrimaryButton.vue -->
<script setup>
import Button from './ui/button/Button.vue'
</script>

<template>
  <Button class="bg-emerald-700 text-white hover:bg-emerald-800">
    <slot />
  </Button>
</template>
```

Use each framework's ordinary conditional class syntax. Your classes take precedence over the component defaults.

## Motion belongs to the product

Components use tonal feedback and visible focus by default. Add motion with Tailwind where it helps your interface, and respect reduced-motion preferences.

## Accessibility {#accessibility-is-the-release-gate}

Keep these behaviors intact when styling or editing a component:

- truthful native element or equivalent semantics;
- accessible name and required description;
- complete keyboard operation and predictable tab order;
- visible focus in light, dark, and high-contrast contexts;
- state communicated programmatically, not by color alone;
- disabled behavior that cannot activate or trap focus;
- correct focus entry, containment, restoration, and dismissal for layered UI;
- errors associated with their controls;
- usable touch targets and responsive behavior;
- nonessential motion removed under `prefers-reduced-motion`.

ARIA supplements correct HTML. It does not repair an avoidable semantic mistake.

## Durable UI is the interaction doctrine

Klean is the canonical source-owned implementation of [Durable UI](/klean-ui/durable-ui). State belongs in the smallest durable home: local state for ephemeral interaction, browser storage for browser-only preferences, the URL for shareable navigation state, and the server for authoritative or cross-device data.

Durability also covers interaction recovery: predictable dismissal, focus restoration, stale request cancellation, optimistic rollback, draft recovery, scroll restoration, and feedback that survives navigation.

## The dependency ladder

Components build on the browser and add only the behavior they need:

1. native HTML;
2. small, readable framework behavior;
3. a focused unstyled primitive when keyboard navigation, focus management, dismissal, or positioning becomes substantial.

Button needs no interaction dependency. Floating components such as Popover use focused positioning utilities. Each installation lists its direct dependencies, and the copied source shows where they are used.

## Customizing a component {#the-test}

Before extending your installed source, consider:

- Is this already native HTML?
- Is this ordinary framework composition?
- Is this a Tailwind class?
- Is this a repeated product concept that belongs in the application?
- Does this prop change real behavior or only choose CSS?
- Can a developer understand the installed source in one careful pass?

Use native attributes for browser behavior, framework composition for application logic, and Tailwind classes for appearance.
