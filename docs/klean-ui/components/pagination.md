---
title: Pagination
titleTemplate: Klean UI
description: Durable server-list pagination with framework-native Inertia links, canonical URLs, and accessible navigation across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanPagination from '../../.vitepress/theme/components/klean/pagination/Pagination.vue'
import paginationSource from '../../.vitepress/theme/components/klean/pagination/Pagination.vue?raw'
import reactSource from '../sources/pagination/Pagination.jsx?raw'
import svelteSource from '../sources/pagination/Pagination.svelte?raw'
import vueUsage from '../snippets/pagination/usage.vue?raw'
import reactUsage from '../snippets/pagination/usage.jsx?raw'
import svelteUsage from '../snippets/pagination/usage.svelte?raw'

const previewPage = ref(4)

function navigatePreview(event) {
  const link = event.target.closest?.('a[data-page]')
  if (!link) return

  event.preventDefault()
  previewPage.value = Number(link.dataset.page)
}
</script>

# Pagination

Pagination navigates a server-owned list with real framework-native Inertia links. Pass the current page and the total page count; Klean derives every destination from the current URL, keeps the rest of the query and hash intact, and removes `page=1` from the canonical first-page URL.

There is no item schema, link adapter, URL builder, ellipsis setting, visual variant, or router configuration. The Boring Stack already has a Link, so Pagination uses it.

<KleanPreview id="pagination-source" :source="paginationSource" filename="Pagination.vue">
  <template #preview>
    <div
      class="w-full max-w-3xl rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950"
      @click.capture="navigatePreview"
    >
      <p class="mb-5 text-center text-sm text-gray-500 dark:text-gray-400">
        Showing server page {{ previewPage }} of 12
      </p>
      <KleanPagination
        :page="previewPage"
        :pages="12"
        aria-label="Example result pages"
      />
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/pagination/Pagination.vue

  </template>
  <template #caption>
    Every available destination is a real link. Narrow the window to see the automatic compact summary.
  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte, installs the matching official Inertia adapter when needed, and writes one editable source file into the conventional component directory:

<KleanInstallation
  id="pagination-installation"
  component="pagination"
  :source="paginationSource"
  filename="Pagination.vue"
  destination="assets/js/components/ui/pagination/Pagination.vue"
  :dependencies="['@inertiajs/vue3', 'tailwind-merge']"
/>

There is no initializer, provider, `klean-ui.json`, generated class helper, or runtime Klean package to configure.

## Usage

Render Pagination from the same server pagination object that rendered the visible rows. The server remains authoritative; Klean does not create a second client-side page state.

### Vue

<CopyCode :code="vueUsage" label="ProjectPages.vue" />

### React

<CopyCode :code="reactUsage" label="ProjectPages.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ProjectPages.svelte" />

`only` is optional. Use it when an Inertia partial reload should request only the result and pagination props. Leave it out when changing page should refresh the full page payload.

## API

| Input                 | Default      | Purpose                                                                        |
| --------------------- | ------------ | ------------------------------------------------------------------------------ |
| `page`                | required     | Current server-provided page.                                                  |
| `pages`               | required     | Total server-provided page count. Pagination renders nothing when this is one. |
| `only`                | `[]`         | Optional Inertia partial-reload prop names.                                    |
| `aria-label`          | `Pagination` | Accessible name for the navigation landmark.                                   |
| `class` / `className` | —            | Ordinary Tailwind classes merged on the navigation root.                       |
| native attributes     | —            | IDs, test hooks, and other navigation attributes forwarded to the root.        |

That is the behavioral API. Change the copied Tailwind classes for a product's visual language instead of adding presentation props.

## Durable by default

Pagination treats the URL and server response as the record of what the user is viewing:

- changing page uses push history, so Back and Forward return to the pages the user visited;
- the current query and hash are preserved, so search, filters, sorting, lenses, and dashboard context do not disappear;
- page one has the clean canonical URL without `page=1`;
- modified clicks and opening in a new tab remain normal link behavior;
- unavailable Previous and Next controls are non-interactive text rather than links that lie;
- `aria-current="page"` identifies the current destination;
- duplicate activation is ignored while that destination is pending;
- focus is recovered when a server update removes the link that initiated navigation;
- narrow layouts keep only Previous, “Page x of y”, and Next without extra configuration.

Do not persist the current page in local storage. If the list can be shared or revisited, its URL and server props are already the durable state.

## Server-list recipe

Slipway-style lists usually combine pagination with search, sorting, filters, and a server response:

```vue
<Pagination
  :page="pagination.page"
  :pages="pagination.totalPages"
  :only="['projects', 'pagination', 'filters']"
  aria-label="Project pages"
/>
```

Pagination changes only the `page` query value. Existing values such as `q`, `sort`, `direction`, `status`, or a selected lens stay in the destination automatically. Applications should reset `page` to one when a filter changes the result set; the filter action owns that decision.

## Responsive and large result sets

At wider sizes, Pagination shows the useful page window plus ellipses. At narrow sizes, it shows the current position between Previous and Next. Both views describe the same server state and use the same destinations.

The component clamps malformed page values to a truthful visible range, but the server should still validate requested pages and return its canonical current page. Rendering that response keeps refresh, sharing, and history correct.

## When to use

Use Pagination when a server-backed collection is divided into discrete pages: audit logs, bridge resources, invoices, deployments, search results, or long administrative lists.

## When not to use

- Use ordinary links when there are only Previous and Next destinations and no useful page count.
- Use an explicit “Load more” action when users are intentionally accumulating items in one continuous view.
- Use infinite loading only when position is disposable and the application has a deliberate focus and history strategy.
- Do not paginate a short list merely to make a layout look smaller.

## Complete framework source

Copy, inspect, and change the complete one-file source for your framework.

### Vue source

<CopyCode :code="paginationSource" label="Pagination.vue" />

### React source

<CopyCode :code="reactSource" label="Pagination.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Pagination.svelte" />

## Related components

- [Table](/klean-ui/components/table) — supplies native row and column structure for paginated results.
- [Input](/klean-ui/components/input) — provides a visible search field while the URL owns the query.
- [Select](/klean-ui/components/select) — handles fixed filters or an application-owned page-size control.
- [Combobox](/klean-ui/components/combobox) — handles searchable filters for larger option sets.
- [Spinner](/klean-ui/components/spinner) — can identify work elsewhere in the result region when a page request takes long enough to warrant it.
