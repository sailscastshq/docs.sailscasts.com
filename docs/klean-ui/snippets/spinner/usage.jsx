import Spinner from '@/components/ui/spinner/Spinner.jsx'

export default function DeploymentStatus({ loading }) {
  return (
    <span role="status" aria-live="polite" aria-atomic="true">
      {loading ? (
        <>
          <Spinner className="size-4" />
          <span>Loading deployments…</span>
        </>
      ) : null}
    </span>
  )
}
