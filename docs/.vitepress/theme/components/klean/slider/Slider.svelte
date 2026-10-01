<script>
  import { onMount, tick, untrack } from 'svelte'
  import { twMerge } from 'tailwind-merge'
  import {
    moveSlider,
    sliderBounds,
    sliderKey,
    sliderPercent,
    sliderValue
  } from './slider.js'

  let {
    value = $bindable(),
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
    class: className = '',
    style,
    dir,
    id,
    'aria-label': label,
    'aria-labelledby': labelledBy,
    onchange,
    oncommit,
    oninput,
    onkeydown,
    onfocus,
    ...inputProps
  } = $props()
  let root = $state()
  let thumbMeasure = $state()
  let inputs = $state([])
  let thumbSize = $state(20)
  let dragging = $state(false)
  let lastIndex = $state(0)
  let gesture
  const initialValue = untrack(() =>
    Array.isArray(value) ? [...value] : value
  )
  let bounds = $derived(sliderBounds(min, max, step, minStepsBetween))
  let current = $derived(sliderValue(value, bounds))
  let values = $derived(Array.isArray(current) ? current : [current])
  let range = $derived(values.length === 2)
  let disabled = $derived(unavailable || bounds.min === bounds.max)
  let start = $derived(range ? sliderPercent(values[0], bounds) : 0)
  let ticks = $derived(
    marks
      .map((mark) => (typeof mark === 'number' ? { value: mark } : mark))
      .filter(
        (mark) =>
          Number.isFinite(mark.value) &&
          mark.value >= bounds.min &&
          mark.value <= bounds.max
      )
  )
  function publish(next) {
    value = next
    onchange?.(next)
    return next
  }
  function measureThumb() {
    const width = thumbMeasure?.getBoundingClientRect().width
    if (Number.isFinite(width) && width > 0) thumbSize = width
  }
  onMount(() => {
    measureThumb()
    const observer = new ResizeObserver(measureThumb)
    observer.observe(root)
    observer.observe(thumbMeasure)
    return () => observer.disconnect()
  })
  $effect(() => {
    className
    style
    tick().then(measureThumb)
  })
  $effect(() => {
    inputProps.form
    const form = inputs[0]?.form
    function reset(event) {
      queueMicrotask(() => {
        if (event.defaultPrevented) return
        publish(sliderValue(initialValue, bounds))
        tick().then(() =>
          inputs.forEach((input, index) => {
            if (input) input.value = values[index]
          })
        )
      })
    }
    form?.addEventListener('reset', reset)
    return () => form?.removeEventListener('reset', reset)
  })
  function limits(index) {
    return {
      min: index === 1 ? values[0] + bounds.gap : bounds.min,
      max: range && index === 0 ? values[1] - bounds.gap : bounds.max
    }
  }
  function rtl() {
    return getComputedStyle(root).direction === 'rtl'
  }
  function pointerValue(event) {
    measureThumb()
    const rect = root.getBoundingClientRect()
    const fraction = Math.max(
      0,
      Math.min(
        1,
        (event.clientX - rect.left - thumbSize / 2) /
          Math.max(1, rect.width - thumbSize)
      )
    )
    return (
      bounds.min + (rtl() ? 1 - fraction : fraction) * (bounds.max - bounds.min)
    )
  }
  function pointerDown(event) {
    if (
      disabled ||
      inputs[0]?.matches(':disabled') ||
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
    lastIndex = index
    inputs[index]?.focus()
    gesture = { id: event.pointerId, index, start: current, next: current }
    root.setPointerCapture?.(event.pointerId)
    dragging = true
    pointerMove(event)
  }
  function pointerMove(event) {
    if (!gesture || gesture.id !== event.pointerId) return
    if (disabled || inputs[gesture.index]?.matches(':disabled')) {
      const id = gesture.id
      gesture = undefined
      dragging = false
      if (root.hasPointerCapture?.(id)) root.releasePointerCapture(id)
      return
    }
    gesture.next = moveSlider(
      current,
      gesture.index,
      pointerValue(event),
      bounds
    )
    publish(gesture.next)
  }
  function endPointer(event, cancelled = false) {
    if (!gesture || gesture.id !== event.pointerId) return
    const finished = gesture
    gesture = undefined
    dragging = false
    if (root.hasPointerCapture?.(event.pointerId))
      root.releasePointerCapture(event.pointerId)
    if (disabled || inputs[finished.index]?.matches(':disabled')) return
    if (cancelled) publish(finished.start)
    else oncommit?.(finished.next)
  }
  function keydown(event, index) {
    onkeydown?.(event)
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
    const next = publish(moveSlider(current, index, candidate, bounds))
    oncommit?.(next)
  }
  function input(event, index) {
    oninput?.(event)
    if (event.defaultPrevented) return
    publish(moveSlider(current, index, event.target.valueAsNumber, bounds))
    tick().then(() => {
      event.target.value = values[index]
    })
  }
</script>

<!-- Pointer handling complements the native, labelled range inputs; this wrapper is not a separate control. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
  bind:this={root}
  data-slot="slider"
  class={twMerge(
    'relative block h-11 w-full touch-pan-y select-none text-gray-950 dark:text-white data-disabled:cursor-not-allowed data-disabled:opacity-40 [--thumb-size:1.25rem]',
    className
  )}
  {style}
  {dir}
  role={range ? 'group' : undefined}
  aria-label={range ? label : undefined}
  aria-labelledby={range ? labelledBy : undefined}
  data-disabled={disabled || undefined}
  data-dragging={dragging || undefined}
  onpointerdown={pointerDown}
  onpointermove={pointerMove}
  onpointerup={endPointer}
  onpointercancel={(event) => endPointer(event, true)}
  onlostpointercapture={(event) => endPointer(event, true)}
>
  <span
    aria-hidden="true"
    data-slot="slider-track"
    class="pointer-events-none absolute inset-x-2.5 top-1/2 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700"
    style="inset-inline: calc(var(--thumb-size) / 2); transform: translateY(-50%); translate: none"
  >
    <span
      data-slot="slider-fill"
      class="absolute h-full rounded-full bg-current"
      style:inset-inline-start={`${start}%`}
      style:width={`${sliderPercent(values.at(-1), bounds) - start}%`}
    ></span>
    {#each ticks as mark (mark.value)}
      <span
        data-slot="slider-mark"
        class="absolute top-1/2 size-1 rounded-full bg-white/65 dark:bg-gray-950/65"
        style:inset-inline-start={`${sliderPercent(mark.value, bounds)}%`}
        style="transform: translate(calc(-50% * var(--slider-direction, 1)), -50%); translate: none"
      ></span>
    {/each}
  </span>
  <span
    bind:this={thumbMeasure}
    aria-hidden="true"
    class="pointer-events-none invisible absolute h-0"
    style="width: var(--thumb-size)"
  ></span>
  {#each values as item, index (index)}
    <input
      {...inputProps}
      bind:this={inputs[index]}
      type="range"
      data-slot="slider-thumb"
      data-index={index}
      id={index === 0 ? id : id ? `${id}-end` : undefined}
      name={Array.isArray(name) ? name[index] : name}
      {disabled}
      min={bounds.min}
      max={bounds.max}
      step={bounds.step}
      value={item}
      aria-label={range
        ? labels[index] || (index ? 'Maximum value' : 'Minimum value')
        : label}
      aria-labelledby={range ? undefined : labelledBy}
      aria-valuemin={limits(index).min}
      aria-valuemax={limits(index).max}
      aria-valuetext={valueText?.(item, index)}
      style:z-index={index === lastIndex ? 2 : 1}
      class="klean-slider-input absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed"
      oninput={(event) => input(event, index)}
      onchange={() => oncommit?.(current)}
      onkeydown={(event) => keydown(event, index)}
      onfocus={(event) => {
        lastIndex = index
        onfocus?.(event)
      }}
    />
  {/each}
  {#each ticks.filter((mark) => mark.label !== undefined) as mark (mark.value)}
    <span
      data-slot="slider-mark-label"
      class="pointer-events-none absolute top-full -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 rtl:translate-x-1/2"
      style:inset-inline-start={`calc(${thumbSize / 2}px + (100% - ${thumbSize}px) * ${sliderPercent(mark.value, bounds) / 100})`}
      >{mark.label}</span
    >
  {/each}
</span>

<style>
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
