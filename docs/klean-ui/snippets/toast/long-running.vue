<script setup>
import Toast from '@/components/ui/toast/Toast.vue'
import { createToast } from '@/components/ui/toast/toast.js'

const notifications = createToast()
let deploymentId

function startDeployment() {
  deploymentId = notifications({
    title: 'Preparing deployment',
    message: 'Reading service configuration',
    progress: 12,
    duration: false,
    dismissible: false
  })
}

function completeDeployment() {
  notifications.update(deploymentId, {
    title: 'Deployment live',
    message: 'production.example.com',
    progress: 100,
    duration: 5000,
    dismissible: true
  })
}
</script>

<template>
  <button type="button" @click="startDeployment">Deploy</button>
  <button type="button" @click="completeDeployment">Complete</button>
  <Toast :controller="notifications">
    <template #default="{ item, dismiss }">
      <!-- Application-owned progress markup and Tailwind. -->
    </template>
  </Toast>
</template>
