import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const BASE_CLASSES =
  'flex min-h-48 w-full flex-col items-center justify-center gap-4 p-6 text-center text-gray-950 dark:text-white'

const EmptyState = forwardRef(function EmptyState(
  { as: Component = 'div', className, 'data-slot': _dataSlot, ...props },
  ref
) {
  return (
    <Component
      {...props}
      ref={ref}
      data-slot="empty-state"
      className={twMerge(BASE_CLASSES, className)}
    />
  )
})

export default EmptyState
