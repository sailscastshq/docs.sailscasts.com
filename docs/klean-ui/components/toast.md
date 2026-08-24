---
title: Toast
titleTemplate: Klean UI
description: Accessible notifications for Vue, React, and Svelte with caller-owned Tailwind.
outline: [2, 3]
---

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import CopyCode from '../../.vitepress/theme/components/CopyCode.vue'
import KleanInstallation from '../../.vitepress/theme/components/KleanInstallation.vue'
import KleanPreview from '../../.vitepress/theme/components/KleanPreview.vue'
import KleanButton from '../../.vitepress/theme/components/klean/Button.vue'
import KleanToast from '../../.vitepress/theme/components/klean/toast/Toast.vue'
import { createToast } from '../../.vitepress/theme/components/klean/toast/toast.js'
import toastSource from '../../.vitepress/theme/components/klean/toast/Toast.vue?raw'
import controllerSource from '../../.vitepress/theme/components/klean/toast/toast.js?raw'
import reactSource from '../sources/toast/Toast.jsx?raw'
import svelteSource from '../sources/toast/Toast.svelte?raw'
import vueUsage from '../snippets/toast/usage.vue?raw'
import reactUsage from '../snippets/toast/usage.jsx?raw'
import svelteUsage from '../snippets/toast/usage.svelte?raw'
import actionUsage from '../snippets/toast/actions.vue?raw'
import motionUsage from '../snippets/toast/motion.vue?raw'
import longRunningUsage from '../snippets/toast/long-running.vue?raw'
import productUsage from '../snippets/toast/products.vue?raw'

const basicNotifications = createToast()
const actionNotifications = createToast()
const motionNotifications = createToast({ duration: 2600 })
const deploymentNotifications = createToast()
const invoiceNotifications = createToast({ duration: false })
const serviceNotifications = createToast({ duration: false })
const retryCount = ref(0)
const motionFrom = ref('right')
const motionTo = ref('right')
const deploymentStep = ref(-1)
let deploymentId

const deploymentStages = [
  {
    title: 'Preparing deployment',
    message: 'Reading service configuration',
    progress: 12,
    status: 'running'
  },
  {
    title: 'Building image',
    message: 'Installing dependencies',
    progress: 38,
    status: 'running'
  },
  {
    title: 'Starting service',
    message: 'Waiting for the health check',
    progress: 76,
    status: 'running'
  },
  {
    title: 'Deployment live',
    message: 'production.example.com',
    progress: 100,
    status: 'complete'
  }
]

const vueFiles = [
  {
    filename: 'toast.js',
    destination: 'assets/js/components/ui/toast/toast.js',
    source: controllerSource
  },
  {
    filename: 'Toast.vue',
    destination: 'assets/js/components/ui/toast/Toast.vue',
    source: toastSource
  }
]

function showBasicToast() {
  basicNotifications({
    title: 'Changes saved',
    message: 'Your draft is ready.',
    action: { label: 'View API', href: '#api' }
  })
}

function showLinkAction() {
  actionNotifications({
    title: 'Draft saved',
    message: 'Continue when you are ready.',
    action: { label: 'View API', href: '#api' }
  })
}

function showButtonAction() {
  actionNotifications({
    title: 'Connection lost',
    message: 'The request did not finish.',
    action: {
      label: 'Retry',
      onClick() {
        retryCount.value += 1
      }
    }
  })
}

function showMotion(nextFrom, nextTo = nextFrom) {
  motionFrom.value = nextFrom
  motionTo.value = nextTo
  motionNotifications({
    title: `${nextFrom} in · ${nextTo} out`,
    message:
      nextFrom === nextTo
        ? 'Nearby travel stays quick and direct.'
        : 'Long travel receives enough time to remain legible.'
  })
}

function startDeployment() {
  deploymentStep.value = 0
  const stage = deploymentStages[0]
  const notification = {
    ...stage,
    duration: false,
    dismissible: false,
    class: 'dark bg-gray-950 text-white ring-white/15 shadow-2xl'
  }

  if (
    deploymentId &&
    deploymentNotifications.update(deploymentId, notification)
  ) {
    return
  }

  deploymentId = deploymentNotifications(notification)
}

