<script setup>
import { computed, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  data: { type: Array, default: () => [] },
  caption: { type: String, required: true },
  emptyLabel: { type: String, default: 'No data' },
  formatValue: { type: Function, default: (value) => String(value) }
})

const attrs = useAttrs()
const width = 640
const height = 200
const inset = 4

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
const hasValues = computed(() => chart.value.points.length > 0)
const firstLabel = computed(() => props.data[0]?.label ?? '')
const lastLabel = computed(() =>
  props.data.length > 1 ? (props.data.at(-1)?.label ?? '') : ''
)
const forwardedAttrs = computed(() => {
  const { class: _class, 'data-slot': _dataSlot, ...rest } = attrs
  return rest
})

function coordinates(segment) {
  return segment.map((point) => `${point.x},${point.y}`).join(' ')
}

function exactValue(point) {
  if (point?.detail) return point.detail
  const value = finiteValue(point)
  return value === undefined ? props.emptyLabel : props.formatValue(value)
}
</script>

<template>
  <figure
    v-bind="forwardedAttrs"
    data-slot="line-chart"
    :class="
      twMerge(
        'grid h-64 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 text-gray-950 dark:text-white',
        attrs.class
      )
    "
  >
    <figcaption data-slot="line-chart-caption" class="text-sm font-semibold">
      {{ caption }}
    </figcaption>

    <svg
      v-if="hasValues"
      data-slot="line-chart-graphic"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 640 200"
      preserveAspectRatio="none"
      fill="none"
      class="h-full min-h-0 w-full overflow-visible"
    >
      <template v-for="(segment, index) in chart.segments" :key="index">
        <polyline
          v-if="segment.length > 1"
          data-slot="line-chart-line"
          :points="coordinates(segment)"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          vector-effect="non-scaling-stroke"
        />
        <circle
          v-else
          data-slot="line-chart-point"
          :cx="segment[0].x"
          :cy="segment[0].y"
          r="3"
          fill="currentColor"
          vector-effect="non-scaling-stroke"
        />
      </template>
    </svg>
    <p
      v-else
      data-slot="line-chart-empty"
      class="grid min-h-32 place-items-center text-sm text-gray-500 dark:text-gray-400"
    >
      {{ emptyLabel }}
    </p>

    <div
      v-if="hasValues"
      data-slot="line-chart-labels"
      :class="[
        'flex text-xs text-gray-500 tabular-nums dark:text-gray-400',
        lastLabel ? 'justify-between' : 'justify-center'
      ]"
    >
      <span>{{ firstLabel }}</span>
      <span v-if="lastLabel">{{ lastLabel }}</span>
    </div>

    <ul data-slot="line-chart-values" class="sr-only">
      <li v-for="(point, index) in data" :key="index">
        {{ point?.label }}: {{ exactValue(point) }}
      </li>
    </ul>
  </figure>
</template>
