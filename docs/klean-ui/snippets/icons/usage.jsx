import Trash from '@/components/ui/icons/Trash.jsx'

export default function DeleteInvoice() {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
      aria-label="Delete invoice"
    >
      <Trash className="size-4" />
      Delete
    </button>
  )
}
