---
title: Row Actions
titleTemplate: Klean UI
description: A durable action group for application rows with real links and buttons, optional Menu overflow, truthful busy state, and caller-owned Tailwind across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import RowActionsRecipes from '../../.vitepress/theme/components/klean/row-actions/RowActionsRecipes.vue'
import rowActionsSource from '../../.vitepress/theme/components/klean/row-actions/RowActions.vue?raw'
import menuSource from '../../.vitepress/theme/components/klean/menu/Menu.vue?raw'
import popoverSource from '../../.vitepress/theme/components/klean/popover/Popover.vue?raw'
import reactSource from '../sources/row-actions/RowActions.jsx?raw'
import svelteSource from '../sources/row-actions/RowActions.svelte?raw'
import vueUsage from '../snippets/row-actions/usage.vue?raw'
import reactUsage from '../snippets/row-actions/usage.jsx?raw'
import svelteUsage from '../snippets/row-actions/usage.svelte?raw'

const vueFiles = [
  {
    filename: 'Popover.vue',
    destination: 'assets/js/components/ui/popover/Popover.vue',
    source: popoverSource
  },
  {
    filename: 'Menu.vue',
    destination: 'assets/js/components/ui/menu/Menu.vue',
    source: menuSource
  },
  {
    filename: 'RowActions.vue',
    destination: 'assets/js/components/ui/row-actions/RowActions.vue',
    source: rowActionsSource
  }
]
</script>

# Row Actions

Row Actions keeps the commands and destinations for one application record together. Frequent destinations can remain visible. Secondary actions can sit behind one compact overflow trigger. Every item is still the real anchor, Boring Stack Link, or button that the application intended.

It is one component, not a family of `RowAction`, `RowActionItem`, or `RowActionTrigger` wrappers. There is no action schema, permission callback, visual variant, mutation client, or confirmation prop. The caller writes ordinary semantic markup and styles it with Tailwind.

<KleanPreview id="row-actions-products" :source="vueUsage" filename="ServiceActions.vue">
  <template #preview>
    <RowActionsRecipes />
  </template>
  <template #caption>
    Hagfish keeps invoice actions graphic and direct. Slipway keeps service actions quiet and operational. The component contract stays the same.
  </template>
</KleanPreview>

## Installation

The command detects Vue, React, or Svelte, copies the matching source, and adds its Menu and Popover dependencies into the same conventional UI directory.

<KleanInstallation
  id="row-actions-installation"
  component="row-actions"
  :source="rowActionsSource"
  filename="RowActions.vue"
  destination="assets/js/components/ui/row-actions/RowActions.vue"
  :files="vueFiles"
  :dependencies="['tailwind-merge']"
/>

There is no initializer, provider, `klean-ui.json`, class helper, barrel file, or runtime Klean dependency.

## Usage

Keep the most frequent action visible when that genuinely saves work. Put secondary commands and destinations in the overflow content.

### Vue

<CopyCode :code="vueUsage" label="ServiceActions.vue" />

### React

<CopyCode :code="reactUsage" label="ServiceActions.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ServiceActions.svelte" />

## API

| Purpose            | Vue             | React       | Svelte             |
| ------------------ | --------------- | ----------- | ------------------ |
| Visible actions    | default slot    | `children`  | `children` snippet |
| Overflow actions   | `#menu` slot    | `menu`      | `menu` snippet     |
| Trigger contents   | `#trigger` slot | `trigger`   | `trigger` snippet  |
| Accessible name    | `label`         | `label`     | `label`            |
| Pending operation  | `busy`          | `busy`      | `busy`             |
| Stable overflow ID | `id`            | `id`        | `id`               |
| Preferred position | `placement`     | `placement` | `placement`        |
| Trigger gap        | `offset`        | `offset`    | `offset`           |
| Root styling       | `class`         | `className` | `class`            |

