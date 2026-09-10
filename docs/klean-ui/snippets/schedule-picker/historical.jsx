import { useState } from 'react'
import SchedulePicker from '@/components/ui/schedule-picker/SchedulePicker.jsx'

export default function RecordedAt() {
  const [recordedAt, setRecordedAt] = useState('2020-02-29T13:35:00.000Z')

  return (
    <>
      <label htmlFor="recorded-at">Recorded at</label>
      <SchedulePicker
        id="recorded-at"
        value={recordedAt}
        onValueChange={setRecordedAt}
        name="recordedAt"
        allowPast
        timeZone="Africa/Lagos"
        locale="en-US"
        placeholder="February 29, 2020 at 2:35pm"
        className="**:data-[slot=input]:border-dashed **:data-[slot=input]:shadow-none"
      />
    </>
  )
}
