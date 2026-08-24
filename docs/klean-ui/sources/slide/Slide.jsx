import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const CONFIRM_THRESHOLD = 0.85

const BASE_CLASSES = [
  'group/slide relative inline-grid min-h-11 w-56 max-w-full touch-none cursor-grab select-none overflow-hidden rounded-full border border-gray-300 bg-gray-100 p-1 text-sm font-medium text-gray-700 shadow-sm outline-none',
  'focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus-visible:ring-white'
]

const FILL_CLASSES = [
  'pointer-events-none absolute inset-y-0 inset-s-0 bg-gray-200',
  'transition-[width,background-color] duration-200 ease-out group-data-[state=dragging]/slide:transition-none motion-reduce:transition-none',
  'dark:bg-gray-800'
]

const THUMB_CLASSES = [
  'pointer-events-none absolute top-1 inset-s-1 z-20 flex size-9 items-center justify-center rounded-full bg-gray-950 text-white shadow-sm',
  'transition-[transform,background-color,color] duration-200 ease-out group-data-[state=dragging]/slide:transition-none motion-reduce:transition-none',
  'dark:bg-white dark:text-gray-950'
]

const Slide = forwardRef(function Slide(
  {
    disabled = false,
    pending = false,
    className,
    children,
    thumb,
    onConfirm,
    onClick,
    onKeyDown,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onLostPointerCapture,
    'aria-busy': ariaBusy,
    ...buttonProps
  },
  forwardedRef
) {
  const buttonRef = useRef(null)
  const thumbRef = useRef(null)
  const activePointer = useRef()
  const startX = useRef(0)
  const startProgress = useRef(0)
  const progressRef = useRef(0)
  const travelRef = useRef(0)
  const directionRef = useRef(1)
  const confirmedRef = useRef(false)
  const suppressClick = useRef(false)
  const pendingRef = useRef(pending)
  const previousPending = useRef(pending)
  const [progress, setRenderedProgress] = useState(pending ? 1 : 0)
  const [travel, setTravel] = useState(0)
  const [direction, setDirection] = useState(1)
  const [confirmed, setConfirmed] = useState(pending)
  const [status, setStatus] = useState(pending ? 'Action in progress.' : '')

  pendingRef.current = pending

  const setRef = useCallback(
    (element) => {
      buttonRef.current = element
      if (typeof forwardedRef === 'function') forwardedRef(element)
      else if (forwardedRef) forwardedRef.current = element
    },
    [forwardedRef]
  )

  const setProgress = useCallback((nextProgress) => {
    const wasReady = progressRef.current >= CONFIRM_THRESHOLD
    const boundedProgress = Math.max(0, Math.min(1, nextProgress))
    progressRef.current = boundedProgress
    setRenderedProgress(boundedProgress)

    if (!wasReady && boundedProgress >= CONFIRM_THRESHOLD) {
      setStatus('Release to confirm.')
    } else if (wasReady && boundedProgress < CONFIRM_THRESHOLD) {
      setStatus('Keep sliding.')
    }
  }, [])

  const measure = useCallback(() => {
    const element = buttonRef.current
    const thumb = thumbRef.current
    if (!element || !thumb || typeof getComputedStyle === 'undefined') return

    const elementStyle = getComputedStyle(element)
    const thumbStyle = getComputedStyle(thumb)
    const inlineStart = Number.parseFloat(thumbStyle.insetInlineStart) || 0
    const nextDirection =
      element.dir === 'rtl' || elementStyle.direction === 'rtl' ? -1 : 1
    const nextTravel = Math.max(
      0,
      element.clientWidth - thumb.offsetWidth - inlineStart * 2
    )

    directionRef.current = nextDirection
    travelRef.current = nextTravel
    setDirection(nextDirection)
    setTravel(nextTravel)
  }, [])

  const clearPointer = useCallback((releaseCapture = true) => {
    const pointerId = activePointer.current
    activePointer.current = undefined

    if (
      releaseCapture &&
      pointerId !== undefined &&
      buttonRef.current?.hasPointerCapture?.(pointerId)
    ) {
      buttonRef.current.releasePointerCapture(pointerId)
    }
  }, [])

  const reset = useCallback(
    (nextStatus = '') => {
      clearPointer()
      confirmedRef.current = false
      setConfirmed(false)
      setProgress(0)
      setStatus(nextStatus)
    },
    [clearPointer, setProgress]
  )

  const cancel = useCallback(() => {
    if (activePointer.current === undefined) return
    reset('Slide cancelled.')
  }, [reset])

  const confirm = useCallback(() => {
    if (disabled || pending || confirmedRef.current) return

    clearPointer()
    confirmedRef.current = true
    setConfirmed(true)
    setProgress(1)
    setStatus('Confirmed.')
    onConfirm?.()

    queueMicrotask(() => {
      if (!pendingRef.current) reset()
    })
  }, [clearPointer, disabled, onConfirm, pending, reset, setProgress])

  useEffect(() => {
    measure()
    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(measure)
    if (buttonRef.current) observer.observe(buttonRef.current)
    if (thumbRef.current) observer.observe(thumbRef.current)

    return () => observer.disconnect()
  }, [measure])

  useEffect(() => {
    const wasPending = previousPending.current
    previousPending.current = pending

    if (pending) {
      clearPointer()
      confirmedRef.current = true
      setConfirmed(true)
      setProgress(1)
      setStatus('Action in progress.')
    } else if (wasPending) {
      reset()
    }
  }, [clearPointer, pending, reset, setProgress])

  useEffect(() => {
    if (disabled) cancel()
  }, [cancel, disabled])

  useEffect(() => () => clearPointer(), [clearPointer])

  function handlePointerDown(event) {
    onPointerDown?.(event)
    const nativeEvent = event.nativeEvent
    if (
      event.defaultPrevented ||
      disabled ||
      pending ||
      !nativeEvent.isPrimary ||
      (nativeEvent.pointerType === 'mouse' && nativeEvent.button !== 0)
    ) {
      return
    }

    event.preventDefault()
    buttonRef.current?.focus({ preventScroll: true })
    measure()
    confirmedRef.current = false
    setConfirmed(false)
    activePointer.current = nativeEvent.pointerId
    startX.current = nativeEvent.clientX
    startProgress.current = progressRef.current
    setStatus('Sliding. Move to the end, then release to confirm.')
    buttonRef.current?.setPointerCapture?.(nativeEvent.pointerId)
  }

  function handlePointerMove(event) {
    onPointerMove?.(event)
    const nativeEvent = event.nativeEvent
    if (
      nativeEvent.pointerId !== activePointer.current ||
      event.defaultPrevented
    ) {
      return
    }

    event.preventDefault()
    measure()
    const delta = directionRef.current * (nativeEvent.clientX - startX.current)
    setProgress(
      startProgress.current +
        (travelRef.current ? delta / travelRef.current : 0)
    )
  }

  function handlePointerUp(event) {
    onPointerUp?.(event)
    if (event.nativeEvent.pointerId !== activePointer.current) return

    suppressClick.current = true
    queueMicrotask(() => {
      suppressClick.current = false
    })
    if (progressRef.current >= CONFIRM_THRESHOLD && !event.defaultPrevented) {
      confirm()
    } else {
      reset('Slide cancelled.')
    }
  }

  function handlePointerCancel(event) {
    onPointerCancel?.(event)
    if (event.nativeEvent.pointerId === activePointer.current) {
      reset('Slide cancelled.')
    }
  }

  function handleLostPointerCapture(event) {
    onLostPointerCapture?.(event)
    if (event.nativeEvent.pointerId === activePointer.current) {
      reset('Slide cancelled.')
    }
  }

  function handleClick(event) {
    if (suppressClick.current) {
      suppressClick.current = false
      event.preventDefault()
      return
    }

    if (event.detail !== 0) {
      event.preventDefault()
      return
    }

    onClick?.(event)
    if (!event.defaultPrevented) confirm()
  }

  function handleKeyDown(event) {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.key !== 'Escape') return

    cancel()
  }

  const dragging = activePointer.current !== undefined
  const ready = progress >= CONFIRM_THRESHOLD
  const state = pending
    ? 'pending'
    : dragging
      ? 'dragging'
      : confirmed
        ? 'confirmed'
        : 'idle'
  const progressState =
    pending || confirmed
      ? 'complete'
      : ready
        ? 'ready'
        : progress >= 0.33
          ? 'middle'
          : 'start'
  const thumbContent =
    typeof thumb === 'function'
      ? thumb({ pending, progress: progressState })
      : thumb

  return (
    <button
      {...buttonProps}
      ref={setRef}
      type="button"
      disabled={disabled || pending}
      aria-busy={pending ? true : ariaBusy}
      data-slot="slide"
      data-state={state}
      data-progress={progressState}
      className={twMerge(BASE_CLASSES, className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
    >
      <span
        aria-hidden="true"
        data-slot="slide-fill"
        className={FILL_CLASSES.join(' ')}
        style={{ width: `${progress * 100}%` }}
      />
      <span
        data-slot="slide-label"
        className="pointer-events-none relative z-10 flex min-w-0 items-center justify-center px-11 text-center"
      >
        {ready && !pending ? 'Release to confirm' : children}
      </span>
      <span
        ref={thumbRef}
        aria-hidden="true"
        data-slot="slide-thumb"
        className={THUMB_CLASSES.join(' ')}
        style={{ transform: `translateX(${direction * progress * travel}px)` }}
      >
        {thumb === undefined ? (
          <svg
            className="size-4 rtl:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="m9 5 7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          thumbContent
        )}
      </span>
      <span data-slot="slide-status" className="sr-only" aria-live="polite">
        {status}
      </span>
    </button>
  )
})

export default Slide
