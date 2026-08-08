import { useState } from 'react'
import Select from '@/components/ui/select/Select.jsx'

const roles = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'editor', label: 'Editor' },
  { value: 'administrator', label: 'Administrator' }
]

export function MemberRole() {
  const [role, setRole] = useState('viewer')

  return (
    <>
      <label id="member-role-label" htmlFor="member-role">
        Member role
      </label>
      <Select
        id="member-role"
        aria-labelledby="member-role-label"
        value={role}
        onValueChange={setRole}
        name="role"
        options={roles}
      />
    </>
  )
}
