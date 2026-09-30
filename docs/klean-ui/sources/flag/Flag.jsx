import { forwardRef, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { flagSource } from './flags.js'

const BASE_CLASSES =
  'inline-flex aspect-3/2 w-6 shrink-0 items-center justify-center overflow-hidden bg-gray-100 object-cover select-none dark:bg-gray-800'

const Flag = forwardRef(function Flag(
  {
    country = '',
    src = '',
    alt = '',
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
  const [failedSource, setFailedSource] = useState(null)
  const imageSource = flagSource(country, src)
  const showImage = Boolean(imageSource) && failedSource !== imageSource
  const classes = twMerge(BASE_CLASSES, className)

  useEffect(() => {
    setFailedSource(null)
  }, [imageSource])

  function handleError(event) {
    setFailedSource(imageSource)
    onError?.(event)
  }

  function handleLoad(event) {
    setFailedSource(null)
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
        alt={alt}
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
    : alt
      ? { role: 'img', 'aria-label': alt }
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
