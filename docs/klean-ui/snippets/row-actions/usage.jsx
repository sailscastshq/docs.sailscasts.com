import { Link, router } from '@inertiajs/react'
import RowActions from '@/components/ui/row-actions/RowActions.jsx'

export function ServiceActions({ service, busy }) {
  return (
    <RowActions
      label={`Actions for ${service.name}`}
      busy={busy}
      menu={
        <>
          <Link href={`/services/${service.id}/settings`}>Settings</Link>
          <button
            type="button"
            onClick={() =>
              router.post(
                `/services/${service.id}/deployments`,
                {},
                { preserveScroll: true }
              )
            }
          >
            Redeploy
          </button>
          <button
            type="button"
            command="show-modal"
            commandFor={`delete-${service.id}`}
          >
            Delete service
          </button>
        </>
      }
    >
      <Link href={`/services/${service.id}/logs`}>Logs</Link>
    </RowActions>
  )
}
