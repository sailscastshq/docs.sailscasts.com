<script>
  import DateRangePicker from '~/components/ui/date-range-picker/DateRangePicker.svelte'

  let period = $state({ start: '', end: '' })
</script>

<DateRangePicker
  bind:value={period}
  name="period"
  label="Reporting period"
  startLabel="From"
  endLabel="To"
  required
/>
