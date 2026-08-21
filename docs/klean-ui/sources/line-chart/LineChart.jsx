import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

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

  return twMerge(
    'pointer-events-none absolute z-10 w-max max-w-52 rounded-md bg-gray-950 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg group-hover:opacity-100 group-focus:opacity-100 dark:bg-white dark:text-gray-950',
    horizontal,
    vertical
  )
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
  const middleLabel =
    data.length > 2
      ? (data[Math.floor((data.length - 1) / 2)]?.label ?? '')
      : ''
  const lastLabel = data.length > 1 ? (data.at(-1)?.label ?? '') : ''
  const currentPoint = chart.points.at(-1)
  const exactValue = (point) => {
    if (point?.detail) return point.detail
    const value = finiteValue(point)
    return value === undefined ? emptyLabel : formatValue(value)
  }
  const pointLabel = (point) => {
    const value = exactValue(point)
    return point?.detail || !point?.label ? value : `${point.label}: ${value}`
  }

  return (
    <figure
      {...props}
      ref={ref}
      data-slot="line-chart"
      className={twMerge(
        'grid h-56 grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] gap-x-3 gap-y-2 text-gray-950 dark:text-white',
        className
      )}
    >
      <figcaption
        data-slot="line-chart-caption"
        className="col-span-2 text-sm font-semibold"
      >
        {caption}
      </figcaption>

      {hasValues ? (
        <div
          data-slot="line-chart-scale"
          className={twMerge(
            'row-start-2 grid min-w-8 text-right text-[11px] leading-none text-gray-500 tabular-nums dark:text-gray-400',
            chart.minimum === chart.maximum
              ? 'place-items-center'
              : 'content-between'
          )}
        >
          <span>{formatValue(chart.maximum)}</span>
          {chart.minimum !== chart.maximum ? (
            <span>{formatValue(chart.minimum)}</span>
          ) : null}
        </div>
      ) : null}

      {hasValues ? (
        <div
          data-slot="line-chart-plot"
          className="relative col-start-2 row-start-2 min-h-0"
        >
          <svg
            data-slot="line-chart-graphic"
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 640 200"
            preserveAspectRatio="none"
            fill="none"
            className="h-full w-full overflow-visible"
          >
            <g
              data-slot="line-chart-guides"
              className="text-gray-200 dark:text-gray-800"
            >
              {guides.map((guide) => (
                <line
                  key={guide}
                  data-slot="line-chart-guide"
                  x1={inset}
                  x2={width - inset}
                  y1={guide}
                  y2={guide}
                  stroke="currentColor"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
            {chart.segments.map((segment, index) =>
              segment.length > 1 ? (
                <path
                  key={index}
                  data-slot="line-chart-line"
                  d={roundedPath(segment)}
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ) : null
            )}
            {chart.points.map((point) => (
              <circle
                key={point.index}
                data-slot="line-chart-point"
                cx={point.x}
                cy={point.y}
                r="2.25"
                fill="currentColor"
                opacity="0.38"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {currentPoint ? (
              <>
                <circle
                  data-slot="line-chart-current-halo"
                  cx={currentPoint.x}
                  cy={currentPoint.y}
                  r="7"
                  fill="currentColor"
                  opacity="0.14"
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  data-slot="line-chart-current"
                  cx={currentPoint.x}
                  cy={currentPoint.y}
                  r="3.5"
                  fill="currentColor"
                  vectorEffect="non-scaling-stroke"
                />
              </>
            ) : null}
          </svg>

          <div
            data-slot="line-chart-values"
            role="list"
            aria-label={`${caption} values`}
            className="pointer-events-none absolute inset-0"
          >
            {chart.points.map((point) => (
              <span key={point.index} role="listitem">
                <button
                  type="button"
                  data-slot="line-chart-hit"
                  aria-label={`Inspect ${pointLabel(data[point.index])}`}
                  style={pointStyle(point)}
                  className="group pointer-events-auto absolute size-7 -translate-x-1/2 -translate-y-1/2 cursor-crosshair rounded-full outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                >
                  <span
                    data-slot="line-chart-hover-point"
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current opacity-0 ring-2 ring-white group-hover:opacity-100 group-focus:opacity-100 dark:ring-gray-950"
                  />
                  <span
                    data-slot="line-chart-tip"
                    aria-hidden="true"
                    className={tipPosition(point)}
                  >
                    {pointLabel(data[point.index])}
                  </span>
                </button>
              </span>
            ))}
            {data.map((point, index) =>
              finiteValue(point) === undefined ? (
                <span
                  key={`missing-${index}`}
                  role="listitem"
                  className="sr-only"
                >
                  {pointLabel(point)}
                </span>
              ) : null
            )}
          </div>
        </div>
      ) : (
        <p
          data-slot="line-chart-empty"
          className="col-span-2 grid min-h-32 place-items-center text-sm text-gray-500 dark:text-gray-400"
        >
          {emptyLabel}
        </p>
      )}

      {hasValues ? (
        <div
          data-slot="line-chart-labels"
          className={twMerge(
            'col-start-2 row-start-3 flex text-xs text-gray-500 tabular-nums dark:text-gray-400',
            lastLabel ? 'justify-between' : 'justify-center'
          )}
        >
          <span>{firstLabel}</span>
          {middleLabel ? <span>{middleLabel}</span> : null}
          {lastLabel ? <span>{lastLabel}</span> : null}
        </div>
      ) : null}
    </figure>
  )
})

export default LineChart
