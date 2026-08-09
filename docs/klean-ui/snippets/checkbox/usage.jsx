import { useState } from 'react'
import Checkbox from '@/components/ui/checkbox/Checkbox.jsx'

export default function NotificationsField() {
  const [notifications, setNotifications] = useState(false)

  return (
    <label className="flex cursor-pointer items-start gap-3">
      <Checkbox
        checked={notifications}
        onChange={(event) => setNotifications(event.target.checked)}
        name="notifications"
      />
      <span>
        <span className="block font-medium">Deployment notifications</span>
        <span className="text-sm text-gray-500">
          Tell me when a deploy finishes.
        </span>
      </span>
    </label>
  )
}
