<script>
  import FileUpload from '$lib/components/ui/file-upload/FileUpload.svelte'

  let file = $state(null)
  let error = $state('')
</script>

<FileUpload
  bind:file
  accept="image/png,image/jpeg,.pdf"
  validate={(candidate) =>
    candidate.size <= 2 * 1024 * 1024 || 'Choose a file under 2 MB.'}
  onchange={() => (error = '')}
  onreject={(detail) => (error = detail.message)}
>
  {#snippet children(upload)}
    <div
      {...upload.dropzone}
      class={`rounded-xl border border-dashed p-6 ${
        upload.dragging ? 'border-gray-950 bg-gray-50' : 'border-gray-300'
      }`}
    >
      <p>{upload.file?.name || 'Drop one file here'}</p>
      <button type="button" onclick={upload.choose}>
        {upload.file ? 'Replace file' : 'Choose file'}
      </button>
      {#if upload.file}
        <button type="button" onclick={upload.clear}>Remove</button>
      {/if}
    </div>
    {#if error}<p role="alert">{error}</p>{/if}
  {/snippet}
</FileUpload>
