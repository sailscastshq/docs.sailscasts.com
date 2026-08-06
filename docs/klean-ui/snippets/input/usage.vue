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
      :aria-invalid="!!form.errors.email"
      :aria-describedby="
        form.errors.email ? 'email-help email-error' : 'email-help'
      "
    />
    <p id="email-help">We only use this for account messages.</p>
    <p v-if="form.errors.email" id="email-error">
      {{ form.errors.email }}
    </p>
  </div>
</template>
