---
title: Schedule Picker
titleTemplate: Klean UI
description: Natural-language future scheduling with Calendar, time choices, timezone safety, and automatic Enter or blur commit.
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

const publishAt = ref('')
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

Schedule Picker turns a future wall-clock intention into an exact ISO instant.
Natural language, Calendar, and time choices share one field, while a visible
interpretation keeps the exact instant honest before Enter or composite blur
commits it.

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

The registry resolves Input, Popover, and Calendar, then installs the
framework-native Schedule Picker and its focused scheduling helper:

<KleanInstallation
  id="schedule-picker-installation"
  component="schedule-picker"
  :source="scheduleSource"
  filename="SchedulePicker.vue"
  destination="assets/js/components/ui/schedule-picker/SchedulePicker.vue"
  :files="vueFiles"
  :dependencies="['@floating-ui/dom', '@internationalized/date', 'chrono-node', 'tailwind-merge']"
/>

There is no provider, locale configuration, timezone database setup, or
natural-language mode to enable.

## When to use

Use Schedule Picker for publishing, sending, deploying, appointments, and jobs
that must happen at a future moment.

## When not to use

Use [Date Picker](/klean-ui/components/date-picker) when only the day matters,
[Date Range Picker](/klean-ui/components/date-range-picker) for a date-only
period, and [Calendar](/klean-ui/components/calendar) when the calendar itself
is the workspace.

## Usage

### Vue

<CopyCode :code="vueUsage" label="PublishSchedule.vue" />

### React

<CopyCode :code="reactUsage" label="PublishSchedule.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="PublishSchedule.svelte" />

## Natural input and commit

The following all create a proposal:

- `tomorrow at 9am`
- `Friday at 14:30`
- `in 5 minutes`
- `in one hour`

The interpreted date, time, and IANA timezone remain visible. Press Enter,
leave the complete picker, or choose **Use this time** to commit. Moving focus
between the text field, Calendar, time list, and footer action does not commit
prematurely. Until a valid commit point, the named hidden form value retains
the last valid ISO instant. An incomplete phrase, parser mistake, or abandoned
invalid edit cannot silently reschedule server work.

Relative durations retain exact seconds. If the reference instant is 13:07:30
in Lagos, `in 5 minutes` proposes 13:12:30 and stores the matching UTC instant.
Ordinary choices such as `tomorrow at 9am` remain minute-clean.

## Timezone convention

Pass the account or application IANA timezone when it is known. When it is not,
the browser timezone is the useful zero-configuration default. Display remains
localized through `Intl`; the committed value remains an ISO instant suitable
for storage and server scheduling.

The component handles timezone offset changes for the selected date, including
daylight-saving transitions. Invalid timezone input falls back to the browser
timezone rather than breaking the field.

## API

| Purpose                 | Vue                                | React                              | Svelte                             |
| ----------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| Current ISO instant     | `v-model`                          | `value`, `onValueChange`           | `bind:value`                       |
| Initial instant         | `default-value`                    | `defaultValue`                     | `defaultValue`                     |
| Native form name        | `name`                             | `name`                             | `name`                             |
| Interpretation timezone | `time-zone`                        | `timeZone`                         | `timeZone`                         |
| Locale                  | `locale`, `dir`                    | `locale`, `dir`                    | `locale`, `dir`                    |
| Earliest instant        | `min`                              | `min`                              | `min`                              |
| Time-list spacing       | `minute-step`                      | `minuteStep`                       | `minuteStep`                       |
| Open state              | `v-model:open`                     | `open`, `onOpenChange`             | `bind:open`                        |
| Native states           | `required`, `disabled`, `readonly` | `required`, `disabled`, `readOnly` | `required`, `disabled`, `readonly` |

Scheduling is future-only by default. `min` may move the earliest acceptable
instant later. `minuteStep` changes the conventional time list; natural input
may remain more precise.

## Durable behavior

- Draft text and the last committed instant are separate truths until Enter or
  a true composite blur.
- Enter commits without moving focus from the field.
- Internal focus movement does not commit; leaving the complete picker does.
- Calendar and time-list choices are keyboard navigable.
- Opening the time list brings the selected time into view.
- Past proposals are invalid and cannot be committed.
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
