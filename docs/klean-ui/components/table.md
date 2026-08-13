---
title: Table
titleTemplate: Klean UI
description: A native table with a neutral baseline, caller-owned semantic children, and ordinary Tailwind styling across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanTable from '../../.vitepress/theme/components/klean/table/Table.vue'
import TableRecipes from '../../.vitepress/theme/components/klean/table/TableRecipes.vue'
import tableSource from '../../.vitepress/theme/components/klean/table/Table.vue?raw'
import reactSource from '../sources/table/Table.jsx?raw'
import svelteSource from '../sources/table/Table.svelte?raw'
import vueUsage from '../snippets/table/usage.vue?raw'
import reactUsage from '../snippets/table/usage.jsx?raw'
import svelteUsage from '../snippets/table/usage.svelte?raw'
import productSource from '../snippets/table/products.vue?raw'

const services = [
  { name: 'api', dependency: 'PostgreSQL 17', status: 'Healthy', memory: '384 MB' },
  { name: 'worker', dependency: 'Redis 8', status: 'Deploying', memory: '192 MB' },
  { name: 'web', dependency: '—', status: 'Healthy', memory: '256 MB' }
]

</script>

# Table

Table is a thin native `<table>` with a neutral typographic baseline. The application writes the caption, column and row headers, sections, cells, actions, responsive wrapper, and every product-specific Tailwind class directly.

That is the complete API. Klean does not replace the browser's table model with an item schema, render callbacks, anatomy components, or visual variants.

<KleanPreview id="table-source" :source="tableSource" filename="Table.vue">
  <template #preview>
    <div
      class="w-full max-w-3xl overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
    >
      <KleanTable class="min-w-160">
        <caption class="caption-top px-4 py-3 text-left text-base font-semibold">
          Production services
        </caption>
        <thead class="bg-gray-50 text-xs uppercase tracking-wider text-gray-600 dark:bg-gray-900 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-4 py-3 font-medium">Service</th>
            <th scope="col" class="px-4 py-3 font-medium">Dependency</th>
            <th scope="col" class="px-4 py-3 font-medium">Status</th>
            <th scope="col" class="px-4 py-3 text-right font-medium">Memory</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="service in services" :key="service.name">
            <th scope="row" class="px-4 py-3 font-mono font-medium">
              {{ service.name }}
            </th>
            <td class="px-4 py-3 text-gray-600 dark:text-gray-300">
              {{ service.dependency }}
            </td>
            <td class="px-4 py-3">{{ service.status }}</td>
            <td class="px-4 py-3 text-right tabular-nums">{{ service.memory }}</td>
          </tr>
        </tbody>
      </KleanTable>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/table/Table.vue

  </template>
  <template #caption>
    The wrapper owns overflow. The browser still exposes one native captioned table.
  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and writes one framework-native source file into the conventional component directory:

<KleanInstallation
  id="table-installation"
  component="table"
  :source="tableSource"
  filename="Table.vue"
  destination="assets/js/components/ui/table/Table.vue"
  :dependencies="['tailwind-merge']"
/>

There is no initializer, configuration file, provider, `TableHeader`, `TableRow`, `TableCell`, barrel file, or runtime package.

## Usage

Use Table for the root and write ordinary HTML beneath it. This keeps semantics visible in reviews and puts Tailwind exactly where the visual decision belongs.

### Vue

<CopyCode :code="vueUsage" label="ServicesTable.vue" />

### React

<CopyCode :code="reactUsage" label="ServicesTable.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ServicesTable.svelte" />

## API

| Input                 | Default | Purpose                                                                   |
| --------------------- | ------- | ------------------------------------------------------------------------- |
| `class` / `className` | —       | Ordinary Tailwind classes merged after the neutral table baseline.        |
| native attributes     | —       | IDs, test hooks, ARIA attributes, and other native table attributes.      |
| default content       | —       | Native caption, sections, rows, headers, cells, links, buttons, and text. |

Table forwards a framework-native element reference. It owns no rows, sorting, filtering, selection, pagination, loading, or empty state.

## Write the table you mean

Native elements already express the relationships a data grid needs:

- give the table an accessible name with a visible `<caption>` or a visually hidden one when nearby visible context already names it;
- use `<thead>`, `<tbody>`, and `<tfoot>` to group rows when those sections exist;
- use `<th scope="col">` for column headers and `<th scope="row">` for row headers;
- put buttons around sortable header labels only when sorting exists, then update `aria-sort` on the sorted header;
- give repeated row actions a specific accessible name, such as “Inspect api”, even if the visible label is only “Inspect”.

Do not add ARIA table roles to native table elements. Do not use Table for layout.

## Responsive tables

Tables describe two-dimensional relationships. Preserve that structure at narrow widths and let an explicit wrapper scroll:

```html
<p id="services-scroll-help" class="text-sm text-gray-600">
  Scroll horizontally to see every service field.
</p>
<div
  class="overflow-x-auto"
  tabindex="0"
  aria-describedby="services-scroll-help"
>
  <table class="min-w-160">
    <!-- native table content -->
  </table>
</div>
```

The focusable wrapper makes keyboard scrolling available where the browser does not already expose it. Do not turn rows or cells into `display: block`; that can obscure the relationships that made a table appropriate.

## Slipway and Hagfish recipes

The same Table can carry Slipway's dense operational results and Hagfish's editorial reporting voice because neither treatment is hidden behind a product variant.

<KleanPreview id="table-products" :source="productSource" filename="ProductTables.vue">
  <template #preview>
    <TableRecipes />

  </template>
  <template #caption>
    Hagfish's editable invoice items remain a responsive form/list. A report ledger is tabular; a collection of editable controls is not.
  </template>
</KleanPreview>

## Table or Data Table?

Use Table when the application already has rows to render and native markup expresses the experience. It is enough for reports, invoices, query results, audit history, comparison matrices, and small operational lists.

A future Data Table will compose Table when users need a coordinated stateful system: sorting, filtering, column visibility, selection, pagination, or server-backed loading. That state should be durable in the URL when it changes what the user is looking at, so reload, sharing, Back/Forward, and server rendering preserve the same view.

Keeping the layers separate avoids making every small table configure features it does not use. Moving from Table to Data Table should preserve the native rows and cells rather than require a new visual language.

## When to use

Use Table when rows and columns have relationships that users need to compare or scan: database results, deployments, invoices, audit events, billing records, permissions, and compact reports.

## When not to use

- Use a list when each item stands alone and column alignment adds no meaning.
- Use cards when each item has a different content shape or a strong independent action hierarchy.
- Keep editable invoice line items as a responsive form/list when controls must reflow naturally on small screens.
- Wait for Data Table when the primary problem is coordinated sort, filter, selection, pagination, and server state rather than markup.

## Complete framework source

Copy, inspect, and change the complete one-file source for your framework.

### Vue source

<CopyCode :code="tableSource" label="Table.vue" />

### React source

<CopyCode :code="reactSource" label="Table.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Table.svelte" />

## Related components

- [Button](/klean-ui/components/button) — supplies truthful row and header actions.
- [Checkbox](/klean-ui/components/checkbox) — supports explicit row selection when the application owns that state.
- [Combobox](/klean-ui/components/combobox) — handles searchable filters outside the table.
- [Tabs](/klean-ui/components/tabs) — separates related result views without changing table semantics.
- [Pagination](/klean-ui/components/pagination) — navigates server-owned result pages while preserving the list's URL state.
- Data Table — the planned stateful layer for durable sorting, filtering, selection, and pagination.