`label` defaults to “Actions.” Use a record-specific label such as “Actions for invoice INV-1042” whenever several action groups appear on the page. `placement` defaults to `bottom-end`, `offset` defaults to `4`, and collision handling may move the menu when the preferred side has no room.

If no overflow content is supplied, Row Actions renders no trigger or menu. If overflow exists, the default trigger is a compact ellipsis button. Replace only its visual contents when the application already has an established icon treatment; Row Actions keeps the button semantics and relationship.

## Durable application behavior

Navigation stays navigation. Use a native anchor or framework-native Inertia Link so URLs remain openable in a new tab, copyable, server-renderable, and recoverable after reload. Row Actions does not convert destinations into click callbacks.

Commands stay buttons. The application owns the router request, processing state, result message, authorization, and server validation. Pass `busy` while an operation makes another overflow choice unsafe; the menu closes and its trigger becomes unavailable, while caller-owned visible actions remain truthful rather than being silently disabled.

Row Actions stops pointer and click propagation at its root so an action inside a clickable table row does not also activate the row. It does not prevent the link or button's own default behavior.

## Permissions and destructive actions

Render only actions the current response authorizes. Ordinary framework conditionals are clearer than a component permission language, and the server still enforces the operation.

A destructive menu item should open a [Dialog](/klean-ui/components/dialog) that names the record and consequence. The Dialog owns confirmation and focus containment; the application owns the request and pending state. Do not make the first click delete the record, and do not ask Row Actions to guess which commands are destructive.

## Keyboard and accessibility

- The root is a named `group`, so repeated action sets remain distinguishable.
- Visible links and buttons keep their native Tab behavior.
- The overflow trigger exposes its menu relationship and expanded state.
- Arrow Down or Arrow Up on the trigger opens the menu at the first or last enabled item.
- Inside the menu, Arrow keys, Home, End, typeahead, Tab, and Escape follow the established [Menu](/klean-ui/components/menu) contract.
- Selecting an item closes the menu and restores trigger focus when appropriate.
- Disabled or `aria-disabled` menu items are skipped and cannot accidentally activate.
- `busy` is exposed on the group and disables only the overflow trigger.
- The caller supplies complete visible labels, focus-visible Tailwind classes, and any live result message.

## Styling with Tailwind

Row Actions supplies only a compact inline layout and a neutral trigger. `class` or `className` merges onto the group. The visible actions, overflow items, and optional trigger contents are caller markup, so Tailwind is their entire visual API.

There is no `variant`, `tone`, `size`, `destructive`, `itemClass`, or product theme prop. When several rows share one treatment, create a small application component around the copied source and the product's ordinary classes.

## When to use

Use Row Actions for one record in a Table, DataTable, card list, invoice list, member list, deployment history, or similar repeated application surface. It is especially useful when one common destination should stay visible and less frequent choices need compact overflow.

## When not to use

- Use a plain [Button](/klean-ui/components/button) or Link when the record has only one action.
- Use [Menu](/klean-ui/components/menu) directly when the trigger is not part of a repeated row action group.
- Use [Command](/klean-ui/components/command) for application-wide search and command discovery.
- Use a visible page toolbar for actions that apply to the whole result rather than one record.
- Do not hide the row's only important task behind an ellipsis merely to make the layout sparse.

## Complete framework source

### Vue

<CopyCode :code="rowActionsSource" label="RowActions.vue" />

### React

<CopyCode :code="reactSource" label="RowActions.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="RowActions.svelte" />

## Related components

- [DataTable](/klean-ui/components/data-table) — coordinates server-owned rows, sorting, selection, and pagination around per-row actions.
- [Table](/klean-ui/components/table) — provides the semantic table markup that may contain action cells.
- [Menu](/klean-ui/components/menu) — supplies overflow keyboard behavior and truthful link/button items.
- [Button](/klean-ui/components/button) — represents a visible row command.
- [Dialog](/klean-ui/components/dialog) — confirms destructive row operations.
- [Tooltip](/klean-ui/components/tooltip) — supplements a terse icon trigger when visible text cannot fit.
