<script>
  import SchedulePicker from '~/components/ui/schedule-picker/SchedulePicker.svelte'

  let recordedAt = $state('2020-02-29T13:35:00.000Z')
</script>

<label for="recorded-at">Recorded at</label>
<SchedulePicker
  id="recorded-at"
  bind:value={recordedAt}
  name="recordedAt"
  allowPast
  timeZone="Africa/Lagos"
  locale="en-US"
  placeholder="February 29, 2020 at 2:35pm"
  class="**:data-[slot=input]:border-dashed **:data-[slot=input]:shadow-none"
/>
