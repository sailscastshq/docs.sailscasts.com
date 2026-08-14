import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

const BASE_CLASSES =
  'rounded-lg border border-gray-200 bg-white p-5 text-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-white'

const Card = forwardRef(function Card(
  { as: Component = 'div', className, 'data-slot': _dataSlot, ...props },
  ref
) {
  return (
    <Component
      {...props}
      ref={ref}
      data-slot="card"
      className={twMerge(BASE_CLASSES, className)}
    />
  )
})

export default Card
