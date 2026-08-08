import { useState } from 'react'
import Combobox from '@/components/ui/combobox/Combobox.jsx'

const projects = [
  { value: 'slipway', label: 'Slipway', keywords: ['deployments'] },
  { value: 'hagfish', label: 'Hagfish', keywords: ['billing'] }
]

export function ProjectPicker() {
  const [project, setProject] = useState()

  return (
    <>
      <label htmlFor="project">Project</label>
      <Combobox
        id="project"
        value={project}
        onValueChange={setProject}
        name="project"
        options={projects}
      />
    </>
  )
}
