import { useRef } from 'react'
import ContextMenu from '@/components/ui/context-menu/ContextMenu.jsx'
export default function ProjectActions() {
  const actions = useRef()
  return (
    <>
      <div
        id="project"
        tabIndex={0}
        className="rounded-lg border p-8 focus:ring-2"
      >
        Northstar project
      </div>
      <button
        type="button"
        onClick={(event) => actions.current.show(event.currentTarget)}
      >
        Actions
      </button>
      <ContextMenu
        ref={actions}
        target="project"
        aria-label="Project actions"
        className="w-52"
      >
        <button
          type="button"
          className="block w-full px-3 py-2 text-left focus:bg-gray-100 dark:focus:bg-gray-800"
        >
          Rename
        </button>
        <a
          href="/projects/42"
          className="block px-3 py-2 focus:bg-gray-100 dark:focus:bg-gray-800"
        >
          Open project
        </a>
      </ContextMenu>
    </>
  )
}
