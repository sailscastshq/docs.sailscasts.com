<script>
  import Sparkline from '@/components/ui/sparkline/Sparkline.svelte'

  const cpu = [
    { label: '12:00', value: 18 },
    { label: '12:05', value: 24 },
    { label: '12:10', value: 21 },
    { label: '12:15', value: 39 },
    { label: '12:20', value: 31 },
    { label: '12:25', value: 42 }
  ]
</script>

<p class="flex items-end gap-3">
  <strong class="text-2xl tabular-nums">42%</strong>
  <Sparkline data={cpu} class="mb-1 h-6 w-24 text-emerald-600" />
</p>
