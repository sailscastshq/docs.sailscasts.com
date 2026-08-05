<script setup>
import { Link } from '@inertiajs/vue3'
import Button from '@/components/ui/button/Button.vue'
</script>

<template>
  <Button type="button">Open dialog</Button>
  <Button type="submit">Save changes</Button>
  <Button as="a" href="https://sailsjs.com">Read Sails docs</Button>
  <Button :as="Link" href="/projects">View projects</Button>
</template>
