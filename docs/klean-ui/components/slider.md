---
title: Slider
titleTemplate: Klean UI
description: Choose a number or a numeric range with accessible controls and caller-owned styling.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import Slider from '../../.vitepress/theme/components/klean/slider/Slider.vue'
import sliderSource from '../../.vitepress/theme/components/klean/slider/Slider.vue?raw'
const rollout = ref(40)
const budget = ref([200, 800])
const effort = ref(3)
const marks = [1, 2, 3, 4, 5].map(value => ({ value, label: value }))
const efforts = ['','Quick','Light','Balanced','Thorough','Deep']
const dollars = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
</script>

# Slider

Choose a number, a level, or the endpoints of a numeric range. Pass one number for a single handle, or two numbers for a range.

<KleanPreview id="slider-preview" :source="sliderSource" filename="Slider.vue">
  <template #preview>
    <div class="grid w-full max-w-xl gap-10 py-4">
      <section>
        <div class="flex justify-between gap-4 text-sm font-medium"><label for="docs-rollout">Release rollout</label><output class="tabular-nums">{{ rollout }}%</output></div>
        <Slider id="docs-rollout" v-model="rollout" name="rollout" :value-text="value => value + ' percent'" />
        <p class="text-sm text-gray-500 dark:text-gray-400">Choose how many visitors receive the release.</p>
      </section>
      <section>
        <div class="flex justify-between gap-4 text-sm font-medium"><span id="docs-budget-label">Monthly budget</span><output class="tabular-nums">{{ dollars(budget[0]) }} – {{ dollars(budget[1]) }}</output></div>
        <Slider v-model="budget" :max="1000" :step="10" :labels="['Minimum budget', 'Maximum budget']" aria-labelledby="docs-budget-label" :value-text="dollars" />
        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400"><span>$0</span><span>$1,000</span></div>
      </section>
      <section class="pb-5">
        <div class="flex justify-between gap-4 text-sm font-medium"><label for="docs-effort">Thinking effort</label><output>{{ efforts[effort] }}</output></div>
        <Slider id="docs-effort" v-model="effort" :min="1" :max="5" :marks="marks" :value-text="value => efforts[value]" />
      </section>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/slider/Slider.vue

  </template>
</KleanPreview>

## When to use

Use Slider when relative adjustment is easier than typing: rollout percentages, volume, playback speed, price filters, or a small ordered set of levels. Show the current value beside its label.

For an exact amount, pair it with [Input](/klean-ui/components/input), bound to the same value. For actions such as deploying a release, use [Slide](/klean-ui/components/slide), not Slider.

## Installation

```sh
npx klean-ui add slider
```

## Single value

::: code-group

```vue [Vue]
<script setup>
import { ref } from 'vue'
import Slider from '@/components/ui/slider/Slider.vue'
const rollout = ref(40)
</script>

<template>
  <label for="rollout">Release rollout</label>
  <output>{{ rollout }}%</output>
  <Slider
    id="rollout"
    v-model="rollout"
    name="rollout"
    :value-text="(value) => value + ' percent'"
  />
</template>
```

```jsx [React]
import { useState } from 'react'
import Slider from '@/components/ui/slider/Slider.jsx'

export default function ReleaseRollout() {
  const [rollout, setRollout] = useState(40)
  return (
    <>
      <label htmlFor="rollout">Release rollout</label>
      <output>{rollout}%</output>
      <Slider
        id="rollout"
        value={rollout}
        onChange={setRollout}
        name="rollout"
        valueText={(value) => value + ' percent'}
      />
    </>
  )
}
```

```svelte [Svelte]
<script>
  import Slider from '@/components/ui/slider/Slider.svelte'
  let rollout = $state(40)
</script>

<label for="rollout">Release rollout</label>
<output>{rollout}%</output>
<Slider
  id="rollout"
  bind:value={rollout}
  name="rollout"
  valueText={(value) => value + ' percent'}
/>
```

:::

## Numeric range

A two-number value selects a range. Give each endpoint a distinct label. The handles cannot cross, and their keyboard order stays minimum then maximum.

::: code-group

```vue [Vue]
<Slider
  v-model="budget"
  :max="1000"
  :step="10"
  aria-label="Monthly budget"
  :labels="['Minimum budget', 'Maximum budget']"
  :value-text="(value) => '$' + value"
  :name="['minimum', 'maximum']"
/>
```

```jsx [React]
<Slider
  value={budget}
  onChange={setBudget}
  max={1000}
  step={10}
  aria-label="Monthly budget"
  labels={['Minimum budget', 'Maximum budget']}
  valueText={(value) => '$' + value}
  name={['minimum', 'maximum']}
/>
```

```svelte [Svelte]
<Slider
  bind:value={budget}
  max={1000}
  step={10}
  aria-label="Monthly budget"
  labels={['Minimum budget', 'Maximum budget']}
  valueText={(value) => '$' + value}
  name={['minimum', 'maximum']}
/>
```

:::

