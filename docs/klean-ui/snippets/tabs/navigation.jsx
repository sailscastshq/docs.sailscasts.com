import { Link } from '@inertiajs/react'
import Tabs from '@/components/ui/tabs/Tabs.jsx'

const sections = [
  { value: 'profile', label: 'Profile', href: '/settings/profile' },
  { value: 'billing', label: 'Billing', href: '/settings/billing' },
  { value: 'schedule', label: 'Schedule', href: '/settings/schedule' }
]

export default function SettingsNavigation({ current }) {
  return (
    <Tabs value={current} orientation="vertical" aria-label="Account settings">
      <nav className="flex flex-col gap-1">
        {sections.map((section) => (
          <Link
            key={section.value}
            href={section.href}
            data-value={section.value}
            prefetch
            className="block min-h-11 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-black/60 no-underline outline-none hover:bg-black/5 hover:text-black focus-visible:ring-2 focus-visible:ring-black data-[state=active]:bg-black data-[state=active]:text-white"
          >
            {section.label}
          </Link>
        ))}
      </nav>
    </Tabs>
  )
}
