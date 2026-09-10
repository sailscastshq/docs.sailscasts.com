---
title: Schedule Picker
titleTemplate: Klean UI
description: Pick a date and time together, schedule future work, or edit historical timestamps with natural input and a visible timezone.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanSchedulePicker from '../../.vitepress/theme/components/klean/schedule-picker/SchedulePicker.vue'
import inputSource from '../../.vitepress/theme/components/klean/input/Input.vue?raw'
import popoverSource from '../../.vitepress/theme/components/klean/popover/Popover.vue?raw'
import calendarSource from '../../.vitepress/theme/components/klean/calendar/Calendar.vue?raw'
import dateSource from '../../.vitepress/theme/components/klean/calendar/date.js?raw'
import scheduleSource from '../../.vitepress/theme/components/klean/schedule-picker/SchedulePicker.vue?raw'
import scheduleHelperSource from '../../.vitepress/theme/components/klean/schedule-picker/schedule.js?raw'
import reactSource from '../sources/schedule-picker/SchedulePicker.jsx?raw'
import reactHelperSource from '../sources/schedule-picker/schedule.react.js?raw'
import svelteSource from '../sources/schedule-picker/SchedulePicker.svelte?raw'
import svelteHelperSource from '../sources/schedule-picker/schedule.svelte.js?raw'
import vueUsage from '../snippets/schedule-picker/usage.vue?raw'
import reactUsage from '../snippets/schedule-picker/usage.jsx?raw'
import svelteUsage from '../snippets/schedule-picker/usage.svelte?raw'
import vueHistorical from '../snippets/schedule-picker/historical.vue?raw'
import reactHistorical from '../snippets/schedule-picker/historical.jsx?raw'
import svelteHistorical from '../snippets/schedule-picker/historical.svelte?raw'
import vueWindow from '../snippets/schedule-picker/window.vue?raw'

const publishAt = ref('')
const recordedAt = ref('2020-02-29T13:35:00.000Z')
const reviewAt = ref('2020-02-29T13:35:00.000Z')
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
    filename: 'schedule.js',
    destination: 'assets/js/components/ui/schedule-picker/schedule.js',
    source: scheduleHelperSource
  },
  {
    filename: 'SchedulePicker.vue',
    destination: 'assets/js/components/ui/schedule-picker/SchedulePicker.vue',
    source: scheduleSource
  }
]
</script>

# Schedule Picker

Choose a date and time in one field. Type naturally or use the calendar and time
controls, with the timezone always visible. The value is an exact ISO instant.

Schedule Picker accepts future times by default. Add `allowPast` when editing
historical records or choosing a time on either side of today.

<KleanPreview id="schedule-picker-source" :source="scheduleSource" filename="SchedulePicker.vue">
  <template #preview>
    <div class="grid w-full max-w-xl gap-2">
      <label for="docs-publish-at" class="text-sm font-medium">Publish at</label>
      <KleanSchedulePicker
        id="docs-publish-at"
        v-model="publishAt"
        name="publishAt"
        time-zone="Africa/Lagos"
        required
      />
      <output class="break-all font-mono text-sm text-gray-600 dark:text-gray-300">
        {{ publishAt || 'No committed instant yet' }}
      </output>
      <button
        type="button"
        class="min-h-11 justify-self-start rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:border-gray-700 dark:hover:bg-gray-900 dark:focus-visible:outline-white"
      >
        Continue
      </button>
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/schedule-picker/SchedulePicker.vue

  </template>
  <template #caption>
    Try “tomorrow at 9am”, “Friday at 14:30”, “in 5 minutes”, or “in one hour”.
  </template>
</KleanPreview>

## Installation

<KleanInstallation
  id="schedule-picker-installation"
  component="schedule-picker"
  :source="scheduleSource"
  filename="SchedulePicker.vue"
  destination="assets/js/components/ui/schedule-picker/SchedulePicker.vue"
  :files="vueFiles"
  :dependencies="['@floating-ui/dom', '@internationalized/date', 'chrono-node', 'tailwind-merge']"
/>

## When to use

Use Schedule Picker whenever both the day and time matter:

- Schedule publishing, sending, appointments, or jobs with the future-only default.
- Edit a record's timestamp, log an event, or search historical records with `allowPast`.
- Restrict a datetime to a permitted window with `min` and `max`.

## When not to use

Use [Date Picker](/klean-ui/components/date-picker) when only the day matters,
[Date Range Picker](/klean-ui/components/date-range-picker) for a date-only
period, and [Calendar](/klean-ui/components/calendar) when the calendar itself
is the workspace. An invoice due date or birthday should stay a date-only value;
do not add a midnight time or timezone to make it fit Schedule Picker.

