<script setup>
import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'
import { twMerge } from 'tailwind-merge'
import Calendar from '../calendar/Calendar.vue'
import { todayIso } from '../calendar/date.js'
import Input from '../input/Input.vue'
import Popover from '../popover/Popover.vue'
import {
  formatSchedule,
  formatTimeLabel,
  instantToWallClock,
  interpretSchedule,
  resolveTimeZone,
  roundedFutureWallClock,
  timeOptions,
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
  /** Minutes between default time choices. Natural input may be more precise. */
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
const initialWallClock =
  instantToWallClock(value.value, zone.value) ||
  roundedFutureWallClock(new Date(), zone.value, props.minuteStep)
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
const minimumTimestamp = computed(() => {
  const configured = new Date(props.min).getTime()
  return Math.max(Date.now(), Number.isNaN(configured) ? -Infinity : configured)
})
const calendarMin = computed(() => {
  const instant = new Date(minimumTimestamp.value + 1000).toISOString()
  return instantToWallClock(instant, zone.value)?.date ?? todayIso(zone.value)
})
const choices = computed(() => timeOptions(props.minuteStep))
const proposalIsPast = computed(
  () =>
    interpretation.value.state === 'proposal' &&
    new Date(interpretation.value.iso).getTime() <= minimumTimestamp.value
)
const committable = computed(
  () => interpretation.value.state === 'proposal' && !proposalIsPast.value
)
const invalid = computed(
  () =>
    interpretation.value.state === 'invalid' ||
    proposalIsPast.value ||
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
  if (proposalIsPast.value) return 'Choose a time in the future.'
  if (interpretation.value.state === 'proposal') {
    return `Will schedule for ${interpretation.value.label} in ${zone.value}. Press Enter or leave the picker to use it.`
  }
  return `Scheduled for ${interpretation.value.label} in ${zone.value}.`
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
  draft.value = nextDraft
  if (!nextDraft.trim()) {
    clear()
    return
  }

  const next = interpretSchedule(nextDraft, {
    reference: new Date(),
    locale: props.locale,
    timeZone: zone.value
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
  const iso = wallClockToIso({ date, time, timeZone: zone.value })
  if (!iso) {
    interpretation.value = { state: 'invalid' }
    return
  }
  selectedDate.value = date
  selectedTime.value = time
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

function handleInputKeydown(event) {
  if (event.key === 'ArrowDown' && !props.disabled && !props.readonly) {
    event.preventDefault()
    popover.value?.open()
  } else if (event.key === 'Enter' && committable.value) {
    event.preventDefault()
    commitProposal({ restoreFocus: false })
  }
}

async function handleOpenUpdate(nextOpen) {
  emit('update:open', nextOpen)
  if (!nextOpen) return
  await nextTick()
  panel.value
    ?.querySelector(`[data-time="${selectedTime.value}"]`)
    ?.scrollIntoView?.({ block: 'center' })
}

function chooseDate(nextDate) {
  stage(nextDate, selectedTime.value)
}

function chooseTime(nextTime) {
  stage(selectedDate.value, nextTime)
}

function timeIsUnavailable(time) {
  const iso = wallClockToIso({
    date: selectedDate.value,
    time,
    timeZone: zone.value
  })
  return !iso || new Date(iso).getTime() <= minimumTimestamp.value
}

async function focusTime(nextTime) {
  selectedTime.value = nextTime
  await nextTick()
  panel.value
    ?.querySelector(`[data-time="${nextTime}"]`)
    ?.focus({ preventScroll: true })
}

function handleTimeKeydown(event, index) {
  let nextIndex
  if (event.key === 'ArrowDown')
    nextIndex = Math.min(index + 1, choices.value.length - 1)
  else if (event.key === 'ArrowUp') nextIndex = Math.max(index - 1, 0)
  else if (event.key === 'Home') nextIndex = 0
  else if (event.key === 'End') nextIndex = choices.value.length - 1
  else return
  event.preventDefault()

  const direction = nextIndex >= index ? 1 : -1
  while (
    nextIndex >= 0 &&
    nextIndex < choices.value.length &&
    timeIsUnavailable(choices.value[nextIndex])
  ) {
    nextIndex += direction
  }
  if (choices.value[nextIndex]) focusTime(choices.value[nextIndex])
}

watch(value, (nextValue) => {
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
      element.setCustomValidity('Choose a schedule.')
    } else if (invalid.value) {
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
        data-slot="schedule-picker-input"
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

    <input v-if="name" type="hidden" :name="name" :value="value" />
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
      :open="open"
      :default-open="defaultOpen"
      placement="bottom-start"
      data-slot="schedule-picker-popover"
      class="w-[min(42rem,calc(100vw-1rem))] p-0"
      @update:open="handleOpenUpdate"
    >
      <div ref="panel" data-slot="schedule-picker-panel">
        <div class="grid sm:grid-cols-[minmax(0,1fr)_10rem]">
          <Calendar
            :model-value="selectedDate"
            :min="calendarMin"
            :locale="locale"
            :dir="dir"
            :disabled="disabled"
            :readonly="readonly"
            class="max-w-none p-4"
            @update:model-value="chooseDate"
          />

          <section
            data-slot="schedule-picker-times"
            class="border-t border-gray-200 p-3 sm:border-s sm:border-t-0 dark:border-gray-700"
            :aria-labelledby="timeHeadingId"
          >
            <h2 :id="timeHeadingId" class="px-2 pb-2 text-sm font-semibold">
              Time
            </h2>
            <div
              role="listbox"
              aria-label="Choose a time"
              class="max-h-64 overflow-y-auto overscroll-contain"
            >
              <button
                v-for="(time, index) in choices"
                :key="time"
                type="button"
                role="option"
                data-slot="schedule-picker-time"
                :data-time="time"
                :aria-selected="time === selectedTime"
                :disabled="timeIsUnavailable(time)"
                :tabindex="time === selectedTime ? 0 : -1"
                class="block min-h-11 w-full rounded-md px-3 text-start text-sm tabular-nums hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:text-gray-300 aria-selected:bg-gray-950 aria-selected:font-semibold aria-selected:text-white dark:hover:bg-gray-800 dark:focus-visible:outline-white dark:disabled:text-gray-700 dark:aria-selected:bg-white dark:aria-selected:text-gray-950"
                @click="chooseTime(time)"
                @keydown="handleTimeKeydown($event, index)"
              >
                {{ formatTimeLabel(time, locale) }}
              </button>
            </div>
          </section>
        </div>

        <footer
          data-slot="schedule-picker-footer"
          class="flex flex-col gap-3 border-t border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700"
        >
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ statusText }}
          </p>
          <button
            type="button"
            data-slot="schedule-picker-confirm"
            class="min-h-11 shrink-0 rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-950 dark:hover:bg-gray-200 dark:focus-visible:outline-white"
            :disabled="!committable || disabled || readonly"
            @click="commitProposal()"
          >
            Use this time
          </button>
        </footer>
      </div>
    </Popover>
  </div>
</template>