function advanceDeployment() {
  if (!deploymentId) return startDeployment()

  deploymentStep.value = Math.min(
    deploymentStep.value + 1,
    deploymentStages.length - 1
  )
  const stage = deploymentStages[deploymentStep.value]
  const complete = stage.status === 'complete'

  deploymentNotifications.update(deploymentId, {
    ...stage,
    duration: complete ? 5000 : false,
    dismissible: complete
  })
}

function showInvoiceToast() {
  invoiceNotifications({
    title: 'Invoice sent',
    message: 'INV-1042 is on its way to Ada.',
    class:
      'rounded-none border-2 border-black bg-white text-black shadow-[6px_6px_0_0_#000] ring-0'
  })
}

function showServiceToast() {
  serviceNotifications({
    title: 'Service restarted',
    message: 'api-production is healthy.',
    class: 'dark rounded-lg bg-gray-950 text-white ring-white/15 shadow-xl'
  })
}

onBeforeUnmount(() => {
  basicNotifications.destroy()
  actionNotifications.destroy()
  motionNotifications.destroy()
  deploymentNotifications.destroy()
  invoiceNotifications.destroy()
  serviceNotifications.destroy()
})
</script>

# Toast

Toast shows short, non-blocking messages for confirmations, failures, and long-running work.

<KleanPreview id="toast-source" :source="toastSource" filename="Toast.vue">
  <template #preview>
    <div class="relative grid min-h-64 w-full place-items-center overflow-hidden rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
      <div class="grid justify-items-center gap-3 text-center">
        <KleanButton type="button" @click="showBasicToast">
          Show toast
        </KleanButton>
      </div>
      <KleanToast
        :controller="basicNotifications"
        position="top-right"
        class="absolute"
      />
    </div>
  </template>
  <template #source>

<<< ../../.vitepress/theme/components/klean/toast/Toast.vue

  </template>
</KleanPreview>

## Installation

One command detects Vue, React, or Svelte and adds Toast:

<KleanInstallation
  id="toast-installation"
  component="toast"
  :source="toastSource"
  filename="Toast.vue"
  destination="assets/js/components/ui/toast/Toast.vue"
  :files="vueFiles"
  :dependencies="['tailwind-merge']"
/>

The command creates `toast/toast.js` and `toast/Toast.vue`, `Toast.jsx`, or `Toast.svelte` under the conventional components directory. Both files immediately belong to the application. There is no Klean runtime dependency, `klean-ui.json`, provider wrapper, alias questionnaire, or generated `cn.js`.

## Usage

Mount `<Toast />` near the application root. Then call `toast()` wherever a notification is needed.

### Vue

<CopyCode :code="vueUsage" label="AppLayout.vue" />

### React

<CopyCode :code="reactUsage" label="AppLayout.jsx" />

### Svelte

<CopyCode :code="svelteUsage" label="AppLayout.svelte" />

## API

### Calling toast

`toast('Changes saved')` covers the ordinary case. An object adds structure and application metadata:

```js
const id = toast({
  title: 'Changes saved',
  message: 'Your draft is ready.',
  duration: 5000,
  dismissible: true,
  action: { label: 'View draft', href: '/drafts/42' },
  class: 'shadow-xl'
})
```

| Input                 | Default | Purpose                                                                         |
| --------------------- | ------- | ------------------------------------------------------------------------------- |
| string input          | —       | Shorthand for the notification message.                                         |
| `title`               | `''`    | Short notification heading.                                                     |
| `message`             | `''`    | Supporting detail.                                                              |
| `duration`            | `5000`  | Visible time in milliseconds. Use `false` or `0` for externally completed work. |
| `dismissible`         | `true`  | Whether the toast includes its named dismiss button.                            |
| `action`              | —       | `{ label, href }` for an anchor or `{ label, onClick }` for a button.           |
| `class` / `className` | `''`    | Tailwind merged last on the notification item.                                  |
| application metadata  | —       | Any additional fields needed by custom content, such as `progress` or `status`. |

The returned ID identifies the same notification throughout its lifetime:

```js
toast.update(id, patch)
toast.dismiss(id)
toast.clear()
```

`createToast({ duration, max })` creates an independent toast instance for tests or embedded surfaces. The exported `toast` remains the zero-configuration application default.

