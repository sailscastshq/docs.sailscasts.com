---
title: Components
titleTemplate: Klean UI
description: Accessible, source-owned Klean UI components with neutral defaults and Tailwind as the visual API.
outline: [2, 3]
---

# Components

Klean components provide semantic markup, accessible behavior, durable interaction, and neutral defaults. Install the framework-native source, then style it with ordinary Tailwind.

Components do not share a visual variant API. Each page shows the behavioral contract, live preview, exact source, installation command, semantic recipes, and accessibility requirements.

## Available components

### [Button](/klean-ui/components/button)

A native-first action primitive that can render a truthful button, anchor, or Boring Stack Link. It handles safe type defaults, disabled semantics, attribute forwarding, and caller-owned Tailwind classes.

### [Input](/klean-ui/components/input)

A styled native input that forwards native attributes and framework-native value binding. Labels, help, errors, IDs, validation, and layout remain visible application markup.

### [Textarea](/klean-ui/components/textarea)

A styled native textarea whose durable presentation grows from its current value and responsive width. Caller Tailwind can take ownership of height and resizing without a component prop.

### [Popover](/klean-ui/components/popover)

A native-first non-modal floating surface with light dismissal, focus return, collision-aware positioning, and ordinary semantic content. A real button invokes it through the browser's `popovertarget` relationship.

### [Menu](/klean-ui/components/menu)

An accessible list of truthful button actions and link destinations built on Klean Popover. It adds roving focus, Arrow keys, Home/End, typeahead, disabled-item behavior, selection, and durable focus return while caller Tailwind owns the product treatment.

### [Calendar](/klean-ui/components/calendar)

An always-visible, locale-aware date-only surface with complete keyboard navigation, caller-owned availability, and stable `YYYY-MM-DD` values.

### [Date Picker](/klean-ui/components/date-picker)

An editable date-only form field composed with Calendar and native-first Popover. Use ordinary `min`, `max`, and availability rules for product constraints.

### [Date Range Picker](/klean-ui/components/date-range-picker)

One related start-and-end decision with inclusive date boundaries, native form names, and a contiguous Calendar selection.

### [Schedule Picker](/klean-ui/components/schedule-picker)

Natural-language future scheduling with Calendar, time choices, IANA timezone safety, exact relative durations, and predictable Enter or composite-blur commit.

### [Toast](/klean-ui/components/toast)

Accessible notifications with semantic actions, long-running updates, reduced motion, and caller-owned Tailwind.

### [Slide](/klean-ui/components/slide)

A native-button confirmation control with an optional pointer slide, truthful pending state, resilient cancellation, RTL geometry, and caller-owned progress styling.

## What belongs in the catalog

A component graduates when it has:

- the same semantic and accessibility outcomes in Vue, React, and Svelte;
- framework-native, readable source;
- keyboard and focus proof where relevant;
- source-application evidence from Hagfish, Slipway, or another Boring Stack app;
- safe installation, re-installation, and dependency metadata;
- a neutral default that does not fight product styling;
- documented Durable UI behavior where state or interaction must recover.

The catalog grows by proving contracts, not by maximizing component count.
