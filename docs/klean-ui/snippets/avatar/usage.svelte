<script>
  import Avatar from '$lib/components/ui/avatar/Avatar.svelte'

  let { creator } = $props()
</script>

<a href="/settings/profile" class="flex items-center gap-3">
  <Avatar src={creator.avatarUrl} alt="" class="size-10 rounded-lg">
    {creator.initials}
  </Avatar>
  <span>{creator.name}</span>
</a>
