import Button from '~/components/ui/button/Button.jsx'
import Popover from '~/components/ui/popover/Popover.jsx'

export default function Filters() {
  return (
    <>
      <Button popoverTarget="filters">Filters</Button>
      <Popover id="filters" className="w-72">
        {({ close }) => (
          <section aria-labelledby="filters-title">
            <h2 id="filters-title" className="font-semibold">
              Visible records
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Choose which records appear in this view.
            </p>
            <Button onClick={close} className="mt-5 w-full">
              Done
            </Button>
          </section>
        )}
      </Popover>
    </>
  )
}
