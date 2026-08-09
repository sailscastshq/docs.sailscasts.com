import { useState } from 'react'
import Radio from '@/components/ui/radio/Radio.jsx'

export default function RegionField() {
  const [region, setRegion] = useState('lagos')

  return (
    <fieldset>
      <legend className="font-medium">Deployment region</legend>
      {['lagos', 'frankfurt'].map((value) => (
        <label key={value} className="mt-3 flex cursor-pointer gap-3">
          <Radio
            name="region"
            value={value}
            checked={region === value}
            required
            onChange={(event) => setRegion(event.target.value)}
          />
          {value}
        </label>
      ))}
    </fieldset>
  )
}
