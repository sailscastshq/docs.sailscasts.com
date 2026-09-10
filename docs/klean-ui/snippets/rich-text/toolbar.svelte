<script>
  import RichText from '@/components/ui/rich-text/RichText.svelte'

  let note = $state('<p>A short note for the review team.</p>')
</script>

<label for="review-note">Review note</label>
<RichText id="review-note" bind:value={note}>
  {#snippet toolbar({ editor, mode, setMode, openLink })}
    <div
      role="group"
      class="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2 *:min-h-9 *:rounded *:px-3"
      aria-label="Text formatting"
    >
      <button
        type="button"
        disabled={!editor?.isEditable || mode !== 'visual'}
        aria-pressed={editor?.isActive('bold') || false}
        onclick={() => editor?.chain().focus().toggleBold().run()}>Bold</button
      >
      <button
        type="button"
        disabled={!editor?.isEditable || mode !== 'visual'}
        onclick={openLink}>Link</button
      >
      <button
        type="button"
        aria-pressed={mode === 'source'}
        onclick={() => setMode(mode === 'source' ? 'visual' : 'source')}
        >Source</button
      >
    </div>
  {/snippet}
</RichText>
