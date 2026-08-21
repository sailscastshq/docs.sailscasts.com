---
title: Line Chart
titleTemplate: Klean UI
description: A calm captioned trend with exact accessible values and caller-owned Tailwind across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanLineChart from '../../.vitepress/theme/components/klean/line-chart/LineChart.vue'
import lineChartSource from '../../.vitepress/theme/components/klean/line-chart/LineChart.vue?raw'
import reactSource from '../sources/line-chart/LineChart.jsx?raw'
import svelteSource from '../sources/line-chart/LineChart.svelte?raw'
import vueUsage from '../snippets/line-chart/usage.vue?raw'
import reactUsage from '../snippets/line-chart/usage.jsx?raw'
import svelteUsage from '../snippets/line-chart/usage.svelte?raw'

const signups = [
  { label: 'Fri', value: 4, detail: 'Friday, 4 signups' },
  { label: 'Sat', value: 4, detail: 'Saturday, 4 signups' },
  { label: 'Sun', value: 7, detail: 'Sunday, 7 signups' },
  { label: 'Mon', value: 7, detail: 'Monday, 7 signups' },
  { label: 'Tue', value: 4, detail: 'Tuesday, 4 signups' },
  { label: 'Wed', value: 4, detail: 'Wednesday, 4 signups' },
  { label: 'Thu', value: 5, detail: 'Thursday, 5 signups' }
]

const formatPercent = (value) => `${value}%`
</script>

# Line Chart

Line Chart gives one ordered trend a visible caption, a readable scale, calm responsive geometry, and points that disclose the same exact values on hover, touch, or keyboard focus. It is deliberately small enough for real application dashboards without bringing a charting system into the product.

<KleanPreview id="line-chart-source" :source="lineChartSource" filename="LineChart.vue">
  <template #preview>
    <section class="w-full max-w-xl rounded-2xl bg-white p-6 text-gray-950 shadow-sm dark:bg-gray-950 dark:text-white dark:shadow-black/30">
      <header class="flex items-end justify-between gap-6">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Last 7 days</p>
          <p class="mt-1 text-4xl font-semibold tracking-tight tabular-nums">38</p>
        </div>
        <p class="pb-1 text-right text-sm text-gray-500 dark:text-gray-400">+8 from<br />the week before</p>
      </header>
      <KleanLineChart
        :data="signups"
        caption="Daily signups"
        class="mt-8 h-56 text-gray-950 dark:text-gray-100"
      />
    </section>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/line-chart/LineChart.vue

  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and copies the matching one-file component into the conventional UI directory:

<KleanInstallation
  id="line-chart-installation"
  component="line-chart"
  :source="lineChartSource"
  filename="LineChart.vue"
  destination="assets/js/components/ui/line-chart/LineChart.vue"
  :dependencies="['tailwind-merge']"
/>

## When to use

Use Line Chart for one small ordered series such as signups over seven days, deployment duration over recent releases, or CPU usage over the last hour.

Use [Sparkline](/klean-ui/components/sparkline) when an adjacent visible number is primary and space is tight. Use [Table](/klean-ui/components/table) when people need to compare or retrieve many exact values. A dense analytical workspace with axes, zooming, brushing, stacked series, or statistical transforms deserves a purpose-built application chart—not more props on Line Chart.

## Usage

### Vue

<CopyCode :code="vueUsage" label="SignupChart.vue" />

### React

<CopyCode :code="reactUsage" label="SignupChart.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="SignupChart.svelte" />

## API

| Input                    | Default   | Purpose                                                                                      |
| ------------------------ | --------- | -------------------------------------------------------------------------------------------- |
| `data`                   | `[]`      | Ordered `{ label, value, detail? }` points. Non-finite values create honest gaps.            |
| `caption`                | required  | Visible name for the figure.                                                                 |
| `emptyLabel`             | `No data` | Visible and announced wording when no finite values exist.                                   |
| `formatValue`            | `String`  | Formats the visible scale and exact accessible values when a point does not supply `detail`. |
| `class` / `className`    | —         | Ordinary Tailwind merged after the neutral responsive frame. Color follows `currentColor`.   |
| native/global attributes | —         | IDs, data hooks, event hooks, and framework-native figure references when genuinely needed.  |

The stable datum contract is intentionally boring:

```js
{
  label: 'Mon',
  value: 7,
  detail: 'Monday, 7 signups'
}
```

`detail` is optional. Use it when the exact accessible sentence needs more context than `formatValue(value)` can provide.

## Inspecting exact values

The visible caption names a native figure. Hover, tap, or focus any finite sample to inspect its exact label and value. Edge points place their readout inward and high points place it below, so the callout stays with the chart in narrow containers.

The visual line, guides, and SVG markers remain decorative to assistive technology. The inspectable points form an exact labelled list generated from the same `data`, including unavailable samples. There is no second dataset to drift out of sync and hover is never the only route to the data.

The default exact value is `String(value)`. Format units or locale-sensitive numbers at the call site:

```vue
<KleanLineChart
  :data="cpu"
  caption="CPU usage — last hour"
  :format-value="formatPercent"
/>
```

Use `Intl.NumberFormat`, `Intl.DateTimeFormat`, or application-owned formatting before data reaches the component when locale changes the meaning. The chart does not guess locale, timezone, or units.

Render a visible [Table](/klean-ui/components/table) from the same array when people need persistent comparison or retrieval rather than one-at-a-time inspection.

## Empty, missing, and live data

- Empty or entirely invalid data shows `emptyLabel`.
- One finite value renders a point rather than inventing a trend.
- Flat, zero, negative, and very large values remain finite and stable.
- The finite minimum and maximum stay visible, so the tighter vertical range remains honest.
- Missing values break the line instead of implying continuity.
- Replacing `data` updates the figure; polling, realtime transport, and loading policy remain application state.
- Time range, metric selection, and filters belong in the URL only when they should survive refresh, history, or sharing.

## Styling with Tailwind

Height, width, color, caption treatment, labels, empty state, line treatment, and point readouts stay in caller Tailwind. Stable `data-slot` hooks make targeted styling explicit:

```vue
<LineChart
  :data="memory"
  caption="Memory — last hour"
  class="h-80 text-sky-600 **:data-[slot=line-chart-caption]:text-gray-950 **:data-[slot=line-chart-line]:stroke-[3]"
/>
```

There is no `variant`, palette, theme object, legend system, animation setting, or global chart provider. Repeated application treatment belongs in a small local wrapper around the copied component.

## Slipway and Hagfish

Slipway can replace its Lookout line geometry with Line Chart while retaining its exact current readings, dark operational styling, polling, and metric controls in application markup. Its compact CPU and memory rows use [Sparkline](/klean-ui/components/sparkline).

Hagfish can use the same primitive for small invoice or payment trends without inheriting Slipway colors or dashboard assumptions. Tailwind preserves each product's visual language; the data and accessibility contract stays the same.

## Related components

- [Sparkline](/klean-ui/components/sparkline) — a compact trend beside an exact visible number.
- [Table](/klean-ui/components/table) — visible exact values and comparison.
- [Card](/klean-ui/components/card) — a semantic surface for one chart and its supporting content.
- [Tooltip](/klean-ui/components/tooltip) — supplementary explanation, never the only source of chart data.

## Complete framework source

### Vue

<CopyCode :code="lineChartSource" label="LineChart.vue" />

### React

<CopyCode :code="reactSource" label="LineChart.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="LineChart.svelte" />