### Toast props

| Input                 | Default                 | Purpose                                                                                   |
| --------------------- | ----------------------- | ----------------------------------------------------------------------------------------- |
| `controller`          | shared `toast`          | An optional independent toast instance.                                                   |
| `position`            | `top-right`             | `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, or `bottom-right`. |
| `from`                | nearest horizontal edge | Entry direction: `left`, `right`, `top`, `bottom`, `fade`, or `none`.                     |
| `to`                  | nearest horizontal edge | Exit direction using the same values.                                                     |
| `label`               | `Notifications`         | Accessible name for the persistent live region.                                           |
| `class` / `className` | —                       | Tailwind for the viewport shelf. Item styling belongs to `toast({ class })`.              |
| default content       | built-in body           | Vue scoped slot, React function child, or Svelte snippet receiving `{ item, dismiss }`.   |

There is deliberately no `variant`, `tone`, `type`, motion-duration, easing, icon, progress, or theme prop.

## Semantic actions

An action with `href` renders a real anchor. An action with `onClick` renders a real `button type="button"`. Both dismiss after activation, and `action.class` accepts ordinary Tailwind.

<KleanPreview id="toast-actions" :source="actionUsage" filename="toast-actions.vue">
  <template #preview>
    <div class="relative grid min-h-64 w-full place-items-center overflow-hidden rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
      <div class="flex flex-wrap justify-center gap-3">
        <KleanButton type="button" @click="showLinkAction">
          Link action
        </KleanButton>
        <KleanButton
          type="button"
          class="bg-white text-gray-950 ring-1 ring-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
          @click="showButtonAction"
        >
          Button action
        </KleanButton>
      </div>
      <p class="absolute bottom-4 text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
        Retry activated {{ retryCount }} {{ retryCount === 1 ? 'time' : 'times' }}.
      </p>
      <KleanToast
        :controller="actionNotifications"
        position="top-right"
        class="absolute"
      />
    </div>
  </template>
</KleanPreview>

## Motion

Toast enters and leaves toward the nearest edge by default. Use `from` and `to` when the notification should travel in another direction. Reduced-motion preferences are respected automatically.

<KleanPreview id="toast-motion" :source="motionUsage" filename="toast-motion.vue">
  <template #preview>
    <div class="relative grid min-h-64 w-full place-items-center overflow-hidden rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
      <div class="flex flex-wrap justify-center gap-3">
        <KleanButton type="button" @click="showMotion('right')">
          Nearest edge
        </KleanButton>
        <KleanButton type="button" @click="showMotion('top')">
          From top
        </KleanButton>
        <KleanButton
          type="button"
          class="bg-white text-gray-950 ring-1 ring-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
          @click="showMotion('right', 'left')"
        >
          Cross the screen
        </KleanButton>
      </div>
      <KleanToast
        :controller="motionNotifications"
        :from="motionFrom"
        :to="motionTo"
        position="top-right"
        class="absolute"
      />
    </div>
  </template>
</KleanPreview>

## Long-running work

Use `duration: false` when an external event controls completion. Keep the returned ID and update the same notification instead of adding one toast for every status message.

<KleanPreview id="toast-long-running" :source="longRunningUsage" filename="deployment-toast.vue">
  <template #preview>
    <div class="relative grid min-h-80 w-full place-items-center overflow-hidden rounded-xl bg-gray-950 p-6 text-white">
      <div class="grid justify-items-center gap-3 text-center">
        <p class="max-w-md text-sm leading-6 text-gray-300">
          Deploy, then move through the events without creating another toast.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <KleanButton
            type="button"
            class="bg-white text-gray-950 hover:bg-gray-200"
            @click="startDeployment"
          >
            Deploy
          </KleanButton>
          <KleanButton
            type="button"
            class="bg-gray-800 text-white ring-1 ring-gray-700 hover:bg-gray-700"
            @click="advanceDeployment"
          >
            Next event
          </KleanButton>
        </div>
      </div>
      <KleanToast
        :controller="deploymentNotifications"
        position="bottom-right"
        class="absolute"
      >
        <template #default="{ item, dismiss }">
          <article class="col-span-2 grid gap-3" aria-label="Deployment status">
            <div class="flex items-start gap-3">
              <span
                aria-hidden="true"
                class="mt-1 size-2.5 shrink-0 rounded-full"
                :class="
                  item.status === 'complete'
                    ? 'bg-emerald-400'
                    : 'bg-blue-400 motion-safe:animate-pulse'
                "
              />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-white">{{ item.title }}</p>
                <p class="mt-1 truncate text-xs text-gray-300">{{ item.message }}</p>
              </div>
              <button
                v-if="item.dismissible !== false"
                type="button"
                class="grid size-11 cursor-pointer place-items-center rounded-lg text-lg text-gray-400 hover:bg-gray-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Dismiss deployment notification"
                @click="dismiss"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div
              role="progressbar"
              aria-label="Deployment progress"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-valuenow="item.progress"
              class="h-1.5 overflow-hidden rounded-full bg-gray-800"
            >
              <div
                class="h-full rounded-full bg-white transition-[width] duration-300 motion-reduce:transition-none"
                :style="{ width: `${item.progress}%` }"
              />
            </div>
          </article>
        </template>
      </KleanToast>
    </div>
  </template>
</KleanPreview>

## Product styling

The built-in body is deliberately neutral and never maps `success`, `error`, or another type to color or iconography. Pass Tailwind through `class`, or replace the complete body when the product needs icons, actions, progress, or a different structure.

<KleanPreview id="toast-products" :source="productUsage" filename="product-toasts.vue">
  <template #preview>
    <div class="grid w-full max-w-3xl gap-6 sm:grid-cols-2">
      <section class="relative min-h-64 bg-[#f4f0e8] p-6" aria-labelledby="bold-toast-title">
        <div class="grid justify-items-center gap-4 text-center">
          <h2 id="bold-toast-title" class="font-mono text-xs font-medium uppercase tracking-[0.18em] text-gray-600">
            Bold invoice styling
          </h2>
          <KleanButton
            type="button"
            class="rounded-none border-2 border-black bg-black text-white hover:bg-white hover:text-black"
            @click="showInvoiceToast"
          >
            Send invoice
          </KleanButton>
        </div>
        <KleanToast
          :controller="invoiceNotifications"
          position="top-left"
          class="absolute"
        />
      </section>
      <section class="dark relative min-h-64 bg-gray-950 p-6 text-white" aria-labelledby="quiet-toast-title">
        <div class="grid justify-items-center gap-4 text-center">
          <h2 id="quiet-toast-title" class="font-mono text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
            Quiet service styling
          </h2>
          <KleanButton
            type="button"
            class="min-w-0 bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
            @click="showServiceToast"
          >
            Restart service
          </KleanButton>
        </div>
        <KleanToast
          :controller="serviceNotifications"
          position="top-right"
          class="absolute"
        />
      </section>
    </div>
  </template>
</KleanPreview>

## Accessibility and Durable UI contract

- New notifications are announced politely and never steal focus.
- Timers pause while a toast is hovered or focused, and while the page is inactive. They resume with the remaining time.
- Dismiss controls have specific accessible names. Actions use real links or buttons.
- The notification shelf stays above other floating application surfaces, so actions and dismissal remain reachable while a tooltip, menu, popover, or dialog is present.
- `update()` keeps long-running work in one notification.
- Reduced-motion preferences are respected.
- Notifications are temporary and are never persisted in storage or the URL.

## Complete framework source

Copy, inspect, and change the complete source for your framework.

### Controller

<CopyCode :code="controllerSource" label="toast.js" />

### Vue source

<CopyCode :code="toastSource" label="Toast.vue" />

### React source

<CopyCode :code="reactSource" label="Toast.jsx" />

### Svelte source

<CopyCode :code="svelteSource" label="Toast.svelte" />

## Related components

- [Spinner](/klean-ui/components/spinner) — represents work in progress; Toast reports a useful outcome.
- [Button](/klean-ui/components/button) — a truthful toast action or dismissal control.
- [Slide](/klean-ui/components/slide) — confirm consequential work before announcing its result.
- [Schedule Picker](/klean-ui/components/schedule-picker) — choose an instant, then announce the server outcome.
- [Dialog](/klean-ui/components/dialog) — blocking decisions that cannot be reduced to a temporary notification.
