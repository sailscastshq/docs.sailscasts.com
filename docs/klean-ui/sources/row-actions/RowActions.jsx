import { useEffect, useId, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import Menu from '../menu/Menu.jsx'

export default function RowActions({
  label = 'Actions',
  busy = false,
  id,
  placement = 'bottom-end',
  offset = 4,
  className,
  children,
  menu,
  trigger,
  onClick,
  onPointerDown,
  ...rootProps
}) {
  const generatedId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const menuId = id ?? `klean-row-actions-${generatedId}`
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (busy) setOpen(false)
  }, [busy])

  function handleClick(event) {
    event.stopPropagation()
    onClick?.(event)
  }

  function handlePointerDown(event) {
    event.stopPropagation()
    onPointerDown?.(event)
  }

  return (
    <div
      {...rootProps}
      role="group"
      aria-label={label}
      aria-busy={busy || undefined}
      data-slot="row-actions"
      className={twMerge('inline-flex items-center gap-1', className)}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {children}

      {menu ? (
        <>
          <button
            type="button"
            disabled={busy}
            aria-label={label}
            aria-controls={menuId}
            aria-expanded={open}
            popoverTarget={menuId}
            data-slot="row-actions-trigger"
            className="inline-grid size-9 cursor-pointer place-items-center rounded-md text-current hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10"
          >
            {trigger ?? (
              <svg
                className="size-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
              </svg>
            )}
          </button>
          <Menu
            id={menuId}
            open={open}
            onOpenChange={setOpen}
            aria-label={label}
            placement={placement}
            offset={offset}
            data-row-actions-menu=""
            className="min-w-40"
          >
            {menu}
          </Menu>
        </>
      ) : null}
    </div>
  )
}
