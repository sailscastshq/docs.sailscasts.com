import {
  arrow as floatingArrow,
  autoUpdate,
  computePosition,
  flip,
  offset as floatingOffset,
  shift
} from '@floating-ui/dom'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const BASE_CLASSES = [
  'pointer-events-none z-50 m-0 w-max max-w-[calc(100vw-1rem)] overflow-visible rounded-md border border-gray-950 bg-gray-950 px-2.5 py-1.5 text-xs font-medium leading-none text-white shadow-md outline-none',
  'transition-opacity duration-100 starting:opacity-0 motion-reduce:transition-none',
  'dark:border-white dark:bg-white dark:text-gray-950',
  'forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:text-[CanvasText]'
]
const OPEN_DELAY = 400
const CLOSE_DELAY = 80
const ARROW_OVERHANG = 8
const ARROW_CLIP_PATHS = {
  top: 'polygon(0 0, 100% 0, 50% 100%)',
  right: 'polygon(100% 0, 0 50%, 100% 100%)',
  bottom: 'polygon(50% 0, 100% 100%, 0 100%)',
  left: 'polygon(0 0, 100% 50%, 0 100%)'
}
let closeActiveTooltip

function descriptionTokens(element) {
  return (element?.getAttribute('aria-describedby') ?? '')
    .split(/\s+/)
    .filter(Boolean)
}

