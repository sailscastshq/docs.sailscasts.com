<script>
  import Checkbox from '@/components/ui/checkbox/Checkbox.svelte'

  let notifications = $state(false)
</script>

<label class="flex cursor-pointer items-start gap-3">
  <Checkbox bind:checked={notifications} name="notifications" />
  <span>
    <span class="block font-medium">Deployment notifications</span>
    <span class="text-sm text-gray-500"> Tell me when a deploy finishes. </span>
  </span>
</label>
