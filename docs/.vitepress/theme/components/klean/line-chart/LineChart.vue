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
const inset = 8
const cornerRadius = 20
const guides = [inset, height / 2, height - inset]

function finiteValue(point) {
  return Number.isFinite(point?.value) ? point.value : undefined
}

function geometry(data) {
  const values = data.map(finiteValue).filter((value) => value !== undefined)
  if (!values.length) {
    return { segments: [], points: [], minimum: undefined, maximum: undefined }
  }

  const minimum = Math.min(...values)
  const maximum = Math.max(...values)
  let domainMinimum = minimum
  let domainMaximum = maximum
  if (domainMinimum === domainMaximum) {
    const padding = Math.max(Math.abs(domainMinimum) * 0.1, 1)
    domainMinimum -= padding
    domainMaximum += padding
  }

  const x = (index) =>
    data.length === 1
      ? width / 2
      : inset + (index / (data.length - 1)) * (width - inset * 2)
  const y = (value) =>
    inset +
    ((domainMaximum - value) / (domainMaximum - domainMinimum)) *
      (height - inset * 2)

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

    const coordinate = { x: x(index), y: y(value), index }
    points.push(coordinate)
    segment.push(coordinate)
  })
  if (segment.length) segments.push(segment)

  return { segments, points, minimum, maximum }
}

const chart = computed(() => geometry(props.data))
const hasValues = computed(() => chart.value.points.length > 0)
const firstLabel = computed(() => props.data[0]?.label ?? '')
const middleLabel = computed(() =>
  props.data.length > 2
    ? (props.data[Math.floor((props.data.length - 1) / 2)]?.label ?? '')
    : ''
)
const lastLabel = computed(() =>
  props.data.length > 1 ? (props.data.at(-1)?.label ?? '') : ''
)
const currentPoint = computed(() => chart.value.points.at(-1))
const forwardedAttrs = computed(() => {
  const { class: _class, 'data-slot': _dataSlot, ...rest } = attrs
  return rest
})

function compact(value) {
  return Number(value.toFixed(2))
}

function roundedPath(segment) {
  if (segment.length < 2) return ''

  let path = `M ${compact(segment[0].x)} ${compact(segment[0].y)}`

  for (let index = 1; index < segment.length - 1; index += 1) {
    const previous = segment[index - 1]
    const point = segment[index]
    const next = segment[index + 1]
    const previousDistance = Math.hypot(
      point.x - previous.x,
      point.y - previous.y
    )
    const nextDistance = Math.hypot(next.x - point.x, next.y - point.y)
    const radius = Math.min(
      cornerRadius,
      previousDistance / 3,
      nextDistance / 3
    )
    const before = {
      x: point.x + ((previous.x - point.x) / previousDistance) * radius,
      y: point.y + ((previous.y - point.y) / previousDistance) * radius
    }
    const after = {
      x: point.x + ((next.x - point.x) / nextDistance) * radius,
      y: point.y + ((next.y - point.y) / nextDistance) * radius
    }

    path += ` L ${compact(before.x)} ${compact(before.y)} Q ${compact(point.x)} ${compact(point.y)} ${compact(after.x)} ${compact(after.y)}`
  }

  const last = segment.at(-1)
  return `${path} L ${compact(last.x)} ${compact(last.y)}`
}

function exactValue(point) {
  if (point?.detail) return point.detail
  const value = finiteValue(point)
  return value === undefined ? props.emptyLabel : props.formatValue(value)
}

function pointLabel(point) {
  const value = exactValue(point)
  return point?.detail || !point?.label ? value : `${point.label}: ${value}`
}

function pointStyle(point) {
  return {
    left: `${(point.x / width) * 100}%`,
    top: `${(point.y / height) * 100}%`
  }
}

function tipPosition(point) {
  const horizontal =
    point.x <= width * 0.2
      ? 'left-1/2'
      : point.x >= width * 0.8
        ? 'right-1/2'
        : 'left-1/2 -translate-x-1/2'
  const vertical =
    point.y <= height * 0.32 ? 'top-full mt-1.5' : 'bottom-full mb-1.5'

  return [
    'pointer-events-none absolute z-10 w-max max-w-52 rounded-md bg-gray-950 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg group-hover:opacity-100 group-focus:opacity-100 dark:bg-white dark:text-gray-950',
    horizontal,
    vertical
  ]
}
</script>

