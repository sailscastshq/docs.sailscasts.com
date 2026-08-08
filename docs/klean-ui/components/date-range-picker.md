---
title: Date Range Picker
titleTemplate: Klean UI
description: An accessible start-and-end date picker with stable form values for Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanDateRangePicker from '../../.vitepress/theme/components/klean/date-range-picker/DateRangePicker.vue'
import inputSource from '../../.vitepress/theme/components/klean/input/Input.vue?raw'
import popoverSource from '../../.vitepress/theme/components/klean/popover/Popover.vue?raw'
import calendarSource from '../../.vitepress/theme/components/klean/calendar/Calendar.vue?raw'
import dateSource from '../../.vitepress/theme/components/klean/calendar/date.js?raw'
import rangeSource from '../../.vitepress/theme/components/klean/date-range-picker/DateRangePicker.vue?raw'
import reactSource from '../sources/date-range-picker/DateRangePicker.jsx?raw'
import svelteSource from '../sources/date-range-picker/DateRangePicker.svelte?raw'
import vueUsage from '../snippets/date-range-picker/usage.vue?raw'
import reactUsage from '../snippets/date-range-picker/usage.jsx?raw'
import svelteUsage from '../snippets/date-range-picker/usage.svelte?raw'

const period = ref({ start: '2026-08-08', end: '2026-08-12' })
const vueFiles = [
  {
    filename: 'Input.vue',
    destination: 'assets/js/components/ui/input/Input.vue',
    source: inputSource
  },
  {
    filename: 'Popover.vue',
    destination: 'assets/js/components/ui/popover/Popover.vue',
    source: popoverSource
  },
  {
    filename: 'date.js',
    destination: 'assets/js/components/ui/calendar/date.js',
    source: dateSource
  },
  {
    filename: 'Calendar.vue',
    destination: 'assets/js/components/ui/calendar/Calendar.vue',
    source: calendarSource
  },
  {
    filename: 'DateRangePicker.vue',
    destination: 'assets/js/components/ui/date-range-picker/DateRangePicker.vue',
    source: rangeSource
  }
]
</script>

# Date Range Picker

Date Range Picker handles one decision with two date-only boundaries. It
submits both dates as stable `YYYY-MM-DD` values and keeps the contiguous range
visible in Calendar.

<KleanPreview id="date-range-source" :source="rangeSource" filename="DateRangePicker.vue">
  <template #preview>
    <div class="grid w-full max-w-xl gap-3">
      <KleanDateRangePicker
        v-model="period"
        name="period"
        label="Reporting period"
        start-label="From"
        end-label="To"
        required
      />
      <output class="font-mono text-sm text-gray-600 dark:text-gray-300">
        {{ period.start }} → {{ period.end }}
      </output>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/date-range-picker/DateRangePicker.vue

  </template>
</KleanPreview>

## Installation

The registry resolves Input, Popover, and Calendar before installing the
framework-native range composition:

<KleanInstallation
  id="date-range-installation"
  component="date-range-picker"
  :source="rangeSource"
  filename="DateRangePicker.vue"
  destination="assets/js/components/ui/date-range-picker/DateRangePicker.vue"
  :files="vueFiles"
  :dependencies="['@floating-ui/dom', 'tailwind-merge']"
/>

## When to use

Use Date Range Picker for reporting periods, stays, booking windows,
availability, campaigns, and filters where start and end form one decision.

## When not to use

Use two [Date Pickers](/klean-ui/components/date-picker) when the fields have
different business meanings or asymmetric rules, such as invoice issue and due
dates. Use [Schedule Picker](/klean-ui/components/schedule-picker) when either
boundary needs a time and timezone. Use [Calendar](/klean-ui/components/calendar)
when the date surface should remain visible.

## Usage

### Vue

<CopyCode :code="vueUsage" label="ReportingPeriod.vue" />

### React

<CopyCode :code="reactUsage" label="ReportingPeriod.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="ReportingPeriod.svelte" />

## Value and form contract

The value is `{ start, end }`. A picker named `period` submits two native form
entries: `period[start]` and `period[end]`. An unfinished boundary stays an
empty string rather than becoming a partial date or a timezone-dependent Date.

Ranges are inclusive: the start and end may be the same day. That is useful for
one-day reports and stays. If a product requires at least one day between the
boundaries, express that product rule with availability or compose two Date
Pickers with derived `min` and `max` values.

Choosing a second date earlier than the first orders the result. The component
does not leave the application with an inverted range.

## API

| Purpose                | Vue                                 | React                              | Svelte                             |
| ---------------------- | ----------------------------------- | ---------------------------------- | ---------------------------------- |
| Current range          | `v-model`                           | `value`, `onValueChange`           | `bind:value`                       |
| Initial range          | `default-value`                     | `defaultValue`                     | `defaultValue`                     |
| Native form names      | `name`                              | `name`                             | `name`                             |
| Group and field labels | `label`, `start-label`, `end-label` | `label`, `startLabel`, `endLabel`  | `label`, `startLabel`, `endLabel`  |
| Bounds                 | `min`, `max`                        | `min`, `max`                       | `min`, `max`                       |
| Product availability   | `unavailable`                       | `unavailable`                      | `unavailable`                      |
| Open state             | `v-model:open`                      | `open`, `onOpenChange`             | `bind:open`                        |
| Native states          | `required`, `disabled`, `readonly`  | `required`, `disabled`, `readOnly` | `required`, `disabled`, `readonly` |

The root is a semantic fieldset with one legend and two labelled editable
fields. Arrow Down opens Calendar from either field. Selecting the start keeps
the surface open and advances to the end; selecting the end closes it and
returns focus reliably.

## Related components

- [Calendar](/klean-ui/components/calendar) — one always-visible date surface.
- [Date Picker](/klean-ui/components/date-picker) — independent dates and asymmetric business rules.
- [Schedule Picker](/klean-ui/components/schedule-picker) — an exact future date and time.
- [Popover](/klean-ui/components/popover) — the floating surface used by the compact range.

## Complete framework source

### Vue

<CopyCode :code="rangeSource" label="DateRangePicker.vue" />

### React

<CopyCode :code="reactSource" label="DateRangePicker.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="DateRangePicker.svelte" />
