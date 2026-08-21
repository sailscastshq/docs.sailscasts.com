import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

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

function coordinates(segment) {
  return segment.map((point) => `${point.x},${point.y}`).join(' ')
}

const Sparkline = forwardRef(function Sparkline(
  {
    data = [],
    label,
    className,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-hidden': _ariaHidden,
    'data-slot': _dataSlot,
    ...props
  },
  ref
) {
  const chart = geometry(data)

  return (
    <svg
      {...props}
      ref={ref}
      data-slot="sparkline"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      viewBox="0 0 120 24"
      preserveAspectRatio="none"
      fill="none"
      className={twMerge('h-6 w-30 overflow-visible', className)}
    >
      {chart.segments.map((segment, index) =>
        segment.length > 1 ? (
          <polyline
            key={index}
            data-slot="sparkline-line"
            points={coordinates(segment)}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ) : (
          <circle
            key={index}
            data-slot="sparkline-point"
            cx={segment[0].x}
            cy={segment[0].y}
            r="1.75"
            fill="currentColor"
            vectorEffect="non-scaling-stroke"
          />
        )
      )}
    </svg>
  )
})

export default Sparkline
