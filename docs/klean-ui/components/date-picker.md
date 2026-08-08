---
title: Date Picker
titleTemplate: Klean UI
description: An editable date-only field with Calendar, native-first Popover, and stable form values.
outline: [2, 3]
---

<script setup>
import { computed, ref, watch } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanDatePicker from '../../.vitepress/theme/components/klean/date-picker/DatePicker.vue'
import { addDays, todayIso } from '../../.vitepress/theme/components/klean/calendar/date.js'
import inputSource from '../../.vitepress/theme/components/klean/input/Input.vue?raw'
import popoverSource from '../../.vitepress/theme/components/klean/popover/Popover.vue?raw'
import calendarSource from '../../.vitepress/theme/components/klean/calendar/Calendar.vue?raw'
import dateSource from '../../.vitepress/theme/components/klean/calendar/date.js?raw'
import datePickerSource from '../../.vitepress/theme/components/klean/date-picker/DatePicker.vue?raw'
import reactSource from '../sources/date-picker/DatePicker.jsx?raw'
import svelteSource from '../sources/date-picker/DatePicker.svelte?raw'
import vueUsage from '../snippets/date-picker/usage.vue?raw'
import reactUsage from '../snippets/date-picker/usage.jsx?raw'
import svelteUsage from '../snippets/date-picker/usage.svelte?raw'
import invoiceSource from '../snippets/date-picker/invoice-dates.vue?raw'

const selectedDate = ref('2026-08-12')
const today = todayIso()
const issuedAt = ref(today)
const dueAt = ref(addDays(today, 30))
const minimumDueDate = computed(() => addDays(issuedAt.value, 1))
const maximumIssueDate = computed(() => addDays(dueAt.value, -1))

watch(issuedAt, () => {
  if (dueAt.value < minimumDueDate.value) dueAt.value = minimumDueDate.value
})

watch(dueAt, () => {
  if (issuedAt.value > maximumIssueDate.value) issuedAt.value = maximumIssueDate.value
})

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
    filename: 'DatePicker.vue',
    destination: 'assets/js/components/ui/date-picker/DatePicker.vue',
    source: datePickerSource
  }
]
</script>

# Date Picker

Date Picker is the normal choice for one date in a form. The field stays
editable, Calendar is an enhancement, and the submitted value is always
`YYYY-MM-DD`.

<KleanPreview id="date-picker-source" :source="datePickerSource" filename="DatePicker.vue">
  <template #preview>
    <div class="grid w-full max-w-sm gap-2">
      <label for="docs-due-date" class="text-sm font-medium">Due date</label>
      <KleanDatePicker
        id="docs-due-date"
        v-model="selectedDate"
        name="dueAt"
        :min="'2026-08-01'"
        required
      />
      <p class="text-sm text-gray-600 dark:text-gray-300">
        Stored as <code>{{ selectedDate }}</code>.
      </p>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/date-picker/DatePicker.vue

  </template>
</KleanPreview>

## Installation

The registry installs Input, Popover, and Calendar first when they are missing,
then adds the framework-native Date Picker:

<KleanInstallation
  id="date-picker-installation"
  component="date-picker"
  :source="datePickerSource"
  filename="DatePicker.vue"
  destination="assets/js/components/ui/date-picker/DatePicker.vue"
  :files="vueFiles"
  :dependencies="['@floating-ui/dom', 'tailwind-merge']"
/>

No provider, configuration file, locale pack, or Date Picker variant is added.

## When to use

Use Date Picker for issue dates, due dates, birthdays, effective dates, and
other date-only fields where a time would be false precision.

## When not to use

Use [Calendar](/klean-ui/components/calendar) when the date surface should stay
visible, [Date Range Picker](/klean-ui/components/date-range-picker) when two
dates make one period, and [Schedule Picker](/klean-ui/components/schedule-picker)
when a wall-clock time and timezone must become an exact instant.

## Usage

### Vue

<CopyCode :code="vueUsage" label="DueDateField.vue" />

### React

<CopyCode :code="reactUsage" label="DueDateField.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="DueDateField.svelte" />

The application owns the visible label and product availability rule. Date
Picker owns the stable value, field validity, optional floating surface,
keyboard navigation, and focus return. Click the field or press Arrow Down to
open Calendar.

## Relational dates

Two fields with different business meanings should stay two Date Pickers. Put
their relationship in the form through ordinary `min` and `max` values.

<KleanPreview id="invoice-dates" :source="invoiceSource" filename="invoice-dates.vue">
  <template #preview>
    <form class="grid w-full max-w-2xl gap-5 sm:grid-cols-2" aria-describedby="docs-invoice-date-rules" @submit.prevent>
      <div class="grid gap-2">
        <label for="docs-issued-date" class="text-sm font-medium">Issued</label>
        <KleanDatePicker
          id="docs-issued-date"
          v-model="issuedAt"
          name="issuedAt"
          :min="today"
          :max="maximumIssueDate"
          required
        />
      </div>
      <div class="grid gap-2">
        <label for="docs-invoice-due-date" class="text-sm font-medium">Due</label>
        <KleanDatePicker
          id="docs-invoice-due-date"
          v-model="dueAt"
          name="dueAt"
          :min="minimumDueDate"
          required
        />
      </div>
      <p id="docs-invoice-date-rules" class="text-sm text-gray-600 dark:text-gray-300 sm:col-span-2">
        Issue dates start today. Due dates must be at least one day later.
      </p>
    </form>
  </template>
</KleanPreview>

The due date cannot equal the issue date, the issue date cannot move into the
past, and changing either side repairs an obsolete opposite boundary. This is
application policy expressed through the small Date Picker API—not an invoice
mode hidden inside the component.

## API

| Purpose              | Vue                                | React                              | Svelte                             |
| -------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| Current value        | `v-model`                          | `value`, `onValueChange`           | `bind:value`                       |
| Initial value        | `default-value`                    | `defaultValue`                     | `defaultValue`                     |
| Native form name     | `name`                             | `name`                             | `name`                             |
| Bounds               | `min`, `max`                       | `min`, `max`                       | `min`, `max`                       |
| Product availability | `unavailable`                      | `unavailable`                      | `unavailable`                      |
| Locale               | `locale`, `dir`                    | `locale`, `dir`                    | `locale`, `dir`                    |
| Open state           | `v-model:open`                     | `open`, `onOpenChange`             | `bind:open`                        |
| Native states        | `required`, `disabled`, `readonly` | `required`, `disabled`, `readOnly` | `required`, `disabled`, `readonly` |

Typing an invalid, unavailable, or out-of-bounds date sets native validity and
`aria-invalid` without silently replacing the last valid application value.
Choosing a date commits once and returns focus through the native-first Popover
relationship.

## Related components

- [Calendar](/klean-ui/components/calendar) — an always-visible date surface.
- [Date Range Picker](/klean-ui/components/date-range-picker) — a start and end date that form one period.
- [Schedule Picker](/klean-ui/components/schedule-picker) — date, time, timezone, and natural language.
- [Input](/klean-ui/components/input) — a plain field when a calendar adds no value.

## Complete framework source

### Vue

<CopyCode :code="datePickerSource" label="DatePicker.vue" />

### React

<CopyCode :code="reactSource" label="DatePicker.jsx" />

### Svelte

<CopyCode :code="svelteSource" label="DatePicker.svelte" />
