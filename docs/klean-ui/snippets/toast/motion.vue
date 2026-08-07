<script setup>
import { ref } from 'vue'
import Toast from '@/components/ui/toast/Toast.vue'
import { createToast } from '@/components/ui/toast/toast.js'

const notifications = createToast()
const from = ref('right')
const to = ref('right')

function notify(nextFrom, nextTo = nextFrom) {
  from.value = nextFrom
  to.value = nextTo
  notifications({ title: `${nextFrom} in · ${nextTo} out` })
}
</script>

<template>
  <button type="button" @click="notify('right')">Nearest edge</button>
  <button type="button" @click="notify('right', 'left')">
    Cross the screen
  </button>
  <Toast :controller="notifications" :from="from" :to="to" />
</template>
