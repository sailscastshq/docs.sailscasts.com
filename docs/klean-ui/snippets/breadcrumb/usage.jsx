import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb.jsx'

const items = [
  { label: 'Projects', href: '/' },
  { label: 'Slipway', href: '/projects/slipway' },
  { label: 'Settings' }
]

export default function ProjectBreadcrumb() {
  return <Breadcrumb items={items} />
}
