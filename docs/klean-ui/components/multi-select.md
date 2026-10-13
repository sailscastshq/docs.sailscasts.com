---
title: MultiSelect
titleTemplate: Klean UI
description: A fixed-choice collection picker with native form values and Tailwind styling.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import KleanFrameworkCode from '../../.vitepress/theme/components/KleanFrameworkCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import MultiSelect from '../../.vitepress/theme/components/klean/multi-select/MultiSelect.vue'
import source from '../../.vitepress/theme/components/klean/multi-select/MultiSelect.vue?raw'
import reactPopoverSource from '../sources/popover/Popover.jsx?raw'
import sveltePopoverSource from '../sources/popover/Popover.svelte?raw'
import popoverSource from '../../.vitepress/theme/components/klean/popover/Popover.vue?raw'
import reactSource from '../sources/multi-select/MultiSelect.jsx?raw'
import svelteSource from '../sources/multi-select/MultiSelect.svelte?raw'
import vueUsage from '../snippets/multi-select/usage.vue?raw'
import reactUsage from '../snippets/multi-select/usage.jsx?raw'
import svelteUsage from '../snippets/multi-select/usage.svelte?raw'
const teams = ref([])
const options = [{ value: 'design', label: 'Design' }, { value: 'engineering', label: 'Engineering', disabled: true }, { value: 'support', label: 'Support' }, { value: 'operations', label: 'Operations' }]
const files = [{ filename: 'Popover.vue', destination: 'assets/js/components/ui/popover/Popover.vue', source: popoverSource }, { filename: 'MultiSelect.vue', destination: 'assets/js/components/ui/multi-select/MultiSelect.vue', source }]
const frameworks = [
 {id:'vue',label:'Vue',code:source,filename:'MultiSelect.vue',files},
 {id:'react',label:'React',code:reactSource,filename:'MultiSelect.jsx',files:[{filename:'Popover.jsx',destination:'assets/js/components/ui/popover/Popover.jsx',source:reactPopoverSource},{filename:'MultiSelect.jsx',destination:'assets/js/components/ui/multi-select/MultiSelect.jsx',source:reactSource}]},
 {id:'svelte',label:'Svelte',code:svelteSource,filename:'MultiSelect.svelte',files:[{filename:'Popover.svelte',destination:'assets/js/components/ui/popover/Popover.svelte',source:sveltePopoverSource},{filename:'MultiSelect.svelte',destination:'assets/js/components/ui/multi-select/MultiSelect.svelte',source:svelteSource}]}
]
const usage = [{id:'vue',label:'Vue',code:vueUsage,filename:'Teams.vue'},{id:'react',label:'React',code:reactUsage,filename:'Teams.jsx'},{id:'svelte',label:'Svelte',code:svelteUsage,filename:'Teams.svelte'}]
</script>

# MultiSelect

MultiSelect selects a collection from fixed choices. It does not create tokens or search remote data. Use a visible checkbox group for a short list, [Select](/klean-ui/components/select) for one choice, or [TagsInput](/klean-ui/components/tags-input) for free text.

<KleanPreview id="multi-select-preview" :source="source" filename="MultiSelect.vue">
<template #preview>
<form class="grid w-full max-w-sm gap-3" @reset="teams = []" @submit.prevent>
<label for="docs-teams" class="text-sm font-medium">Teams</label>
<MultiSelect id="docs-teams" v-model="teams" :options="options" name="teams" required />
<output class="text-sm">{{ teams.length ? teams.join(', ') : 'No teams selected' }}</output>
<div class="flex gap-3"><button type="reset">Reset</button><button type="submit">Submit</button></div>
</form>
</template>
<template #caption>Arrow keys move, Home/End reach the ends, typing highlights a matching label, and Space/Enter toggle without closing. Escape closes and restores focus. Engineering is disabled.</template>
</KleanPreview>

## Installation

<KleanInstallation id="multi-select-installation" component="multi-select" :source="source" filename="MultiSelect.vue" destination="assets/js/components/ui/multi-select/MultiSelect.vue" :frameworks="frameworks" :dependencies="['@floating-ui/dom', 'tailwind-merge']" :command-available="false" />

Copy MultiSelect and Popover from the complete framework sources above. There is no provider, runtime dependency on Klean, or new interaction library.

## Usage

<KleanFrameworkCode id="multi-select-usage" :frameworks="usage" label="MultiSelect usage framework" />

## Behavioral contract

| Input                                           | Contract                                                                                                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`                                       | Fixed `{ value, label, disabled?, group? }` choices. Use string, number, or boolean values with unique string serialization; labels name choices. |
| Vue `modelValue`, React `value`, Svelte `value` | Controlled array; Vue `v-model`, React `onValueChange`, Svelte `bind:value`.                                                                      |
| `defaultValue`                                  | Initial uncontrolled array, empty by default. Native form reset restores it. Controlled forms reset their own array.                              |
| `placeholder`                                   | Application-owned empty text, default `Select options`.                                                                                           |
| `name`, `form`, `required`, `disabled`, `id`    | Native form contract. A hidden native multiple select supplies validation and repeated values.                                                    |
| `open`, `defaultOpen`                           | Framework-native controlled/default popup state.                                                                                                  |
| `placement`, `offset`                           | Existing Popover positioning behavior.                                                                                                            |
| `class` / `className`                           | Caller Tailwind utilities merge last on the visible trigger. Native descriptions, labels and events forward to it.                                |

Only known choices render and submit. Prefer string values. Do not mix values that stringify identically, such as `1` and `'1'`; native HTML cannot distinguish those form values. Application values retain their type; HTML form values serialize to strings in option order. Disabled choices cannot toggle and are excluded from native form submission. An empty collection submits no entry. Use `new FormData(form).getAll('teams')`, not `get('teams')`.

Required validation focuses the visible trigger and exposes `aria-invalid`. Associate application error text through `aria-describedby`; the application owns validation wording. The hidden form select is excluded from the accessibility tree and tab order, leaving one interactive widget.

Selection stays open to collect several choices. Repeated activation toggles rather than duplicating. Navigation and typeahead do not commit choices. Escape and outside dismissal preserve accepted selection; they do not roll back the application array. Disabled controls never open. Popup state is ephemeral; the application owns durable storage or server updates.

## Anatomy and composition

The source exposes `data-slot="multi-select"`, `multi-select-trigger`, `multi-select-value`, `multi-select-content`, `multi-select-listbox`, `multi-select-option`, `multi-select-indicator`, and `multi-select-native`. Option state uses `data-selected`, `data-highlighted` and `data-disabled`.

Vue `#value="{ options }"`, React `renderValue(options)`, and Svelte `valueContent(options)` customize the selected collection. Vue `#option`, React `renderOption`, and Svelte `optionContent` receive the option plus selected/highlighted state. The default trigger lists selected labels; a localized count or chips belongs in application composition. Icon and empty content use the matching framework-native slots/render callbacks/snippets.

Use ordinary Tailwind classes for density, borders and width. There are no `size`, `variant`, chip style, or color props. Labels and empty text remain application-owned.

## Complete source

<KleanFrameworkCode id="multi-select-source" :frameworks="frameworks" label="MultiSelect source framework" />

Copy [Popover](/klean-ui/components/popover) alongside the component when installing manually.
