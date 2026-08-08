<script setup>
import { computed, nextTick, onMounted, ref, useAttrs, useId, watch } from 'vue'
import { twMerge } from 'tailwind-merge'
import {
  addDays,
  addMonths,
  calendarGrid,
  clampDate,
  compareDates,
  dateIsUnavailable,
  dateLabel,
  endOfMonth,
  firstDayOfWeek,
  monthLabel,
  monthValue,
  parseIsoDate,
  resolveDirection,
  resolveLocale,
  startOfMonth,
  todayIso,
  weekEdge,
  weekdayLabels
} from './date.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** A date-only ISO value: YYYY-MM-DD. */
  modelValue: { type: String, default: undefined },
  /** Initial value when modelValue is not controlled. */
  defaultValue: { type: String, default: undefined },
  /** Earliest selectable YYYY-MM-DD date. */
  min: { type: String, default: undefined },
  /** Latest selectable YYYY-MM-DD date. */
  max: { type: String, default: undefined },
  /** Product rule for unavailable dates. Receives YYYY-MM-DD. */
  unavailable: { type: Function, default: undefined },
  /** Range boundary decoration used by DateRangePicker. */
  rangeStart: { type: String, default: undefined },
  /** Committed range boundary decoration used by DateRangePicker. */
  rangeEnd: { type: String, default: undefined },
  /** Pending range boundary decoration used by DateRangePicker. */
  rangePreview: { type: String, default: undefined },
  /** BCP 47 locale. Defaults to the document or browser locale. */
  locale: { type: String, default: undefined },
  /** Reading direction. Inferred when omitted. */
  dir: {
    type: String,
    default: undefined,
    validator: (value) => value === undefined || ['ltr', 'rtl'].includes(value)
  },
  /** Accessible name for the calendar region. */
  label: { type: String, default: 'Choose a date' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change', 'focus-change'])
const attrs = useAttrs()
const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const root = ref()
const internalValue = ref(
  parseIsoDate(props.defaultValue) ? props.defaultValue : undefined
)
const locale = computed(() => resolveLocale(props.locale))
const direction = computed(() => resolveDirection(locale.value, props.dir))
const today = computed(() => todayIso())
const selected = computed(() =>
  props.modelValue === undefined ? internalValue.value : props.modelValue
)
const limits = computed(() => ({
  min: parseIsoDate(props.min) ? props.min : undefined,
  max: parseIsoDate(props.max) ? props.max : undefined,
  unavailable: props.unavailable
}))

function available(value) {
  return !props.disabled && !dateIsUnavailable(value, limits.value)
}

function nearestAvailable(value, direction = 1) {
  let candidate = clampDate(value, limits.value) ?? today.value
  for (let count = 0; count < 732; count += 1) {
    if (available(candidate)) return candidate
    const next = addDays(candidate, direction)
    if (!next) break
    if (props.min && compareDates(next, props.min) < 0) break
    if (props.max && compareDates(next, props.max) > 0) break
    candidate = next
  }
  return clampDate(value, limits.value) ?? today.value
}

const initialFocus =
  (parseIsoDate(selected.value) && selected.value) ||
  (parseIsoDate(props.defaultValue) && props.defaultValue) ||
  today.value
const focusedDate = ref(nearestAvailable(initialFocus))
const viewMonth = ref(monthValue(focusedDate.value))
const weekStart = computed(() => firstDayOfWeek(locale.value))
const weekdays = computed(() => weekdayLabels(locale.value, weekStart.value))
const days = computed(() =>
  calendarGrid(`${viewMonth.value}-01`, weekStart.value).map((value) => {
    const parsed = parseIsoDate(value)
    const rangeEnd = props.rangeEnd || props.rangePreview
    const inRange =
      props.rangeStart &&
      rangeEnd &&
      compareDates(value, props.rangeStart) >= 0 &&
      compareDates(value, rangeEnd) <= 0
    return {
      value,
      day: parsed.day,
      label: dateLabel(value, locale.value, { weekday: 'long' }),
      outside: monthValue(value) !== viewMonth.value,
      selected: value === selected.value,
      today: value === today.value,
      unavailable: !available(value),
      rangeStart: value === props.rangeStart,
      rangeEnd: value === rangeEnd,
      inRange
    }
  })
)
const weeks = computed(() =>
  Array.from({ length: 6 }, (_, index) =>
    days.value.slice(index * 7, index * 7 + 7)
  )
)
const visibleMonthLabel = computed(() =>
  monthLabel(`${viewMonth.value}-01`, locale.value)
)
const previousDisabled = computed(() => {
  if (props.disabled) return true
  const previousEnd = endOfMonth(addMonths(`${viewMonth.value}-01`, -1))
  return Boolean(props.min && compareDates(previousEnd, props.min) < 0)
})
const nextDisabled = computed(() => {
  if (props.disabled) return true
  const nextStart = startOfMonth(addMonths(`${viewMonth.value}-01`, 1))
  return Boolean(props.max && compareDates(nextStart, props.max) > 0)
})
const rootAttrs = computed(() => {
  const { class: _class, 'data-slot': _dataSlot, ...rest } = attrs
  return rest
})
const rootClasses = computed(() =>
  twMerge(
    'w-full max-w-[22rem] rounded-lg bg-white p-3 text-gray-950 dark:bg-gray-950 dark:text-white',
    attrs.class
  )
)

function commit(value) {
  if (!available(value) || props.readonly) return
  if (props.modelValue === undefined) internalValue.value = value
  emit('update:modelValue', value)
  emit('change', value)
}

async function focus(value, { move = true } = {}) {
  const next = nearestAvailable(
    value,
    compareDates(value, focusedDate.value) < 0 ? -1 : 1
  )
  focusedDate.value = next
  if (move) viewMonth.value = monthValue(next)
  emit('focus-change', next)
  await nextTick()
  root.value
    ?.querySelector(`[data-date="${next}"]`)
    ?.focus({ preventScroll: true })
}

function moveByMonth(amount) {
  if (
    (amount < 0 && previousDisabled.value) ||
    (amount > 0 && nextDisabled.value)
  ) {
    return
  }
  focus(addMonths(focusedDate.value, amount))
}

function handleDayFocus(value) {
  focusedDate.value = value
  emit('focus-change', value)
}

function handleDayKeydown(event, value) {
  let next
  const horizontal = direction.value === 'rtl' ? -1 : 1

  if (event.key === 'ArrowLeft') next = addDays(value, -horizontal)
  else if (event.key === 'ArrowRight') next = addDays(value, horizontal)
  else if (event.key === 'ArrowUp') next = addDays(value, -7)
  else if (event.key === 'ArrowDown') next = addDays(value, 7)
  else if (event.key === 'Home')
    next = weekEdge(value, weekStart.value, 'start')
  else if (event.key === 'End') next = weekEdge(value, weekStart.value, 'end')
  else if (event.key === 'PageUp')
    next = addMonths(value, event.shiftKey ? -12 : -1)
  else if (event.key === 'PageDown')
    next = addMonths(value, event.shiftKey ? 12 : 1)
  else return

  event.preventDefault()
  focus(next)
}

watch(
  () => props.modelValue,
  (value) => {
    if (!parseIsoDate(value)) return
    focusedDate.value = nearestAvailable(value)
    viewMonth.value = monthValue(focusedDate.value)
  }
)

onMounted(() => {
  if (!root.value?.querySelector('[data-slot="calendar-day"]:focus')) return
  focus(focusedDate.value)
})

defineExpose({
  root,
  focus: () => focus(focusedDate.value),
  focusedDate
})
</script>

<template>
  <section
    ref="root"
    v-bind="rootAttrs"
    :dir="direction"
    data-slot="calendar"
    :aria-label="label"
    :class="rootClasses"
  >
    <header
      data-slot="calendar-header"
      class="grid grid-cols-[2.75rem_1fr_2.75rem] items-center gap-1"
    >
      <button
        type="button"
        data-slot="calendar-previous"
        class="grid min-h-11 min-w-11 place-items-center rounded-md text-xl hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-gray-800 dark:focus-visible:outline-white"
        :aria-label="`Previous month, ${visibleMonthLabel}`"
        :disabled="previousDisabled"
        @click="moveByMonth(-1)"
      >
        <span aria-hidden="true">{{ direction === 'rtl' ? '→' : '←' }}</span>
      </button>
      <h2
        :id="`klean-calendar-${generatedId}-heading`"
        data-slot="calendar-heading"
        class="text-center text-base font-semibold"
        aria-live="polite"
        aria-atomic="true"
      >
        {{ visibleMonthLabel }}
      </h2>
      <button
        type="button"
        data-slot="calendar-next"
        class="grid min-h-11 min-w-11 place-items-center rounded-md text-xl hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-gray-800 dark:focus-visible:outline-white"
        :aria-label="`Next month, ${visibleMonthLabel}`"
        :disabled="nextDisabled"
        @click="moveByMonth(1)"
      >
        <span aria-hidden="true">{{ direction === 'rtl' ? '←' : '→' }}</span>
      </button>
    </header>

    <table
      role="grid"
      data-slot="calendar-grid"
      class="mt-2 w-full table-fixed border-collapse"
      :aria-labelledby="`klean-calendar-${generatedId}-heading`"
      :aria-readonly="readonly || undefined"
      :aria-disabled="disabled || undefined"
    >
      <thead>
        <tr>
          <th
            v-for="weekday in weekdays"
            :key="weekday"
            scope="col"
            data-slot="calendar-weekday"
            class="h-9 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {{ weekday }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, weekIndex) in weeks" :key="weekIndex">
          <td
            v-for="day in week"
            :key="day.value"
            role="gridcell"
            data-slot="calendar-cell"
            class="p-0 text-center"
            :aria-selected="day.selected"
          >
            <button
              type="button"
              data-slot="calendar-day"
              :data-date="day.value"
              :data-outside-month="day.outside || undefined"
              :data-selected="day.selected || undefined"
              :data-today="day.today || undefined"
              :data-unavailable="day.unavailable || undefined"
              :data-range-start="day.rangeStart || undefined"
              :data-range-end="day.rangeEnd || undefined"
              :data-in-range="day.inRange || undefined"
              :aria-label="day.label"
              :aria-current="day.today ? 'date' : undefined"
              :aria-disabled="day.unavailable || undefined"
              :disabled="day.unavailable"
              :tabindex="day.value === focusedDate ? 0 : -1"
              class="mx-auto grid min-h-11 min-w-11 place-items-center rounded-md text-sm tabular-nums hover:bg-gray-100 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed data-[in-range]:bg-gray-100 data-[outside-month]:text-gray-400 data-[range-end]:bg-gray-950 data-[range-end]:font-semibold data-[range-end]:text-white data-[range-start]:bg-gray-950 data-[range-start]:font-semibold data-[range-start]:text-white data-[selected]:bg-gray-950 data-[selected]:font-semibold data-[selected]:text-white data-[today]:ring-1 data-[today]:ring-inset data-[today]:ring-gray-400 data-[unavailable]:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:outline-white dark:data-[in-range]:bg-gray-800 dark:data-[outside-month]:text-gray-600 dark:data-[range-end]:bg-white dark:data-[range-end]:text-gray-950 dark:data-[range-start]:bg-white dark:data-[range-start]:text-gray-950 dark:data-[selected]:bg-white dark:data-[selected]:text-gray-950 dark:data-[today]:ring-gray-600 dark:data-[unavailable]:text-gray-700"
              @focus="handleDayFocus(day.value)"
              @keydown="handleDayKeydown($event, day.value)"
              @click="commit(day.value)"
            >
              {{ day.day }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
