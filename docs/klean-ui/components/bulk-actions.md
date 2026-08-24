---
title: Bulk Actions
titleTemplate: Klean UI
description: A durable selected-record action region with a polite count, real caller-authored actions, truthful busy state, and focus recovery across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import BulkActionsRecipes from '../../.vitepress/theme/components/klean/bulk-actions/BulkActionsRecipes.vue'
import bulkActionsSource from '../../.vitepress/theme/components/klean/bulk-actions/BulkActions.vue?raw'
import reactSource from '../sources/bulk-actions/BulkActions.jsx?raw'
import svelteSource from '../sources/bulk-actions/BulkActions.svelte?raw'
import vueUsage from '../snippets/bulk-actions/usage.vue?raw'
import reactUsage from '../snippets/bulk-actions/usage.jsx?raw'
import svelteUsage from '../snippets/bulk-actions/usage.svelte?raw'
</script>

# Bulk Actions

Bulk Actions gives a selected set of application records one clear action region. It announces the current count, provides a default way to clear selection, and leaves every real destination and command in caller markup.

It accepts the count, never the selected IDs. Selection, authorization, requests, confirmation, success messages, and positioning remain application concerns. There is no action schema, visual variant, mutation client, permission callback, or toolbar state machine.

<KleanPreview id="bulk-actions-products" :source="vueUsage" filename="ServiceBulkActions.vue">
  <template #preview>
    <BulkActionsRecipes />
  </template>
  <template #caption>
    Hagfish can keep its graphic invoice treatment while Slipway Bridge keeps its compact operational menu. Both use the same semantic contract.
  </template>
</KleanPreview>

## Installation

The command detects Vue, React, or Svelte and copies the matching source into the conventional UI directory.

<KleanInstallation
  id="bulk-actions-installation"
  component="bulk-actions"
  :source="bulkActionsSource"
  filename="BulkActions.vue"
  destination="assets/js/components/ui/bulk-actions/BulkActions.vue"
  :dependencies="['tailwind-merge']"
/>

There is no initializer, provider, `klean-ui.json`, class helper, barrel file, or runtime Klean dependency.

## Usage

Pass only the number selected. Keep the selected IDs where the table or page already owns them, and write real Links and buttons inside the action region.

### Vue

<CopyCode :code="vueUsage" label="ServiceBulkActions.vue" />

### React

<CopyCode :code="reactUsage" label="ServiceBulkActions.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ServiceBulkActions.svelte" />

## API

| Purpose           | Vue             | React        | Svelte             |
| ----------------- | --------------- | ------------ | ------------------ |
| Selected count    | `count`         | `count`      | `count`            |
| Accessible name   | `label`         | `label`      | `label`            |
| Pending operation | `busy`          | `busy`       | `busy`             |
| Clear copy        | `clearLabel`    | `clearLabel` | `clearLabel`       |
| Clear selection   | `@clear`        | `onClear`    | `onclear`          |
| Actions           | default slot    | `children`   | `children` snippet |
| Count summary     | `#summary` slot | `summary`    | `summary` snippet  |
| Root styling      | `class`         | `className`  | `class`            |

`label` defaults to “Bulk actions,” and `clearLabel` defaults to “Clear selection.” Use a result-specific name such as “Actions for selected invoices” when more than one selectable result appears on a page.

The action and summary render functions receive `{ count, busy, clear }`. Use them when custom copy or a product wrapper benefits from the current normalized count. The component renders nothing when `count` is zero.

## Selection and focus

Bulk selection normally belongs to [DataTable](/klean-ui/components/data-table) or the surrounding page. Keep the selected IDs there and pass only `selectedIds.length` to Bulk Actions. Clearing emits one event; the caller resets its own selection.

Add `data-bulk-actions-focus` to the page-level checkbox or control that should receive focus when a focused action region disappears. Klean restores focus only for the zero-selection transition and only when focus was inside that disappearing region. It does not steal focus during ordinary count updates or unrelated page changes.

## Links, commands, and menus

Use an anchor or framework-native Inertia Link for destinations so open-in-new-tab, copy-link, reload, server rendering, and browser history keep working. Use a button for commands. If several secondary commands need compact overflow, place a [Menu](/klean-ui/components/menu) trigger and menu inside the default content.

The component never turns an action description into a click handler. Render only actions authorized by the current server response, and enforce the same authorization on the server.

## Busy and destructive work

`busy` truthfully marks the region busy and disables the default clear control. Caller actions remain caller-owned: disable only the commands that the pending operation truly makes unsafe. This keeps links usable and prevents one broad boolean from lying about every action.

A destructive action should open a [Dialog](/klean-ui/components/dialog) that names the selected records and the consequence. The application owns confirmation, the request, progress, failure recovery, and the final selection state.

## Placement and responsive behavior

Bulk Actions is an action region, not a positioning system. Put it inline above a table, make it sticky below a filter bar, or fix it near the viewport edge with ordinary caller Tailwind. This avoids hidden offsets and lets each application account for its own header, safe area, and small-screen layout.

The neutral baseline wraps actions when space narrows. Keep the summary concise, preserve visible labels for destructive work, and move secondary commands into Menu when a crowded toolbar would become difficult to scan.

## Keyboard and accessibility

- The root is a named `region`, so assistive technology can identify which selected result it controls.
- The count is a polite, atomic status message.
- Links and buttons retain native keyboard, focus, and activation behavior.
- The default clear control is a real button with visible text.
- `aria-busy` appears only while `busy` is true.
- Focus returns deliberately when a focused toolbar disappears after clearing.
- Caller actions provide their own focus-visible Tailwind classes and complete accessible names.

## Styling with Tailwind

Bulk Actions supplies a neutral wrapping layout. `class` or `className` merges onto the root, while every action is caller markup and therefore styled with ordinary Tailwind.

There is no `variant`, `tone`, `size`, `sticky`, `floating`, `actionClass`, or product theme prop. If an application repeats one treatment, wrap the copied source in a small product component with that application's classes.

## When to use

Use Bulk Actions when a user selects multiple rows, invoices, services, members, deployments, or other records and needs actions that apply to that set.

## When not to use

- Use [Row Actions](/klean-ui/components/row-actions) for commands that apply to one record.
- Use a normal page toolbar for commands that do not depend on selection.
- Use [Filter Bar](/klean-ui/components/filter-bar) for changing which results are visible.
- Do not use bulk actions when the operation cannot clearly name or count its target set.

## Complete framework source

### Vue

<CopyCode :code="bulkActionsSource" label="BulkActions.vue" />

### React

<CopyCode :code="reactSource" label="BulkActions.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="BulkActions.svelte" />

## Related components

- [DataTable](/klean-ui/components/data-table) — owns server results and page-scoped selection around the action region.
- [Checkbox](/klean-ui/components/checkbox) — provides the page or row selection controls.
- [Menu](/klean-ui/components/menu) — keeps secondary bulk commands accessible without an action schema.
- [Dialog](/klean-ui/components/dialog) — confirms destructive operations against the selected set.
- [Row Actions](/klean-ui/components/row-actions) — groups commands and destinations for one record.
- [Filter Bar](/klean-ui/components/filter-bar) — changes the result set without owning its selection actions.
