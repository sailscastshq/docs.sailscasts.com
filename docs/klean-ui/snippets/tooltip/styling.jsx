export default function InvoiceTooltip() {
  return (
    <Tooltip
      text="Copy public invoice link"
      placement="bottom"
      className="rounded-none border-2 border-black bg-amber-50 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-black shadow-[3px_3px_0_0_#000] dark:border-amber-200 dark:bg-amber-950 dark:text-amber-50 dark:shadow-[3px_3px_0_0_#fde68a]"
    >
      <button
        type="button"
        aria-label="Copy public invoice link"
        className="grid size-12 place-items-center border-2 border-black bg-black text-white"
      >
        <CopyIcon aria-hidden="true" />
      </button>
    </Tooltip>
  )
}
