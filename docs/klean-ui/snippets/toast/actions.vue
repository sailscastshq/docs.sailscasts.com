<script setup>
import Toast from '@/components/ui/toast/Toast.vue'
import { createToast } from '@/components/ui/toast/toast.js'

const notifications = createToast()

function showLinkAction() {
  notifications({
    title: 'Draft saved',
    message: 'Continue when you are ready.',
    action: { label: 'View draft', href: '/drafts/42' }
  })
}

function showButtonAction() {
  notifications({
    title: 'Connection lost',
    action: { label: 'Retry', onClick: reconnect }
  })
}
</script>

<template>
  <button type="button" @click="showLinkAction">Show link action</button>
  <button type="button" @click="showButtonAction">Show button action</button>
  <Toast :controller="notifications" />
</template>
