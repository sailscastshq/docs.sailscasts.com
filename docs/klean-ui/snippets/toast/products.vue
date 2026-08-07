<script setup>
import Toast from '@/components/ui/toast/Toast.vue'
import { createToast } from '@/components/ui/toast/toast.js'

const invoiceNotifications = createToast()

function showInvoiceToast() {
  invoiceNotifications({
    title: 'Invoice sent',
    message: 'INV-1042 is on its way to Ada.',
    class:
      'rounded-none border-2 border-black bg-white text-black shadow-[6px_6px_0_0_#000]'
  })
}
</script>

<template>
  <button type="button" @click="showInvoiceToast">Send invoice</button>
  <Toast :controller="invoiceNotifications" position="top-left" />
</template>
