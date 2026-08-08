import { useState } from 'react'
import DatePicker from '@/components/ui/date-picker/DatePicker.jsx'

export default function DueDateField() {
  const [dueAt, setDueAt] = useState('')

  return (
    <>
      <label htmlFor="due-date">Due date</label>
      <DatePicker
        id="due-date"
        value={dueAt}
        onValueChange={setDueAt}
        name="dueAt"
        required
      />
    </>
  )
}
