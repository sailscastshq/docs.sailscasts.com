import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const Spinner = forwardRef(function Spinner(
  {
    children,
    className,
    'aria-hidden': _ariaHidden,
    role: _role,
    focusable: _focusable,
    tabIndex: _tabIndex,
    'data-slot': _dataSlot,
    ...props
  },
  ref
) {
  return (
    <span
      {...props}
      ref={ref}
      data-slot="spinner"
      aria-hidden="true"
      className={twMerge(
        [
          'inline-flex size-4 shrink-0 items-center justify-center motion-reduce:animate-none! motion-reduce:**:animate-none! *:size-full',
          children ? '' : 'animate-spin'
        ],
        className
      )}
    >
      {children ?? (
        <svg
          data-slot="spinner-mark"
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.2"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  )
})

export default Spinner
