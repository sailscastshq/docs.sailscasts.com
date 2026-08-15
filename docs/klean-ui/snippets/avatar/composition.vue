<script setup>
import Avatar from '@/components/ui/avatar/Avatar.vue'
import Spinner from '@/components/ui/spinner/Spinner.vue'

defineProps({ creator: Object, uploading: Boolean })
</script>

<template>
  <span class="relative inline-flex">
    <Avatar
      :src="creator.avatarUrl"
      :alt="creator.name"
      class="size-16 rounded-xl"
    >
      {{ creator.initials }}
    </Avatar>

    <span
      v-if="uploading"
      role="status"
      class="absolute inset-0 grid place-items-center rounded-xl bg-black/55"
    >
      <Spinner class="size-5 text-white" />
      <span class="sr-only">Uploading profile image</span>
    </span>
  </span>
</template>