<template>
  <figure
    v-bind="forwardedAttrs"
    data-slot="line-chart"
    :class="
      twMerge(
        'grid h-56 grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] gap-x-3 gap-y-2 text-gray-950 dark:text-white',
        attrs.class
      )
    "
  >
    <figcaption
      data-slot="line-chart-caption"
      class="col-span-2 text-sm font-semibold"
    >
      {{ caption }}
    </figcaption>

    <div
      v-if="hasValues"
      data-slot="line-chart-scale"
      :class="[
        'row-start-2 grid min-w-8 text-right text-[11px] leading-none text-gray-500 tabular-nums dark:text-gray-400',
        chart.minimum === chart.maximum
          ? 'place-items-center'
          : 'content-between'
      ]"
    >
      <span>{{ formatValue(chart.maximum) }}</span>
      <span v-if="chart.minimum !== chart.maximum">
        {{ formatValue(chart.minimum) }}
      </span>
    </div>

    <div
      v-if="hasValues"
      data-slot="line-chart-plot"
      class="relative col-start-2 row-start-2 min-h-0"
    >
      <svg
        data-slot="line-chart-graphic"
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 640 200"
        preserveAspectRatio="none"
        fill="none"
        class="h-full w-full overflow-visible"
      >
        <g
          data-slot="line-chart-guides"
          class="text-gray-200 dark:text-gray-800"
        >
          <line
            v-for="guide in guides"
            :key="guide"
            data-slot="line-chart-guide"
            :x1="inset"
            :x2="width - inset"
            :y1="guide"
            :y2="guide"
            stroke="currentColor"
            stroke-width="1"
            vector-effect="non-scaling-stroke"
          />
        </g>
        <template v-for="(segment, index) in chart.segments" :key="index">
          <path
            v-if="segment.length > 1"
            data-slot="line-chart-line"
            :d="roundedPath(segment)"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            vector-effect="non-scaling-stroke"
          />
        </template>
        <circle
          v-for="point in chart.points"
          :key="point.index"
          data-slot="line-chart-point"
          :cx="point.x"
          :cy="point.y"
          r="2.25"
          fill="currentColor"
          opacity="0.38"
          vector-effect="non-scaling-stroke"
        />
        <template v-if="currentPoint">
          <circle
            data-slot="line-chart-current-halo"
            :cx="currentPoint.x"
            :cy="currentPoint.y"
            r="7"
            fill="currentColor"
            opacity="0.14"
            vector-effect="non-scaling-stroke"
          />
          <circle
            data-slot="line-chart-current"
            :cx="currentPoint.x"
            :cy="currentPoint.y"
            r="3.5"
            fill="currentColor"
            vector-effect="non-scaling-stroke"
          />
        </template>
      </svg>

      <div
        data-slot="line-chart-values"
        role="list"
        :aria-label="`${caption} values`"
        class="pointer-events-none absolute inset-0"
      >
        <span v-for="point in chart.points" :key="point.index" role="listitem">
          <button
            type="button"
            data-slot="line-chart-hit"
            :aria-label="`Inspect ${pointLabel(data[point.index])}`"
            :style="pointStyle(point)"
            class="group pointer-events-auto absolute size-7 -translate-x-1/2 -translate-y-1/2 cursor-crosshair rounded-full outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
          >
            <span
              data-slot="line-chart-hover-point"
              aria-hidden="true"
              class="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current opacity-0 ring-2 ring-white group-hover:opacity-100 group-focus:opacity-100 dark:ring-gray-950"
            />
            <span
              data-slot="line-chart-tip"
              aria-hidden="true"
              :class="tipPosition(point)"
            >
              {{ pointLabel(data[point.index]) }}
            </span>
          </button>
        </span>
        <template v-for="(point, index) in data" :key="`missing-${index}`">
          <span
            v-if="finiteValue(point) === undefined"
            role="listitem"
            class="sr-only"
          >
            {{ pointLabel(point) }}
          </span>
        </template>
      </div>
    </div>
    <p
      v-else
      data-slot="line-chart-empty"
      class="col-span-2 grid min-h-32 place-items-center text-sm text-gray-500 dark:text-gray-400"
    >
      {{ emptyLabel }}
    </p>

    <div
      v-if="hasValues"
      data-slot="line-chart-labels"
      :class="[
        'col-start-2 row-start-3 flex text-xs text-gray-500 tabular-nums dark:text-gray-400',
        lastLabel ? 'justify-between' : 'justify-center'
      ]"
    >
      <span>{{ firstLabel }}</span>
      <span v-if="middleLabel">{{ middleLabel }}</span>
      <span v-if="lastLabel">{{ lastLabel }}</span>
    </div>
  </figure>
</template>
