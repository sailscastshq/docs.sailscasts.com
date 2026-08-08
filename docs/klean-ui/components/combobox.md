---
title: Combobox
titleTemplate: Klean UI
description: An accessible editable search-and-choose input for Vue, React, and Svelte with local filtering and application-owned remote results.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanCombobox from '../../.vitepress/theme/components/klean/combobox/Combobox.vue'
import comboboxSource from '../../.vitepress/theme/components/klean/combobox/Combobox.vue?raw'
import popoverSource from '../../.vitepress/theme/components/klean/popover/Popover.vue?raw'
import reactSource from '../sources/combobox/Combobox.jsx?raw'
import svelteSource from '../sources/combobox/Combobox.svelte?raw'
import vueUsage from '../snippets/combobox/usage.vue?raw'
import reactUsage from '../snippets/combobox/usage.jsx?raw'
import svelteUsage from '../snippets/combobox/usage.svelte?raw'
import remoteUsage from '../snippets/combobox/remote.vue?raw'

const customer = ref('cus_kelvin')
const customers = [
  {
    value: 'cus_kelvin',
    label: 'Kelvin Omereshone',
    description: 'kelvin@sailscasts.com'
  },
  {
    value: 'cus_ada',
    label: 'Ada Lovelace',
    description: 'ada@example.com'
  },
  {
    value: 'cus_grace',
    label: 'Grace Hopper',
    description: 'grace@example.com',
    keywords: ['compiler']
  }
]
const vueFiles = [
  {
    filename: 'Popover.vue',
    destination: 'assets/js/components/ui/popover/Popover.vue',
    source: popoverSource
  },
  {
    filename: 'Combobox.vue',
    destination: 'assets/js/components/ui/combobox/Combobox.vue',
    source: comboboxSource
  }
]
</script>

# Combobox

Combobox lets someone search a long list and commit one application value. The
editable query is temporary; the chosen customer, repository, assignee, or
relationship is the value that persists.

The common path is one component and one option array. There is no required
trigger, input, content, or item-component ceremony.

<KleanPreview id="combobox-source" :source="comboboxSource" filename="Combobox.vue">
  <template #preview>
    <div class="grid w-full max-w-sm gap-2">
      <label for="docs-customer" class="text-sm font-medium">Customer</label>
      <KleanCombobox
        id="docs-customer"
        v-model="customer"
        name="customer"
        :options="customers"
        placeholder="Search customers"
      />
      <output class="font-mono text-sm text-gray-600 dark:text-gray-300">
        {{ customer }}
      </output>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/combobox/Combobox.vue

  </template>
  <template #caption>
    Type a name or email, move with Arrow keys, commit with Enter, abandon the query with Escape, or Tab onward normally.
  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte, installs the framework-native
Combobox, and resolves Popover first when it is missing:

<KleanInstallation
  id="combobox-installation"
  component="combobox"
  :source="comboboxSource"
  filename="Combobox.vue"
  destination="assets/js/components/ui/combobox/Combobox.vue"
  :files="vueFiles"
  :dependencies="['@floating-ui/dom', 'tailwind-merge']"
/>

The installation creates no initializer, provider, `klean-ui.json`, alias
questionnaire, generated class helper, or Klean runtime dependency.

## Usage

### Vue

<CopyCode :code="vueUsage" label="ProjectPicker.vue" />

### React

<CopyCode :code="reactUsage" label="ProjectPicker.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ProjectPicker.svelte" />

The framework binding changes; the value, options, query, and keyboard contract
do not.

## Which control should I use?

Use [Select](/klean-ui/components/select) when the complete list is known,
reasonably short, and typing would not help. Use Combobox when a query narrows a
long list, searches relationships, or requests suggestions from the server. Use
[Input](/klean-ui/components/input) when arbitrary text is valid and no option
must be chosen.

That is the whole decision. Combobox is not a Select variant because editable
and select-only controls have different browser, focus, keyboard, and
assistive-technology contracts.

## Options and values

The conventional option contract is
`{ value, label, description?, disabled?, group?, keywords? }`:

```js
const repositories = [
  {
    value: 'sailscastshq/slipway',
    label: 'sailscastshq/slipway',
    description: 'Deploy and operate Sails applications',
    keywords: ['hosting', 'deployments'],
    group: 'Sailscasts'
  }
]
```

