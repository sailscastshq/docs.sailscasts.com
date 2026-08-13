import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const BASE_CLASSES =
  'w-full border-collapse text-left text-sm text-gray-950 dark:text-white'

const Table = forwardRef(function Table(
  { className, 'data-slot': _dataSlot, ...props },
  ref
) {
  return (
    <table
      {...props}
      ref={ref}
      data-slot="table"
      className={twMerge(BASE_CLASSES, className)}
    />
  )
})

export default Table
