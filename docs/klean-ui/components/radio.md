---
title: Radio
titleTemplate: Klean UI
description: A native-first Klean UI radio for mutually exclusive choices across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanRadio from '../../.vitepress/theme/components/klean/radio/Radio.vue'
import radioSource from '../../.vitepress/theme/components/klean/radio/Radio.vue?raw'
import reactSource from '../sources/radio/Radio.jsx?raw'
import svelteSource from '../sources/radio/Radio.svelte?raw'
import vueUsage from '../snippets/radio/usage.vue?raw'
import reactUsage from '../snippets/radio/usage.jsx?raw'
import svelteUsage from '../snippets/radio/usage.svelte?raw'

const regions = [
  { value: 'frankfurt', label: 'Frankfurt', hint: 'Central Europe' },
  { value: 'lagos', label: 'Lagos', hint: 'West Africa' },
  { value: 'virginia', label: 'Virginia', hint: 'US East' }
]
const region = ref('lagos')
const participation = ref(false)
const category = ref('all')
</script>

# Radio

Radio represents one choice from a short visible set. It renders a real
`input[type="radio"]`, so the browser keeps mutual exclusion, arrow-key
navigation, clickable labels, required validation, submitted values, disabled
behavior, and form reset.

The application supplies the shared `name`, semantic `fieldset` and `legend`,
visible labels, descriptions, validation copy, and Tailwind styling. Klean does
not duplicate HTML's group contract.

<KleanPreview id="radio-source" :source="radioSource" filename="Radio.vue">
  <template #preview>
    <fieldset class="w-full max-w-sm">
      <legend class="text-sm font-semibold">Deployment region</legend>
      <div class="mt-3 space-y-2">
        <label
          v-for="item in regions"
          :key="item.value"
          class="flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 has-checked:border-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:has-checked:border-white"
        >
          <KleanRadio
            v-model="region"
            name="docs-deployment-region"
            :value="item.value"
            required
          />
          <span>
            <span class="block text-sm font-medium">{{ item.label }}</span>
            <span class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
              {{ item.hint }}
            </span>
          </span>
        </label>
      </div>
      <output class="mt-3 block font-mono text-xs text-gray-500 dark:text-gray-400">
        Selected: {{ region }}
      </output>
    </fieldset>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/radio/Radio.vue

  </template>
  <template #caption>
    Choose with a pointer, activate a label, or focus the checked choice and use the Arrow keys.
  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and installs one framework-native
source file:

<KleanInstallation
  id="radio-installation"
  component="radio"
  :source="radioSource"
  filename="Radio.vue"
  destination="assets/js/components/ui/radio/Radio.vue"
/>

The installation creates no provider, initializer, `klean-ui.json`, alias
questionnaire, generated class helper, or Klean runtime dependency.

## Usage

### Vue

<CopyCode :code="vueUsage" label="RegionField.vue" />

### React

<CopyCode :code="reactUsage" label="RegionField.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="RegionField.svelte" />

The framework binding changes, but every version produces one native group and
submits the checked value under `region`.

## Why Radio, not RadioGroup?

HTML already groups radios that share a `name`. The browser keeps one checked,
moves within the group with Arrow keys, validates `required`, submits one value,
and restores the initial choice on form reset.

A JavaScript RadioGroup would duplicate those rules and create another place
for state, orientation, items, labels, and focus to drift. Klean instead gives
each framework its natural scalar binding:

- Vue: one `v-model` shared by each Radio.
- React: native `checked`, `defaultChecked`, `value`, and `onChange`.
- Svelte: one `bind:group` shared by each Radio.

The `fieldset` is the group component. The `legend` is its accessible name.

## When to use

Use Radio when a person must choose exactly one option from a short list that is
helpful to compare at once: deployment region, participation policy, billing
cadence, visibility, or storage provider.

Radio is especially useful when the labels or descriptions influence the
decision and should remain visible without opening another surface.

## When not to use

Use [Checkbox](/klean-ui/components/checkbox) when values are independent or
several may be chosen. Use [Switch](/klean-ui/components/switch) for an
immediate on/off setting. Use [Select](/klean-ui/components/select) when one
choice comes from a longer fixed list and compactness matters. Use
[Combobox](/klean-ui/components/combobox) when the list must be searched.

Do not use Radio for actions. A selected radio changes form state; a
[Button](/klean-ui/components/button) performs a command.

## Semantic groups

Use one `fieldset`, one visible `legend`, and the same `name` for every related
Radio:

```vue
<fieldset aria-describedby="participation-help participation-error">
  <legend class="font-medium">Participation</legend>
  <p id="participation-help" class="text-sm text-gray-500">
    Choose who may submit and vote.
  </p>

  <label>
    <Radio
      v-model="form.allowAnonymousParticipation"
      name="participation"
      :value="false"
      required
    />
    Logged-in users only
  </label>

  <label>
    <Radio
      v-model="form.allowAnonymousParticipation"
      name="participation"
      :value="true"
      required
    />
    Anyone
  </label>

  <p id="participation-error" class="empty:hidden text-sm text-red-700">
    {{ form.errors.allowAnonymousParticipation }}
  </p>
</fieldset>
```

Vue retains typed values, including the real boolean participation choice used
by Slipway. The application owns deterministic IDs, validation timing, and
error copy.

## Native behavior

- Activating an associated label checks its Radio.
- Arrow keys move and select within radios sharing a `name`.
- Tab enters and leaves the group as one keyboard stop.
- A checked Radio submits its `name` and `value`.
- `required` makes the group participate in native constraint validation.
- `disabled` prevents interaction and submission.
- Form reset restores the initially checked choice.

