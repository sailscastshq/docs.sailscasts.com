<script setup>
import Field from '@/components/ui/field/Field.vue'
import Input from '@/components/ui/input/Input.vue'
</script>

<template>
  <Field
    name="email"
    label="Email address"
    description="We only use this for account messages."
    :error="form.errors.email"
    required
  >
    <Input v-model="form.email" type="email" autocomplete="email" />
  </Field>
</template>
