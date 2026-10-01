import { forwardRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { countryName, flagSource } from './flags.js'

const BASE_CLASSES =
  'inline-flex aspect-3/2 w-6 shrink-0 items-center justify-center overflow-hidden bg-gray-100 object-cover select-none dark:bg-gray-800'

const Flag = forwardRef(function Flag(
  {
    country = '',
    src = '',
    alt,
    children,
    className,
    onError,
    onLoad,
    'data-slot': _dataSlot,
    'data-state': _dataState,
    ...props
  },
  ref
) {
  const resolvedAlt =
    alt === undefined ? (src ? '' : countryName(country)) : alt
  const imageSource = flagSource(country, src)
  const [imageState, setImageState] = useState(() => ({
    source: imageSource,
    failed: false
  }))
  let currentImageState = imageState
  if (imageState.source !== imageSource) {
    currentImageState = { source: imageSource, failed: false }
    setImageState(currentImageState)
  }
  const showImage = Boolean(imageSource) && !currentImageState.failed
  const classes = twMerge(BASE_CLASSES, className)

  function handleError(event) {
    setImageState({ source: imageSource, failed: true })
    onError?.(event)
  }

  function handleLoad(event) {
    setImageState({ source: imageSource, failed: false })
    onLoad?.(event)
  }

  if (showImage) {
    return (
      <img
        {...props}
        ref={ref}
        data-slot="flag"
        data-state="image"
        src={imageSource}
        alt={resolvedAlt}
        className={classes}
        onError={handleError}
        onLoad={handleLoad}
      />
    )
  }

  const {
    loading: _loading,
    decoding: _decoding,
    crossOrigin: _crossOrigin,
    referrerPolicy: _referrerPolicy,
    fetchPriority: _fetchPriority,
    sizes: _sizes,
    srcSet: _srcSet,
    useMap: _useMap,
    isMap: _isMap,
    ...fallbackProps
  } = props
  const hasCallerFallbackSemantics =
    props.role !== undefined ||
    props['aria-label'] !== undefined ||
    props['aria-hidden'] !== undefined
  const fallbackSemantics = hasCallerFallbackSemantics
    ? {}
    : resolvedAlt
      ? { role: 'img', 'aria-label': resolvedAlt }
      : { 'aria-hidden': true }

  return (
    <span
      {...fallbackProps}
      {...fallbackSemantics}
      ref={ref}
      data-slot="flag"
      data-state="fallback"
      className={classes}
    >
      {children}
    </span>
  )
})

export default Flag