`label`, `description`, and `keywords` participate in local matching.
`keywords` provides invisible aliases without changing what people see.
`disabled` leaves an option understandable but removes it from pointer and
keyboard selection. `group` creates one labelled group without adding another
component API.

String, number, and boolean values retain their type in application state. A
`name` submits primitive values through an ordinary form. Prefer a stable ID as
the value when the visible option represents an object.

## Remote search

Combobox emits `search` after 300 milliseconds when it opens and as the query
changes. The opening query is empty, so the application can provide a useful
first page before anyone types.

The application owns its URL, credentials, pagination, response shape, and
request cancellation. Abort replaced work and pass `options`, `loading`, and
`error` back to Combobox:

<CopyCode :code="remoteUsage" label="RepositoryPicker.vue" />

Existing results remain usable while loading. Combobox replaces its pending
debounce timer; the application cancels its pending request because only the
application knows the transport policy.

## API

| Purpose       | Vue                                    | React                    | Svelte                |
| ------------- | -------------------------------------- | ------------------------ | --------------------- |
| Current value | `v-model`                              | `value`, `onValueChange` | `bind:value`          |
| Initial value | `default-value`                        | `defaultValue`           | `defaultValue`        |
| Choices       | `options`                              | `options`                | `options`             |
| Query         | `v-model:query`                        | `query`, `onQueryChange` | `bind:query`          |
| Search        | `@search`                              | `onSearch`               | `onsearch`            |
| Request state | `loading`, `error`                     | `loading`, `error`       | `loading`, `error`    |
| Form          | `name`, `required`, `disabled`, `form` | same native names        | same native names     |
| Open state    | `v-model:open`                         | `open`, `onOpenChange`   | `bind:open`           |
| Geometry      | `placement`, `offset`                  | `placement`, `offset`    | `placement`, `offset` |
| Styling       | `class`                                | `className`              | `class`               |

`searchDelay` defaults to 300 milliseconds. The default placement is
`bottom-start` with a four-pixel offset. Geometry may flip or shift to remain
visible. Control query or open state only when application behavior genuinely
needs to observe that temporary state.

Vue offers `option`, `empty`, `loading`, and `error` slots. React offers
equivalent render functions; Svelte offers equivalent snippets. They change
rendering, not selection semantics.

## Keyboard and accessibility

- Give Combobox a visible `<label>` or another accessible name.
- Focus or click opens the choices while DOM focus stays on the real editable input.
- Arrow Down and Arrow Up move between enabled filtered options; Home and End reach the enabled edges.
- `aria-activedescendant` exposes the highlight without moving focus into the popup.
- Enter commits the highlighted value once, closes, and restores the selected label.
- Escape abandons an unfinished query without changing the committed value.
- Tab closes and continues through the document normally. Combobox never traps focus.
- Pointer selection prevents an early blur and commits before closing.
- Disabled options remain understandable and are skipped.

Long lists scroll and keep the active option visible. The surface matches at
least the input width, flips or shifts at viewport edges, and has no product
animation by default.

## Styling

`class` or `className` merges onto the real editable input, so caller Tailwind
wins. There are no `variant`, `tone`, `size`, radius, theme, or part-class props.

Stable `data-slot` hooks cover the root, control, input, icon, content, listbox,
group, option, indicator, empty, loading, and error surfaces. Repeated product
treatments belong in application-owned components; the copied source is the
final escape hatch.

## Durable state

Persist the committed value in a form, URL, storage, or server only when the
product needs that durability. Query, open state, and keyboard highlight are
temporary by default. Escape and outside dismissal restore the committed label.
Unmounting removes observers and pending debounce work.

## Related components

- [Select](/klean-ui/components/select) — a non-editable choice from a fixed list.
- [Input](/klean-ui/components/input) — arbitrary free-form text.
- [Popover](/klean-ui/components/popover) — ordinary floating content without selection semantics.
- [Menu](/klean-ui/components/menu) — actions and navigation rather than a persistent value.
- [Dialog](/klean-ui/components/dialog) — a modal task that makes the background inert.

## Complete framework source

### Vue

<CopyCode :code="comboboxSource" label="Combobox.vue" />

### React

<CopyCode :code="reactSource" label="Combobox.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="Combobox.svelte" />
