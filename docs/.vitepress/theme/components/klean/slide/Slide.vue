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

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Prevents pointer and native button activation. */
  disabled: { type: Boolean, default: false },
  /** Truthful caller-owned action state. Also prevents duplicate confirmation. */
  pending: { type: Boolean, default: false }
})

const emit = defineEmits(['confirm'])
const attrs = useAttrs()
const button = ref()
const thumb = ref()
const progress = ref(0)
const travel = ref(0)
const direction = ref(1)
const pointerId = ref()
const startX = ref(0)
const startProgress = ref(0)
const confirmed = ref(false)
const status = ref('')
let suppressClick = false
let resizeObserver

const CONFIRM_THRESHOLD = 0.85

const baseClasses = [
  'group/slide relative inline-grid min-h-11 w-56 max-w-full touch-none cursor-grab select-none overflow-hidden rounded-full border border-gray-300 bg-gray-100 p-1 text-sm font-medium text-gray-700 shadow-sm outline-none',
  'focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus-visible:ring-white'
]

const fillClasses = [
  'pointer-events-none absolute inset-y-0 inset-s-0 bg-gray-200',
  'transition-[width,background-color] duration-200 ease-out group-data-[state=dragging]/slide:transition-none motion-reduce:transition-none',
  'dark:bg-gray-800'
]

const thumbClasses = [
  'pointer-events-none absolute top-1 inset-s-1 z-20 flex size-9 items-center justify-center rounded-full bg-gray-950 text-white shadow-sm',
  'transition-[transform,background-color,color] duration-200 ease-out group-data-[state=dragging]/slide:transition-none motion-reduce:transition-none',
  'dark:bg-white dark:text-gray-950'
]

const isDragging = computed(() => pointerId.value !== undefined)
const isReady = computed(() => progress.value >= CONFIRM_THRESHOLD)
const state = computed(() =>
  props.pending
    ? 'pending'
    : isDragging.value
      ? 'dragging'
      : confirmed.value
        ? 'confirmed'
        : 'idle'
)
const progressState = computed(() => {
  if (props.pending || confirmed.value) return 'complete'
  if (progress.value >= CONFIRM_THRESHOLD) return 'ready'
  if (progress.value >= 0.33) return 'middle'
  return 'start'
})
const buttonClasses = computed(() => twMerge(baseClasses, attrs.class))
const buttonAttrs = computed(() => {
  const {
    class: _class,
    type: _type,
    disabled: _disabled,
    'aria-busy': _ariaBusy,
    'data-slot': _dataSlot,
    'data-state': _dataState,
    'data-progress': _dataProgress,
    onClick: _onClick,
    onKeydown: _onKeydown,
    onKeyDown: _onKeyDown,
    onPointerdown: _onPointerdown,
    onPointerDown: _onPointerDown,
    onPointermove: _onPointermove,
    onPointerMove: _onPointerMove,
    onPointerup: _onPointerup,
    onPointerUp: _onPointerUp,
    onPointercancel: _onPointercancel,
    onPointerCancel: _onPointerCancel,
    onLostpointercapture: _onLostPointercapture,
    onLostPointerCapture: _onLostPointerCapture,
    ...rest
  } = attrs

  return rest
})
const thumbStyle = computed(() => ({
  transform: `translateX(${direction.value * progress.value * travel.value}px)`
}))
const fillStyle = computed(() => ({ width: `${progress.value * 100}%` }))

function callListener(listener, event) {
  for (const callback of Array.isArray(listener) ? listener : [listener]) {
    callback?.(event)
  }
}

function measure() {
  if (!button.value || !thumb.value || typeof getComputedStyle === 'undefined')
    return

  const buttonStyle = getComputedStyle(button.value)
  const thumbStyle = getComputedStyle(thumb.value)
  const inlineStart = Number.parseFloat(thumbStyle.insetInlineStart) || 0

  direction.value =
    button.value.dir === 'rtl' || buttonStyle.direction === 'rtl' ? -1 : 1
  travel.value = Math.max(
    0,
    button.value.clientWidth - thumb.value.offsetWidth - inlineStart * 2
  )
}

function setProgress(nextProgress) {
  const wasReady = isReady.value
  progress.value = Math.max(0, Math.min(1, nextProgress))

  if (!wasReady && isReady.value) status.value = 'Release to confirm.'
  else if (wasReady && !isReady.value) status.value = 'Keep sliding.'
}

function clearPointer(releaseCapture = true) {
  const activePointer = pointerId.value
  pointerId.value = undefined

  if (
    releaseCapture &&
    activePointer !== undefined &&
    button.value?.hasPointerCapture?.(activePointer)
  ) {
    button.value.releasePointerCapture(activePointer)
  }
}

