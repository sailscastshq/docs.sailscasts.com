---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/social.png
title: Client Integration
titleTemplate: Sails Flare
description: Integrating push notifications in your frontend with a Vue composable
prev:
  text: Web Push Adapter
  link: /sails-flare/web-push
next:
  text: Building Adapters
  link: /sails-flare/building-adapters
editLink: true
---

# Client Integration

Sails Flare handles the server side — but you also need client-side code to request permission, subscribe with the browser's push service, and send the subscription to your server.

This page shows a Vue 3 composable that handles all of that. Adapt the pattern for React, Svelte, or vanilla JS as needed.

## Vue composable

```js
// assets/js/composables/push-notifications.js
import { ref, readonly } from 'vue'

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const array = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) {
    array[i] = raw.charCodeAt(i)
  }
  return array
}

const isSupported = ref(
  'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
)
const permission = ref(isSupported.value ? Notification.permission : 'denied')
const isSubscribed = ref(false)
const isLoading = ref(false)

if (isSupported.value) {
  navigator.serviceWorker.ready.then(async (registration) => {
    const sub = await registration.pushManager.getSubscription()
    isSubscribed.value = !!sub
  })
}

export function usePushNotifications() {
  function getVapidKey() {
    const meta = document.querySelector('meta[name="vapid-public-key"]')
    return meta?.content || ''
  }

  async function requestPermission() {
    if (!isSupported.value) return
    isLoading.value = true
    try {
      const result = await Notification.requestPermission()
      permission.value = result
      if (result !== 'granted') return

      const vapidKey = getVapidKey()
      if (!vapidKey) return

      const registration = await navigator.serviceWorker.ready
      let subscription = await registration.pushManager.getSubscription()
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        })
      }

      // Send to your server (adapt the HTTP method to your stack)
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: subscription.toJSON() })
      })

      isSubscribed.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function unsubscribe() {
    if (!isSupported.value) return
    isLoading.value = true
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        const endpoint = subscription.endpoint
        await subscription.unsubscribe()
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint })
        })
      }
      isSubscribed.value = false
    } finally {
      isLoading.value = false
    }
  }

  return {
    isSupported: readonly(isSupported),
    permission: readonly(permission),
    isSubscribed: readonly(isSubscribed),
    isLoading: readonly(isLoading),
    requestPermission,
    unsubscribe
  }
}
```

## Usage in a component

```vue
<script setup>
import { usePushNotifications } from '@/composables/push-notifications'

const {
  isSupported,
  permission,
  isSubscribed,
  isLoading,
  requestPermission,
  unsubscribe
} = usePushNotifications()
</script>

<template>
  <button
    v-if="isSupported && permission !== 'denied'"
    @click="isSubscribed ? unsubscribe() : requestPermission()"
    :disabled="isLoading"
  >
    {{ isSubscribed ? 'Disable notifications' : 'Enable notifications' }}
  </button>
</template>
```

## Key behaviors

### Never auto-prompt

The composable never calls `Notification.requestPermission()` on its own. The UI must call `requestPermission()` from a deliberate user gesture (button click). This respects browser UX best practices and avoids permission fatigue.

### Feature detection

`isSupported` checks for `serviceWorker`, `PushManager`, and `Notification` — the three browser APIs required for web push. If any is missing (e.g. older browsers, some in-app webviews), the toggle is hidden entirely.

### Permission states

| State       | Meaning                    | UI behavior                                |
| ----------- | -------------------------- | ------------------------------------------ |
| `'default'` | User hasn't been asked yet | Show "Enable notifications" button         |
| `'granted'` | User allowed notifications | Show active state or "Disable" option      |
| `'denied'`  | User blocked notifications | Hide the button entirely (can't re-prompt) |

### Singleton state

The composable uses module-level refs so state is shared across all components that import it. Calling `requestPermission()` in a header component updates `isSubscribed` everywhere.

## VAPID key delivery

The composable reads the VAPID public key from a `<meta>` tag:

```html
<meta name="vapid-public-key" content="BHHptnie8S3lypy..." />
```

This is rendered server-side from your `config/notifications.js`. See the [Web Push Adapter](/sails-flare/web-push#vapid-key-in-html) page for the EJS template.