## Usage

### Vue

<CopyCode :code="vueUsage" label="PublishSchedule.vue" />

### React

<CopyCode :code="reactUsage" label="PublishSchedule.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="PublishSchedule.svelte" />

## Historical dates and times

Add `allowPast` to accept both past and future instants. The same field, calendar,
time controls, and natural input work for editing records—there is no separate
datetime component to learn.

<KleanPreview id="schedule-picker-historical" :source="vueHistorical" filename="RecordedAt.vue">
  <template #preview>
    <div class="grid w-full max-w-xl gap-3">
      <label for="docs-recorded-at" class="text-sm font-medium">Recorded at</label>
      <KleanSchedulePicker
        id="docs-recorded-at"
        v-model="recordedAt"
        name="recordedAt"
        allow-past
        time-zone="Africa/Lagos"
        locale="en-US"
        placeholder="February 29, 2020 at 2:35pm"
        class="**:data-[slot=input]:border-dashed **:data-[slot=input]:shadow-none"
      />
      <output class="break-all font-mono text-sm text-gray-600 dark:text-gray-300">
        {{ recordedAt || 'No instant selected' }}
      </output>
      <button
        type="button"
        class="min-h-11 justify-self-start rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:border-gray-700 dark:hover:bg-gray-900 dark:focus-visible:outline-white"
      >
        Continue
      </button>
    </div>
  </template>
  <template #caption>
    Edit February 29, 2020, or type “yesterday at 2:35pm”. Enter or leaving the picker applies a valid choice.
  </template>
</KleanPreview>

### Vue

<CopyCode :code="vueHistorical" label="RecordedAt.vue" />

### React

<CopyCode :code="reactHistorical" label="RecordedAt.jsx" />

### Svelte

<CopyCode :code="svelteHistorical" label="RecordedAt.svelte" />

## Allowed date and time window

`min` and `max` are inclusive ISO instants, not date-only strings. They constrain
both the calendar and time selection, including typed input. A value exactly at
either boundary is allowed, provided it also satisfies the future-only default.

An earlier `min` does not enable historical dates on its own. Use `allowPast` for
a window that includes the past.

<KleanPreview id="schedule-picker-window" :source="vueWindow" filename="ReviewTime.vue">
  <template #preview>
    <div class="grid w-full max-w-xl gap-2">
      <label for="docs-review-at" class="text-sm font-medium">Review time</label>
      <p id="docs-review-window" class="text-sm text-gray-600 dark:text-gray-300">
        February 29, 2020, from 9am through 5pm in Africa/Lagos.
      </p>
      <KleanSchedulePicker
        id="docs-review-at"
        v-model="reviewAt"
        name="reviewAt"
        allow-past
        min="2020-02-29T08:00:00.000Z"
        max="2020-02-29T16:00:00.000Z"
        time-zone="Africa/Lagos"
        locale="en-US"
        aria-describedby="docs-review-window"
      />
      <output class="break-all font-mono text-sm text-gray-600 dark:text-gray-300">
        {{ reviewAt || 'No instant selected' }}
      </output>
    </div>
  </template>
</KleanPreview>

<CopyCode :code="vueWindow" label="ReviewTime.vue" />

In Vue use `allow-past`; in React and Svelte use `allowPast`. The `min` and `max`
names are identical in all three frameworks. Continue validating the permitted
window on the server when saving the value.

## Choosing the time

Choose the hour and minute in the compact time control beneath the calendar.
A 12-hour locale such as `en-US` includes AM/PM; a 24-hour locale such as `en-GB`
uses hours 00–23. The timezone stays beside the time, and the locale controls
presentation, not the stored instant.

Every minute is selectable. `minuteStep` defaults to 15 and only rounds the
starting time for an empty picker; existing selections and typed values are not
rounded.

## Natural input and commit

The following all create a proposal:

- `tomorrow at 9am`
- `Friday at 14:30`
- `in 5 minutes`
- `in one hour`

The interpreted date, time, and IANA timezone remain visible. Press Enter,
leave the complete picker, or choose **Done** to commit. Moving focus
between the text field, calendar, time controls, and footer action does not commit
prematurely. Until a valid choice is committed, the field retains the last valid
ISO instant. An incomplete phrase or invalid edit cannot silently replace it.
Choosing **Done** without changing an existing value simply closes the picker.

With `allowPast`, phrases such as `yesterday at 2:35pm`, `2 hours ago`, and
`February 29, 2020 at 2:35pm` are also accepted. The allowed window still applies.

