---
title: Filter Bar
titleTemplate: Klean UI
description: A durable filter form for Vue, React, and Svelte with separate draft and committed state, native apply and cancel, removable active filters, and deterministic URLs.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import FilterBarRecipes from '../../.vitepress/theme/components/klean/filter-bar/FilterBarRecipes.vue'
import filterBarSource from '../../.vitepress/theme/components/klean/filter-bar/FilterBar.vue?raw'
import filterStateSource from '../../.vitepress/theme/components/klean/filter-bar/filterState.js?raw'
import reactSource from '../sources/filter-bar/FilterBar.jsx?raw'
import reactStateSource from '../sources/filter-bar/filterState.react.js?raw'
import svelteSource from '../sources/filter-bar/FilterBar.svelte?raw'
import svelteStateSource from '../sources/filter-bar/filterState.svelte.js?raw'
import vueUsage from '../snippets/filter-bar/usage.vue?raw'
import reactUsage from '../snippets/filter-bar/usage.jsx?raw'
import svelteUsage from '../snippets/filter-bar/usage.svelte?raw'
import durableUsage from '../snippets/filter-bar/durable.vue?raw'

const installationFiles = [
  {
    filename: 'FilterBar.vue',
    destination: 'assets/js/components/ui/filter-bar/FilterBar.vue',
    source: filterBarSource
  },
  {
    filename: 'filterState.js',
    destination: 'assets/js/components/ui/filter-bar/filterState.js',
    source: filterStateSource
  }
]
</script>

# Filter Bar

Filter Bar coordinates the controls that shape a server-owned result. It keeps unfinished edits separate from the filters currently applied to the page, then uses one native form submission to commit the draft. Cancel is a native form reset. Active filters can be removed one at a time or cleared together without losing useful keyboard focus.

The application still writes every Input, Select, Combobox, Checkbox, Popover, Sheet, label, button, summary, and Tailwind class. Filter Bar does not ask for a column schema, filter registry, visual variant, route, or server query language.

<KleanPreview id="filter-bar-bridge" :source="vueUsage" filename="ServiceFilters.vue">
  <template #preview>
    <FilterBarRecipes />
  </template>
  <template #caption>
    A Slipway Bridge-style filter surface. Change a control before applying, cancel it, remove an active filter, clear everything, and use the same controls from the keyboard.
  </template>
</KleanPreview>

## Installation

The command detects Vue, React, or Svelte and copies the component plus its small deterministic URL helper into the conventional UI directory.

<KleanInstallation
  id="filter-bar-installation"
  component="filter-bar"
  :source="filterBarSource"
  filename="FilterBar.vue"
  destination="assets/js/components/ui/filter-bar/FilterBar.vue"
  :files="installationFiles"
  :dependencies="['tailwind-merge']"
/>

There is no provider, initializer, configuration file, filter-definition format, or runtime Klean dependency. If the page already owns its URL serialization, use the component and ignore `filterState.js`.

## Usage

### Vue

<CopyCode :code="vueUsage" label="ServiceFilters.vue" />

### React

<CopyCode :code="reactUsage" label="ServiceFilters.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ServiceFilters.svelte" />

The framework syntax changes. The contract does not: committed state is caller-owned, the slot or child function receives a separate draft, and the root remains one native search form.

## API

| Purpose                    | Vue                 | React               | Svelte             |
| -------------------------- | ------------------- | ------------------- | ------------------ |
| Committed filters          | `v-model`           | `value`, `onChange` | `bind:value`       |
| Initial uncontrolled state | model default       | `defaultValue`      | `defaultValue`     |
| Pending visit              | `busy`              | `busy`              | `busy`             |
| Accessible form name       | `label`             | `label`             | `label`            |
| Application markup         | default scoped slot | function child      | `children` snippet |
| Styling                    | `class`             | `className`         | `class`            |

The slot, function, or snippet receives:

| Value                                                  | Purpose                                                                            |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `draft`, `setDraft(next)`                              | The editable filter object and a whole-object setter.                              |
| `update(key, value)`                                   | Replaces one draft value without committing it.                                    |
| `entries`, `count`                                     | Entries and count from the committed filter object.                                |
| `dirty`                                                | Whether the draft differs from the committed filters.                              |
| `applyAttrs` / `applyProps`                            | Native submit-button attributes, including truthful disabled state.                |
| `cancelAttrs` / `cancelProps`                          | Native reset-button attributes.                                                    |
| `clearAttrs` / `clearProps`                            | Attributes for an immediate “Clear all” button.                                    |
| `removeAttrs(key, label?)` / `removeProps(...)`        | Attributes for one accessible immediate remove button with focus recovery.         |
| `apply()`, `cancel()`, `clear()`, `remove(key, event)` | Direct methods for unusual application compositions. Prefer the attribute helpers. |

Use Apply for a draft that contains several related choices. Remove-one and Clear-all commit immediately because their intent is already complete. A pending `busy` form keeps the current filters visible while disabling commits that would duplicate an application visit.

## Durable URL state

