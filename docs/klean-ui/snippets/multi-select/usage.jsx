import { useState } from 'react'
import MultiSelect from '@/components/ui/multi-select/MultiSelect.jsx'
export default function Teams() {
  const [teams, setTeams] = useState([])
  const options = [
    { value: 'design', label: 'Design' },
    { value: 'support', label: 'Support' }
  ]
  return (
    <>
      <label htmlFor="teams">Teams</label>
      <MultiSelect
        id="teams"
        value={teams}
        onValueChange={setTeams}
        options={options}
        name="teams"
        required
      />
    </>
  )
}
