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
      <div className="flex gap-6 border-b">
        <button type="button" data-value="overview">
          Overview
        </button>
        <button type="button" data-value="activity">
          Activity
        </button>
      </div>

      <section data-value="overview">Project health and ownership.</section>
      <section data-value="activity">Recent deployments and changes.</section>
    </Tabs>
  )
}
