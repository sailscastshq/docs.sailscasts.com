<script setup>
defineOptions({ inheritAttrs: false })
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    data-slot="icon"
    v-bind="$attrs"
  >
    <path d="M19.5 8.5V4.75h-3.75M4.5 15.5v3.75h3.75" />
    <path d="M18.65 7A8 8 0 0 0 5.5 7.25M5.35 17A8 8 0 0 0 18.5 16.75" />
  </svg>
</template>