The visible result and the URL should describe the same committed filters. `filterState.js` exports four small framework-neutral helpers:

- `stableFilters(filters)` sorts object keys recursively before JSON serialization;
- `filtersEqual(left, right)` compares typed JSON filter values deterministically;
- `filterUrl(url, filters, defaults?)` writes the conventional `filters` query parameter while preserving unrelated query values and the hash;
- `filtersFromUrl(url, defaults?)` reads a valid object and safely returns defaults for missing or malformed input.

<CopyCode :code="durableUsage" label="ServiceFilters.vue" />

Normal filter commits should create a history entry so Back returns to the previous result. Debounced free-text search usually replaces the current history entry; [DataTable](/klean-ui/components/data-table) already supplies that server-query convention. When Back, Forward, or a server response changes the caller-owned model, Filter Bar synchronizes the draft to that committed truth.

Defaults and an empty filter object disappear from the URL. The server still validates filter names, operators, values, permissions, and query cost. The browser helper does not duplicate a Waterline query language or authorization policy.

## Typed application filters

Filter Bar accepts a plain JSON object and does not inspect its values. A simple page can use `{ status: 'running' }`. Bridge can use richer values such as:

```js
{
  status: { operator: 'equals', value: 'running' },
  createdAt: {
    operator: 'between',
    from: '2026-08-01',
    to: '2026-08-24'
  }
}
```

That boundary keeps operator lists, relationship searches, saved views, and server serialization in the application where their meaning lives. Ordinary Klean controls edit `draft`; Filter Bar only coordinates when the complete object becomes committed.

## Popover, Sheet, or inline?

Keep a small filter set inline. Put a compact desktop filter form inside [Popover](/klean-ui/components/popover) when it must float near a trigger. Use [Sheet](/klean-ui/components/sheet) when the same controls need more room on a narrow viewport. The caller chooses those truthful layout semantics; Filter Bar does not hide them behind a `mode` or responsive variant.

Whichever surface contains it, keep Apply and Cancel in the same native form. Close the surface only after the application accepts the commit, and return focus to its trigger. Filter Bar continues to handle draft state and active-filter focus independently of the surrounding layout.

## Keyboard and accessibility

- The root is a native form named as a search region. Give every control a visible label or an equally specific accessible name.
- Enter submits when a control does not use Enter for its own composite behavior. A native reset button cancels the draft.
- Apply and Cancel are disabled when nothing changed. Apply, remove, and clear are disabled while `busy` prevents a duplicate visit.
- Build active filters from real buttons using `removeAttrs` or `removeProps`. Include the complete filter description in each accessible name.
- After removal, focus reaches the next active filter, the previous one, Clear all, or a caller-marked `[data-filter-trigger]`.
- The committed count is announced politely and never depends on color.
- A Combobox, Select, Checkbox, Popover, or Sheet keeps its own established keyboard contract inside the form.

## Styling with Tailwind

`class` or `className` merges onto the form. Everything inside it is application markup, so Tailwind remains the entire visual API. A product can keep filters quiet and inline, place them in a bordered toolbar, or create an application-owned wrapper reused across pages.

There are no `variant`, `tone`, `density`, `chipClass`, `panelClass`, or filter-type style props. When several pages share one visual treatment, create a small application component from the copied Klean source and ordinary controls.

## When not to use

- Use [Input](/klean-ui/components/input) for one independent text value that does not coordinate result state.
- Use [Select](/klean-ui/components/select) or [Combobox](/klean-ui/components/combobox) when the task is choosing a value, not applying a group of filters.
- Use the query helper from [DataTable](/klean-ui/components/data-table) when the page primarily needs server search, sorting, selection, and pagination as one result system.
- Do not use Filter Bar as a generic form generator or a client-side ORM query builder.
- Do not hide a small, frequently changed filter behind a panel merely to make the page look sparse.

## Complete framework source

### Vue

<CopyCode :code="filterBarSource" label="FilterBar.vue" />

<CopyCode :code="filterStateSource" label="filterState.js" />

### React

<CopyCode :code="reactSource" label="FilterBar.jsx" />

<CopyCode :code="reactStateSource" label="filterState.js" />

### Svelte

<CopyCode :code="svelteSource" label="FilterBar.svelte" />

<CopyCode :code="svelteStateSource" label="filterState.js" />

## Related components

- [DataTable](/klean-ui/components/data-table) — server-driven search, filters, sorting, selection, and pagination as one result system.
- [Input](/klean-ui/components/input) — free-text search and scalar values.
- [Select](/klean-ui/components/select) — one value from a short fixed list.
- [Combobox](/klean-ui/components/combobox) — searchable local or remote values.
- [Checkbox](/klean-ui/components/checkbox) — independent boolean filter choices.
- [Popover](/klean-ui/components/popover) — a compact non-modal desktop filter surface.
- [Sheet](/klean-ui/components/sheet) — a roomy narrow-viewport filter surface.
- [Badge](/klean-ui/components/badge) — static metadata only; removable filters stay real buttons.
