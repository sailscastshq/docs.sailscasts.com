import Badge from '@/components/ui/badge/Badge.jsx'

export default function ServiceStatus() {
  return (
    <Badge className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-emerald-500"
      />
      Healthy
    </Badge>
  )
}
