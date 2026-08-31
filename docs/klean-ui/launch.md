---
title: Klean UI is ready
titleTemplate: Klean UI
description: Why we built Kelvin's Lean UI, what shipped, and what Slipway and Hagfish proved before launch.
outline: [2, 3]
---

# Klean UI is ready

Klean UI means **Kelvin's Lean UI**. It is the component system we wanted for
The Boring JavaScript Stack: framework-native source for Vue, React, and Svelte;
accessible browser behavior; Durable UI resilience; and ordinary Tailwind that
belongs to the application.

The CLI delivers and inspects the source. It does not own the interface after
installation.

```bash
npx klean-ui add button
```

That command detects a conventional Boring Stack application, selects its
framework, resolves the expected paths, adds only direct prerequisites, and
leaves readable application files behind. There is no initializer, provider,
manifest, alias questionnaire, generated class helper, or Klean runtime.

## Why now

We did not start with the ambition to make another component library. We tried
PrimeVue first. It is capable, but its styling model was the wrong trade for
the products we were building. Making Slipway look unmistakably like Slipway
and Hagfish look unmistakably like Hagfish meant repeatedly working through a
library-owned styling contract when we wanted to edit the markup and Tailwind
directly.

The problem was not a missing preset. It was ownership.

Klean UI came out of the repeated work that followed: native dialogs and
popovers, forms that remain ordinary HTML, navigation that stays linkable,
state that survives real browser behavior, and components whose source can be
read in one sitting. We extracted those decisions only after they survived two
very different applications.

## How it differs from shadcn

Klean keeps the best part of the shadcn idea: **the application owns the copied
source**. The difference is the default path and the public API.

- A conventional Boring Stack app needs no `init` step or project manifest.
- Vue, React, and Svelte are equal framework-native targets.
- `class` or `className` is the visual API; Klean does not require a
  `variant`, `size`, `tone`, or radius matrix.
- Native platform behavior comes first when the browser already provides it.
- Durable behavior is part of correctness, not a separate state-management
  layer.
- Updates begin with `check` and `diff`; local edits are never silently
  replaced.

This is not a selectable Slipway or Hagfish theme. Klean provides neutral,
audited source. The application supplies its own visual voice.

## One contract, three native implementations

Vue, React, and Svelte do not share a runtime wrapper. Each registry item uses
the framework's own conventions while preserving the same semantics,
accessibility outcomes, states, useful slots, and caller-owned styling hooks.

All three targets build and mount in their own Storybook renderer. The composed
workbench makes parity visible without pretending the implementations are the
same file.

## What shipped

Klean UI 0.0.3 contains:

- **42 documented components**, from Button, Field controls, Dialog, Popover,
  Menu, Select, Combobox, and Command through Calendar, Date Picker, Schedule
  Picker, DataTable, Sidebar, Toast, and application-state recipes;
- **98 original Klean Icons** on one 24px canvas with a calm 1.5px stroke;
- **Durable UI source** for stored state, URL state, drafts, scroll recovery,
  optimistic work, and abortable search;
- a zero-configuration CLI with dry runs, dependency planning, revision-aware
  diffs, and rollback-safe updates; and
- Vue, React, and Svelte Storybooks, builds, interaction coverage, accessibility
  checks, and clean-package installation smoke tests.

[Explore every component →](/klean-ui/components/)

## Proven in products, not just stories

### Slipway: dense operational UI

Slipway exercises compact navigation, settings, command surfaces, data-heavy
tables, destructive operations, deployment workflows, and dark mode. Its Klean
adoption replaced repeated icon geometry while preserving the product's exact
density and hierarchy.

![Slipway settings before and after Klean adoption](/klean-ui/launch/slipway-settings-before-after.png)

![Slipway command palette before and after Klean adoption](/klean-ui/launch/slipway-command-before-after.png)

The point of the comparison is how little the product identity moves. Shared
source removed duplication; it did not redesign Slipway.

### Hagfish: expressive application UI

Hagfish uses thicker borders, stronger contrast, playful details, document
workflows, invoice scheduling, and both light and dark treatments. It now
renders 215 Klean icon instances from application-owned Vue source while its
own artwork and visual emphasis remain Hagfish.

![Hagfish delete dialog using Klean source in light mode](/klean-ui/launch/hagfish-delete-dialog-light.png)

![Hagfish delete dialog using Klean source in dark mode](/klean-ui/launch/hagfish-delete-dialog-dark.png)

![Hagfish scheduling workflow using Klean controls](/klean-ui/launch/hagfish-schedule-picker.png)

The final Hagfish inventory reports zero PrimeIcons, zero PrimeVue icon
imports, and zero unclassified interface SVGs. Logos, marketing art, video
artwork, product illustrations, and its squiggly dividers remain deliberately
owned exceptions.

## Durable UI is the implementation philosophy

Klean UI is where our Durable UI practice becomes ordinary application code.
Useful state survives reloads when it should. Query state stays shareable.
Drafts restore deliberately. Focus returns after overlays close. Optimistic
work rolls back visibly. Stale search requests lose. Reduced motion remains a
real supported state.

Not every primitive needs persistence. The component or application flow that
owns the state also owns its recovery. Klean adds the behavior only where it
makes the interface more resilient.

[Read the Durable UI contract →](/klean-ui/durable-ui)

## Updates remain yours

Copied source cannot be updated responsibly by pretending local edits do not
exist. Klean makes inspection the default:

```bash
npx klean-ui check
npx klean-ui diff button
npx klean-ui update button
```

`check` is read-only. `diff` shows application source against the invoked CLI's
registry. `update` automatically replaces only an exact known Klean revision;
component files, prerequisites, dependencies, and lockfiles are planned as one
transaction. Local or unknown changes stop the update for review unless the
caller explicitly chooses overwrite.

[Read the update guide →](/klean-ui/updating)

## Deliberate omissions

This release does not claim every future application block is finished. It
also deliberately does not include:

- a Klean runtime or global provider;
- a permanent consumer configuration file;
- a mandatory theme or visual variant system;
- a generic string-based icon registry in the application;
- product logos and brand artwork; or
- silent source replacement.

Patch releases may fix implementation, accessibility, or browser compatibility
without intentional API breaks. Minor releases are additive. Any breaking
anatomy or behavior needs migration notes, a deliberate transition path, and
proof in the applications that depend on it—even before 1.0.

## Start owning the source

Install a component:

```bash
npx klean-ui add button
```

Install only the icons an application uses:

```bash
npx klean-ui add icon trash search calendar
```

Give a coding agent the same decision rules:

```bash
npx skills add sailscastshq/klean-ui --skill klean-ui
```

Then open the files. Change the classes. Wrap repeated product treatments in
your own components. Keep the native semantics. Add the real application
tests. The source is yours—that is the feature.

## Links

- [Klean UI on npm](https://www.npmjs.com/package/klean-ui)
- [GitHub repository](https://github.com/sailscastshq/klean-ui)
- [Component documentation](/klean-ui/components/)
- [Installation guide](/klean-ui/installation)
- [Update guide](/klean-ui/updating)
- [Doctrine](/klean-ui/doctrine)
- [Storybook workbench instructions](https://github.com/sailscastshq/klean-ui#component-workbench)
- [Roadmap](https://github.com/sailscastshq/klean-ui/issues/3)
- [Klean UI skill](https://github.com/sailscastshq/klean-ui/tree/main/skills/klean-ui)
- [Slipway adoption evidence](https://github.com/sailscastshq/slipway/pull/506)
- [Hagfish adoption evidence](https://github.com/sailscastshq/hagfish/pull/279)
