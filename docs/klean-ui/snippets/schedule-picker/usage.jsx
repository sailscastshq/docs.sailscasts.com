import { useState } from 'react'
import SchedulePicker from '@/components/ui/schedule-picker/SchedulePicker.jsx'

export default function PublishSchedule() {
  const [publishAt, setPublishAt] = useState('')

  return (
    <>
      <label htmlFor="publish-at">Publish at</label>
      <SchedulePicker
        id="publish-at"
        value={publishAt}
        onValueChange={setPublishAt}
        name="publishAt"
        timeZone="Africa/Lagos"
        required
      />
    </>
  )
}
