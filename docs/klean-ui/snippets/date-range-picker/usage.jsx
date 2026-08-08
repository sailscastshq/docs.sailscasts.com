import { useState } from 'react'
import DateRangePicker from '@/components/ui/date-range-picker/DateRangePicker.jsx'

export default function ReportingPeriod() {
  const [period, setPeriod] = useState({ start: '', end: '' })

  return (
    <DateRangePicker
      value={period}
      onValueChange={setPeriod}
      name="period"
      label="Reporting period"
      startLabel="From"
      endLabel="To"
      required
    />
  )
}
