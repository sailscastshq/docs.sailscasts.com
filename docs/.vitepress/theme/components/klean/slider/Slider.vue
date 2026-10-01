<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  watch
} from 'vue'
import { twMerge } from 'tailwind-merge'
import {
  moveSlider,
  sliderBounds,
  sliderKey,
  sliderPercent,
  sliderValue
} from './slider.js'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  modelValue: { type: [Number, Array], default: undefined },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: [Number, String], default: 1 },
  minStepsBetween: { type: Number, default: 0 },
  bigStep: { type: Number, default: undefined },
  labels: { type: Array, default: () => ['Minimum value', 'Maximum value'] },
  marks: { type: Array, default: () => [] },
  valueText: { type: Function, default: undefined },
  disabled: Boolean,
  name: { type: [String, Array], default: undefined }
})
const emit = defineEmits(['update:modelValue', 'change', 'commit'])
const attrs = useAttrs()
const root = ref()
const inputs = ref([])
const bounds = computed(() =>
  sliderBounds(props.min, props.max, props.step, props.minStepsBetween)
)
const value = computed(() => sliderValue(props.modelValue, bounds.value))
const values = computed(() =>
  Array.isArray(value.value) ? value.value : [value.value]
)
const range = computed(() => values.value.length === 2)
const disabled = computed(
  () => props.disabled || bounds.value.min === bounds.value.max
)
const dragging = ref(false)
const thumbSize = ref(20)
const thumbMeasure = ref()
let geometryObserver
function measureThumb() {
  const width = thumbMeasure.value?.getBoundingClientRect().width
  if (Number.isFinite(width) && width > 0) thumbSize.value = width
}
const initialValue = Array.isArray(props.modelValue)
  ? [...props.modelValue]
  : props.modelValue