Initialize `budget` to `[200, 800]`. Use `minStepsBetween` to keep a minimum distance, measured in steps. With a step of 10 and a minimum separation of two steps, the handles stay at least 20 apart. Without a minimum distance, both endpoints may select the same value.

A single `name` submits both endpoints under that name; read them with `FormData.getAll()`. A two-name array submits each endpoint separately.

## Steps and marks

Set `min`, `max`, and `step` to describe the values your application accepts. Steps begin at `min`. Decimal and negative values are supported; `step="any"` allows continuous adjustment.

Marks identify meaningful positions. Pass numbers for dots, or `{ value, label }` objects for dots with labels. Marks do not restrict the values: `step` does.

::: code-group

```vue [Vue]
<Slider
  v-model="effort"
  :min="1"
  :max="5"
  aria-label="Thinking effort"
  :marks="[
    { value: 1, label: 'Quick' },
    { value: 3, label: 'Balanced' },
    { value: 5, label: 'Deep' }
  ]"
  :value-text="
    (value) => ['', 'Quick', 'Light', 'Balanced', 'Thorough', 'Deep'][value]
  "
/>
```

```jsx [React]
<Slider
  value={effort}
  onChange={setEffort}
  min={1}
  max={5}
  aria-label="Thinking effort"
  marks={[
    { value: 1, label: 'Quick' },
    { value: 3, label: 'Balanced' },
    { value: 5, label: 'Deep' }
  ]}
  valueText={(value) =>
    ['', 'Quick', 'Light', 'Balanced', 'Thorough', 'Deep'][value]
  }
/>
```

```svelte [Svelte]
<Slider
  bind:value={effort}
  min={1}
  max={5}
  aria-label="Thinking effort"
  marks={[
    { value: 1, label: 'Quick' },
    { value: 3, label: 'Balanced' },
    { value: 5, label: 'Deep' }
  ]}
  valueText={(value) =>
    ['', 'Quick', 'Light', 'Balanced', 'Thorough', 'Deep'][value]}
/>
```

:::

Keep marks sparse enough that their labels fit at narrow widths. Choose a step that lands exactly on your maximum when that endpoint matters.

## Changes and commits

Binding updates the value while the user adjusts it. Use `commit` for work that should wait until an adjustment completes, such as submitting an expensive filter request.

| Purpose              | Vue       | React                | Svelte       |
| -------------------- | --------- | -------------------- | ------------ |
| Bind value           | `v-model` | `value` + `onChange` | `bind:value` |
| Observe changes      | `@change` | `onChange`           | `onchange`   |
| Completed adjustment | `@commit` | `onCommit`           | `oncommit`   |
| Classes              | `class`   | `className`          | `class`      |

Callbacks receive the number or two-number array, not a DOM event. An interrupted pointer gesture restores its starting value without committing. Form reset restores the initial value.

## Styling

Use ordinary Tailwind classes. For example, `class="text-blue-600"` changes the filled track and keyboard focus color. Caller classes win over the neutral defaults.

The root exposes `data-slot="slider"`, `data-disabled`, and `data-dragging`. Descendants expose `slider-track`, `slider-fill`, `slider-thumb`, `slider-mark`, and `slider-mark-label`. Use ordinary descendant selectors for track, fill, and mark styling; the native thumb accepts browser thumb pseudo-element selectors. Extract an application component when a visual treatment repeats.

Keep value movement immediate. Do not add an animation that makes the handle lag behind dragging or keyboard input.

## Accessible labels and errors

Associate a visible `<label>` with a single slider using `for` and `id`. Use `aria-label` when a visible label is not available. For ranges, label the group with `aria-label` or `aria-labelledby` and supply distinct endpoint `labels`.

Use `valueText` when a plain number is not enough—for example “40 percent”, “Balanced”, or a formatted currency amount. Keep the same unit visible beside the control.

Set `aria-invalid` and connect an error message with `aria-describedby` for application validation. Do not communicate errors through color alone. `disabled` removes unavailable controls from the tab order; their values remain visible.

Arrow keys adjust by one step. Home and End reach the allowed endpoints. Shift with an arrow, or Page Up and Page Down, adjusts by ten steps; `bigStep` overrides that increment. Direction follows the surrounding `dir` setting.

## Durable application state

A slider does not decide where its value belongs. Keep shareable filters in the URL and configuration changes in the application's form or saved record. Update visible values immediately; persist or navigate after a commit when appropriate. On failure, keep the value and an actionable error visible.

## Source

<<< ../../.vitepress/theme/components/klean/slider/Slider.vue

<<< ../../.vitepress/theme/components/klean/slider/slider.js

## Related components

- [Input](/klean-ui/components/input) — exact numeric entry alongside relative adjustment.
- [Filter Bar](/klean-ui/components/filter-bar) — compose a range into shareable filters.
- [Select](/klean-ui/components/select) — choose discrete options that do not form an ordered numeric scale.
- [Slide](/klean-ui/components/slide) — confirm an action rather than choose a value.
