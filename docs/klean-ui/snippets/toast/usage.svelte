<script>
  import Toast from '$lib/components/ui/toast/Toast.svelte'
  import { toast } from '$lib/components/ui/toast/toast.js'

  function save() {
    toast({
      title: 'Changes saved',
      message: 'Your draft is ready.',
      action: { label: 'View draft', href: '/drafts/42' }
    })
  }
</script>

<Toast />
<button type="button" onclick={save}>Save changes</button>
