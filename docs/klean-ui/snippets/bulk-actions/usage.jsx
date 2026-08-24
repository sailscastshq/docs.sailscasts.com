import { Link, router } from '@inertiajs/react'
import { useState } from 'react'
import BulkActions from '@/components/ui/bulk-actions/BulkActions.jsx'

export function ServiceBulkActions() {
  const [selectedIds, setSelectedIds] = useState([
    'svc_01J9api',
    'svc_01J9worker'
  ])
  const [processing, setProcessing] = useState(false)

  function archiveSelected() {
    if (processing) return
    setProcessing(true)
    router.post(
      '/services/archive',
      { ids: selectedIds },
      { onFinish: () => setProcessing(false) }
    )
  }

  return (
    <>
      <input
        type="checkbox"
        aria-label="Select all services on this page"
        data-bulk-actions-focus
      />
      <BulkActions
        count={selectedIds.length}
        busy={processing}
        label="Actions for selected services"
        onClear={() => setSelectedIds([])}
      >
        <Link href="/services/export">Export</Link>
        <button type="button" disabled={processing} onClick={archiveSelected}>
          Archive
        </button>
      </BulkActions>
    </>
  )
}