Klean does not add key handlers, roving focus, `role="radio"`, or
`aria-checked`; all would duplicate the native input.

## Slipway recipes

Slipway uses the same native control in three useful presentations. Klean keeps
all three possible without adding visual variants.

### Conventional provider list

Keep Radio visible when familiarity and quick scanning matter:

```vue
<label class="flex cursor-pointer items-center gap-3 px-4 py-3">
  <Radio v-model="provider" name="provider" value="s3" />
  <span>
    <span class="block text-sm font-medium">Amazon S3</span>
    <span class="text-xs text-gray-500">Managed object storage</span>
  </span>
</label>
```

### Choice cards

Visually hide only Radio and let the wrapping label present the large choice:

<div class="grid gap-3 py-4 sm:grid-cols-2">
  <label class="cursor-pointer rounded-xl bg-gray-50 p-4 transition has-checked:bg-gray-950 has-checked:text-white dark:bg-gray-900 dark:has-checked:bg-white dark:has-checked:text-gray-950">
    <KleanRadio
      v-model="participation"
      class="sr-only"
      name="docs-participation"
      :value="false"
    />
    <span class="block text-sm font-medium">Logged-in users only</span>
    <span class="mt-2 block text-sm opacity-70">Every vote has a person behind it.</span>
  </label>
  <label class="cursor-pointer rounded-xl bg-gray-50 p-4 transition has-checked:bg-gray-950 has-checked:text-white dark:bg-gray-900 dark:has-checked:bg-white dark:has-checked:text-gray-950">
    <KleanRadio
      v-model="participation"
      class="sr-only"
      name="docs-participation"
      :value="true"
    />
    <span class="block text-sm font-medium">Anyone</span>
    <span class="mt-2 block text-sm opacity-70">Anonymous participation is allowed.</span>
  </label>
</div>

The selected style comes from `has-[:checked]`. Focus remains on the native
Radio, so add `focus-within:*` utilities to the label when the product treatment
needs a larger visible focus ring.

### Filter chips

Radio is also suitable for one filter from a compact visible set:

<fieldset class="py-4">
  <legend class="text-xs font-medium text-gray-500">Category</legend>
  <div class="mt-3 flex flex-wrap gap-2">
    <label
      v-for="item in ['all', 'billing', 'deploys', 'domains']"
      :key="item"
      class="min-h-11 cursor-pointer rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-500 has-checked:bg-gray-950 has-checked:text-white dark:bg-gray-900 dark:text-gray-400 dark:has-checked:bg-white dark:has-checked:text-gray-950"
    >
      <KleanRadio
        v-model="category"
        class="sr-only"
        name="docs-category"
        :value="item"
      />
      {{ item === 'all' ? 'All categories' : item }}
    </label>
  </div>
</fieldset>

When a filter should survive reload and be shareable, synchronize the selected
value with a query parameter. That URL policy belongs to the page, not Radio.

## API

| Purpose       | Vue                     | React                 | Svelte               |
| ------------- | ----------------------- | --------------------- | -------------------- |
| Current value | `v-model`               | `checked`, `onChange` | `bind:group`         |
| Initial value | initial model           | `defaultChecked`      | initial group        |
| Choice        | `value`                 | `value`               | `value`              |
| Group         | shared native `name`    | shared native `name`  | shared native `name` |
| Form          | native input attributes | native input props    | native attributes    |
| Styling       | `class`                 | `className`           | `class`              |

Radio exposes its native element for explicit focus recovery and stable
`data-slot="radio"`, `data-state`, `data-disabled`, and `data-invalid` hooks.
It has no `RadioGroup`, item, indicator, orientation, `variant`, `tone`, `size`,
label, or part-class props.

## Styling

The default intentionally retains native radio rendering. Its accent follows
the current text colour, and caller Tailwind merges last.

### Control and label styling

`Radio` renders only the native input. Its `class` or `className` styles the
control without styling the label text, so typography and layout remain
independent application markup:

```vue
<div class="flex items-center gap-3">
  <Radio
    id="region-lagos"
    v-model="region"
    name="region"
    value="lagos"
    class="size-5 text-emerald-700 focus-visible:outline-emerald-700"
  />
  <label for="region-lagos" class="text-sm text-gray-600">Lagos</label>
</div>
```

Keep the `id` and `for` association: it gives the Radio its accessible name and
makes the text a larger click target. Styling the label or an entire selected
card with `peer-checked:*` or `has-[:checked]:*` is optional caller markup.

For example:

```vue
<!-- Larger operational control -->
<Radio class="size-5 text-emerald-700 focus-visible:outline-emerald-700" />

<!-- Entire label becomes the visible choice -->
<label class="has-checked:bg-gray-950 has-checked:text-white">
  <Radio class="sr-only" />
  Team plan
</label>
```

There is no Klean theme token or variant mapping between the application and
its source.

## Durable state

Radio preserves the browser's form and reset contract. The owning feature
chooses durability:

- framework state for a temporary form choice;
- a URL parameter for a shareable filter;
- the database for an account or team preference;
- draft persistence only when losing an unfinished form would harm the user.

The primitive never guesses which policy applies and never writes to storage by
itself.

## Related components

- [Checkbox](/klean-ui/components/checkbox) — zero, one, or many independent values.
- [Switch](/klean-ui/components/switch) — an immediate boolean setting.
- [Select](/klean-ui/components/select) — one value from a longer fixed list.
- [Combobox](/klean-ui/components/combobox) — one searchable value.
- [Input](/klean-ui/components/input) — a free-form value rather than a fixed choice.

## Complete framework source

### Vue

<CopyCode :code="radioSource" label="Radio.vue" />

### React

<CopyCode :code="reactSource" label="Radio.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="Radio.svelte" />
