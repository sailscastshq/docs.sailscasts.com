---
title: Sparkline
titleTemplate: Klean UI
description: A compact trend beside an exact value, with truthful accessible defaults and caller-owned Tailwind across Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanSparkline from '../../.vitepress/theme/components/klean/sparkline/Sparkline.vue'
import sparklineSource from '../../.vitepress/theme/components/klean/sparkline/Sparkline.vue?raw'
import reactSource from '../sources/sparkline/Sparkline.jsx?raw'
import svelteSource from '../sources/sparkline/Sparkline.svelte?raw'
import vueUsage from '../snippets/sparkline/usage.vue?raw'
import reactUsage from '../snippets/sparkline/usage.jsx?raw'
import svelteUsage from '../snippets/sparkline/usage.svelte?raw'

const cpu = [
  { label: '12:00', value: 18 },
  { label: '12:05', value: 24 },
  { label: '12:10', value: 21 },
  { label: '12:15', value: 39 },
  { label: '12:20', value: 31 },
  { label: '12:25', value: 42 }
]
</script>

# Sparkline

Sparkline is the small trend that sits beside an exact value. The number remains the truth; the line adds quick direction and shape without turning a compact status row into a chart dashboard.

<KleanPreview id="sparkline-source" :source="sparklineSource" filename="Sparkline.vue">
  <template #preview>
    <section class="grid w-full max-w-sm gap-3 rounded-xl border border-gray-200 bg-white p-5 text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-white">
      <p class="text-sm text-gray-600 dark:text-gray-400">CPU usage</p>
      <p class="flex items-end justify-between gap-5">
        <strong class="text-3xl tabular-nums">42%</strong>
        <KleanSparkline :data="cpu" class="mb-1 h-7 w-32 text-emerald-600 dark:text-emerald-400" />
      </p>
    </section>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/sparkline/Sparkline.vue

  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and copies the matching one-file component into the conventional UI directory:

<KleanInstallation
  id="sparkline-installation"
  component="sparkline"
  :source="sparklineSource"
  filename="Sparkline.vue"
  destination="assets/js/components/ui/sparkline/Sparkline.vue"
  :dependencies="['tailwind-merge']"
/>

## When to use

Use Sparkline in operational summaries, small metric cards, table cells, and dense side panels where a nearby visible number already states the current value.

Use [Line Chart](/klean-ui/components/line-chart) when the trend deserves its own caption, time span, and exact accessible values. Use [Table](/klean-ui/components/table) when comparison and lookup matter more than shape.

## Usage

### Vue

<CopyCode :code="vueUsage" label="CpuUsage.vue" />

### React

<CopyCode :code="reactUsage" label="CpuUsage.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="CpuUsage.svelte" />

## API

| Input                    | Default | Purpose                                                                                  |
| ------------------------ | ------- | ---------------------------------------------------------------------------------------- |
| `data`                   | `[]`    | Ordered `{ label, value }` points. Non-finite values create honest gaps in the line.     |
| `label`                  | —       | Makes the graphic informative and supplies its accessible name.                          |
| `class` / `className`    | —       | Ordinary Tailwind merged after the compact neutral size. Color follows `currentColor`.   |
| native/global attributes | —       | IDs, data hooks, event hooks, and framework-native element references when truly needed. |

There is no variant, color scale, tooltip, provider, animation, or chart configuration object.

## Accessible by default

Without `label`, Sparkline is decorative and stays out of the accessibility tree. This is the normal choice when an adjacent number and visible text already communicate the metric.

Add `label` only when the shape itself contributes information that is not otherwise present:

```vue
<Sparkline :data="cpu" label="CPU usage rose from 18 to 42 percent" />
```

A tooltip is never the only source of a value. Pointer hover, keyboard focus, touch, screenshots, print, and assistive technology all need the same truthful information.

## Data behavior

- Empty data renders an empty graphic without fabricated values.
- One finite point renders a visible point.
- Flat, zero, negative, and very large values remain finite and stable.
- A missing or non-finite point breaks the line instead of drawing through unknown data.
- The component is deterministic during server rendering.

## Styling with Tailwind

The line uses the element's text color, so ordinary Tailwind owns size and color:

```vue
<Sparkline :data="memory" class="h-8 w-40 text-sky-600 dark:text-sky-400" />
```

For repeated product treatment, keep a small application-owned wrapper. Sparkline does not acquire product tones or semantic variants.

## Related components

- [Line Chart](/klean-ui/components/line-chart) — a captioned trend with exact accessible values.
- [Table](/klean-ui/components/table) — exact comparison and lookup across rows and columns.
- [Tooltip](/klean-ui/components/tooltip) — supplementary help, never the only source of chart data.
- [Card](/klean-ui/components/card) — a semantic surface that can contain a compact metric.

## Complete framework source

### Vue

<CopyCode :code="sparklineSource" label="Sparkline.vue" />

### React

<CopyCode :code="reactSource" label="Sparkline.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="Sparkline.svelte" />
