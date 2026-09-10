<script>
  import RichText from '@/components/ui/rich-text/RichText.svelte'

  let outline = $state(
    '## What we will build\n\n- A working feature\n- A recovery path\n- Tests for the edge cases\n'
  )
</script>

<label for="talk-outline">Talk outline</label>
<RichText
  id="talk-outline"
  bind:value={outline}
  format="markdown"
  name="outline"
/>
