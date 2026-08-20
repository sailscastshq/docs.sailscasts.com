<script>
  import TagsInput from '$lib/components/ui/tags-input/TagsInput.svelte'

  let tags = $state(['billing', 'invoice'])
  let draft = $state('')
</script>

<div class="grid gap-2">
  <label for="expense-tags" class="text-sm font-medium">Tags</label>
  <TagsInput
    id="expense-tags"
    bind:value={tags}
    bind:draft
    name="tags"
    aria-describedby="expense-tags-help"
  />
  <p id="expense-tags-help" class="text-sm text-gray-500">
    Press Enter or comma to add. Paste a comma-separated list.
  </p>
</div>
