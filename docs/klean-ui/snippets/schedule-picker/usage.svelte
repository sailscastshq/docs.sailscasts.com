<script>
  import SchedulePicker from '~/components/ui/schedule-picker/SchedulePicker.svelte'

  let publishAt = $state('')
</script>

<label for="publish-at">Publish at</label>
<SchedulePicker
  id="publish-at"
  bind:value={publishAt}
  name="publishAt"
  timeZone="Africa/Lagos"
  required
/>
