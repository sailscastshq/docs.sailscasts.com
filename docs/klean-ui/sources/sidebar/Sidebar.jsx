import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { twMerge } from 'tailwind-merge'

const Sidebar = forwardRef(function Sidebar(
  {
    id = 'app-sidebar',
    open,
    defaultOpen = true,
    remember = true,
    onOpenChange,
    className,
    children,
    'data-slot': _dataSlot,
    'data-state': _dataState,
    'data-restored': _dataRestored,
    'aria-hidden': _ariaHidden,
    inert: _inert,
    ...props
  },
  forwardedRef
) {
  const rootRef = useRef(null)
  const onOpenChangeRef = useRef(onOpenChange)
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [restored, setRestored] = useState(false)
  const controlled = open !== undefined
  const visible = controlled ? open : internalOpen
  const storageKey = `klean:sidebar:${id}:open`

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange
  }, [onOpenChange])

  const rememberVisibility = useCallback(
    (next) => {
      if (!remember || typeof window === 'undefined') return
      try {
        window.localStorage.setItem(storageKey, String(next))
      } catch {
        // Visibility still works when persistence is unavailable.
      }
    },
    [remember, storageKey]
  )

  const setOpen = useCallback(
    (next) => {
      const normalized = Boolean(next)
      if (!controlled) setInternalOpen(normalized)
      onOpenChangeRef.current?.(normalized)
      rememberVisibility(normalized)
    },
    [controlled, rememberVisibility]
  )

  const show = useCallback(() => setOpen(true), [setOpen])
  const hide = useCallback(() => setOpen(false), [setOpen])
  const toggle = useCallback(() => setOpen(!visible), [setOpen, visible])

  useImperativeHandle(forwardedRef, () => ({
    root: rootRef.current,
    show,
    hide,
    toggle
  }))

  useEffect(() => {
    if (!controlled && remember) {
      try {
        const value = window.localStorage.getItem(storageKey)
        const next =
          value === 'true' ? true : value === 'false' ? false : defaultOpen
        setInternalOpen(next)
        onOpenChangeRef.current?.(next)
      } catch {
        // The supplied default remains authoritative without storage.
        onOpenChangeRef.current?.(defaultOpen)
      }
    }

    setRestored(true)

    function handleStorage(event) {
      if (
        !remember ||
        event.storageArea !== window.localStorage ||
        event.key !== storageKey
      ) {
        return
      }
      if (event.newValue === 'true') {
        if (!controlled) setInternalOpen(true)
        onOpenChangeRef.current?.(true)
      }
      if (event.newValue === 'false') {
        if (!controlled) setInternalOpen(false)
        onOpenChangeRef.current?.(false)
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [controlled, defaultOpen, remember, storageKey])

  useEffect(() => {
    if (restored && controlled) rememberVisibility(visible)
  }, [controlled, rememberVisibility, restored, visible])

  const api = { open: visible, show, hide, toggle }

  return (
    <aside
      {...props}
      ref={rootRef}
      id={id}
      data-slot="sidebar"
      data-state={visible ? 'open' : 'closed'}
      data-restored={restored ? 'true' : 'false'}
      aria-hidden={visible ? undefined : 'true'}
      inert={visible ? undefined : true}
      className={twMerge(
        'min-w-0 shrink-0 overflow-hidden transition-[width,opacity] duration-200 ease-out motion-reduce:transition-none',
        className
      )}
    >
      {typeof children === 'function' ? children(api) : children}
    </aside>
  )
})

export default Sidebar
