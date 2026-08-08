---
title: Select
titleTemplate: Klean UI
description: A fixed-list, typed value picker for Vue, React, and Svelte with one clean API and ordinary Tailwind styling.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanSelect from '../../.vitepress/theme/components/klean/select/Select.vue'
import SlipwaySelectRecipe from '../../.vitepress/theme/components/klean/select/SlipwaySelectRecipe.vue'
import selectSource from '../../.vitepress/theme/components/klean/select/Select.vue?raw'
import popoverSource from '../../.vitepress/theme/components/klean/popover/Popover.vue?raw'
import reactSource from '../sources/select/Select.jsx?raw'
import svelteSource from '../sources/select/Select.svelte?raw'
import vueUsage from '../snippets/select/usage.vue?raw'
import reactUsage from '../snippets/select/usage.jsx?raw'
import svelteUsage from '../snippets/select/usage.svelte?raw'
import productSource from '../snippets/select/products.vue?raw'

const role = ref('viewer')
const roleOptions = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor', disabled: true },
  { value: 'administrator', label: 'Administrator' }
]
const vueFiles = [
  {
    filename: 'Popover.vue',
    destination: 'assets/js/components/ui/popover/Popover.vue',
    source: popoverSource
  },
  {
    filename: 'Select.vue',
    destination: 'assets/js/components/ui/select/Select.vue',
    source: selectSource
  }
]
</script>

# Select

Select chooses one persistent value from a known list. It keeps string, number,
and boolean values typed in application state, works with ordinary forms, and
gives pointer, touch, keyboard, and assistive-technology users the same outcome.

The common path is one component and one option array. There is no required
`SelectTrigger`, `SelectValue`, `SelectContent`, or `SelectItem` ceremony.

<KleanPreview id="select-source" :source="selectSource" filename="Select.vue">
  <template #preview>
    <div class="grid w-full max-w-sm gap-2">
      <label for="docs-member-role" class="text-sm font-medium">
        Member role
      </label>
      <KleanSelect
        id="docs-member-role"
        v-model="role"
        name="role"
        :options="roleOptions"
        placeholder="Choose a role"
      />
      <output class="font-mono text-sm text-gray-600 dark:text-gray-300">
        {{ role }}
      </output>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/select/Select.vue

  </template>
  <template #caption>
    Try Arrow Up/Down, Home/End, typing “a”, Enter, Escape, and Tab. Editor is disabled and is skipped.
  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte, installs the framework-native Select,
and resolves Popover first when it is missing:

<KleanInstallation
  id="select-installation"
  component="select"
  :source="selectSource"
  filename="Select.vue"
  destination="assets/js/components/ui/select/Select.vue"
  :files="vueFiles"
  :dependencies="['@floating-ui/dom', 'tailwind-merge']"
/>

The installation creates no initializer, provider, `klean-ui.json`, alias
questionnaire, generated class helper, or Klean runtime dependency.

## Usage

### Vue

<CopyCode :code="vueUsage" label="MemberRole.vue" />

### React

<CopyCode :code="reactUsage" label="MemberRole.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="MemberRole.svelte" />

The framework binding changes; the value and option contract does not.

## When to use

Use Select when the choices are already known and someone must choose one
persistent value: a role, status, environment, region, branch, billing interval,
or sort order.

A native `<select>` is still the cleanest answer when its browser-owned picker
and styling fit the product. Use Klean Select when the same value-selection job
needs source-owned Tailwind styling, grouped choices, a consistent selected
indicator, or a constrained long list.

## When not to use

- Use [Menu](/klean-ui/components/menu) for actions or navigation. A Menu item does something; a Select option becomes the current value.
- Use a future **Combobox** when the person types a query, filters a long list, or waits for remote suggestions. Search will not become a `searchable` Select mode.
- Use radio buttons when a small set should remain visible for immediate comparison.
- Use checkboxes or a purpose-built multiple-choice pattern when more than one value may be chosen.
- Use [Date Picker](/klean-ui/components/date-picker) or [Schedule Picker](/klean-ui/components/schedule-picker) for date and time decisions with their own input rules.

## Options and values

The conventional option contract is `{ value, label, disabled?, group? }`:

```js
const regions = [
  { value: 'lagos', label: 'Lagos', group: 'Nigeria' },
  { value: 'abuja', label: 'Abuja', group: 'Nigeria' },
  { value: 'accra', label: 'Accra', group: 'Ghana' },
  { value: 'kumasi', label: 'Kumasi', group: 'Ghana', disabled: true }
]
```

`label` is the default visible and accessible name. `disabled` prevents pointer
and keyboard selection. `group` creates one labelled group without adding
another component API. The placeholder describes an unselected control; it is
never inserted as a fake selectable value.

String, number, and boolean values retain their type in application state. A
`name` submits primitive values through an ordinary form. Object values remain
valid application state but are not serialized automatically; submit a stable
primitive identifier instead.

### Dynamic options

Options may appear, disappear, reorder, or relabel as application data changes.
Select recalculates the visible selection and keyboard highlight from the latest
array. If the current value no longer has an option, the placeholder returns;
Select does not silently choose a replacement.

## API

| Purpose       | Vue                                    | React                    | Svelte                |
| ------------- | -------------------------------------- | ------------------------ | --------------------- |
| Current value | `v-model`                              | `value`, `onValueChange` | `bind:value`          |
| Initial value | `default-value`                        | `defaultValue`           | `defaultValue`        |
| Choices       | `options`                              | `options`                | `options`             |
| Form          | `name`, `required`, `disabled`, `form` | same native names        | same native names     |
| Open state    | `v-model:open`                         | `open`, `onOpenChange`   | `bind:open`           |
| Geometry      | `placement`, `offset`                  | `placement`, `offset`    | `placement`, `offset` |
| Styling       | `class`                                | `className`              | `class`               |

The default placement is `bottom-start` with a four-pixel offset. Placement is
preferred geometry, not a visual variant; the surface may flip or shift to stay
visible. Control open state only when application behavior genuinely needs to
observe it.

Vue offers `value`, `option`, `icon`, and `empty` slots. React offers equivalent
render functions; Svelte offers equivalent snippets. They change rendering,
not selection semantics.

`required` communicates the required relationship. Keep validation messages,
error IDs, and server rules application-owned, following the same native markup
contract as [Input](/klean-ui/components/input).

## Keyboard and accessibility

- Give Select a visible `<label>` or another accessible name.
- Enter, Space, Arrow Down, or Arrow Up opens from the real button.
- Opening highlights the committed option, otherwise the first enabled option, without committing.
- Arrow Down and Arrow Up move between enabled options; Home and End reach the enabled edges.
- Printable characters provide buffered typeahead against accessible option labels.
- Enter or Space commits once, closes, and restores focus.
- Escape cancels without changing the value and restores focus.
- Tab closes and continues through the document normally. Select never traps focus.
- Disabled options remain understandable and are skipped.

Long lists scroll and keep the active option visible. The surface matches at
least the trigger width, flips or shifts at viewport edges, and has no animation
by default.

## Styling

`class` or `className` merges onto the visible trigger, so caller Tailwind wins.
There are no `variant`, `tone`, `size`, radius, theme, or part-class props.
Stable `data-slot` and state attributes cover focused product recipes; because
the source is copied into the application, editing it remains the final escape
hatch.

### Product recipes

This compact treatment comes directly from Slipway's Bearing feedback composer.
Source-app recipes appear here only when they map to an interface that actually
exists; Klean does not invent a product look to fill a comparison.

<KleanPreview id="select-products" :source="productSource" filename="slipway-select.vue">
  <template #preview>
    <SlipwaySelectRecipe />
  </template>
  <template #caption>
    Slipway's compact trigger and popup are ordinary caller Tailwind. They do not require a variant or theme selector.
  </template>
</KleanPreview>

## Durable state

Persist the selected value in a form, URL, or server only when the product needs
that durability. Open state, keyboard highlight, and typeahead are temporary
interaction state and are not written to storage or the URL by Klean.

## Related components

- [Input](/klean-ui/components/input) — free-form text rather than a fixed choice.
- [Menu](/klean-ui/components/menu) — actions and navigation rather than a persistent value.
- [Popover](/klean-ui/components/popover) — ordinary floating content in normal Tab order.
- [Dialog](/klean-ui/components/dialog) — a modal task that makes the background inert.
- **Combobox** — the separate upcoming component for editable search and async suggestions.

## Complete framework source

### Vue

<CopyCode :code="selectSource" label="Select.vue" />

### React

<CopyCode :code="reactSource" label="Select.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="Select.svelte" />
