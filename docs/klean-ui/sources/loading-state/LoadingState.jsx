import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const BASE_CLASSES =
  'flex min-h-32 w-full flex-col items-center justify-center gap-3 p-6 text-center text-gray-600 dark:text-gray-300'

const LoadingState = forwardRef(function LoadingState(
  {
    className,
    role: _role,
    'aria-live': _ariaLive,
    'aria-atomic': _ariaAtomic,
    'data-slot': _dataSlot,
    ...props
  },
  ref
) {
  return (
    <div
      {...props}
      ref={ref}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-slot="loading-state"
      className={twMerge(BASE_CLASSES, className)}
    />
  )
})

export default LoadingState
