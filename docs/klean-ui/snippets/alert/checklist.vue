<script setup>
import Alert from '@/components/ui/alert/Alert.vue'
import Button from '@/components/ui/button/Button.vue'

const items = [
  {
    key: 'secret',
    label: 'SESSION_SECRET is missing',
    suggestion: 'Generate a strong secret before the first deployment.',
    action: 'Generate'
  },
  {
    key: 'database',
    label: 'PostgreSQL is not attached',
    suggestion: 'Add a database service for production data.',
    action: 'Add service'
  }
]

function handleAction(item) {
  // The application owns the actual operation and its pending/error state.
  console.log(item.key)
}
</script>

<template>
  <Alert
    as="section"
    role="note"
    aria-labelledby="deployment-checklist-title"
    class="overflow-hidden border border-amber-200 bg-amber-50/50 p-0 text-gray-950 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-white"
  >
    <header class="px-4 py-3">
      <h2
        id="deployment-checklist-title"
        class="text-sm font-medium text-amber-900 dark:text-amber-200"
      >
        Deployment checklist
      </h2>
    </header>

    <ul class="border-t border-amber-200/60 dark:border-amber-900/40">
      <li
        v-for="item in items"
        :key="item.key"
        class="flex items-start justify-between gap-3 border-b border-amber-200/50 px-4 py-3 last:border-b-0 dark:border-amber-900/30"
      >
        <div class="min-w-0">
          <p class="text-sm">{{ item.label }}</p>
          <p class="mt-0.5 text-xs leading-5 text-gray-600 dark:text-gray-400">
            {{ item.suggestion }}
          </p>
        </div>
        <Button
          type="button"
          class="min-h-8 min-w-0 shrink-0 border border-amber-300 bg-transparent px-2.5 py-1 text-xs text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-transparent dark:text-amber-200"
          @click="handleAction(item)"
        >
          {{ item.action }}
        </Button>
      </li>
    </ul>
  </Alert>
</template>
