import Button from '@/components/ui/button/Button.jsx'
import Tooltip from '@/components/ui/tooltip/Tooltip.jsx'

export default function QueryToolbar() {
  return (
    <Tooltip text="Re-run query">
      <Button
        type="button"
        aria-label="Re-run query"
        className="size-10 min-h-0 p-0"
      >
        <RefreshIcon aria-hidden="true" />
      </Button>
    </Tooltip>
  )
}
