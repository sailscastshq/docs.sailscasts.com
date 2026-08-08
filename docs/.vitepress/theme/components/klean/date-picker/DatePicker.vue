<script setup>
import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'
import { twMerge } from 'tailwind-merge'
import Calendar from '../calendar/Calendar.vue'
import {
  dateIsUnavailable,
  dateLabel,
  parseIsoDate,
  resolveLocale
} from '../calendar/date.js'
import Input from '../input/Input.vue'
import Popover from '../popover/Popover.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** A date-only ISO value: YYYY-MM-DD. */
  modelValue: { type: String, default: undefined },
  /** Initial value when modelValue is not controlled. */
  defaultValue: { type: String, default: undefined },
  id: { type: String, default: undefined },
  name: { type: String, default: undefined },
  placeholder: { type: String, default: 'YYYY-MM-DD' },
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
const inputId = computed(() => props.id ?? `klean-date-picker-${generatedId}`)
const popoverId = computed(() => `${inputId.value}-calendar`)
const descriptionId = computed(() => `${inputId.value}-description`)
const internalValue = ref(
  parseIsoDate(props.defaultValue) ? props.defaultValue : ''
)
const value = computed(() =>
  props.modelValue === undefined ? internalValue.value : props.modelValue
)
const draft = ref(value.value ?? '')
const input = ref()
const popover = ref()
const locale = computed(() => resolveLocale(props.locale))
const invalid = computed(() => {
  if (!draft.value) return false
  if (!parseIsoDate(draft.value)) return true
  return dateIsUnavailable(draft.value, {
    min: props.min,
    max: props.max,
    unavailable: props.unavailable
  })
})
const describedValue = computed(() =>
  !invalid.value && parseIsoDate(draft.value)
    ? dateLabel(draft.value, locale.value, { weekday: 'long' })
    : ''
)
const inputAttrs = computed(() => {
  const {
    class: _class,
    'data-slot': _dataSlot,
    'aria-describedby': _describedBy,
    ...rest
  } = attrs
  return rest
})
const describedBy = computed(
  () =>
    [attrs['aria-describedby'], describedValue.value && descriptionId.value]
      .filter(Boolean)
      .join(' ') || undefined
)
const rootClasses = computed(() =>
  twMerge(
    'relative flex w-full items-stretch [&_[data-slot=input]]:pe-12',
    attrs.class
  )
)

function commit(nextValue) {
  if (props.disabled || props.readonly) return
  if (nextValue && dateIsUnavailable(nextValue, props)) return
  if (props.modelValue === undefined) internalValue.value = nextValue
  draft.value = nextValue
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

function handleInput(event) {
  const nextValue = event.target.value.trim()
  draft.value = nextValue
  if (
    !nextValue ||
    (parseIsoDate(nextValue) && !dateIsUnavailable(nextValue, props))
  ) {
    commit(nextValue)
  }
}

function handleInputKeydown(event) {
  if (event.key === 'ArrowDown' && !props.disabled && !props.readonly) {
    event.preventDefault()
    popover.value?.open()
  }
}

function handleCalendarChange(nextValue) {
  commit(nextValue)
  popover.value?.close()
}

function handleOpenUpdate(nextOpen) {
  emit('update:open', nextOpen)
}

watch(value, (nextValue) => {
  draft.value = nextValue ?? ''
})

watch(
  () => [invalid.value, props.required, draft.value],
  async () => {
    await nextTick()
    const element = input.value?.element
    if (!element) return
    if (props.required && !draft.value) {
      element.setCustomValidity('Choose a date.')
    } else if (invalid.value) {
      element.setCustomValidity('Enter an available date as YYYY-MM-DD.')
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
  <div data-slot="date-picker" :class="rootClasses">
    <Input
      ref="input"
      v-bind="inputAttrs"
      :id="inputId"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      :name="name"
      :value="draft"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :readonly="readonly"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedBy"
      data-slot="date-picker-input"
      @input="handleInput"
      @click="!disabled && !readonly && popover?.open()"
      @keydown="handleInputKeydown"
    />
    <span
      v-if="describedValue"
      :id="descriptionId"
      data-slot="date-picker-description"
      class="sr-only"
    >
      {{ describedValue }}
    </span>
    <button
      type="button"
      :popovertarget="popoverId"
      data-slot="date-picker-button"
      class="absolute inset-y-0 end-0 grid min-w-11 place-items-center rounded-e-md text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus-visible:outline-white"
      :disabled="disabled || readonly"
      :aria-label="draft ? `Change date, ${describedValue}` : 'Choose a date'"
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
    <Popover
      ref="popover"
      :id="popoverId"
      :open="open"
      :default-open="defaultOpen"
      placement="bottom-start"
      data-slot="date-picker-popover"
      class="w-[min(22rem,calc(100vw-1rem))] p-0"
      @update:open="handleOpenUpdate"
    >
      <Calendar
        :model-value="parseIsoDate(value) ? value : undefined"
        :default-value="parseIsoDate(draft) ? draft : undefined"
        :min="min"
        :max="max"
        :unavailable="unavailable"
        :locale="locale"
        :dir="dir"
        :disabled="disabled"
        :readonly="readonly"
        @update:model-value="handleCalendarChange"
      />
    </Popover>
  </div>
</template>
