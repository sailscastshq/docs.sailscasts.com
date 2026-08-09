---
title: Checkbox
titleTemplate: Klean UI
description: A native-first Klean UI checkbox for boolean, collection, and indeterminate selection across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import { computed, ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanCheckbox from '../../.vitepress/theme/components/klean/checkbox/Checkbox.vue'
import checkboxSource from '../../.vitepress/theme/components/klean/checkbox/Checkbox.vue?raw'
import reactSource from '../sources/checkbox/Checkbox.jsx?raw'
import svelteSource from '../sources/checkbox/Checkbox.svelte?raw'
import vueUsage from '../snippets/checkbox/usage.vue?raw'
import reactUsage from '../snippets/checkbox/usage.jsx?raw'
import svelteUsage from '../snippets/checkbox/usage.svelte?raw'

const events = [
  { id: 'builds', label: 'Builds' },
  { id: 'deployments', label: 'Deployments' },
  { id: 'incidents', label: 'Incidents' }
]
const selected = ref(['builds'])
const allSelected = computed(() => selected.value.length === events.length)
const someSelected = computed(
  () => selected.value.length > 0 && !allSelected.value
)

function toggleAll(event) {
  selected.value = event.target.checked
    ? events.map((item) => item.id)
    : []
}
</script>

# Checkbox

Checkbox represents one independent yes/no value or membership in a set. It is
a real form control, so the browser keeps Space activation, clickable labels,
required validation, disabled behavior, submitted values, and reset semantics.

The common path is one Checkbox inside one visible label. Related choices use a
native fieldset. Partial list selection uses the same component with
`indeterminate`; there is no group, label, or indicator-component ceremony.

<KleanPreview id="checkbox-source" :source="checkboxSource" filename="Checkbox.vue">
  <template #preview>
    <fieldset class="w-full max-w-sm space-y-3 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <legend class="px-1 text-sm font-semibold">Notify me about</legend>
      <label class="flex cursor-pointer items-center gap-3 border-b border-gray-200 pb-3 dark:border-gray-800">
        <KleanCheckbox
          :model-value="allSelected"
          :indeterminate="someSelected"
          aria-controls="checkbox-demo-builds checkbox-demo-deployments checkbox-demo-incidents"
          @change="toggleAll"
        />
        <span class="text-sm font-medium">Select all</span>
      </label>
      <label
        v-for="event in events"
        :key="event.id"
        class="flex cursor-pointer items-center gap-3 text-sm"
      >
        <KleanCheckbox
          :id="`checkbox-demo-${event.id}`"
          v-model="selected"
          name="notifications"
          :value="event.id"
        />
        {{ event.label }}
      </label>
      <output class="block pt-1 font-mono text-xs text-gray-500 dark:text-gray-400">
        {{ selected.length }} of {{ events.length }} selected
      </output>
    </fieldset>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/checkbox/Checkbox.vue

  </template>
  <template #caption>
    Select one item, every item, or use the mixed parent checkbox to change the complete set.
  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and installs one framework-native
source file:

<KleanInstallation
  id="checkbox-installation"
  component="checkbox"
  :source="checkboxSource"
  filename="Checkbox.vue"
  destination="assets/js/components/ui/checkbox/Checkbox.vue"
/>

The installation creates no initializer, provider, `klean-ui.json`, alias
questionnaire, generated class helper, or Klean runtime dependency.

## Usage

### Vue

<CopyCode :code="vueUsage" label="NotificationsField.vue" />

### React

<CopyCode :code="reactUsage" label="NotificationsField.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="NotificationsField.svelte" />

The binding syntax changes, but every version produces the same native checkbox
and keeps the visible label in application markup.

## Which control should I use?

Use Checkbox when each value can stand independently: remember me, include
retained data, subscribe to an event, or select a row. A set of checkboxes can
have zero, one, or many selected values.

Use a Switch for an immediate on/off setting whose new state takes effect as
soon as it changes. Use Radio Group when exactly one of a small visible set may
be chosen. Use [Select](/klean-ui/components/select) when one choice comes from
a longer fixed list. Use [Button](/klean-ui/components/button) for an action
rather than persistent form state.

Checkbox is not a Switch or Select variant. Those controls communicate
different state and keyboard expectations.

## Labels, descriptions, and errors

A real `<label>` may wrap Checkbox or target its `id`. Wrapping is the tersest
API and makes the entire visible row clickable:

```vue
<label class="flex cursor-pointer items-start gap-3">
  <Checkbox
    v-model="form.confirmed"
    name="confirmed"
    required
    :aria-invalid="Boolean(form.errors.confirmed)"
    aria-describedby="confirmed-help confirmed-error"
    class="mt-0.5"
  />
  <span>
    <span class="block font-medium">I have reviewed this transfer</span>
    <span id="confirmed-help" class="text-sm text-gray-500">
      Check the recipient and amount before continuing.
    </span>
    <span id="confirmed-error" class="empty:hidden text-sm text-red-700">
      {{ form.errors.confirmed }}
    </span>
  </span>
</label>
```

The application owns the text, deterministic IDs, validation timing, and
business consequence. Checkbox forwards the relationships without introducing
a Field configuration language.

## Groups and collection values

When several checkboxes answer one visible question, use `fieldset` and
`legend`. Each choice still receives its own label and submitted value.

Vue keeps its native checkbox collection behavior: `v-model` can contain an
array or `Set`, and `true-value` and `false-value` remain available for a single
non-boolean value. React uses ordinary `checked`, `defaultChecked`, and
`onChange`. Svelte uses `bind:checked` and native event attributes. Collection
stores and product selection rules stay with the application that owns them.

## Indeterminate selection

`indeterminate` presents a parent checkbox as partially selected when some, but
not all, children are checked:

```vue
<Checkbox
  :model-value="allSelected"
  :indeterminate="someSelected"
  aria-controls="row-one row-two row-three"
  @change="selectAll($event.target.checked)"
/>
```

The browser exposes that native control as mixed to assistive technology.
Indeterminate is presentation, not a third submitted value. Activating it
produces an ordinary checked or unchecked state, and the application updates
the child collection.

## Native form behavior

- Space toggles the focused checkbox.
- Activating an associated label toggles it.
- A checked checkbox submits its `name` and `value`; an unchecked checkbox submits nothing.
- `required` participates in native constraint validation.
- `disabled` prevents interaction and submission.
- Form reset restores the initial checked state.
- `readonly` does not apply to checkboxes; use `disabled` when the value cannot change.

Klean does not replace any of these with key handlers or ARIA state machines.

## API

| Purpose       | Vue                     | React                 | Svelte            |
| ------------- | ----------------------- | --------------------- | ----------------- |
| Current value | `v-model`               | `checked`, `onChange` | `bind:checked`    |
| Initial value | initial model           | `defaultChecked`      | initial state     |
| Partial state | `indeterminate`         | `indeterminate`       | `indeterminate`   |
| Form          | native input attributes | native input props    | native attributes |
| Styling       | `class`                 | `className`           | `class`           |

The component exposes its native element for explicit focus recovery and stable
`data-slot="checkbox"`, `data-state`, `data-disabled`, and `data-invalid`
styling or test hooks. It has no `variant`, `tone`, `size`, group, label,
indicator, or part-class props.

## Styling

The default is a neutral native checkbox whose accent follows its current text
color. Caller Tailwind merges last:

```vue
<!-- Compact operational control -->
<Checkbox class="size-3.5 text-white focus-visible:outline-white" />

<!-- Destructive confirmation -->
<Checkbox class="mt-0.5 text-red-600 focus-visible:outline-red-600" />

<!-- High-contrast sign-in form -->
<Checkbox class="text-black focus-visible:outline-black" />
```

For a selectable card or chip, visually hide Checkbox with `sr-only` and style
its wrapping label with `has-[:checked]` or `peer-*` utilities. That complete
product treatment belongs in the recipe, not in a visual variant API.

## Durable state

Checkbox preserves native reset and form behavior but does not persist every
boolean automatically. The owning form, server record, URL, or storage policy
decides whether a checked value should survive navigation or reload.
Indeterminate state is normally derived from the durable child selection rather
than stored separately.

## Related components

- [Input](/klean-ui/components/input) — arbitrary free-form text.
- [Select](/klean-ui/components/select) — one persistent value from a fixed list.
- [Button](/klean-ui/components/button) — an action rather than checked form state.
- [Menu](/klean-ui/components/menu) — actions and navigation in a temporary popup.
- [Dialog](/klean-ui/components/dialog) — the owning confirmation task; Checkbox may confirm one fact inside it.

## Complete framework source

### Vue

<CopyCode :code="checkboxSource" label="Checkbox.vue" />

### React

<CopyCode :code="reactSource" label="Checkbox.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="Checkbox.svelte" />
