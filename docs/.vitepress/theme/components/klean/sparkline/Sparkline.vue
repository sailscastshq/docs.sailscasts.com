<script setup>
import { computed, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  data: { type: Array, default: () => [] },
  label: { type: String, default: undefined }
})

const attrs = useAttrs()
const width = 120
const height = 24
const inset = 1.5

function finiteValue(point) {
  return Number.isFinite(point?.value) ? point.value : undefined
}

function geometry(data) {
  const values = data.map(finiteValue).filter((value) => value !== undefined)
  if (!values.length) return { segments: [], points: [] }

  let minimum = Math.min(0, ...values)
  let maximum = Math.max(0, ...values)
  if (minimum === maximum) {
    minimum -= 1
    maximum += 1
  }

  const x = (index) =>
    data.length === 1
      ? width / 2
      : inset + (index / (data.length - 1)) * (width - inset * 2)
  const y = (value) =>
    inset + ((maximum - value) / (maximum - minimum)) * (height - inset * 2)

  const segments = []
  const points = []
  let segment = []

  data.forEach((point, index) => {
    const value = finiteValue(point)
    if (value === undefined) {
      if (segment.length) segments.push(segment)
      segment = []
      return
    }

    const coordinate = { x: x(index), y: y(value) }
    points.push(coordinate)
    segment.push(coordinate)
  })
  if (segment.length) segments.push(segment)

  return { segments, points }
}

const chart = computed(() => geometry(props.data))
const forwardedAttrs = computed(() => {
  const {
    class: _class,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-hidden': _ariaHidden,
    'data-slot': _dataSlot,
    ...rest
  } = attrs
  return rest
})

function coordinates(segment) {
  return segment.map((point) => `${point.x},${point.y}`).join(' ')
}
</script>

<template>
  <svg
    v-bind="forwardedAttrs"
    data-slot="sparkline"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
    viewBox="0 0 120 24"
    preserveAspectRatio="none"
    fill="none"
    :class="twMerge('h-6 w-30 overflow-visible', attrs.class)"
  >
    <template v-for="(segment, index) in chart.segments" :key="index">
      <polyline
        v-if="segment.length > 1"
        data-slot="sparkline-line"
        :points="coordinates(segment)"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
      <circle
        v-else
        data-slot="sparkline-point"
        :cx="segment[0].x"
        :cy="segment[0].y"
        r="1.75"
        fill="currentColor"
        vector-effect="non-scaling-stroke"
      />
    </template>
  </svg>
</template>