function reset(nextStatus = '') {
  clearPointer()
  confirmed.value = false
  progress.value = 0
  status.value = nextStatus
}

function cancel() {
  if (!isDragging.value) return
  reset('Slide cancelled.')
}

function confirm() {
  if (props.disabled || props.pending || confirmed.value) return

  clearPointer()
  confirmed.value = true
  progress.value = 1
  status.value = 'Confirmed.'
  emit('confirm')

  nextTick(() => {
    if (!props.pending) reset()
  })
}

function handlePointerdown(event) {
  callListener(attrs.onPointerdown ?? attrs.onPointerDown, event)
  if (
    event.defaultPrevented ||
    props.disabled ||
    props.pending ||
    !event.isPrimary ||
    (event.pointerType === 'mouse' && event.button !== 0)
  ) {
    return
  }

  event.preventDefault()
  button.value?.focus({ preventScroll: true })
  measure()
  confirmed.value = false
  pointerId.value = event.pointerId
  startX.value = event.clientX
  startProgress.value = progress.value
  status.value = 'Sliding. Move to the end, then release to confirm.'
  button.value?.setPointerCapture?.(event.pointerId)
}

function handlePointermove(event) {
  callListener(attrs.onPointermove ?? attrs.onPointerMove, event)
  if (event.pointerId !== pointerId.value || event.defaultPrevented) return

  event.preventDefault()
  measure()
  const delta = direction.value * (event.clientX - startX.value)
  setProgress(startProgress.value + (travel.value ? delta / travel.value : 0))
}

function handlePointerup(event) {
  callListener(attrs.onPointerup ?? attrs.onPointerUp, event)
  if (event.pointerId !== pointerId.value) return

  suppressClick = true
  queueMicrotask(() => {
    suppressClick = false
  })
  if (isReady.value && !event.defaultPrevented) confirm()
  else reset('Slide cancelled.')
}

function handlePointercancel(event) {
  callListener(attrs.onPointercancel ?? attrs.onPointerCancel, event)
  if (event.pointerId === pointerId.value) reset('Slide cancelled.')
}

function handleLostPointercapture(event) {
  callListener(attrs.onLostpointercapture ?? attrs.onLostPointerCapture, event)
  if (event.pointerId === pointerId.value) reset('Slide cancelled.')
}

function handleClick(event) {
  if (suppressClick) {
    suppressClick = false
    event.preventDefault()
    return
  }

  if (event.detail !== 0) {
    event.preventDefault()
    return
  }

  callListener(attrs.onClick, event)
  if (!event.defaultPrevented) confirm()
}

function handleKeydown(event) {
  callListener(attrs.onKeydown ?? attrs.onKeyDown, event)
  if (event.defaultPrevented || event.key !== 'Escape') return

  cancel()
}

watch(
  () => props.pending,
  (pending, wasPending) => {
    if (pending) {
      clearPointer()
      confirmed.value = true
      progress.value = 1
      status.value = 'Action in progress.'
    } else if (wasPending) {
      reset()
    }
  },
  { immediate: true }
)

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) cancel()
  }
)

onMounted(() => {
  measure()
  if (typeof ResizeObserver === 'undefined') return

  resizeObserver = new ResizeObserver(measure)
  if (button.value) resizeObserver.observe(button.value)
  if (thumb.value) resizeObserver.observe(thumb.value)
})

onBeforeUnmount(() => {
  clearPointer()
  resizeObserver?.disconnect()
})
</script>

<template>
  <button
    ref="button"
    v-bind="buttonAttrs"
    type="button"
    :disabled="disabled || pending"
    :aria-busy="pending ? 'true' : attrs['aria-busy']"
    data-slot="slide"
    :data-state="state"
    :data-progress="progressState"
    :class="buttonClasses"
    @click="handleClick"
    @keydown="handleKeydown"
    @pointerdown="handlePointerdown"
    @pointermove="handlePointermove"
    @pointerup="handlePointerup"
    @pointercancel="handlePointercancel"
    @lostpointercapture="handleLostPointercapture"
  >
    <span
      aria-hidden="true"
      data-slot="slide-fill"
      :class="fillClasses"
      :style="fillStyle"
    />
    <span
      data-slot="slide-label"
      class="pointer-events-none relative z-10 flex min-w-0 items-center justify-center px-11 text-center"
    >
      <span v-if="isReady && !pending">Release to confirm</span>
      <slot v-else />
    </span>
    <span
      ref="thumb"
      aria-hidden="true"
      data-slot="slide-thumb"
      :class="thumbClasses"
      :style="thumbStyle"
    >
      <svg
        class="size-4 rtl:rotate-180"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="m9 5 7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span data-slot="slide-status" class="sr-only" aria-live="polite">
      {{ status }}
    </span>
  </button>
</template>
