import { useState } from 'react'
import Tabs from '@/components/ui/tabs/Tabs.jsx'

export default function ProjectTabs() {
  const [active, setActive] = useState('overview')

  return (
    <Tabs
      value={active}
      onValueChange={setActive}
      aria-label="Project sections"
    >
      <div className="flex gap-6 overflow-x-auto border-b border-gray-200">
        <button
          type="button"
          data-value="overview"
          className="min-h-11 cursor-pointer border-b-2 border-transparent px-1 py-2 text-sm font-medium text-gray-500 outline-none hover:text-gray-950 focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:border-gray-950 data-[state=active]:text-gray-950"
        >
          Overview
        </button>
        <button
          type="button"
          data-value="activity"
          className="min-h-11 cursor-pointer border-b-2 border-transparent px-1 py-2 text-sm font-medium text-gray-500 outline-none hover:text-gray-950 focus-visible:ring-2 focus-visible:ring-gray-950 data-[state=active]:border-gray-950 data-[state=active]:text-gray-950"
        >
          Activity
        </button>
      </div>

      <section
        data-value="overview"
        className="py-6 outline-none focus-visible:ring-2"
      >
        Project health and ownership.
      </section>
      <section
        data-value="activity"
        className="py-6 outline-none focus-visible:ring-2"
      >
        Recent deployments and changes.
      </section>
    </Tabs>
  )
}
