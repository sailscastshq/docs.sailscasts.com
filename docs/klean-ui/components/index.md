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

### [Alert](/klean-ui/components/alert)

A shallow notice surface with silent defaults, explicit announcement semantics, native headings and lists, real actions, and caller-owned Tailwind styling.

### [Avatar](/klean-ui/components/avatar)

One resilient identity image with an accessible fallback, explicit informative or decorative naming, browser-native image behavior, and caller-owned Tailwind styling.

### [Badge](/klean-ui/components/badge)

One static inline metadata span for visible labels, counts, and compact statuses, with caller-owned Tailwind and truthful notification composition.

### [Button](/klean-ui/components/button)

A native-first action primitive that can render a truthful button, anchor, or Boring Stack Link. It handles safe type defaults, disabled semantics, attribute forwarding, and caller-owned Tailwind classes.

### [Icons](/klean-ui/components/icons)

Original source-owned SVG marks on one calm 24px grid, with exact Vue, React, and Svelte components, native attribute forwarding, and caller-owned Tailwind styling.

### [Card](/klean-ui/components/card)

One shallow semantic surface with native application content, truthful whole-card links or actions, explicit multiple-action composition, and caller-owned Tailwind styling.

### [Input](/klean-ui/components/input)

A styled native input that forwards native attributes and framework-native value binding. Labels, help, errors, IDs, validation, and layout remain visible application markup.

### [Textarea](/klean-ui/components/textarea)

A styled native textarea whose durable presentation grows from its current value and responsive width. Caller Tailwind can take ownership of height and resizing without a component prop.

### [Checkbox](/klean-ui/components/checkbox)

A native-first checked value for booleans, collection membership, and real indeterminate selection. Browser form and accessibility behavior stay intact while labels, groups, validation, and product styling remain visible application markup.

### [Radio](/klean-ui/components/radio)

A native-first mutually exclusive choice for short visible lists. Shared names, fieldsets, legends, labels, keyboard behavior, validation, and form submission remain browser semantics while caller Tailwind owns the presentation.

### [Switch](/klean-ui/components/switch)

A native-first boolean setting that takes effect immediately, with real checked state, browser keyboard and form behavior, honest optimistic rollback recipes, and caller-owned Tailwind styling.

### [Separator](/klean-ui/components/separator)

One native-first semantic boundary: a native horizontal rule, a correct vertical ARIA bridge, and caller-owned Tailwind for the rare places where spacing is not enough.

### [Spinner](/klean-ui/components/spinner)

A calm decorative mark for indeterminate work, with caller-owned Tailwind styling and truthful busy and status semantics left in visible application markup.

### [Tooltip](/klean-ui/components/tooltip)

Short supplementary text for one semantic button or link, with accessible hover, focus, dismissal, collision handling, and caller-owned Tailwind styling.

### [Breadcrumb](/klean-ui/components/breadcrumb)

Durable location hierarchy with framework-native Inertia links, truthful current-page semantics, one responsive ordered trail, and caller-owned Tailwind styling.

### [Tabs](/klean-ui/components/tabs)

Accessible peer panels with roving focus, automatic or manual activation, dynamic removal, overflow reveal, and caller-owned native buttons and Tailwind styling.

### [Table](/klean-ui/components/table)

A native table with a neutral baseline, caller-written captions, sections, headers, rows, cells, and actions, plus an explicit boundary before stateful Data Table behavior.

### [DataTable](/klean-ui/components/data-table)

A durable server-driven table block with one native table, page-scoped selection, clean Inertia URL queries, truthful pending state, and caller-owned application markup.

### [Row Actions](/klean-ui/components/row-actions)

A compact group of real row links and buttons with optional accessible overflow, truthful busy state, row-click isolation, and caller-owned Tailwind styling.

### [Bulk Actions](/klean-ui/components/bulk-actions)

A selected-record action region with a polite count, real caller-authored links and buttons, truthful busy state, and deliberate focus recovery.

### [Empty State](/klean-ui/components/empty-state)

One shallow empty-result layout with caller-owned semantic headings, explicit reasons, real next actions, and ordinary Tailwind.

### [Loading State](/klean-ui/components/loading-state)

One truthful pending-content status layout with caller-owned busy regions, useful copy, product marks, skeleton markup, and ordinary Tailwind.

### [Error State](/klean-ui/components/error-state)

One shallow failed-content layout with caller-owned announcement semantics, recovery controls, safe diagnostics, and ordinary Tailwind.

### [Filter Bar](/klean-ui/components/filter-bar)

A native filter form with separate draft and committed state, immediate active-filter removal, pending safety, deterministic URLs, and caller-owned controls and Tailwind.

### [FileUpload](/klean-ui/components/file-upload)

One native file-selection bridge with honest validation, previews, drop behavior, and caller-owned upload markup.

### [Sparkline](/klean-ui/components/sparkline)

A compact trend beside an exact value, with truthful decorative defaults, honest missing-data gaps, and caller-owned Tailwind styling.

### [Line Chart](/klean-ui/components/line-chart)

A calm captioned trend with exact accessible values from the same data, resilient empty and missing states, and caller-owned Tailwind styling.

### [Pagination](/klean-ui/components/pagination)

Durable server-list navigation with framework-native Inertia links, canonical page URLs, truthful edges, compact mobile output, and application-owned query state.

### [Popover](/klean-ui/components/popover)

A native-first non-modal floating surface with light dismissal, focus return, collision-aware positioning, and ordinary semantic content. A real button invokes it through the browser's `popovertarget` relationship.

### [Menu](/klean-ui/components/menu)

An accessible list of truthful button actions and link destinations built on Klean Popover. It adds roving focus, Arrow keys, Home/End, typeahead, disabled-item behavior, selection, and durable focus return while caller Tailwind owns the product treatment.

### [Select](/klean-ui/components/select)

A one-component fixed-list value picker with typed values, grouped and disabled options, full keyboard behavior, ordinary form participation, and caller-owned Tailwind. Editable search remains a separate Combobox contract.

### [Combobox](/klean-ui/components/combobox)

An editable search-and-choose input for long or remotely loaded lists, with typed values, local filtering, stable loading and error states, full keyboard behavior, and application-owned request policy.

### [Command](/klean-ui/components/command)

A pragmatic searchable composition for application actions and destinations, with stable input focus, active-descendant keyboard behavior, explicit keywords, nested-flow seams, and application-owned routes and work.

### [Dialog](/klean-ui/components/dialog)

A native modal surface with platform focus containment, inert background behavior, native commands and dialog forms, durable dismissal policy, and application-owned semantic content.

### [Sheet](/klean-ui/components/sheet)

A native off-canvas dialog for mobile navigation, comments, inspectors, and focused edge workflows, with caller-owned placement, semantic content, and Tailwind styling.

### [Sidebar](/klean-ui/components/sidebar)

A durable native desktop aside with remembered visibility, honest closed-state semantics, and application-owned links, navigation, and Tailwind styling.

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
