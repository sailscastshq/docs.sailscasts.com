---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/social.png
title: Getting started
titleTemplate: Sails Flare
description: Getting started with Sails Flare in a Sails.js application
next:
  text: Configuration
  link: /sails-flare/configuration
editLink: true
---

# Getting started

Sails Flare is a multi-channel notification hook for Sails.js. It gives you a clean API to fire push notifications to your users across all their devices — web push today, SMS and email adapters in the future.

The hook uses an **adapter pattern** (same approach as [Sails AI](/sails-ai/)): install the hook, configure a channel, and call `sails.flare.fire()`. Swap channels by changing config.

## Install the hook

```sh
npm i sails-hook-flare
```

## Install the web-push dependency

The built-in Web Push adapter uses the `web-push` npm package. Install it in your app:

```sh
npm i web-push
```

::: tip
`web-push` is installed in your app (not the hook) because the hook resolves it at runtime from your app's `node_modules` — the same pattern Sails AI uses for provider SDKs.
:::

## Generate VAPID keys

VAPID (Voluntary Application Server Identification) keys identify your server to browser push services. Generate a key pair once — they don't expire:

```sh
npx web-push generate-vapid-keys
```

This outputs a public key and private key. You'll need both.

## Set environment variables

Add the keys to your environment:

```sh
VAPID_PUBLIC_KEY=BHHptnie8S3lypyA-z_2r...
VAPID_PRIVATE_KEY=6FSHIAGTuCWY8-Sa1JIR...
VAPID_SUBJECT=mailto:support@yourapp.com
```

Or if you use `config/local.js` for development:

```js
// config/local.js
module.exports = {
  notifications: {
    providers: {
      'web-push': {
        adapter: 'web-push',
        vapidPublicKey: 'BHHptnie8S3lypyA-z_2r...',
        vapidPrivateKey: '6FSHIAGTuCWY8-Sa1JIR...',
        vapidSubject: 'mailto:support@yourapp.com'
      }
    }
  }
}
```

## Create `config/notifications.js`

```js
// config/notifications.js
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

## Create the PushSubscription model

Flare stores one row per device/browser. Create the model:

```js
// api/models/PushSubscription.js
module.exports = {
  tableName: 'push_subscriptions',

  attributes: {
    subscription: {
      type: 'json',
      required: true,
      description:
        'Full browser PushSubscription object { endpoint, keys: { p256dh, auth } }.'
    },
    endpoint: {
      type: 'string',
      required: true,
      description:
        'Push service endpoint URL — extracted for fast lookups and dedup.'
    },
    user: {
      model: 'User'
    }
  }
}
```

## Try it out

Once Sails lifts, you'll see:

```
info: sails-flare: Loaded channel 'web-push'
```

Now fire a notification from any action or helper:

```js
await sails.flare.fire(userId, {
  title: 'Hello!',
  body: 'Your first push notification from Sails Flare.',
  url: '/dashboard',
  tag: 'welcome'
})
```

That's it. Read on to learn about [configuration](/sails-flare/configuration), [firing notifications](/sails-flare/firing-notifications), and [building adapters](/sails-flare/building-adapters).
