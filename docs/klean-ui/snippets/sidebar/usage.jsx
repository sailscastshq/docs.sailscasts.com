import { Link } from '@inertiajs/react'
import { useRef, useState } from 'react'
import Sidebar from '@/components/ui/sidebar/Sidebar.jsx'

export default function AppShell() {
  const sidebar = useRef(null)
  const [open, setOpen] = useState()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        ref={sidebar}
        id="primary-navigation"
        aria-label="Project navigation"
        onOpenChange={setOpen}
        className="w-56 border-r data-[state=closed]:w-0 data-[state=closed]:opacity-0"
      >
        <nav aria-label="Workspace" className="w-56 p-3">
          <Link
            href="/"
            aria-current="page"
            className="block min-h-11 px-3 py-3"
          >
            Projects
          </Link>
          <Link href="/lookout" className="block min-h-11 px-3 py-3">
            Lookout
          </Link>
        </nav>
      </Sidebar>

      <main className="min-w-0 flex-1">
        <button
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={Boolean(open)}
          onClick={() => sidebar.current?.toggle()}
        >
          {open ? 'Hide navigation' : 'Show navigation'}
        </button>
      </main>
    </div>
  )
}
