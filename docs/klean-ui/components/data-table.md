---
title: DataTable
titleTemplate: Klean UI
description: A durable server-driven table block with native markup, page-scoped selection, clean Inertia URLs, and caller-owned Tailwind across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import DataTableRecipes from '../../.vitepress/theme/components/klean/data-table/DataTableRecipes.vue'
import dataTableSource from '../../.vitepress/theme/components/klean/data-table/DataTable.vue?raw'
import vueQuerySource from '../../.vitepress/theme/components/klean/data-table/useDataTableQuery.js?raw'
import tableSource from '../../.vitepress/theme/components/klean/table/Table.vue?raw'
import reactSource from '../sources/data-table/DataTable.jsx?raw'
import reactQuerySource from '../sources/data-table/useDataTableQuery.react.js?raw'
import svelteSource from '../sources/data-table/DataTable.svelte?raw'
import svelteQuerySource from '../sources/data-table/dataTableQuery.svelte.js?raw'
import vueUsage from '../snippets/data-table/usage.vue?raw'
import reactUsage from '../snippets/data-table/usage.jsx?raw'
import svelteUsage from '../snippets/data-table/usage.svelte?raw'
import bridgeSource from '../snippets/data-table/bridge.vue?raw'

const installationFiles = [
  {
    filename: 'Table.vue',
    destination: 'assets/js/components/ui/table/Table.vue',
    source: tableSource
  },
  {
    filename: 'DataTable.vue',
    destination: 'assets/js/components/ui/data-table/DataTable.vue',
    source: dataTableSource
  },
  {
    filename: 'useDataTableQuery.js',
    destination: 'assets/js/components/ui/data-table/useDataTableQuery.js',
    source: vueQuerySource
  }
]

const durableQueryUsage = `import { computed } from 'vue'
import { useDataTableQuery } from '@/components/ui/data-table/useDataTableQuery.js'

const props = defineProps({
  query: { type: Object, required: true }
})

const dataTable = useDataTableQuery({
  url: '/bridge/services',
  query: computed(() => props.query),
  defaults: {
    page: 1,
    search: '',
    filters: {},
    sort: 'createdAt DESC'
  },
  only: ['services', 'total', 'query']
})`

const sortUsage = `<Input
  v-model="dataTable.search.value"
  type="search"
  aria-label="Search services"
/>

<th scope="col" :aria-sort="dataTable.ariaSort('name')">
  <button v-bind="dataTable.sortButton('name', 'service name')">
    Service
  </button>
</th>

<button
  type="button"
  @click="dataTable.visit({ filters: { status: 'failed' }, page: 1 })"
>
  Failed services
</button>`
</script>

# DataTable

DataTable coordinates a real native table for server-driven application work. It keeps selection honest across the current page, exposes a truthful busy state, and offers an optional Inertia query helper so search, sort, filters, and pagination survive refresh, sharing, and Back/Forward.

The application still writes the caption, headers, rows, cells, links, actions, empty state, and every Tailwind class. There is no column schema, visual variant API, client-side data engine, or hidden link abstraction.

<KleanPreview id="data-table-bridge" :source="bridgeSource" filename="BridgeServices.vue">
  <template #preview>
    <DataTableRecipes />
  </template>
  <template #caption>
    A Slipway-style operational surface built from one native table. Search, selection, sorting, destinations, and row actions remain ordinary application markup.
  </template>
</KleanPreview>

## Installation

The command detects Vue, React, or Svelte, installs the framework's Inertia adapter and `tailwind-merge`, and writes DataTable, its query helper, and the Table registry dependency into the conventional UI directories.

<KleanInstallation
  id="data-table-installation"
  component="data-table"
  :source="dataTableSource"
  filename="DataTable.vue"
  destination="assets/js/components/ui/data-table/DataTable.vue"
  :files="installationFiles"
  :dependencies="['@inertiajs/vue3', 'tailwind-merge']"
/>

The query helper is included because DataTable is intended for Boring Stack applications. Ignore it when the page already owns an equivalent server-query contract; the component itself does not require the helper at render time.

## Table or DataTable?

Use [Table](/klean-ui/components/table) when the page already has rows and only needs native tabular markup. Use DataTable when several server-owned list concerns must behave as one experience: search, filters, sorting, pagination, selection, and pending navigation.

DataTable composes Table rather than replacing it. Migrating a Table keeps the same `<caption>`, `<thead>`, `<tbody>`, `<th>`, `<td>`, links, buttons, and Tailwind classes.

## Usage

### Vue

<CopyCode :code="vueUsage" label="ServicesTable.vue" />

### React

<CopyCode :code="reactUsage" label="ServicesTable.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ServicesTable.svelte" />

## Component API

| Input                           | Default   | Purpose                                                                                           |
| ------------------------------- | --------- | ------------------------------------------------------------------------------------------------- |
| `rows`                          | `[]`      | The rows rendered on the current server page.                                                     |
| `rowKey`                        | `id`      | A property name or function that returns each stable row key.                                     |
| `selectable`                    | every row | Returns `false` for rows the current user cannot select.                                          |
| `selected`                      | `[]`      | Framework-native controlled or bindable selected keys.                                            |
| `busy`                          | `false`   | Marks the native table busy and prevents duplicate selection while keeping current rows readable. |
| `class` / `className`           | —         | Tailwind classes for the responsive scroll container.                                             |
| `tableClass` / `tableClassName` | —         | Tailwind classes for the native Table.                                                            |
| default content                 | required  | Native caption, sections, rows, headers, cells, links, buttons, and empty states.                 |

The content function or slot receives:

| Value                         | Purpose                                                                |
| ----------------------------- | ---------------------------------------------------------------------- |
| `rows`                        | The same current-page rows.                                            |
| `selected`, `selectedCount`   | Current selected keys and count.                                       |
| `allSelected`, `someSelected` | Truthful current-page selection state.                                 |
| `rowSelection(row, label?)`   | Props for one Klean Checkbox, including an automatic accessible label. |
| `pageSelection(label?)`       | Props for the current-page Checkbox, including its mixed state.        |
| `isSelected(row)`             | Tests one visible row key.                                             |
| `clearSelection()`            | Clears the current page selection.                                     |
| `removeSelection(keys)`       | Removes completed or failed keys after a bulk action.                  |

Selection is deliberately page-scoped. When navigation, filtering, or permissions remove a row from the current result, its key leaves the selection. Cross-page selection requires a separate application-owned model because “all matching records” has server consequences that a component must not guess.

## Durable server queries

`useDataTableQuery` for Vue and React, and `createDataTableQuery` for Svelte, keep the visible server query recoverable without making DataTable own application routes.

<CopyCode :code="durableQueryUsage" label="BridgeServices.vue" />

The helper follows these conventions:

- search waits briefly while the user types, replaces the current history entry, and returns to page 1;
- committed filters, sorts, and page changes create normal visits;
- current rows stay visible during navigation;
- scroll and local page state are preserved;
- optional `only` values request the smallest useful Inertia prop set;
- server props remain the source of truth when Back or Forward changes the URL;
- default `page=1`, empty search, and empty filters disappear from the URL;
- unrelated query parameters and the URL hash remain intact;
- sorting uses the familiar `field ASC` / `field DESC` grammar;
- focus returns to the initiating control after the server response.

Use the returned helpers directly in native controls:

<CopyCode :code="sortUsage" label="BridgeServices.vue" />

The server still validates search, filter, sort, and page values. It returns the current rows, total, canonical query, authorization decisions, and any recoverable error. DataTable does not duplicate Waterline queries in the browser.

## Links and actions stay truthful

A service name that opens a destination is an `<a>` or the Boring Stack `<Link>`. Sorting, filtering, bulk actions, and row menus are buttons. DataTable does not hide those decisions behind `onRowClick`, a route prop, or a cell configuration object.

This keeps Cmd/Ctrl-click, open-in-new-tab, copied URLs, Inertia navigation, and assistive technology behavior intact.

## Loading, empty, and error states

- Keep the current rows mounted when `busy` is true. Disable duplicate selection and show a nearby [Spinner](/klean-ui/components/spinner) only when it adds useful feedback.
- Render “No records yet” when the collection is genuinely empty.
- Render “No matching records” when filters or search produced zero rows, with a real control to clear them.
- Render a nearby [Alert](/klean-ui/components/alert) for a recoverable server failure. Do not turn the table into an error role.
- After a bulk mutation, call `removeSelection(succeededKeys)` and leave failed rows selected when retrying them is useful.

## Accessibility and responsive behavior

- Give every table a visible `<caption>` or a visually hidden caption when nearby visible context already provides the same name.
- Use `<th scope="col">` for column headers and `<th scope="row">` for the row's primary identity.
- Put a real button inside a sortable header and update `aria-sort` on that `<th>`.
- Give repeated links and actions specific names such as “Actions for api”.
- DataTable announces the selection count and supplies a real mixed current-page checkbox.
- Keep every current row in one native table. The outer DataTable container scrolls horizontally when caller-owned `min-w-*` classes need more room.
- When wide operational tables need more context on small screens, use caller-owned `sticky` classes to keep selection and the primary row identity visible while the remaining columns scroll.
- Do not collapse a data relationship into cards merely to avoid horizontal scrolling. Use a list when the content was not tabular in the first place.

## Styling with Tailwind

The wrapper, table, caption, headers, cells, statuses, links, actions, empty state, and pagination are styled where they are written. There is no `variant`, density prop, column style object, Klean color, or global DataTable theme.

Build a small product wrapper when several pages share one treatment. Slipway can preserve Bridge's dense dark operational surface; Hagfish can use its editorial borders and typography from the same component contract.

## When not to use

- Use [Table](/klean-ui/components/table) for a static report or a small result that does not coordinate list state.
- Use a semantic list for independent records without meaningful columns.
- Use [Combobox](/klean-ui/components/combobox) when the task is finding and choosing one value, not inspecting a result set.
- Use [Command](/klean-ui/components/command) for a searchable collection of actions and destinations.
- Do not use DataTable for spreadsheet-style cell editing; editable invoice lines are usually a responsive form/list with explicit controls.

## Complete framework source

The installer writes both the component and the framework-native query helper. Table is installed as a registry dependency.

### Vue

<CopyCode :code="dataTableSource" label="DataTable.vue" />

<CopyCode :code="vueQuerySource" label="useDataTableQuery.js" />

### React

<CopyCode :code="reactSource" label="DataTable.jsx" />

<CopyCode :code="reactQuerySource" label="useDataTableQuery.js" />

### Svelte

<CopyCode :code="svelteSource" label="DataTable.svelte" />

<CopyCode :code="svelteQuerySource" label="dataTableQuery.svelte.js" />

## Related components

- [Table](/klean-ui/components/table) — the native semantic primitive DataTable composes.
- [Checkbox](/klean-ui/components/checkbox) — page and row selection with a real mixed state.
- [Input](/klean-ui/components/input) — searchable server queries.
- [Select](/klean-ui/components/select) and [Combobox](/klean-ui/components/combobox) — fixed and searchable filters.
- [Menu](/klean-ui/components/menu) — truthful row and bulk actions.
- [Pagination](/klean-ui/components/pagination) — durable server-page links.
- [Alert](/klean-ui/components/alert) — recoverable query and mutation failures.
- [Spinner](/klean-ui/components/spinner) — supplementary pending feedback.
