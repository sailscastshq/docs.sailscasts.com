<script>
  import LineChart from '@/components/ui/line-chart/LineChart.svelte'

  const signups = [
    { label: 'Fri', value: 4, detail: 'Friday, 4 signups' },
    { label: 'Sat', value: 4, detail: 'Saturday, 4 signups' },
    { label: 'Sun', value: 7, detail: 'Sunday, 7 signups' },
    { label: 'Mon', value: 7, detail: 'Monday, 7 signups' },
    { label: 'Tue', value: 4, detail: 'Tuesday, 4 signups' },
    { label: 'Wed', value: 4, detail: 'Wednesday, 4 signups' },
    { label: 'Thu', value: 5, detail: 'Thursday, 5 signups' }
  ]
</script>

<LineChart
  data={signups}
  caption="Signups — last 7 days"
  class="h-56 text-gray-950"
/>
