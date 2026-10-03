import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import Menu from '../menu/Menu.jsx'

const ContextMenu = forwardRef(function ContextMenu(
  {
    target,
    id,
    disabled = false,
    open,
    onOpenChange,
    placement = 'bottom-start',
    offset = 0,
    children,
    ...attrs
  },
  ref
) {
  const generatedId = useId()
  const menuId =
    id ?? `klean-context-menu-${generatedId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const menu = useRef()
  const [internalOpen, setInternalOpen] = useState(false)
  const [anchor, setAnchor] = useState()
  const isOpen = open ?? internalOpen
  const targetElement = useCallback(() => {
    const root = menu.current?.getContent()?.getRootNode() ?? document
    return typeof target === 'string' ? root.getElementById?.(target) : target
  }, [target])
  const requestOpen = useCallback(
    (value) => {
      if (open === undefined) setInternalOpen(value)
      onOpenChange?.(value)
    },
    [open, onOpenChange]
  )
  const show = useCallback(
    (source = targetElement(), point) => {
      const element = targetElement()
      if (
        disabled ||
        !element?.isConnected ||
        !source?.isConnected ||
        element.matches(':disabled') ||
        element.getAttribute('aria-disabled') === 'true'
      )
        return
      const rect = source.getBoundingClientRect()
      const x = point?.x ?? rect.left
      const y = point?.y ?? rect.bottom
      setAnchor({
        contextElement: source,
        getBoundingClientRect: () => ({
          x,
          y,
          left: x,
          right: x,
          top: y,
          bottom: y,
          width: 0,
          height: 0
        })
      })
      menu.current?.open('first', source)
    },
    [disabled, targetElement]
  )
  const hide = useCallback(
    () => menu.current?.close({ restoreFocus: true }),
    []
  )
  useImperativeHandle(ref, () => ({ show, hide }), [show, hide])
  useEffect(() => {
    if (disabled) hide()
  }, [disabled, hide])
  useEffect(() => {
    const element = targetElement()
    if (!element) return
    const attributes = ['aria-haspopup', 'aria-controls', 'aria-expanded']
    const previous = attributes.map((name) => element.getAttribute(name))
    element.setAttribute('aria-haspopup', 'menu')
    element.setAttribute('aria-controls', menuId)
    element.setAttribute('aria-expanded', String(isOpen))
    function invoke(event) {
      if (
        event.defaultPrevented ||
        disabled ||
        element.matches(':disabled') ||
        element.getAttribute('aria-disabled') === 'true'
      )
        return
      const keyboard = event.type === 'keydown'
      if (
        keyboard &&
        !(
          event.key === 'ContextMenu' ||
          (event.key === 'F10' &&
            event.shiftKey &&
            !event.ctrlKey &&
            !event.altKey &&
            !event.metaKey)
        )
      )
        return
      event.preventDefault()
      const point =
        !keyboard && (event.clientX || event.clientY)
          ? { x: event.clientX, y: event.clientY }
          : undefined
      show(element, point)
    }
    element.addEventListener('contextmenu', invoke)
    element.addEventListener('keydown', invoke)
    return () => {
      element.removeEventListener('contextmenu', invoke)
      element.removeEventListener('keydown', invoke)
      attributes.forEach((name, index) =>
        previous[index] === null
          ? element.removeAttribute(name)
          : element.setAttribute(name, previous[index])
      )
    }
  }, [disabled, isOpen, menuId, show, targetElement])
  return (
    <Menu
      {...attrs}
      popover="manual"
      ref={menu}
      id={menuId}
      open={isOpen}
      onOpenChange={requestOpen}
      anchor={anchor}
      placement={placement}
      offset={offset}
    >
      {children}
    </Menu>
  )
})
export default ContextMenu
