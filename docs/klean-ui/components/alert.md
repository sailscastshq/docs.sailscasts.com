---
title: Alert
titleTemplate: Klean UI
description: A shallow notice surface with explicit announcement semantics, native content, and caller-owned Tailwind styling.
outline: [2, 3]
---

<script setup>
import { ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanAlert from '../../.vitepress/theme/components/klean/alert/Alert.vue'
import KleanButton from '../../.vitepress/theme/components/klean/Button.vue'
import alertSource from '../../.vitepress/theme/components/klean/alert/Alert.vue?raw'
import reactSource from '../sources/alert/Alert.jsx?raw'
import svelteSource from '../sources/alert/Alert.svelte?raw'
import vueUsage from '../snippets/alert/usage.vue?raw'
import reactUsage from '../snippets/alert/usage.jsx?raw'
import svelteUsage from '../snippets/alert/usage.svelte?raw'
import checklistUsage from '../snippets/alert/checklist.vue?raw'

const lastChecklistAction = ref('')
const checklist = [
  {
    label: 'SESSION_SECRET is missing',
    suggestion: 'Generate a strong secret before the first deployment.',
    action: 'Generate',
    kind: 'warning'
  },
  {
    label: 'PostgreSQL is not attached',
    suggestion: 'Add a database service for production data.',
    action: 'Add service',
    kind: 'info'
  },
  {
    label: 'Deployment source is connected',
    suggestion: 'GitHub will provide the selected branch.',
    kind: 'success'
  }
]

function runChecklistAction(label) {
  lastChecklistAction.value = `${label} selected`
}
</script>

# Alert

Alert is one shallow surface for visible guidance, warnings, operation results, and recoverable failures. Put native headings, paragraphs, lists, links, and buttons inside it, then choose announcement semantics from when the message appears.

Klean does not infer urgency from color or from the component name. Alert renders no role and no live region by default.

<KleanPreview id="alert-source" :source="alertSource" filename="Alert.vue">
  <template #preview>
    <KleanAlert class="mx-auto max-w-xl">
      <h2 class="font-medium">Changes are saved automatically</h2>
      <p class="mt-1 leading-6 text-gray-600 dark:text-gray-300">
        You can leave this page and return whenever you are ready.
      </p>
    </KleanAlert>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/alert/Alert.vue

  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and writes the matching source into the application's conventional component directory:

<KleanInstallation
  id="alert-installation"
  component="alert"
  :source="alertSource"
  filename="Alert.vue"
  destination="assets/js/components/ui/alert/Alert.vue"
  :dependencies="['tailwind-merge']"
/>

The result works immediately with neutral monochrome defaults. There is no initializer, configuration file, provider, visual preset, severity map, or shared Klean runtime.

## Usage

The application writes the real content and opts into urgent announcement only when a new failure needs immediate attention.

### Vue

<CopyCode :code="vueUsage" label="DeploymentError.vue" />

### React

<CopyCode :code="reactUsage" label="DeploymentError.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="DeploymentError.svelte" />

## API

| Input                 | Default | Purpose                                                                   |
| --------------------- | ------- | ------------------------------------------------------------------------- |
| `as`                  | `div`   | Native container such as `div`, `section`, or `aside`.                    |
| `class` / `className` | —       | Ordinary Tailwind classes merged after the neutral defaults.              |
| native attributes     | —       | IDs, `role`, ARIA relationships, test hooks, and other native attributes. |
| default content       | —       | Native headings, paragraphs, lists, links, buttons, and application UI.   |

There is no `severity`, `tone`, `variant`, `status`, `color`, `icon`, `dismissible`, `AlertTitle`, `AlertDescription`, or `AlertItem` API. Those ideas are clearer as application markup and state.

## Choose semantics from the lifecycle

Appearance cannot decide how assistive technology should announce a message.

| Situation                                                   | Markup                                              |
| ----------------------------------------------------------- | --------------------------------------------------- |
| Static guidance already present with the page               | No role                                             |
| Supporting information that is useful but not a live update | `role="note"` when the extra semantic is worthwhile |
| A non-urgent result inserted after an operation             | `role="status"` or an existing polite live region   |
| An urgent failure inserted after the user acts              | `role="alert"`                                      |

Do not put `role="alert"` on every red surface or on every individual field error. A form may announce one error summary while each field keeps its own visible error and `aria-describedby` relationship.

## Compose real checklists

A warnings checklist is still an Alert. The heading, count, items, suggestions, and actions remain native markup so application data and operations stay obvious.

<KleanPreview id="alert-checklist" :source="checklistUsage" filename="DeploymentChecklist.vue">
  <template #preview>
    <div class="mx-auto max-w-3xl">
      <KleanAlert
        as="section"
        role="note"
        aria-labelledby="docs-deployment-checklist-title"
        class="overflow-hidden border border-amber-200 bg-amber-50/50 p-0 text-gray-950 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-white"
      >
        <header class="flex items-center gap-2 px-4 py-3">
          <svg
            aria-hidden="true"
            class="size-4 text-amber-600 dark:text-amber-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v4m0 4h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
            />
          </svg>
          <h2
            id="docs-deployment-checklist-title"
            class="text-sm font-medium text-amber-900 dark:text-amber-200"
          >
            Deployment checklist
          </h2>
          <span class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
            2 need attention
          </span>
        </header>
        <ul class="m-0! list-none! border-t border-amber-200/60 p-0! dark:border-amber-900/40">
          <li
            v-for="item in checklist"
            :key="item.label"
            class="m-0! flex items-start justify-between gap-3 border-b border-amber-200/50 px-4 py-3 last:border-b-0 dark:border-amber-900/30"
          >
            <div class="flex min-w-0 items-start gap-3">
              <span
                :class="[
                  'mt-1 size-2 shrink-0 rounded-full',
                  item.kind === 'warning'
                    ? 'bg-amber-500'
                    : item.kind === 'info'
                      ? 'bg-sky-500'
                      : 'bg-emerald-500'
                ]"
                aria-hidden="true"
              ></span>
              <div class="min-w-0">
                <p class="m-0! text-sm text-gray-900 dark:text-gray-100">{{ item.label }}</p>
                <p class="m-0! mt-0.5! text-xs leading-5 text-gray-600 dark:text-gray-400">{{ item.suggestion }}</p>
              </div>
            </div>
            <KleanButton
              v-if="item.action"
              type="button"
              class="min-h-8 min-w-0 shrink-0 border border-amber-300 bg-transparent px-2.5 py-1 text-xs text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-transparent dark:text-amber-200 dark:hover:bg-amber-900/40"
              @click="runChecklistAction(item.action)"
            >
              {{ item.action }}
            </KleanButton>
            <span v-else class="shrink-0 text-xs font-medium text-emerald-700 dark:text-emerald-400">Ready</span>
          </li>
        </ul>
      </KleanAlert>
      <p role="status" aria-live="polite" aria-atomic="true" class="sr-only">
        {{ lastChecklistAction }}
      </p>
    </div>
  </template>
