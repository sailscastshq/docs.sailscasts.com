import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

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

function coordinates(segment) {
  return segment.map((point) => `${point.x},${point.y}`).join(' ')
}

const LineChart = forwardRef(function LineChart(
  {
    data = [],
    caption,
    emptyLabel = 'No data',
    formatValue = String,
    className,
    'data-slot': _dataSlot,
    ...props
  },
  ref
) {
  const chart = geometry(data)
  const hasValues = chart.points.length > 0
  const firstLabel = data[0]?.label ?? ''
  const lastLabel = data.length > 1 ? (data.at(-1)?.label ?? '') : ''
  const exactValue = (point) => {
    if (point?.detail) return point.detail
    const value = finiteValue(point)
    return value === undefined ? emptyLabel : formatValue(value)
  }

  return (
    <figure
      {...props}
      ref={ref}
      data-slot="line-chart"
      className={twMerge(
        'grid h-64 grid-rows-[auto_minmax(0,1fr)_auto] gap-3 text-gray-950 dark:text-white',
        className
      )}
    >
      <figcaption
        data-slot="line-chart-caption"
        className="text-sm font-semibold"
      >
        {caption}
      </figcaption>

      {hasValues ? (
        <svg
          data-slot="line-chart-graphic"
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 640 200"
          preserveAspectRatio="none"
          fill="none"
          className="h-full min-h-0 w-full overflow-visible"
        >
          {chart.segments.map((segment, index) =>
            segment.length > 1 ? (
              <polyline
                key={index}
                data-slot="line-chart-line"
                points={coordinates(segment)}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ) : (
              <circle
                key={index}
                data-slot="line-chart-point"
                cx={segment[0].x}
                cy={segment[0].y}
                r="3"
                fill="currentColor"
                vectorEffect="non-scaling-stroke"
              />
            )
          )}
        </svg>
      ) : (
        <p
          data-slot="line-chart-empty"
          className="grid min-h-32 place-items-center text-sm text-gray-500 dark:text-gray-400"
        >
          {emptyLabel}
        </p>
      )}

      {hasValues ? (
        <div
          data-slot="line-chart-labels"
          className={twMerge(
            'flex text-xs text-gray-500 tabular-nums dark:text-gray-400',
            lastLabel ? 'justify-between' : 'justify-center'
          )}
        >
          <span>{firstLabel}</span>
          {lastLabel ? <span>{lastLabel}</span> : null}
        </div>
      ) : null}

      <ul data-slot="line-chart-values" className="sr-only">
        {data.map((point, index) => (
          <li key={index}>
            {point?.label}: {exactValue(point)}
          </li>
        ))}
      </ul>
    </figure>
  )
})

export default LineChart
