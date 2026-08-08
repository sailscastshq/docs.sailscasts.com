<script setup>
import { ref } from 'vue'
import Combobox from '@/components/ui/combobox/Combobox.vue'

const repository = ref()
const repositories = ref([])
const loading = ref(false)
const error = ref('')
let request

async function search(query) {
  request?.abort()
  request = new AbortController()
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(
      `/api/repositories?q=${encodeURIComponent(query)}`,
      { signal: request.signal }
    )
    repositories.value = await response.json()
  } catch (cause) {
    if (cause.name !== 'AbortError')
      error.value = 'Could not search repositories.'
  } finally {
    if (!request.signal.aborted) loading.value = false
  }
}
</script>

<template>
  <label for="repository">Repository</label>
  <Combobox
    id="repository"
    v-model="repository"
    :options="repositories"
    :loading="loading"
    :error="error"
    @search="search"
  />
</template>
