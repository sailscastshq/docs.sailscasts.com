<script setup>
import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'
import { twMerge } from 'tailwind-merge'
import Calendar from '../calendar/Calendar.vue'
import Input from '../input/Input.vue'
import Popover from '../popover/Popover.vue'
import {
  formatSchedule,
  initialScheduleWallClock,
  instantToWallClock,
  interpretSchedule,
  resolveTimeZone,
  scheduleCalendarBounds,
  scheduleConstraint,
  timeFields,
  updateTimeField,
  wallClockToIso
} from './schedule.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** An exact ISO instant, such as 2026-08-12T08:30:00.000Z. */
  modelValue: { type: String, default: undefined },
  defaultValue: { type: String, default: undefined },
  id: { type: String, default: undefined },
  name: { type: String, default: undefined },
  placeholder: { type: String, default: 'Tomorrow at 9am' },
  /** IANA timezone used to interpret wall-clock input. */
  timeZone: { type: String, default: undefined },
  locale: { type: String, default: undefined },
  dir: { type: String, default: undefined },
  /** Earliest allowed ISO instant. Scheduling remains future-only by default. */
  min: { type: String, default: undefined },
  /** Latest allowed ISO instant, inclusive. */
  max: { type: String, default: undefined },
  /** Allow historical records as well as future dates. */
  allowPast: { type: Boolean, default: false },
  /** Round the initial suggested time to this interval. Edits may use any minute. */
  minuteStep: { type: Number, default: 15 },
  open: { type: Boolean, default: undefined },
  defaultOpen: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change', 'update:open'])
const attrs = useAttrs()
const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const inputId = computed(
  () => props.id ?? `klean-schedule-picker-${generatedId}`
)
const popoverId = computed(() => `${inputId.value}-panel`)
const statusId = computed(() => `${inputId.value}-status`)
const timeHeadingId = computed(() => `${inputId.value}-time-heading`)
const zone = computed(() => resolveTimeZone(props.timeZone))
const validDefault = !Number.isNaN(new Date(props.defaultValue).getTime())
  ? props.defaultValue
  : ''
const internalValue = ref(validDefault)
const value = computed(() =>
  props.modelValue === undefined ? internalValue.value : props.modelValue
)
const initialWallClock = initialScheduleWallClock(value.value, {
  allowPast: props.allowPast,
  min: props.min,
  max: props.max,
  timeZone: zone.value,
  minuteStep: props.minuteStep
})
const selectedDate = ref(initialWallClock.date)
const selectedTime = ref(initialWallClock.time)
const draft = ref(
  value.value ? formatSchedule(value.value, props.locale, zone.value) : ''
)
const interpretation = ref(
  value.value
    ? {
        state: 'committed',
        iso: value.value,
        date: initialWallClock.date,
        time: initialWallClock.time,
        label: formatSchedule(value.value, props.locale, zone.value)
      }
    : { state: 'empty' }
)
const input = ref()
const popover = ref()
const panel = ref()
const root = ref()
const touched = ref(false)
const validationClock = ref(Date.now())
const constraints = computed(() => ({
  allowPast: props.allowPast,
  min: props.min,
  max: props.max,
  reference: new Date(validationClock.value)
}))
const calendarBounds = computed(() =>
  scheduleCalendarBounds({ ...constraints.value, timeZone: zone.value })
)
const fields = computed(() => timeFields(selectedTime.value, props.locale))
const minutes = Array.from({ length: 60 }, (_, minute) =>
  String(minute).padStart(2, '0')
)
const constraintError = computed(() =>
  interpretation.value.iso
    ? scheduleConstraint(interpretation.value.iso, constraints.value)
    : ''
)
const committable = computed(
  () => interpretation.value.state === 'proposal' && !constraintError.value
)
const invalid = computed(
  () =>
    interpretation.value.state === 'invalid' ||
    Boolean(constraintError.value) ||
    (touched.value && interpretation.value.state === 'incomplete')
)
const statusText = computed(() => {
  if (interpretation.value.state === 'empty') {
    return 'Type a date and time, or choose them from the calendar.'
  }
  if (interpretation.value.state === 'invalid') {
    return 'Enter a date and time, such as tomorrow at 9am.'
  }
  if (interpretation.value.state === 'incomplete') {
    return interpretation.value.message
  }
  if (constraintError.value === 'past') return 'Choose a time in the future.'
  if (constraintError.value === 'min')
    return `Choose ${formatSchedule(props.min, props.locale, zone.value)} or later.`
  if (constraintError.value === 'max')
    return `Choose ${formatSchedule(props.max, props.locale, zone.value)} or earlier.`
  if (interpretation.value.state === 'proposal') {
    return `${props.allowPast ? 'Use' : 'Will schedule for'} ${interpretation.value.label} in ${zone.value}. Press Enter or leave the picker to use it.`
  }
  return `${props.allowPast ? 'Selected' : 'Scheduled for'} ${interpretation.value.label} in ${zone.value}.`
})
const inputAttrs = computed(() => {
  const {
    class: _class,
    'data-slot': _dataSlot,
    'aria-describedby': _describedBy,
    ...rest
  } = attrs
  return rest
})
const describedBy = computed(() =>
  [attrs['aria-describedby'], statusId.value].filter(Boolean).join(' ')
)
const rootClasses = computed(() =>
  twMerge(
    'grid w-full gap-2 **:data-[slot=schedule-picker-field]:relative **:data-[slot=schedule-picker-field]:flex **:data-[slot=schedule-picker-field]:items-stretch **:data-[slot=input]:pe-12',
    attrs.class
  )
)

