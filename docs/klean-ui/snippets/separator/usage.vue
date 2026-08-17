<script setup>
import Separator from '@/components/ui/separator/Separator.vue'
</script>

<template>
  <article>
    <section aria-labelledby="profile-title">
      <h2 id="profile-title">Profile</h2>
      <p>Personal account details.</p>
    </section>

    <Separator class="my-8" />

    <section aria-labelledby="security-title">
      <h2 id="security-title">Security</h2>
      <p>Sign-in and recovery settings.</p>
    </section>
  </article>
</template>
