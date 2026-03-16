---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/social.png
title: Web Push Adapter
titleTemplate: Sails Flare
description: Built-in Web Push adapter for browser push notifications
prev:
  text: Firing Notifications
  link: /sails-flare/firing-notifications
next:
  text: Client Integration
  link: /sails-flare/client-integration
editLink: true
---

# Web Push Adapter

The Web Push adapter is built into Sails Flare. It delivers browser push notifications using the [Web Push protocol](https://web.dev/articles/push-notifications-web-push-protocol) via the `web-push` npm package.

## How it works

1. **Your server** signs a push message with your VAPID private key
2. **The push service** (Google FCM, Mozilla autopush, Apple) delivers it to the user's browser
3. **Your service worker** receives the push event and shows a notification

No third-party notification service needed — you're talking directly to the browser vendors' push infrastructure.

## Setup

Install `web-push` in your app:

```sh
npm i web-push
```

Generate VAPID keys:

```sh
npx web-push generate-vapid-keys
```

Configure the adapter in `config/notifications.js`:

```js
module.exports.notifications = {
  provider: 'web-push',
  providers: {
    'web-push': {
      adapter: 'web-push',
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
      vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
      vapidSubject: process.env.VAPID_SUBJECT || 'mailto:support@yourapp.com'
    }
  }
}
```

## PushSubscription model

The adapter expects a `PushSubscription` Waterline model that stores browser subscriptions. Each row represents one device/browser:

```js
// api/models/PushSubscription.js
module.exports = {
  tableName: 'push_subscriptions',
  attributes: {
    subscription: { type: 'json', required: true },
    endpoint: { type: 'string', required: true },
    user: { model: 'User' }
  }
}
```

| Column         | Purpose                                                                       |
| -------------- | ----------------------------------------------------------------------------- |
| `subscription` | Full browser `PushSubscription` object `{ endpoint, keys: { p256dh, auth } }` |
| `endpoint`     | Extracted endpoint URL for fast lookups and deduplication                     |
| `user`         | Association to your `User` model                                              |

## API endpoints

You need two routes for the client to manage subscriptions:

### Subscribe

```js
// api/controllers/push/subscribe.js
module.exports = {
  friendlyName: 'Subscribe to push notifications',

  inputs: {
    subscription: { type: 'ref', required: true }
  },

  fn: async function ({ subscription }) {
    const userId = this.req.session.userId

    // Upsert: update keys if endpoint already exists
    const existing = await PushSubscription.findOne({
      endpoint: subscription.endpoint,
      user: userId
    })

    if (existing) {
      await PushSubscription.updateOne({ id: existing.id }).set({
        subscription
      })
    } else {
      await PushSubscription.create({
        subscription,
        endpoint: subscription.endpoint,
        user: userId
      })
    }

    return { ok: true }
  }
}
```

### Unsubscribe

```js
// api/controllers/push/unsubscribe.js
module.exports = {
  friendlyName: 'Unsubscribe from push notifications',

  inputs: {
    endpoint: { type: 'string', required: true }
  },

  fn: async function ({ endpoint }) {
    await PushSubscription.destroy({
      endpoint,
      user: this.req.session.userId
    })
    return { ok: true }
  }
}
```

### Routes

```js
// config/routes.js
'POST /api/push/subscribe': 'push/subscribe',
'DELETE /api/push/subscribe': 'push/unsubscribe',
```

### Policies

```js
// config/policies.js
'push/*': 'is-authenticated',
```

## Service worker

Your service worker needs two event listeners to handle incoming push messages and notification clicks:

```js
// sw.js

// Handle incoming push messages
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const { title, body, url, icon, badge, tag } = data

  event.waitUntil(
    self.registration.showNotification(title || 'My App', {
      body,
      icon: icon || '/images/icon-192.png',
      badge: badge || '/images/icon-192.png',
      data: { url: url || '/' },
      tag
    })
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if (new URL(client.url).origin === self.location.origin) {
            return client.focus().then(() => client.navigate(targetUrl))
          }
        }
        return self.clients.openWindow(targetUrl)
      })
  )
})
```

## VAPID key in HTML

For the client to subscribe, it needs the VAPID public key. Expose it via a meta tag:

```html
<!-- views/layout.ejs or equivalent -->
<meta
  name="vapid-public-key"
  content="<%= sails.config.notifications?.providers?.['web-push']?.vapidPublicKey || '' %>"
/>
```

The client reads this meta tag instead of hardcoding the key.

## Subscription lifecycle

1. **Subscribe**: User clicks "Enable notifications" → browser prompts for permission → client calls `pushManager.subscribe()` with VAPID public key → sends subscription to `POST /api/push/subscribe`
2. **Deliver**: Server calls `sails.flare.fire(userId, payload)` → hook queries `PushSubscription.find({ user })` → adapter calls `webPush.sendNotification()` for each
3. **Expire**: When a subscription returns 410/404, the hook auto-destroys the record
4. **Unsubscribe**: User clicks "Disable notifications" → client calls `subscription.unsubscribe()` → sends endpoint to `DELETE /api/push/subscribe`