export default function Tooltip({
  text,
  placement = 'top',
  offset = 8,
  className,
  style,
  children,
  ...contentProps
}) {
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const tooltipId = `klean-tooltip-${generatedId}`
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const contentRef = useRef(null)
  const arrowRef = useRef(null)
  const openTimer = useRef()
  const closeTimer = useRef()
  const cleanupPosition = useRef(() => {})
  const lastTouchAt = useRef(0)
  const [isOpen, setIsOpen] = useState(false)
  const [supportsNative, setSupportsNative] = useState(false)
  const [resolvedPlacement, setResolvedPlacement] = useState(placement)
  const [positionStyle, setPositionStyle] = useState({
    position: 'fixed',
    left: 0,
    top: 0
  })
  const [arrowStyle, setArrowStyle] = useState({})

  const removeDescription = useCallback(
    (element) => {
      if (!element) return
      const tokens = descriptionTokens(element).filter(
        (token) => token !== tooltipId
      )
      if (tokens.length) {
        element.setAttribute('aria-describedby', tokens.join(' '))
      } else {
        element.removeAttribute('aria-describedby')
      }
    },
    [tooltipId]
  )

  const syncTrigger = useCallback(() => {
    const nextTrigger = rootRef.current?.firstElementChild
    if (nextTrigger === triggerRef.current) return triggerRef.current

    removeDescription(triggerRef.current)
    triggerRef.current = nextTrigger
    if (nextTrigger) {
      const tokens = new Set(descriptionTokens(nextTrigger))
      tokens.add(tooltipId)
      nextTrigger.setAttribute('aria-describedby', [...tokens].join(' '))
    }
    return nextTrigger
  }, [removeDescription, tooltipId])

  const closeNow = useCallback(() => {
    clearTimeout(openTimer.current)
    clearTimeout(closeTimer.current)
    cleanupPosition.current()
    cleanupPosition.current = () => {}
    setIsOpen(false)
    if (closeActiveTooltip === closeNow) closeActiveTooltip = undefined
  }, [])

  const openNow = useCallback(() => {
    clearTimeout(openTimer.current)
    clearTimeout(closeTimer.current)
    const trigger = syncTrigger()
    if (!trigger || !text) return

    if (closeActiveTooltip && closeActiveTooltip !== closeNow) {
      closeActiveTooltip()
    }
    closeActiveTooltip = closeNow
    setIsOpen(true)
  }, [closeNow, syncTrigger, text])

  const scheduleOpen = useCallback(() => {
    clearTimeout(closeTimer.current)
    if (isOpen) return
    clearTimeout(openTimer.current)
    openTimer.current = setTimeout(openNow, OPEN_DELAY)
  }, [isOpen, openNow])

  const scheduleClose = useCallback(() => {
    clearTimeout(openTimer.current)
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(closeNow, CLOSE_DELAY)
  }, [closeNow])

  useEffect(() => {
    setSupportsNative(
      typeof contentRef.current?.showPopover === 'function' &&
        typeof contentRef.current?.hidePopover === 'function'
    )
    syncTrigger()

    const observer = new MutationObserver(syncTrigger)
    observer.observe(rootRef.current, { childList: true })
    return () => {
      observer.disconnect()
      removeDescription(triggerRef.current)
      closeNow()
    }
  }, [closeNow, removeDescription, syncTrigger])

  useEffect(() => {
    const content = contentRef.current
    const trigger = triggerRef.current
    if (!content) return

    if (supportsNative) {
      let showing = false
      try {
        showing = content.matches(':popover-open')
        if (isOpen && !showing) content.showPopover({ source: trigger })
        else if (!isOpen && showing) content.hidePopover()
      } catch {
        // Rapid pointer and focus changes can make requests redundant.
      }
    }

    cleanupPosition.current()
    cleanupPosition.current = () => {}
    if (!isOpen || !trigger?.isConnected || !content.isConnected) return

    const updatePosition = async () => {
      if (!trigger.isConnected || !content.isConnected) {
        closeNow()
        return
      }

      const result = await computePosition(trigger, content, {
        placement,
        strategy: 'fixed',
        middleware: [
          floatingOffset(offset),
          flip(),
          shift({ padding: 8 }),
          floatingArrow({ element: arrowRef.current, padding: 6 })
        ]
      })
      const side = result.placement.split('-')[0]
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      }[side]
      const arrowData = result.middlewareData.arrow ?? {}

      setResolvedPlacement(result.placement)
      setPositionStyle({ position: 'fixed', left: result.x, top: result.y })
      setArrowStyle({
        left: arrowData.x == null ? '' : arrowData.x,
        top: arrowData.y == null ? '' : arrowData.y,
        right: '',
        bottom: '',
        clipPath: ARROW_CLIP_PATHS[side],
        [staticSide]: -ARROW_OVERHANG
      })
    }

    cleanupPosition.current = autoUpdate(trigger, content, updatePosition)
    return () => {
      cleanupPosition.current()
      cleanupPosition.current = () => {}
    }
  }, [closeNow, isOpen, offset, placement, supportsNative])

  useEffect(() => {
    if (!isOpen) return

    function handleEscape(event) {
      if (event.key !== 'Escape') return
      event.preventDefault()
      closeNow()
    }

    function handleContextChange(event) {
      const path = event.composedPath?.() ?? [event.target]
      if (
        path.includes(triggerRef.current) ||
        path.includes(contentRef.current)
      ) {
        return
      }
      closeNow()
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('pointerdown', handleContextChange, true)
    window.addEventListener('blur', closeNow)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('pointerdown', handleContextChange, true)
      window.removeEventListener('blur', closeNow)
    }
  }, [closeNow, isOpen])

  function handlePointerOver(event) {
    if (event.pointerType === 'touch') return
    if (contentRef.current?.contains(event.target)) {
      clearTimeout(closeTimer.current)
      return
    }
    scheduleOpen()
  }

  function handlePointerOut(event) {
    if (
      rootRef.current?.contains(event.relatedTarget) ||
      contentRef.current?.contains(event.relatedTarget)
    ) {
      return
    }
    scheduleClose()
  }

  function handlePointerDown(event) {
    if (event.pointerType !== 'touch') return
    lastTouchAt.current = Date.now()
    closeNow()
  }

  function handleFocusIn() {
    if (Date.now() - lastTouchAt.current < 1000) return
    scheduleOpen()
  }

  function handleFocusOut(event) {
    if (rootRef.current?.contains(event.relatedTarget)) return
    scheduleClose()
  }

  return (
    <span
      ref={rootRef}
      role="presentation"
      className="contents"
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
    >
      {children}
      <div
        {...contentProps}
        id={tooltipId}
        ref={contentRef}
        popover="hint"
        role="tooltip"
        data-slot="tooltip"
        data-state={isOpen ? 'open' : 'closed'}
        data-placement={resolvedPlacement}
        hidden={!supportsNative && !isOpen}
        className={twMerge(BASE_CLASSES, className)}
        style={{ ...positionStyle, ...style }}
        onToggle={(event) => {
          if (event.newState === 'closed' && isOpen) setIsOpen(false)
          contentProps.onToggle?.(event)
        }}
      >
        {text}
        <span
          ref={arrowRef}
          aria-hidden="true"
          data-slot="tooltip-arrow"
          className="pointer-events-none absolute size-3 bg-inherit forced-colors:hidden"
          style={arrowStyle}
        />
      </div>
    </span>
  )
}
