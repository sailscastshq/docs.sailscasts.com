import { useState } from 'react'
import { useFormDraft } from '@/components/ui/durable-ui/useFormDraft.js'

export default function NewInvoice() {
  const [data, setData] = useState({ customer: '', note: '' })
  const [saved, setSaved] = useState(false)
  const draft = useFormDraft('invoice:new', data, {
    clearWhen: saved,
    onRestore: setData
  })

  async function submit(event) {
    event.preventDefault()
    await saveInvoice(data)
    setSaved(true)
  }

  return (
    <>
      {draft.hasDraft && (
        <aside aria-label="Recovered draft">
          <p>A saved invoice draft is available.</p>
          <button type="button" onClick={draft.restore}>
            Restore
          </button>
          <button type="button" onClick={draft.discard}>
            Discard
          </button>
        </aside>
      )}
      <form onSubmit={submit}>{/* ordinary application fields */}</form>
    </>
  )
}
