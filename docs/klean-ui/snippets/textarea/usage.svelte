<script>
  import Textarea from '@/components/ui/textarea/Textarea.svelte'

  let { value = $bindable(''), error = '' } = $props()
</script>

<div class="grid gap-2">
  <label for="note">Internal note</label>
  <Textarea
    id="note"
    bind:value
    name="note"
    rows="3"
    aria-invalid={Boolean(error)}
    aria-describedby="note-help note-error"
  />
  <p id="note-help">Plain text, up to 2,000 characters.</p>
  <p id="note-error" class="empty:hidden text-sm text-red-700">
    {error}
  </p>
</div>