Relative durations retain exact seconds. If the reference instant is 13:07:30
in Lagos, `in 5 minutes` proposes 13:12:30 and stores the matching UTC instant.
Ordinary choices such as `tomorrow at 9am` remain minute-clean.

## Timezone convention

Pass the account or application IANA timezone when it is known. When it is not,
the browser timezone is the useful zero-configuration default. Display remains
localized through `Intl`; the committed value remains an ISO instant suitable
for storage and server scheduling.

Pass an ISO timestamp with `Z` or an explicit offset as the value. Do not pass a
timezone-less form string such as `2020-02-29T14:35`: it does not identify an exact
instant. Keep date-only values as `YYYY-MM-DD` with Date Picker. An existing form
that stores local date and time strings needs an explicit conversion at its
boundary; do not append `Z` unless those values really are UTC.

The component handles timezone offset changes for the selected date. Local times
skipped by daylight saving are rejected. When a clock time occurs twice, the
earlier occurrence is used unless the input includes an explicit UTC offset.
Invalid timezone input falls back to the browser timezone.

## API

| Purpose                 | Vue                                | React                              | Svelte                             |
| ----------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| Current ISO instant     | `v-model`                          | `value`, `onValueChange`           | `bind:value`                       |
| Initial instant         | `default-value`                    | `defaultValue`                     | `defaultValue`                     |
| Native form name        | `name`                             | `name`                             | `name`                             |
| Interpretation timezone | `time-zone`                        | `timeZone`                         | `timeZone`                         |
| Locale                  | `locale`, `dir`                    | `locale`, `dir`                    | `locale`, `dir`                    |
| Accept past instants    | `allow-past`                       | `allowPast`                        | `allowPast`                        |
| Earliest instant        | `min`                              | `min`                              | `min`                              |
| Latest instant          | `max`                              | `max`                              | `max`                              |
| Initial time rounding   | `minute-step`                      | `minuteStep`                       | `minuteStep`                       |
| Open state              | `v-model:open`                     | `open`, `onOpenChange`             | `bind:open`                        |
| Native states           | `required`, `disabled`, `readonly` | `required`, `disabled`, `readOnly` | `required`, `disabled`, `readonly` |

`allowPast` defaults to `false`. `min` and `max` are optional, inclusive limits;
neither disables the future-only default. `minuteStep` sets the suggested
starting time, not the precision of the value.

## Styling

Use ordinary classes on the component. Target a part through its `data-slot` when
you want to change only that part. The historical example above gives the input
a dashed border without changing the text, calendar, or time controls:

```html
class="**:data-[slot=input]:border-dashed **:data-[slot=input]:shadow-none"
```

Use `className` in React. Classes and ordinary attributes remain application-owned.

## Durable behavior

- Editing text does not replace the committed value until Enter or leaving the picker.
- Enter commits without moving focus from the field.
- Internal focus movement does not commit; leaving the complete picker does.
- Calendar, hour, minute, and AM/PM choices are keyboard navigable.
- Past proposals are rejected unless `allowPast` is enabled.
- Bounds are checked at commit, so an expired scheduling choice cannot slip through.
- Escape dismisses only ephemeral open state and returns focus predictably.
- Klean never writes the draft, open state, or selected instant to storage or the URL.

The application may persist the committed value or a form draft using its own
Durable UI policy. Klean does not guess that persistence scope.

## Related components

Schedule Picker combines date, time, and IANA timezone as an exact ISO instant.
Choose the date-only components below when wall-clock time must not exist.

- [Date Picker](/klean-ui/components/date-picker) — one date-only `YYYY-MM-DD` value without time or timezone.
- [Calendar](/klean-ui/components/calendar) — an always-visible date-only `YYYY-MM-DD` surface.
- [Date Range Picker](/klean-ui/components/date-range-picker) — ordered date-only `YYYY-MM-DD` periods.
- [Popover](/klean-ui/components/popover) — the non-modal floating behavior.
- [Toast](/klean-ui/components/toast) — announce the server result after a schedule is saved.

## Complete framework source

### Vue

<CopyCode :code="scheduleSource" label="SchedulePicker.vue" />
<CopyCode :code="scheduleHelperSource" label="schedule.js" />

### React

<CopyCode :code="reactSource" label="SchedulePicker.jsx" />
<CopyCode :code="reactHelperSource" label="schedule.js" />

### Svelte

<CopyCode :code="svelteSource" label="SchedulePicker.svelte" />
<CopyCode :code="svelteHelperSource" label="schedule.js" />