let gesture
let form
const lastIndex = ref(0)
const classes = computed(() =>
  twMerge(
    'relative block h-11 w-full touch-pan-y select-none text-gray-950 dark:text-white data-disabled:cursor-not-allowed data-disabled:opacity-40 [--thumb-size:1.25rem]',
    attrs.class
  )
)
const inputAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    dir: _dir,
    id: _id,
    'aria-label': _label,
    ...rest
  } = attrs
  if (range.value) delete rest['aria-labelledby']
  return rest
})
const fill = computed(() => ({
  insetInlineStart: `${range.value ? sliderPercent(values.value[0], bounds.value) : 0}%`,
  width: `${sliderPercent(values.value.at(-1), bounds.value) - (range.value ? sliderPercent(values.value[0], bounds.value) : 0)}%`
}))
const ticks = computed(() =>
  props.marks
    .map((mark) => (typeof mark === 'number' ? { value: mark } : mark))
    .filter(
      (mark) =>
        Number.isFinite(mark.value) &&
        mark.value >= bounds.value.min &&
        mark.value <= bounds.value.max
    )
)
const limits = (index) => ({
  min: index === 1 ? values.value[0] + bounds.value.gap : bounds.value.min,
  max:
    range.value && index === 0
      ? values.value[1] - bounds.value.gap
      : bounds.value.max
})
function publish(next) {
  emit('update:modelValue', next)
  emit('change', next)
  return next
}
function input(event, index) {
  const next = moveSlider(
    value.value,
    index,
    event.target.valueAsNumber,
    bounds.value
  )
  event.target.value = Array.isArray(next) ? next[index] : next
  publish(next)
  nextTick(() => {
    event.target.value = values.value[index]
  })
}
function rtl() {
  return getComputedStyle(root.value).direction === 'rtl'
}
function pointerValue(event) {
  measureThumb()
  const rect = root.value.getBoundingClientRect()
  const fraction = Math.max(
    0,
    Math.min(
      1,
      (event.clientX - rect.left - thumbSize.value / 2) /
        Math.max(1, rect.width - thumbSize.value)
    )
  )
  return (
    bounds.value.min +
    (rtl() ? 1 - fraction : fraction) * (bounds.value.max - bounds.value.min)
  )
}
function pointerDown(event) {
  if (
    disabled.value ||
    inputs.value[0]?.matches(':disabled') ||
    event.button !== 0 ||
    event.isPrimary === false
  )
    return
  event.preventDefault()
  const candidate = pointerValue(event)
  const distances = values.value.map((item) => Math.abs(item - candidate))
  const index = range.value
    ? distances[0] === distances[1]
      ? candidate < values.value[0]
        ? 0
        : candidate > values.value[1]
          ? 1
          : lastIndex.value === 0
            ? 1
            : 0
      : distances[0] < distances[1]
        ? 0
        : 1
    : 0
  lastIndex.value = index
  inputs.value[index]?.focus()
  gesture = {
    id: event.pointerId,
    index,
    start: value.value,
    next: value.value
  }
  root.value.setPointerCapture?.(event.pointerId)
  dragging.value = true
  pointerMove(event)
}
function pointerMove(event) {
  if (!gesture || gesture.id !== event.pointerId) return
  if (disabled.value || inputs.value[gesture.index]?.matches(':disabled')) {
    const id = gesture.id
    gesture = undefined
    dragging.value = false
    if (root.value.hasPointerCapture?.(id)) root.value.releasePointerCapture(id)
    return
  }
  gesture.next = moveSlider(
    value.value,
    gesture.index,
    pointerValue(event),
    bounds.value
  )
  publish(gesture.next)
}
function endPointer(event, cancelled = false) {
  if (!gesture || gesture.id !== event.pointerId) return
  const finished = gesture
  gesture = undefined
  dragging.value = false
  if (root.value.hasPointerCapture?.(event.pointerId))
    root.value.releasePointerCapture(event.pointerId)
  if (disabled.value || inputs.value[finished.index]?.matches(':disabled'))
    return
  if (cancelled) publish(finished.start)
  else emit('commit', finished.next)
}
function keydown(event, index) {
  if (event.defaultPrevented) return
  if (disabled.value || event.target.matches(':disabled')) return
  if (
    !event.shiftKey &&
    !['PageUp', 'PageDown', 'Home', 'End'].includes(event.key)
  )
    return
  const limit = limits(index)
  const increment =
    props.bigStep ??
    (bounds.value.step === 'any'
      ? (bounds.value.max - bounds.value.min) / 10
      : bounds.value.step * 10)
  const candidate = sliderKey(
    event.key,
    values.value[index],
    limit.min,
    limit.max,
    increment,
    rtl()
  )
  if (candidate === undefined) return
  event.preventDefault()
  const next = publish(moveSlider(value.value, index, candidate, bounds.value))
  emit('commit', next)
}
function reset(event) {
  queueMicrotask(() => {
    if (event.defaultPrevented) return
    publish(sliderValue(initialValue, bounds.value))
    nextTick(() =>
      inputs.value.forEach((input, index) => {
        if (input) input.value = values.value[index]
      })
    )
  })
}
function listenForm() {
  form?.removeEventListener('reset', reset)
  form = inputs.value[0]?.form
  form?.addEventListener('reset', reset)
}
onMounted(() => {
  listenForm()
  measureThumb()
  geometryObserver = new ResizeObserver(measureThumb)
  geometryObserver.observe(root.value)
  geometryObserver.observe(thumbMeasure.value)
})
watch(
  () => attrs.class,
  () => nextTick(measureThumb)
)
watch(() => attrs.form, listenForm, { flush: 'post' })
onBeforeUnmount(() => {
  form?.removeEventListener('reset', reset)
  geometryObserver?.disconnect()
})
defineExpose({ inputs })
</script>

