<script setup>
import Avatar from '@/components/ui/avatar/Avatar.vue'

defineProps({ creator: Object, comments: Array, teams: Array })
</script>

<template>
  <!-- Hagfish keeps comment color and density in application classes. -->
  <article v-for="comment in comments" :key="comment.id" class="flex gap-3">
    <Avatar
      :src="comment.avatarUrl"
      alt=""
      :class="['size-7 text-[10px] font-bold text-white', comment.avatarClass]"
    >
      {{ comment.initials }}
    </Avatar>
    <p>
      <strong>{{ comment.authorName }}</strong> {{ comment.body }}
    </p>
  </article>

  <!-- Slipway's real button owns team switching and its accessible name. -->
  <button
    v-for="team in teams"
    :key="team.id"
    type="button"
    class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2"
  >
    <Avatar
      :src="team.logoUrl"
      alt=""
      class="size-6 rounded-md bg-gray-900 text-[10px] text-white"
    >
      {{ team.initials }}
    </Avatar>
    <span>{{ team.name }}</span>
  </button>
</template>
