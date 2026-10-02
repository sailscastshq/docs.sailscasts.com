<script setup>
import { ref } from 'vue'
import KleanCheckbox from './klean/checkbox/Checkbox.vue'
import KleanButton from './klean/Button.vue'
import KleanBadge from './klean/badge/Badge.vue'

const weeklySummary = ref(true)
const productUpdates = ref(false)
const saved = ref(false)
function update() {
  saved.value = false
}
</script>

<template>
  <form
    class="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700"
    @submit.prevent="saved = true"
  >
    <div class="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 class="text-sm font-semibold text-gray-950 dark:text-white">
          Notifications
        </h2>
        <p class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
          A little less noise. Just what matters.
        </p>
      </div>
      <KleanBadge
        class="bg-cyan-50 text-cyan-800 ring-cyan-600/15 dark:bg-cyan-950 dark:text-cyan-200 dark:ring-cyan-400/20"
        >Personal</KleanBadge
      >
    </div>
    <div class="divide-y divide-gray-100 dark:divide-gray-800">
      <label
        class="flex cursor-pointer items-center justify-between gap-5 py-4"
      >
        <span
          ><span
            class="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >Weekly summary</span
          ><span class="mt-1 block text-xs text-gray-500 dark:text-gray-400"
            >The big picture, once a week.</span
          ></span
        >
        <KleanCheckbox v-model="weeklySummary" @update:model-value="update" />
      </label>
      <label
        class="flex cursor-pointer items-center justify-between gap-5 py-4"
      >
        <span
          ><span
            class="block text-sm font-medium text-gray-900 dark:text-gray-100"
            >Product updates</span
          ><span class="mt-1 block text-xs text-gray-500 dark:text-gray-400"
            >New features worth knowing about.</span
          ></span
        >
        <KleanCheckbox v-model="productUpdates" @update:model-value="update" />
      </label>
    </div>
    <div
      class="mt-5 flex items-center justify-between gap-4 border-t border-gray-100 pt-5 dark:border-gray-800"
    >
      <p class="text-xs text-gray-500 dark:text-gray-400" role="status">
        {{
          saved
            ? 'Preferences saved in this demo.'
            : 'Your preferences, your choice.'
        }}
      </p>
      <KleanButton type="submit" class="shrink-0">Save changes</KleanButton>
    </div>
  </form>
</template>
