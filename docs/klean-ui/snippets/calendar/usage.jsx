import { useState } from 'react'
import Calendar from '@/components/ui/calendar/Calendar.jsx'

export default function AvailabilityCalendar() {
  const [date, setDate] = useState('2026-08-12')

  return <Calendar value={date} onValueChange={setDate} min="2026-08-01" />
}
