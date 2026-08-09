import { useState } from 'react'
import Switch from '@/components/ui/switch/Switch.jsx'

export default function PublicRoadmapSetting() {
  const [publicRoadmap, setPublicRoadmap] = useState(true)

  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-6">
      <span>
        <span className="block font-medium">Public roadmap</span>
        <span className="text-sm text-gray-500">
          Show planned work to customers.
        </span>
      </span>
      <Switch
        checked={publicRoadmap}
        onChange={(event) => setPublicRoadmap(event.target.checked)}
        name="publicRoadmap"
      />
    </label>
  )
}
