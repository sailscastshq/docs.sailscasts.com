<script>
  import Flag from '$lib/components/ui/flag/Flag.svelte'
</script>

<div class="flex items-center gap-4">
  <span class="inline-flex items-center gap-2">
    <Flag country="ng" class="w-5" />
    <span>Nigeria</span>
  </span>
  <Flag country="KE" alt="Kenya" class="w-8" />
  <Flag country="GH" alt="Ghana" class="size-10 aspect-square rounded-full" />
</div>
