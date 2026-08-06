<script setup>
import Input from '@/components/ui/input/Input.vue'
</script>

<template>
  <div class="grid gap-2">
    <label for="email">Email address</label>
    <Input
      id="email"
      v-model="form.email"
      name="email"
      type="email"
      autocomplete="email"
      required
      :aria-invalid="Boolean(form.errors.email)"
      aria-describedby="email-help email-error"
    />
    <p id="email-help">We only use this for account messages.</p>
    <p id="email-error" class="empty:hidden text-sm text-red-700">
      {{ form.errors.email }}
    </p>
  </div>
</template>