function setInternalValue(nextValue) {
  if (props.modelValue === undefined) internalValue.value = nextValue
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

function clear() {
  setInternalValue('')
  interpretation.value = { state: 'empty' }
}

function readDraft(nextDraft) {
  validationClock.value = Date.now()
  draft.value = nextDraft
  if (!nextDraft.trim()) {
    clear()
    return
  }

  const next = interpretSchedule(nextDraft, {
    reference: new Date(),
    locale: props.locale,
    timeZone: zone.value,
    allowPast: props.allowPast
  })
  interpretation.value = next
  if (next.date) selectedDate.value = next.date
  if (next.time) selectedTime.value = next.time
}

function handleInput(event) {
  touched.value = false
  readDraft(event.target.value)
}

function stage(date = selectedDate.value, time = selectedTime.value) {
  if (props.disabled || props.readonly) return
  validationClock.value = Date.now()
  // Opening or reselecting an unchanged instant must not discard its seconds.
  const previous = interpretation.value
  const iso =
    previous.iso && previous.date === date && previous.time === time
      ? previous.iso
      : wallClockToIso({ date, time, timeZone: zone.value })
  selectedDate.value = date
  selectedTime.value = time
  if (!iso) {
    interpretation.value = { state: 'invalid' }
    return
  }
  const label = formatSchedule(iso, props.locale, zone.value)
  interpretation.value = {
    state: 'proposal',
    iso,
    date,
    time,
    label,
    timeZone: zone.value
  }
  draft.value = label
}

function commitProposal({ restoreFocus = true } = {}) {
  validationClock.value = Date.now()
  if (!committable.value || props.disabled || props.readonly) return
  const next = interpretation.value
  setInternalValue(next.iso)
  draft.value = next.label
  interpretation.value = { ...next, state: 'committed' }
  popover.value?.close({ restoreFocus })
}

function handleFocusOut(event) {
  if (event.relatedTarget && root.value?.contains(event.relatedTarget)) return
  touched.value = true
  commitProposal({ restoreFocus: false })
}

function finish() {
  if (props.disabled || props.readonly) return
  validationClock.value = Date.now()
  if (interpretation.value.state === 'committed' && !constraintError.value) {
    popover.value?.close()
  } else {
    commitProposal()
  }
}

function handleInputKeydown(event) {
  if (event.key === 'ArrowDown' && !props.disabled && !props.readonly) {
    event.preventDefault()
    popover.value?.open()
  } else if (
    event.key === 'Enter' &&
    (interpretation.value.state === 'proposal' ||
      interpretation.value.state === 'incomplete' ||
      invalid.value)
  ) {
    event.preventDefault()
    touched.value = true
    commitProposal({ restoreFocus: false })
  }
}

async function handleOpenUpdate(nextOpen) {
  emit('update:open', nextOpen)
  if (!nextOpen) return
  validationClock.value = Date.now()
  if (interpretation.value.state === 'empty') {
    const initial = initialScheduleWallClock('', {
      ...constraints.value,
      timeZone: zone.value,
      minuteStep: props.minuteStep
    })
    selectedDate.value = initial.date
    selectedTime.value = initial.time
  }
  await nextTick()
  requestAnimationFrame(() => {
    if (!panel.value?.getClientRects().length) return
    panel.value.parentElement.scrollTop = 0
  })
}

function chooseDate(nextDate) {
  stage(nextDate, selectedTime.value)
}

function chooseTime(nextTime) {
  stage(selectedDate.value, nextTime)
}

function chooseTimeField(part, nextValue) {
  chooseTime(updateTimeField(selectedTime.value, part, nextValue, props.locale))
}

watch([value, zone, () => props.locale], ([nextValue]) => {
  const wallClock = instantToWallClock(nextValue, zone.value)
  if (!wallClock) {
    if (!nextValue) {
      draft.value = ''
      interpretation.value = { state: 'empty' }
    }
    return
  }
  selectedDate.value = wallClock.date
  selectedTime.value = wallClock.time
  const label = formatSchedule(nextValue, props.locale, zone.value)
  draft.value = label
  interpretation.value = {
    state: 'committed',
    iso: nextValue,
    ...wallClock,
    label
  }
})

watch(
  () => [
    invalid.value,
    committable.value,
    props.required,
    draft.value,
    value.value
  ],
  async () => {
    await nextTick()
    const element = input.value?.element
    if (!element) return
    if (props.required && !value.value) {
      element.setCustomValidity('Choose a date and time.')
    } else if (invalid.value || interpretation.value.state === 'incomplete') {
      element.setCustomValidity(statusText.value)
    } else {
      element.setCustomValidity('')
    }
  },
  { immediate: true }
)

defineExpose({
  input,
  focus: (options) => input.value?.focus(options),
  open: () => popover.value?.open(),
  close: () => popover.value?.close()
})
</script>

<template>
  <div
    ref="root"
    data-slot="schedule-picker"
    :data-state="interpretation.state"
    :class="rootClasses"
    @focusout="handleFocusOut"
  >
    <div data-slot="schedule-picker-field">
      <Input
        ref="input"
        v-bind="inputAttrs"
        :id="inputId"
        type="text"
        autocomplete="off"
        :value="draft"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedBy"
        @input="handleInput"
        @click="!disabled && !readonly && popover?.open()"
        @keydown="handleInputKeydown"
      />
      <button
        type="button"
        :popovertarget="popoverId"
        data-slot="schedule-picker-button"
        class="absolute inset-y-0 inset-e-0 grid min-w-11 place-items-center rounded-e-md text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white"
        :disabled="disabled || readonly"
        aria-label="Choose a date and time"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          class="size-5"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </button>
    </div>

    <input
      v-if="name"
      type="hidden"
      :name="name"
      :value="value"
      :disabled="disabled"
    />
    <p
      :id="statusId"
      data-slot="schedule-picker-status"
      class="text-sm text-gray-600 aria-invalid:text-red-700 dark:text-gray-400 dark:aria-invalid:text-red-400"
      :aria-invalid="invalid"
      aria-live="polite"
    >
      {{ statusText }}
    </p>

    <Popover
      ref="popover"
      :id="popoverId"
      :anchor="inputId"
      :open="open"
      :default-open="defaultOpen"
      placement="bottom-start"
      data-slot="schedule-picker-popover"
      class="max-h-[min(var(--klean-popover-available-height,100dvh),calc(100dvh-1rem))] w-[min(24rem,calc(100vw-1rem))] overflow-y-auto overscroll-contain rounded-xl p-0"
      @update:open="handleOpenUpdate"
    >
      <div ref="panel" data-slot="schedule-picker-panel">
        <div class="grid">
          <Calendar
            :model-value="selectedDate"
            :min="calendarBounds.min"
            :max="calendarBounds.max"
            :locale="locale"
            :dir="dir"
            :disabled="disabled"
            :readonly="readonly"
            class="max-w-none p-4"
            @update:model-value="chooseDate"
          />

          <section
            data-slot="schedule-picker-times"
            class="sticky bottom-0 grid min-w-0 gap-2 border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950"
            :aria-labelledby="timeHeadingId"
          >
            <div class="flex min-w-0 items-baseline justify-between gap-3">
              <h2 :id="timeHeadingId" class="text-sm font-medium">Time</h2>
              <p
                :id="`${inputId}-time-zone`"
                data-slot="schedule-picker-time-zone"
                class="min-w-0 text-end text-xs wrap-anywhere text-gray-500 dark:text-gray-400"
              >
                {{ zone }}
              </p>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div
                data-slot="schedule-picker-time-fields"
                role="group"
                :aria-labelledby="timeHeadingId"
                :aria-describedby="`${inputId}-time-zone`"
                dir="ltr"
                class="inline-flex shrink-0 items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-sm font-medium tabular-nums shadow-xs dark:border-gray-700 dark:bg-gray-900"
              >
                <select
                  data-slot="schedule-picker-hour"
                  aria-label="Hour"
                  class="h-11 w-11 cursor-pointer appearance-none rounded-md bg-transparent text-center text-gray-950 hover:bg-gray-200/60 focus-visible:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:outline-white"
                  :value="fields.hour"
                  :disabled="disabled || readonly"
                  @change="chooseTimeField('hour', $event.target.value)"
                >
                  <option
                    v-for="hour in fields.hours"
                    :key="hour.value"
                    :value="hour.value"
                  >
                    {{ hour.label }}
                  </option>
                </select>
                <span aria-hidden="true" class="text-gray-400">:</span>
                <select
                  data-slot="schedule-picker-minute"
                  aria-label="Minute"
                  class="h-11 w-11 cursor-pointer appearance-none rounded-md bg-transparent text-center text-gray-950 hover:bg-gray-200/60 focus-visible:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:outline-white"
                  :value="fields.minute"
                  :disabled="disabled || readonly"
                  @change="chooseTimeField('minute', $event.target.value)"
                >
                  <option
                    v-for="minute in minutes"
                    :key="minute"
                    :value="minute"
                  >
                    {{ minute }}
                  </option>
                </select>
                <div
                  v-if="fields.hour12"
                  class="relative ms-1 border-s border-gray-200 ps-1 dark:border-gray-700"
                >
                  <select
                    data-slot="schedule-picker-period"
                    aria-label="Period"
                    class="h-11 min-w-16 cursor-pointer appearance-none rounded-md bg-transparent ps-2 pe-6 text-gray-950 hover:bg-gray-200/60 focus-visible:bg-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:outline-white"
                    :value="fields.period"
                    :disabled="disabled || readonly"
                    @change="chooseTimeField('period', $event.target.value)"
                  >
                    <option
                      v-for="period in fields.periods"
                      :key="period.value"
                      :value="period.value"
                    >
                      {{ period.label }}
                    </option>
                  </select>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="pointer-events-none absolute inset-e-2 top-1/2 size-3 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    <path d="m7 10 5 5 5-5" />
                  </svg>
                </div>
              </div>
              <div data-slot="schedule-picker-footer">
                <button
                  type="button"
                  data-slot="schedule-picker-confirm"
                  class="min-h-11 cursor-pointer rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:outline-white"
                  :disabled="
                    (!committable && interpretation.state !== 'committed') ||
                    invalid ||
                    disabled ||
                    readonly
                  "
                  @click="finish()"
                >
                  Done
                </button>
              </div>
            </div>
            <p v-if="invalid" class="text-sm text-red-700 dark:text-red-400">
              {{ statusText }}
            </p>
          </section>
        </div>
      </div>
    </Popover>
  </div>
</template>
