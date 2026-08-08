---
title: Calendar
titleTemplate: Klean UI
description: An accessible, locale-aware date-only calendar for Vue, React, and Svelte.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanCalendar from '../../.vitepress/theme/components/klean/calendar/Calendar.vue'
import calendarSource from '../../.vitepress/theme/components/klean/calendar/Calendar.vue?raw'
import dateSource from '../../.vitepress/theme/components/klean/calendar/date.js?raw'
import reactSource from '../sources/calendar/Calendar.jsx?raw'
import reactDateSource from '../sources/calendar/date.react.js?raw'
import svelteSource from '../sources/calendar/Calendar.svelte?raw'
import svelteDateSource from '../sources/calendar/date.svelte.js?raw'
import vueUsage from '../snippets/calendar/usage.vue?raw'
import reactUsage from '../snippets/calendar/usage.jsx?raw'
import svelteUsage from '../snippets/calendar/usage.svelte?raw'

const selectedDate = ref('2026-08-12')
const vueFiles = [
  {
    filename: 'date.js',
    destination: 'assets/js/components/ui/calendar/date.js',
    source: dateSource
  },
  {
    filename: 'Calendar.vue',
    destination: 'assets/js/components/ui/calendar/Calendar.vue',
    source: calendarSource
  }
]
</script>

# Calendar

Calendar is an always-visible, locale-aware surface for choosing one date. Its
value is `YYYY-MM-DD`: a date on a calendar, not midnight in an accidental
timezone.

<KleanPreview id="calendar-source" :source="calendarSource" filename="Calendar.vue">
  <template #preview>
    <div class="grid justify-items-center gap-4">
      <KleanCalendar v-model="selectedDate" :min="'2026-08-01'" :max="'2026-12-31'" />
      <output class="font-mono text-sm text-gray-600 dark:text-gray-300">
        {{ selectedDate }}
      </output>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/calendar/Calendar.vue

  </template>
  <template #caption>
    Try Arrow keys, Home, End, Page Up, Page Down, and Shift with Page Up or Page Down.
  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and installs the framework-native
calendar plus its small date-only helper:

<KleanInstallation
  id="calendar-installation"
  component="calendar"
  :source="calendarSource"
  filename="Calendar.vue"
  destination="assets/js/components/ui/calendar/Calendar.vue"
  :files="vueFiles"
  :dependencies="['tailwind-merge']"
/>

## When to use

Use Calendar when choosing dates is the main task: availability, booking,
capacity, or a scheduling workspace where the month should remain visible.

## When not to use

Use [Date Picker](/klean-ui/components/date-picker) for one compact form field,
[Date Range Picker](/klean-ui/components/date-range-picker) for one related
period, and [Schedule Picker](/klean-ui/components/schedule-picker) when date,
time, and timezone must become an exact instant.

## Usage

### Vue

<CopyCode :code="vueUsage" label="AvailabilityCalendar.vue" />

### React

<CopyCode :code="reactUsage" label="AvailabilityCalendar.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="AvailabilityCalendar.svelte" />

## API

| Purpose              | Vue                    | React                    | Svelte                 |
| -------------------- | ---------------------- | ------------------------ | ---------------------- |
| Current value        | `v-model`              | `value`, `onValueChange` | `bind:value`           |
| Initial value        | `default-value`        | `defaultValue`           | `defaultValue`         |
| Bounds               | `min`, `max`           | `min`, `max`             | `min`, `max`           |
| Product availability | `unavailable`          | `unavailable`            | `unavailable`          |
| Locale               | `locale`, `dir`        | `locale`, `dir`          | `locale`, `dir`        |
| Interaction          | `disabled`, `readonly` | `disabled`, `readOnly`   | `disabled`, `readonly` |
| Styling              | `class`                | `className`              | `class`                |

`unavailable(date)` receives a `YYYY-MM-DD` string. Return `true` for dates the
product cannot accept. The component owns date navigation and selection; the
application owns business availability and ordinary Tailwind.

There are no variants, tones, week-start settings, or translation tables.
`Intl` derives month names, weekday names, reading direction, and locale week
conventions. A supplied `dir` overrides direction when the application needs
to do so explicitly.

## Keyboard and accessibility

- Arrow Left and Right move by day; Arrow Up and Down move by week.
- Home and End move to the first and last day of the locale week.
- Page Up and Page Down move by month; Shift moves by year.
- Enter and Space select an available date.
- Every date is a native button inside a semantic grid.
- Focus follows the active date without creating 42 Tab stops.
- Disabled dates remain understandable and cannot be committed.

Calendar state is durable only when the application persists the selected
date. The viewed month and focused day are interaction state and are never
written to storage or the URL by Klean.

## Related components

- [Date Picker](/klean-ui/components/date-picker) — one editable date field with an optional calendar.
- [Date Range Picker](/klean-ui/components/date-range-picker) — one related start and end date.
- [Schedule Picker](/klean-ui/components/schedule-picker) — a date, wall-clock time, and timezone.
- [Popover](/klean-ui/components/popover) — the floating surface used by compact date components.

## Complete framework source

### Vue

<CopyCode :code="calendarSource" label="Calendar.vue" />
<CopyCode :code="dateSource" label="date.js" />

### React

<CopyCode :code="reactSource" label="Calendar.jsx" />
<CopyCode :code="reactDateSource" label="date.js" />

### Svelte

<CopyCode :code="svelteSource" label="Calendar.svelte" />
<CopyCode :code="svelteDateSource" label="date.js" />
