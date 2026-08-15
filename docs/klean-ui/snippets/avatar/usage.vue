<script setup>
import Avatar from '@/components/ui/avatar/Avatar.vue'

defineProps({ creator: Object })
</script>

<template>
  <a href="/settings/profile" class="flex items-center gap-3">
    <Avatar :src="creator.avatarUrl" alt="" class="size-10 rounded-lg">
      {{ creator.initials }}
    </Avatar>
    <span>{{ creator.name }}</span>
  </a>
</template>
