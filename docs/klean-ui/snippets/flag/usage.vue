<script setup>
import Flag from '@/components/ui/flag/Flag.vue'
</script>

<template>
  <span class="inline-flex items-center gap-2">
    <Flag country="ng" alt="" class="w-5" />
    <span>Nigeria</span>
  </span>
  <Flag country="KE" class="w-8" />
  <Flag
    country="GH"
    alt="Based in Ghana"
    class="size-10 aspect-square rounded-full"
  />
</template>
