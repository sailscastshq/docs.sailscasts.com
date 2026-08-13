<script setup>
import Pagination from '@/components/ui/pagination/Pagination.vue'

defineProps({
  pagination: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <Pagination
    :page="pagination.page"
    :pages="pagination.totalPages"
    :only="['projects', 'pagination']"
    aria-label="Project pages"
  />
</template>
