<script>
  import Calendar from '~/components/ui/calendar/Calendar.svelte'

  let date = $state('2026-08-12')
</script>

<Calendar bind:value={date} min="2026-08-01" />
