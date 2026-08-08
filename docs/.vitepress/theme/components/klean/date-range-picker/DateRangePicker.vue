<script setup>
import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'
import { twMerge } from 'tailwind-merge'
import Calendar from '../calendar/Calendar.vue'
import {
  compareDates,
  dateIsUnavailable,
  dateLabel,
  parseIsoDate,
  resolveLocale
} from '../calendar/date.js'
import Input from '../input/Input.vue'
import Popover from '../popover/Popover.vue'

defineOptions({ inheritAttrs: false })

function normalizeRange(value) {
  return {
    start: parseIsoDate(value?.start) ? value.start : '',
    end: parseIsoDate(value?.end) ? value.end : ''
  }
}

const props = defineProps({
  /** Date-only ISO boundaries: { start: YYYY-MM-DD, end: YYYY-MM-DD }. */
  modelValue: { type: Object, default: undefined },
  defaultValue: { type: Object, default: () => ({}) },
  id: { type: String, default: undefined },
  /** Produces name[start] and name[end] native form entries. */
  name: { type: String, default: undefined },
  label: { type: String, default: 'Date range' },
  startLabel: { type: String, default: 'Start date' },
  endLabel: { type: String, default: 'End date' },
  min: { type: String, default: undefined },
  max: { type: String, default: undefined },
  unavailable: { type: Function, default: undefined },
  locale: { type: String, default: undefined },
  dir: { type: String, default: undefined },
  open: { type: Boolean, default: undefined },
  defaultOpen: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change', 'update:open'])
const attrs = useAttrs()
const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const baseId = computed(() => props.id ?? `klean-date-range-${generatedId}`)
const startId = computed(() => `${baseId.value}-start`)
const endId = computed(() => `${baseId.value}-end`)
const popoverId = computed(() => `${baseId.value}-calendar`)
const statusId = computed(() => `${baseId.value}-status`)
const internalValue = ref(normalizeRange(props.defaultValue))
const value = computed(() =>
  props.modelValue === undefined
    ? internalValue.value
    : normalizeRange(props.modelValue)
)
const startDraft = ref(value.value.start)
const endDraft = ref(value.value.end)
const activePart = ref('start')
const preview = ref('')
const startInput = ref()
const endInput = ref()
const popover = ref()
const locale = computed(() => resolveLocale(props.locale))
const limits = computed(() => ({
  min: props.min,
  max: props.max,
  unavailable: props.unavailable
}))
const startInvalid = computed(
  () =>
    Boolean(startDraft.value) &&
    (!parseIsoDate(startDraft.value) ||
      dateIsUnavailable(startDraft.value, limits.value))
)
const endInvalid = computed(
  () =>
    Boolean(endDraft.value) &&
    (!parseIsoDate(endDraft.value) ||
      dateIsUnavailable(endDraft.value, limits.value))
)
const orderInvalid = computed(
  () =>
    parseIsoDate(startDraft.value) &&
    parseIsoDate(endDraft.value) &&
    compareDates(endDraft.value, startDraft.value) < 0
)
const statusText = computed(() => {
  if (orderInvalid.value)
    return 'The end date must be on or after the start date.'
  if (startInvalid.value || endInvalid.value) {
    return 'Enter available dates as YYYY-MM-DD.'
  }
  if (value.value.start && value.value.end) {
    return `${dateLabel(value.value.start, locale.value)} through ${dateLabel(value.value.end, locale.value)}.`
  }
  if (value.value.start) return 'Choose an end date.'
  return 'Choose a start date, then an end date.'
})
const orderedDecoration = computed(() => {
  const start = value.value.start
  const end = value.value.end || preview.value
  if (!start || !end) return { start, end }
  return compareDates(start, end) <= 0
    ? { start, end }
    : { start: end, end: start }
})
const calendarValue = computed(() =>
  activePart.value === 'end'
    ? value.value.end || preview.value || value.value.start
    : value.value.start
)
const fieldsetAttrs = computed(() => {
  const { class: _class, 'data-slot': _dataSlot, ...rest } = attrs
  return rest
})
const rootClasses = computed(() =>
  twMerge(
    'grid w-full gap-3 [&_[data-slot=date-range-field]]:relative [&_[data-slot=date-range-field]]:flex [&_[data-slot=date-range-field]]:items-stretch [&_[data-slot=input]]:pe-12',
    attrs.class
  )
)

function updateRange(nextRange) {
  const normalized = normalizeRange(nextRange)
  if (props.modelValue === undefined) internalValue.value = normalized
  emit('update:modelValue', normalized)
  emit('change', normalized)
}

function openPart(part) {
  activePart.value = part
  preview.value = ''
  popover.value?.open()
}

function handleDraft(part, event) {
  const next = event.target.value.trim()
  if (part === 'start') startDraft.value = next
  else endDraft.value = next
  if (next && (!parseIsoDate(next) || dateIsUnavailable(next, limits.value)))
    return

  const nextRange = {
    start: part === 'start' ? next : value.value.start,
    end: part === 'end' ? next : value.value.end
  }
  if (
    nextRange.start &&
    nextRange.end &&
    compareDates(nextRange.end, nextRange.start) < 0
  ) {
    return
  }
  updateRange(nextRange)
}

function chooseDate(date) {
  if (activePart.value === 'start' || !value.value.start) {
    updateRange({ start: date, end: '' })
    startDraft.value = date
    endDraft.value = ''
    activePart.value = 'end'
    preview.value = date
    return
  }

  const range =
    compareDates(date, value.value.start) < 0
      ? { start: date, end: value.value.start }
      : { start: value.value.start, end: date }
  updateRange(range)
  startDraft.value = range.start
  endDraft.value = range.end
  preview.value = ''
  popover.value?.close()
}

function handleCalendarFocus(date) {
  if (activePart.value === 'end' && value.value.start) preview.value = date
}

function handleInputKeydown(event, part) {
  if (event.key !== 'ArrowDown' || props.disabled || props.readonly) return
  event.preventDefault()
  openPart(part)
}

watch(value, (nextValue) => {
  startDraft.value = nextValue.start
  endDraft.value = nextValue.end
})

watch(
  () => [
    startInvalid.value,
    endInvalid.value,
    orderInvalid.value,
    props.required,
    value.value.start,
    value.value.end
  ],
  async () => {
    await nextTick()
    const startElement = startInput.value?.element
    const endElement = endInput.value?.element
    if (startElement) {
      startElement.setCustomValidity(
        startInvalid.value || orderInvalid.value
          ? statusText.value
          : props.required && !value.value.start
            ? 'Choose a start date.'
            : ''
      )
    }
    if (endElement) {
      endElement.setCustomValidity(
        endInvalid.value || orderInvalid.value
          ? statusText.value
          : props.required && !value.value.end
            ? 'Choose an end date.'
            : ''
      )
    }
  },
  { immediate: true }
)

defineExpose({
  focus: (part = 'start', options) =>
    (part === 'end' ? endInput.value : startInput.value)?.focus(options),
  open: (part = 'start') => openPart(part),
  close: () => popover.value?.close()
})
</script>

<template>
  <fieldset
    v-bind="fieldsetAttrs"
    data-slot="date-range-picker"
    :disabled="disabled"
    :class="rootClasses"
  >
    <legend data-slot="date-range-legend" class="text-sm font-medium">
      {{ label }}
    </legend>

    <div class="grid gap-3 sm:grid-cols-2">
      <div class="grid gap-2">
        <label :for="startId" class="text-sm text-gray-600 dark:text-gray-400">
          {{ startLabel }}
        </label>
        <div data-slot="date-range-field">
          <Input
            ref="startInput"
            :id="startId"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            :name="name ? `${name}[start]` : undefined"
            :value="startDraft"
            placeholder="YYYY-MM-DD"
            :required="required"
            :readonly="readonly"
            :aria-invalid="startInvalid || orderInvalid || undefined"
            :aria-describedby="statusId"
            data-slot="date-range-start"
            @input="handleDraft('start', $event)"
            @click="openPart('start')"
            @keydown="handleInputKeydown($event, 'start')"
          />
          <button
            type="button"
            :popovertarget="popoverId"
            popovertargetaction="show"
            data-slot="date-range-start-button"
            class="absolute inset-y-0 end-0 grid min-w-11 place-items-center rounded-e-md text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white"
            :disabled="disabled || readonly"
            :aria-label="`Choose ${startLabel.toLowerCase()}`"
            @click="activePart = 'start'"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              class="size-5"
            >
              <path
                d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="grid gap-2">
        <label :for="endId" class="text-sm text-gray-600 dark:text-gray-400">
          {{ endLabel }}
        </label>
        <div data-slot="date-range-field">
          <Input
            ref="endInput"
            :id="endId"
            type="text"
            inputmode="numeric"
            autocomplete="off"
            :name="name ? `${name}[end]` : undefined"
            :value="endDraft"
            placeholder="YYYY-MM-DD"
            :required="required"
            :readonly="readonly"
            :aria-invalid="endInvalid || orderInvalid || undefined"
            :aria-describedby="statusId"
            data-slot="date-range-end"
            @input="handleDraft('end', $event)"
            @click="openPart('end')"
            @keydown="handleInputKeydown($event, 'end')"
          />
          <button
            type="button"
            :popovertarget="popoverId"
            popovertargetaction="show"
            data-slot="date-range-end-button"
            class="absolute inset-y-0 end-0 grid min-w-11 place-items-center rounded-e-md text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white"
            :disabled="disabled || readonly"
            :aria-label="`Choose ${endLabel.toLowerCase()}`"
            @click="activePart = 'end'"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              class="size-5"
            >
              <path
                d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <p
      :id="statusId"
      data-slot="date-range-status"
      class="text-sm text-gray-600 dark:text-gray-400"
      :class="{
        'text-red-700 dark:text-red-400':
          startInvalid || endInvalid || orderInvalid
      }"
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
      data-slot="date-range-popover"
      class="w-[min(22rem,calc(100vw-1rem))] p-0"
      @update:open="emit('update:open', $event)"
    >
      <Calendar
        :model-value="calendarValue"
        :default-value="value.start"
        :min="min"
        :max="max"
        :unavailable="unavailable"
        :range-start="orderedDecoration.start"
        :range-end="value.end ? orderedDecoration.end : undefined"
        :range-preview="!value.end ? orderedDecoration.end : undefined"
        :locale="locale"
        :dir="dir"
        :disabled="disabled"
        :readonly="readonly"
        @focus-change="handleCalendarFocus"
        @update:model-value="chooseDate"
      />
    </Popover>
  </fieldset>
</template>
