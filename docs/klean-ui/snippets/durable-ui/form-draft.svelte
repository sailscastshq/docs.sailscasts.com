<script>
  import { createFormDraft } from '@/components/ui/durable-ui/formDraft.svelte.js'

  let form = $state({ customer: '', note: '' })
  let saved = $state(false)

  const draft = createFormDraft('invoice:new', () => form, {
    clearWhen: () => saved,
    restore(next) {
      form = next
    }
  })

  async function submit(event) {
    event.preventDefault()
    await saveInvoice(form)
    saved = true
  }
</script>

{#if draft.hasDraft}
  <aside aria-label="Recovered draft">
    <p>A saved invoice draft is available.</p>
    <button type="button" onclick={draft.restore}>Restore</button>
    <button type="button" onclick={draft.discard}>Discard</button>
  </aside>
{/if}

<form onsubmit={submit}>
  <!-- ordinary application fields -->
</form>