</KleanPreview>

The list preserves item count and navigation for screen-reader users. Visible words—not colored dots—carry each result. Buttons keep native keyboard behavior, while the application owns pending state, success, failure, and the actual operation.

## Style products, not variants

The same Alert source can serve Hagfish's editorial visual language and Slipway's operational density without naming either treatment in the API.

<KleanPreview id="alert-products" :source="vueUsage" filename="AlertRecipes.vue">
  <template #preview>
    <div class="grid gap-8 lg:grid-cols-2">
      <KleanAlert
        as="section"
        role="note"
        aria-labelledby="docs-invoice-warning-title"
        class="rounded-none border-2 border-black bg-[#fff3c4] p-6 text-black shadow-[5px_5px_0_0_#000] dark:bg-[#fff3c4] dark:text-black"
      >
        <h2 id="docs-invoice-warning-title" class="text-xl font-semibold tracking-tight">
          This invoice has not been sent
        </h2>
        <p class="mt-2 leading-7">Your client cannot view or pay it until you share the invoice link.</p>
        <a href="#alert-products" class="mt-5 inline-flex font-semibold underline underline-offset-4">
          Review sharing options
        </a>
      </KleanAlert>
      <KleanAlert
        as="section"
        role="alert"
        aria-labelledby="docs-source-warning-title"
        class="flex items-start justify-between gap-4 border border-amber-200 bg-amber-50/50 text-gray-950 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-white"
      >
        <div class="min-w-0">
          <h2 id="docs-source-warning-title" class="text-sm font-medium text-amber-900 dark:text-amber-200">
            Deployment source required
          </h2>
          <p class="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400">
            Choose a repository and branch before deploying this application.
          </p>
        </div>
        <KleanButton
          type="button"
          class="min-h-8 min-w-0 shrink-0 border border-amber-300 bg-transparent px-2.5 py-1 text-xs text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-transparent dark:text-amber-200"
        >
          Configure source
        </KleanButton>
      </KleanAlert>
    </div>
  </template>
</KleanPreview>

If a treatment repeats, make a small application-owned wrapper or recipe. Do not move product colors, spacing, icons, or severity mapping into Alert.

## Accessibility

- Use a heading level that fits the page outline; Alert never chooses one.
- Keep icons decorative with `aria-hidden="true"` when visible text already communicates the meaning.
- Do not communicate warning, success, or urgency through color alone.
- Use real buttons for actions and real anchors or Boring Stack Links for navigation.
- Keep dismiss controls explicitly labeled and application-owned.
- Ensure urgent messages are inserted after the live region exists; a server-rendered alert already present at page load may not be announced.
- Prefer one form error summary instead of many simultaneous assertive announcements.

## Durable behavior

Alert owns no open, dismissed, loading, or severity state. Static guidance simply renders. Operation results derive from application state. If dismissal must survive navigation or sessions, the application chooses the correct Durable UI home and keeps a recovery path where the information matters.

Buttons inside an Alert own no hidden work. Pending state, cancellation, rollback, and error recovery remain with the operation that produced the message.

## When to use

Use Alert for visible information that deserves a distinct surface: a warning, form summary, operation result, recovery instruction, compatibility note, or short checklist of blockers.

## When not to use

- Use [Toast](/klean-ui/components/toast) for transient notification queues that should not occupy document layout.
- Use ordinary text when spacing and typography already make the message clear.
- Use [Dialog](/klean-ui/components/dialog) when the user must make a focused modal decision.
- Use field errors beside [Input](/klean-ui/components/input) and [Textarea](/klean-ui/components/textarea), with one optional summary for the form.

## Complete framework source

Copy, inspect, and change the complete source for your framework.

### Vue source

<CopyCode :code="alertSource" label="Alert.vue" />

### React source

<CopyCode :code="reactSource" label="Alert.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Alert.svelte" />

## Related components

- [Button](/klean-ui/components/button) — supplies truthful actions and navigation inside an Alert.
- [Toast](/klean-ui/components/toast) — handles transient queued notifications.
- [Dialog](/klean-ui/components/dialog) — handles focused modal decisions.
- [Input](/klean-ui/components/input) — keeps field-level errors and relationships close to the field.
