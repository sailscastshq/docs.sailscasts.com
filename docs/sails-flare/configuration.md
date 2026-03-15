---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/social.png
title: Configuration
titleTemplate: Sails Flare
description: Configuring Sails Flare channels, providers, and defaults
prev:
  text: Getting started
  link: /sails-flare/getting-started
next:
  text: Firing Notifications
  link: /sails-flare/firing-notifications
editLink: true
---

# Configuration

All notification configuration lives in `config/notifications.js`. This is where you define channels, set defaults, and configure channel-specific options.

## Basic configuration

```js
// config/notifications.js
module.exports.notifications = {
  // Which channel to use by default
  provider: 'web-push',

  // All configured channels
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

## Multiple channels

You can configure multiple notification channels and switch between them at runtime:

```js
// config/notifications.js
module.exports.notifications = {
  provider: 'web-push', // default channel

  providers: {
    'web-push': {
      adapter: 'web-push',
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
      vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
      vapidSubject: process.env.VAPID_SUBJECT || 'mailto:support@yourapp.com'
    },
    sms: {
      adapter: '@flare/sms',
      accountSid: process.env.TWILIO_SID,
      authToken: process.env.TWILIO_TOKEN,
      fromNumber: process.env.TWILIO_FROM
    }
  }
}
```

Then in your code:

```js
// Uses the default channel (web-push)
await sails.flare.fire(userId, { title: 'Hello', body: '...' })

// Uses a specific channel
await sails.flare.channel('sms').fire(userId, { title: 'Hello', body: '...' })
```

## Environment variables

The Web Push adapter requires three environment variables:

| Variable            | Description                                           | Example                      |
| ------------------- | ----------------------------------------------------- | ---------------------------- |
| `VAPID_PUBLIC_KEY`  | Public key shared with browsers to verify your server | `BHHptnie8S3lypy...`         |
| `VAPID_PRIVATE_KEY` | Private key used to sign push requests (keep secret)  | `6FSHIAGTuCWY8-S...`         |
| `VAPID_SUBJECT`     | Contact URL or `mailto:` identifying the sender       | `mailto:support@yourapp.com` |

Generate VAPID keys with:

```sh
npx web-push generate-vapid-keys
```

::: warning
VAPID keys are generated once and reused permanently. Don't rotate them — changing keys invalidates all existing browser subscriptions.
:::

## Graceful degradation

If no providers are configured (e.g. missing VAPID keys in development), Flare exposes a no-op API. Your app boots normally and `sails.flare.fire()` returns an empty array with a console warning.

This means you can safely call `sails.flare.fire()` in shared code paths without wrapping it in environment checks.

## Provider configuration reference

### `web-push` (built-in)

| Option            | Type   | Required | Description                             |
| ----------------- | ------ | -------- | --------------------------------------- |
| `adapter`         | string | Yes      | Must be `'web-push'`                    |
| `vapidPublicKey`  | string | Yes      | VAPID public key                        |
| `vapidPrivateKey` | string | Yes      | VAPID private key                       |
| `vapidSubject`    | string | Yes      | `mailto:` or URL identifying the sender |
