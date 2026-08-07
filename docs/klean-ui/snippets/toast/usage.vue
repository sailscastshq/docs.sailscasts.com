<script setup>
import Toast from '@/components/ui/toast/Toast.vue'
import { toast } from '@/components/ui/toast/toast.js'

function save() {
  toast({
    title: 'Changes saved',
    message: 'Your draft is ready.',
    action: { label: 'View draft', href: '/drafts/42' }
  })
}
</script>

<template>
  <Toast />
  <button type="button" @click="save">Save changes</button>
</template>
