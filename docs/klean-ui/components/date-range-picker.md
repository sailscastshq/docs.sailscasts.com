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

const period = ref({ start: '2026-08-08', end: '2026-08-12' })
const unavailable = (date) => date >= '2026-08-14' && date <= '2026-08-16'


import reactInstallInputjsx from '../sources/input/Input.jsx?raw'
import reactInstallPopoverjsx from '../sources/popover/Popover.jsx?raw'
import reactInstalldatejs from '../sources/calendar/date.react.js?raw'
import reactInstallCalendarjsx from '../sources/calendar/Calendar.jsx?raw'
import reactInstallDateRangePickerjsx from '../sources/date-range-picker/DateRangePicker.jsx?raw'
import svelteInstallInputsvelte from '../sources/input/Input.svelte?raw'
import svelteInstallPopoversvelte from '../sources/popover/Popover.svelte?raw'
import svelteInstalldatejs from '../sources/calendar/date.svelte.js?raw'
import svelteInstallCalendarsvelte from '../sources/calendar/Calendar.svelte?raw'
import svelteInstallDateRangePickersvelte from '../sources/date-range-picker/DateRangePicker.svelte?raw'

const installationFrameworks = [
  {
    id: 'vue', label: 'Vue',
    dependencies: ["tailwind-merge", "@floating-ui/dom"],
    files: [
      { filename: 'Input.vue', destination: 'assets/js/components/ui/input/Input.vue', source: inputSource },
      { filename: 'Popover.vue', destination: 'assets/js/components/ui/popover/Popover.vue', source: popoverSource },
      { filename: 'date.js', destination: 'assets/js/components/ui/calendar/date.js', source: dateSource },
      { filename: 'Calendar.vue', destination: 'assets/js/components/ui/calendar/Calendar.vue', source: calendarSource },
      { filename: 'DateRangePicker.vue', destination: 'assets/js/components/ui/date-range-picker/DateRangePicker.vue', source: rangeSource },
    ]
  },
  {
    id: 'react', label: 'React',
    dependencies: ["tailwind-merge", "@floating-ui/dom"],
    files: [
      { filename: 'Input.jsx', destination: 'assets/js/components/ui/input/Input.jsx', source: reactInstallInputjsx },
      { filename: 'Popover.jsx', destination: 'assets/js/components/ui/popover/Popover.jsx', source: reactInstallPopoverjsx },
      { filename: 'date.js', destination: 'assets/js/components/ui/calendar/date.js', source: reactInstalldatejs },
      { filename: 'Calendar.jsx', destination: 'assets/js/components/ui/calendar/Calendar.jsx', source: reactInstallCalendarjsx },
      { filename: 'DateRangePicker.jsx', destination: 'assets/js/components/ui/date-range-picker/DateRangePicker.jsx', source: reactInstallDateRangePickerjsx },
    ]
  },
  {
    id: 'svelte', label: 'Svelte',
    dependencies: ["tailwind-merge", "@floating-ui/dom"],
    files: [
      { filename: 'Input.svelte', destination: 'assets/js/components/ui/input/Input.svelte', source: svelteInstallInputsvelte },
      { filename: 'Popover.svelte', destination: 'assets/js/components/ui/popover/Popover.svelte', source: svelteInstallPopoversvelte },
      { filename: 'date.js', destination: 'assets/js/components/ui/calendar/date.js', source: svelteInstalldatejs },
      { filename: 'Calendar.svelte', destination: 'assets/js/components/ui/calendar/Calendar.svelte', source: svelteInstallCalendarsvelte },
      { filename: 'DateRangePicker.svelte', destination: 'assets/js/components/ui/date-range-picker/DateRangePicker.svelte', source: svelteInstallDateRangePickersvelte },
    ]
  },
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
        :unavailable="unavailable"
        required
      />
      <output class="font-mono text-sm text-gray-600 dark:text-gray-300">
        {{ period.start }} → {{ period.end }}
      </output>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        August 14–16 is unavailable, so a contiguous range cannot cross it.
      </p>
    </div>
  </template>
  <template #usage>

::: code-group

<<< ../snippets/date-range-picker/usage.vue [Vue]

<<< ../snippets/date-range-picker/usage.jsx [React]

<<< ../snippets/date-range-picker/usage.svelte [Svelte]

:::

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
  :frameworks="installationFrameworks"
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

Copy the [example above](#date-range-source) for your framework.

## Value and form contract

The value is `{ start, end }`. A picker named `period` submits two native form
entries: `period[start]` and `period[end]`. Committed state is always empty,
start-only, or a complete ordered range. It never contains a partial date, an
end without a start, or a timezone-dependent Date.

Ranges are inclusive: the start and end may be the same day. That is useful for
one-day reports and stays. If a product requires at least one day between the
boundaries, express that product rule with availability or compose two Date
Pickers with derived `min` and `max` values.

Choosing a second date earlier than the first orders the result. The component
does not leave the application with an inverted range.

## Range rules

- The calendar anchors to the field that opened it. It flips or shifts before
  leaving the viewport and follows the field through scroll, resize, and layout
  changes.
- Start and end are inclusive; selecting the same date twice creates a valid
  one-day range.
- Reverse calendar selection is ordered automatically. An inverted typed draft
  is reported as invalid without changing committed application state.
- Clearing the start clears both boundaries. Typing an end without a start
  remains an invalid draft.
- `min` and `max` constrain both boundaries. An `unavailable` date cannot be
  selected or crossed, so the result remains one contiguous range.
- Arrow Down opens from either field. Escape and explicit dismissal return
  focus to that field; outside dismissal leaves focus at the new target.
- Required, disabled, readonly, controlled, uncontrolled, locale, direction,
  and native form behavior need no additional configuration.

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

Calendar, Date Picker, and Date Range Picker use date-only `YYYY-MM-DD` values.
Choose Schedule Picker when time and timezone must resolve to an exact ISO instant.

- [Calendar](/klean-ui/components/calendar) — one always-visible date-only `YYYY-MM-DD` surface.
- [Date Picker](/klean-ui/components/date-picker) — independent date-only `YYYY-MM-DD` values and asymmetric rules.
- [Schedule Picker](/klean-ui/components/schedule-picker) — date and time as an exact ISO instant; future scheduling by default, historical editing with `allowPast`.
- [Popover](/klean-ui/components/popover) — the floating surface used by the compact range.

## Complete framework source

::: code-group

<<< ../../.vitepress/theme/components/klean/date-range-picker/DateRangePicker.vue [Vue]

<<< ../sources/date-range-picker/DateRangePicker.jsx [React]

<<< ../sources/date-range-picker/DateRangePicker.svelte [Svelte]

:::
