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

const Radio = forwardRef(function Radio(
  {
    checked,
    defaultChecked = false,
    disabled = false,
    value = 'on',
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
      assignRef(forwardedRef, node)
    },
    [forwardedRef]
  )

  useEffect(() => {
    const node = elementRef.current
    if (!node || controlled) return

    const root = node.form ?? node.getRootNode()

    function syncGroupState(event) {
      const target = event.target
      if (
        target?.type !== 'radio' ||
        target.name !== node.name ||
        target.form !== node.form
      ) {
        return
      }

      setLocalChecked(node.checked)
    }

    function handleReset() {
      queueMicrotask(() => setLocalChecked(node.checked))
    }

    root?.addEventListener('change', syncGroupState)
    node.form?.addEventListener('reset', handleReset)

    return () => {
      root?.removeEventListener('change', syncGroupState)
      node.form?.removeEventListener('reset', handleReset)
    }
  }, [controlled])

  function handleChange(event) {
    if (!controlled) setLocalChecked(event.target.checked)
    onChange?.(event)
  }

  return (
    <input
      {...props}
      ref={setElement}
      type="radio"
      checked={controlled ? Boolean(checked) : undefined}
      defaultChecked={controlled ? undefined : Boolean(defaultChecked)}
      disabled={disabled}
      value={value}
      aria-invalid={ariaInvalid}
      data-slot="radio"
      data-state={resolvedChecked ? 'checked' : 'unchecked'}
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      className={twMerge(BASE_CLASSES, className)}
      onChange={handleChange}
    />
  )
})

export default Radio
