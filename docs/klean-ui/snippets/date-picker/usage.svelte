<script>
  import DatePicker from '~/components/ui/date-picker/DatePicker.svelte'

  let dueAt = $state('')
</script>

<label for="due-date">Due date</label>
<DatePicker id="due-date" bind:value={dueAt} name="dueAt" required />