<template>
  <span
    ref="root"
    data-slot="slider"
    :class="classes"
    :style="attrs.style"
    :dir="attrs.dir"
    :role="range ? 'group' : undefined"
    :aria-label="range ? attrs['aria-label'] : undefined"
    :aria-labelledby="range ? attrs['aria-labelledby'] : undefined"
    :data-disabled="disabled || undefined"
    :data-dragging="dragging || undefined"
    @pointerdown="pointerDown"
    @pointermove="pointerMove"
    @pointerup="endPointer"
    @pointercancel="endPointer($event, true)"
    @lostpointercapture="endPointer($event, true)"
  >
    <span
      aria-hidden="true"
      data-slot="slider-track"
      class="pointer-events-none absolute inset-x-2.5 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gray-200 dark:bg-gray-700"
      :style="{
        insetInline: 'calc(var(--thumb-size) / 2)',
        transform: 'translateY(-50%)',
        translate: 'none'
      }"
    >
      <span
        data-slot="slider-fill"
        class="absolute h-full rounded-full bg-current"
        :style="fill"
      />
      <span
        v-for="mark in ticks"
        :key="mark.value"
        data-slot="slider-mark"
        class="absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/65 dark:bg-gray-950/65 rtl:translate-x-1/2"
        :style="{
          insetInlineStart: `${sliderPercent(mark.value, bounds)}%`,
          transform: 'translate(calc(-50% * var(--slider-direction, 1)), -50%)',
          translate: 'none'
        }"
      />
    </span>
    <span
      ref="thumbMeasure"
      aria-hidden="true"
      class="pointer-events-none invisible absolute h-0"
      style="width: var(--thumb-size)"
    />
    <input
      v-for="(item, index) in values"
      :key="index"
      :ref="(el) => (inputs[index] = el)"
      v-bind="inputAttrs"
      type="range"
      data-slot="slider-thumb"
      :data-index="index"
      :id="index === 0 ? attrs.id : attrs.id ? `${attrs.id}-end` : undefined"
      :name="Array.isArray(name) ? name[index] : name"
      :disabled="disabled"
      :min="bounds.min"
      :max="bounds.max"
      :step="bounds.step"
      :value="item"
      :aria-label="
        range
          ? labels[index] || (index ? 'Maximum value' : 'Minimum value')
          : attrs['aria-label']
      "
      :aria-valuemin="limits(index).min"
      :aria-valuemax="limits(index).max"
      :aria-valuetext="valueText?.(item, index)"
      :style="{ zIndex: index === lastIndex ? 2 : 1 }"
      class="klean-slider-input absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed"
      @input="input($event, index)"
      @change="emit('commit', value)"
      @keydown="keydown($event, index)"
      @focus="lastIndex = index"
    />
    <span
      v-for="mark in ticks.filter((tick) => tick.label !== undefined)"
      :key="`label-${mark.value}`"
      data-slot="slider-mark-label"
      class="pointer-events-none absolute top-full -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 rtl:translate-x-1/2"
      :style="{
        insetInlineStart: `calc(${thumbSize / 2}px + (100% - ${thumbSize}px) * ${sliderPercent(mark.value, bounds) / 100})`
      }"
      >{{ mark.label }}</span
    >
  </span>
</template>

<style scoped>
@layer base {
  [data-slot='slider']:dir(rtl) {
    --slider-direction: -1;
  }
  .klean-slider-input {
    pointer-events: none;
  }
  .klean-slider-input::-webkit-slider-runnable-track {
    height: 6px;
    background: transparent;
  }
  .klean-slider-input::-moz-range-track {
    height: 6px;
    background: transparent;
  }
  .klean-slider-input::-webkit-slider-thumb {
    appearance: none;
    box-sizing: border-box;
    width: var(--thumb-size);
    height: var(--thumb-size);
    margin-top: calc((6px - var(--thumb-size)) / 2);
    border: 1px solid #d1d5db;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px #0002;
    pointer-events: auto;
  }
  .klean-slider-input::-moz-range-thumb {
    box-sizing: border-box;
    width: var(--thumb-size);
    height: var(--thumb-size);
    border: 1px solid #d1d5db;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px #0002;
    pointer-events: auto;
  }
  .klean-slider-input:focus-visible::-webkit-slider-thumb {
    outline: 3px solid currentColor;
    outline-offset: 3px;
  }
  .klean-slider-input:focus-visible::-moz-range-thumb {
    outline: 3px solid currentColor;
    outline-offset: 3px;
  }
  @media (forced-colors: active) {
    [data-slot='slider-track'] {
      background: GrayText;
    }
    [data-slot='slider-fill'] {
      background: Highlight;
    }
    .klean-slider-input::-webkit-slider-thumb {
      border-color: ButtonText;
      background: ButtonFace;
    }
    .klean-slider-input::-moz-range-thumb {
      border-color: ButtonText;
      background: ButtonFace;
    }
  }
}
</style>
