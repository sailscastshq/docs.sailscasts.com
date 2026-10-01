import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  moveSlider,
  sliderBounds,
  sliderKey,
  sliderPercent,
  sliderValue
} from './slider.js'
import './slider.css'

const Slider = forwardRef(function Slider(
  {
    value: controlledValue,
    defaultValue,
    onChange,
    onCommit,
    min = 0,
    max = 100,
    step = 1,
    minStepsBetween = 0,
    bigStep,
    labels = ['Minimum value', 'Maximum value'],
    marks = [],
    valueText,
    disabled: unavailable = false,
    name,
    className,
    style,
    dir,
    id,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    onInput,
    onKeyDown,
    onFocus,
    ...inputProps
  },
  forwardedRef
) {
  const [localValue, setLocalValue] = useState(defaultValue)
  const initialValue = useRef(controlledValue ?? defaultValue)
  const bounds = sliderBounds(min, max, step, minStepsBetween)
  const value = sliderValue(
    controlledValue === undefined ? localValue : controlledValue,
    bounds
  )
  const values = Array.isArray(value) ? value : [value]
  const range = values.length === 2
  const disabled = unavailable || bounds.min === bounds.max
  const root = useRef(null)
  const inputs = useRef([])
  const thumbMeasure = useRef(null)
  const gesture = useRef()
  const latest = useRef()
  const [dragging, setDragging] = useState(false)
  const [lastIndex, setLastIndex] = useState(0)
  const [thumbSize, setThumbSize] = useState(20)
  latest.current = {
    value,
    values,
    bounds,
    onChange,
    onCommit,
    controlledValue
  }
  function publish(next) {
    if (controlledValue === undefined) setLocalValue(next)
    onChange?.(next)
    return next
  }
  function measureThumb() {
    const width = thumbMeasure.current?.getBoundingClientRect().width
    if (Number.isFinite(width) && width > 0) setThumbSize(width)
    return Number.isFinite(width) && width > 0 ? width : thumbSize
  }
  useEffect(() => {
    measureThumb()
    const observer = new ResizeObserver(measureThumb)
    observer.observe(root.current)
    observer.observe(thumbMeasure.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    measureThumb()
  }, [className, style])
  useEffect(() => {
    const elements = inputs.current.filter(Boolean)
    const commit = () => latest.current.onCommit?.(latest.current.value)
    elements.forEach((element) => element.addEventListener('change', commit))
    return () =>
      elements.forEach((element) =>
        element.removeEventListener('change', commit)
      )
  }, [range])
  useEffect(() => {
    const form = inputs.current[0]?.form
    function reset(event) {
      queueMicrotask(() => {
        if (event.defaultPrevented) return
        const current = latest.current
        const next = sliderValue(initialValue.current, current.bounds)
        if (current.controlledValue === undefined) setLocalValue(next)
        current.onChange?.(next)
        // Controlled callers may reject reset; keep the DOM authoritative too.
        queueMicrotask(() =>
          inputs.current.forEach((input, index) => {
            if (input) input.value = latest.current.values[index]
          })
        )
      })
    }
    form?.addEventListener('reset', reset)
    return () => form?.removeEventListener('reset', reset)
  }, [inputProps.form])
  function limits(index) {
    return {
      min: index === 1 ? values[0] + bounds.gap : bounds.min,
      max: range && index === 0 ? values[1] - bounds.gap : bounds.max
    }
  }
  function rtl() {
    return getComputedStyle(root.current).direction === 'rtl'
  }
  function pointerValue(event) {
    const measuredWidth = measureThumb()
    const rect = root.current.getBoundingClientRect()
    const fraction = Math.max(
      0,
      Math.min(
        1,
        (event.clientX - rect.left - measuredWidth / 2) /
          Math.max(1, rect.width - measuredWidth)
      )
    )
    return (
      bounds.min + (rtl() ? 1 - fraction : fraction) * (bounds.max - bounds.min)
    )
  }
  function pointerDown(event) {
    if (
      disabled ||
      inputs.current[0]?.matches(':disabled') ||
      event.button !== 0 ||
      event.isPrimary === false
    )
      return
    event.preventDefault()
    const candidate = pointerValue(event)
    const distances = values.map((item) => Math.abs(item - candidate))
    const index = range
      ? distances[0] === distances[1]
        ? candidate < values[0]
          ? 0
          : candidate > values[1]
            ? 1
            : lastIndex === 0
              ? 1
              : 0
        : distances[0] < distances[1]
          ? 0
          : 1
      : 0
    setLastIndex(index)
    inputs.current[index]?.focus()
    gesture.current = { id: event.pointerId, index, start: value, next: value }
    root.current.setPointerCapture?.(event.pointerId)
    setDragging(true)
    pointerMove(event)
  }
  function pointerMove(event) {
    const active = gesture.current
    if (!active || active.id !== event.pointerId) return
    if (disabled || inputs.current[active.index]?.matches(':disabled')) {
      gesture.current = undefined
      setDragging(false)
      if (root.current.hasPointerCapture?.(active.id))
        root.current.releasePointerCapture(active.id)
      return
    }
    active.next = moveSlider(value, active.index, pointerValue(event), bounds)
    publish(active.next)
  }
  function endPointer(event, cancelled = false) {
    const active = gesture.current
    if (!active || active.id !== event.pointerId) return
    gesture.current = undefined
    setDragging(false)
    if (root.current.hasPointerCapture?.(event.pointerId))
      root.current.releasePointerCapture(event.pointerId)
    if (disabled || inputs.current[active.index]?.matches(':disabled')) return
    if (cancelled) publish(active.start)
    else onCommit?.(active.next)
  }
  function keydown(event, index) {
    onKeyDown?.(event)
    if (event.defaultPrevented || disabled || event.target.matches(':disabled'))
      return
    if (
      !event.shiftKey &&
      !['PageUp', 'PageDown', 'Home', 'End'].includes(event.key)
    )
      return
    const limit = limits(index)
    const increment =
      bigStep ??
      (bounds.step === 'any'
        ? (bounds.max - bounds.min) / 10
        : bounds.step * 10)
    const candidate = sliderKey(
      event.key,
      values[index],
      limit.min,
      limit.max,
      increment,
      rtl()
    )
    if (candidate === undefined) return
    event.preventDefault()
    const next = publish(moveSlider(value, index, candidate, bounds))
    onCommit?.(next)
  }
  function input(event, index) {
    onInput?.(event)
    if (event.defaultPrevented) return
    const next = moveSlider(value, index, event.target.valueAsNumber, bounds)
    event.target.value = Array.isArray(next) ? next[index] : next
    publish(next)
    const target = event.target
    queueMicrotask(() => {
      target.value = latest.current.values[index]
    })
  }
  const ticks = marks
    .map((mark) => (typeof mark === 'number' ? { value: mark } : mark))
    .filter(
      (mark) =>
        Number.isFinite(mark.value) &&
        mark.value >= bounds.min &&
        mark.value <= bounds.max
    )
  const start = range ? sliderPercent(values[0], bounds) : 0
  return (
    <span
      ref={root}
      data-slot="slider"
      className={twMerge(
        'relative block h-11 w-full touch-pan-y select-none text-gray-950 dark:text-white data-disabled:cursor-not-allowed data-disabled:opacity-40 [--thumb-size:1.25rem]',
        className
      )}
      style={style}
      dir={dir}
      role={range ? 'group' : undefined}
      aria-label={range ? label : undefined}
      aria-labelledby={range ? labelledBy : undefined}
      data-disabled={disabled || undefined}
      data-dragging={dragging || undefined}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={endPointer}
      onPointerCancel={(event) => endPointer(event, true)}
      onLostPointerCapture={(event) => endPointer(event, true)}
    >
      <span
        aria-hidden="true"
        data-slot="slider-track"
        className="pointer-events-none absolute inset-x-2.5 top-1/2 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700"
        style={{
          insetInline: 'calc(var(--thumb-size) / 2)',
          transform: 'translateY(-50%)',
          translate: 'none'
        }}
      >
        <span
          data-slot="slider-fill"
          className="absolute h-full rounded-full bg-current"
          style={{
            insetInlineStart: `${start}%`,
            width: `${sliderPercent(values.at(-1), bounds) - start}%`
          }}
        />
        {ticks.map((mark) => (
          <span
            key={mark.value}
            data-slot="slider-mark"
            className="absolute top-1/2 size-1 rounded-full bg-white/65 dark:bg-gray-950/65"
            style={{
              insetInlineStart: `${sliderPercent(mark.value, bounds)}%`,
              transform:
                'translate(calc(-50% * var(--slider-direction, 1)), -50%)',
              translate: 'none'
            }}
          />
        ))}
      </span>
      <span
        ref={thumbMeasure}
        aria-hidden="true"
        className="pointer-events-none invisible absolute h-0"
        style={{ width: 'var(--thumb-size)' }}
      />
      {values.map((item, index) => (
        <input
          key={index}
          {...inputProps}
          ref={(element) => {
            inputs.current[index] = element
            if (index === 0) {
              if (typeof forwardedRef === 'function') forwardedRef(element)
              else if (forwardedRef) forwardedRef.current = element
            }
          }}
          type="range"
          data-slot="slider-thumb"
          data-index={index}
          id={index === 0 ? id : id ? `${id}-end` : undefined}
          name={Array.isArray(name) ? name[index] : name}
          disabled={disabled}
          min={bounds.min}
          max={bounds.max}
          step={bounds.step}
          value={item}
          aria-label={
            range
              ? labels[index] || (index ? 'Maximum value' : 'Minimum value')
              : label
          }
          aria-labelledby={range ? undefined : labelledBy}
          aria-valuemin={limits(index).min}
          aria-valuemax={limits(index).max}
          aria-valuetext={valueText?.(item, index)}
          style={{ zIndex: index === lastIndex ? 2 : 1 }}
          className="klean-slider-input absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed"
          onChange={(event) => input(event, index)}
          onKeyDown={(event) => keydown(event, index)}
          onFocus={(event) => {
            setLastIndex(index)
            onFocus?.(event)
          }}
        />
      ))}
      {ticks
        .filter((mark) => mark.label !== undefined)
        .map((mark) => (
          <span
            key={`label-${mark.value}`}
            data-slot="slider-mark-label"
            className="pointer-events-none absolute top-full -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 rtl:translate-x-1/2"
            style={{
              insetInlineStart: `calc(${thumbSize / 2}px + (100% - ${thumbSize}px) * ${sliderPercent(mark.value, bounds) / 100})`
            }}
          >
            {mark.label}
          </span>
        ))}
    </span>
  )
})

export default Slider
