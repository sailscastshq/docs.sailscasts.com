import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const BASE_CLASSES = [
  'size-4 shrink-0 cursor-pointer appearance-auto accent-current text-gray-950 outline-none',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-invalid:focus-visible:outline-red-600',
  'dark:text-white dark:focus-visible:outline-white dark:aria-invalid:focus-visible:outline-red-500'
]

function assignRef(ref, value) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

const Checkbox = forwardRef(function Checkbox(
  {
    checked,
    defaultChecked = false,
    indeterminate = false,
    disabled = false,
    'aria-invalid': ariaInvalid,
    className,
    onChange,
    'data-slot': _dataSlot,
    'data-state': _dataState,
    'data-disabled': _dataDisabled,
    'data-invalid': _dataInvalid,
    ...props
  },
  forwardedRef
) {
  const elementRef = useRef(null)
  const controlled = checked !== undefined
  const [localChecked, setLocalChecked] = useState(Boolean(defaultChecked))
  const resolvedChecked = controlled ? Boolean(checked) : localChecked
  const invalid = ariaInvalid === true || ariaInvalid === 'true'

  const setElement = useCallback(
    (node) => {
      elementRef.current = node
      if (node) node.indeterminate = Boolean(indeterminate)
      assignRef(forwardedRef, node)
    },
    [forwardedRef, indeterminate]
  )

  useEffect(() => {
    const node = elementRef.current
    if (!node) return
    node.indeterminate = Boolean(indeterminate)
  }, [indeterminate])

  useEffect(() => {
    const node = elementRef.current
    const form = node?.form
    if (!form || controlled) return

    function handleReset() {
      queueMicrotask(() => setLocalChecked(node.defaultChecked))
    }

    form.addEventListener('reset', handleReset)
    return () => form.removeEventListener('reset', handleReset)
  }, [controlled])

  function handleChange(event) {
    if (!controlled) setLocalChecked(event.target.checked)
    onChange?.(event)
  }

  return (
    <input
      {...props}
      ref={setElement}
      type="checkbox"
      checked={controlled ? checked : undefined}
      defaultChecked={controlled ? undefined : defaultChecked}
      disabled={disabled}
      aria-invalid={ariaInvalid}
      data-slot="checkbox"
      data-state={
        indeterminate
          ? 'indeterminate'
          : resolvedChecked
            ? 'checked'
            : 'unchecked'
      }
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      className={twMerge(BASE_CLASSES, className)}
      onChange={handleChange}
    />
  )
})

export default Checkbox
