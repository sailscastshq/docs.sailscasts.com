<script>
  import Input from '@/components/ui/input/Input.svelte'

  let { value = $bindable(''), error = '' } = $props()
</script>

<div class="grid gap-2">
  <label for="email">Email address</label>
  <Input
    id="email"
    bind:value
    name="email"
    type="email"
    autocomplete="email"
    required
    aria-invalid={Boolean(error)}
    aria-describedby="email-help email-error"
  />
  <p id="email-help">We only use this for account messages.</p>
  <p id="email-error" class="empty:hidden text-sm text-red-700">
    {error}
  </p>
</div>
