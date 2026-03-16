---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/social.png
title: Building Adapters
titleTemplate: Sails Flare
description: How to build a custom Sails Flare adapter for any notification channel
prev:
  text: Client Integration
  link: /sails-flare/client-integration
editLink: true
---

# Building Adapters

Sails Flare uses an adapter pattern to support any notification channel. Each adapter is a class that implements the `Adapter` interface. This guide shows you how to build one.

## The Adapter interface

Every adapter must implement `initialize()` and `fire()`. The `teardown()` method is optional:

```js
class MyAdapter {
  async initialize(config) {
    /* ... */
  }
  async fire(subscription, payload) {
    /* ... */
  }
  async teardown() {
    /* ... */
  }
}

module.exports = MyAdapter
```

| Method                        | Required | Description                                                                  |
| ----------------------------- | -------- | ---------------------------------------------------------------------------- |
| `initialize(config)`          | Yes      | Called once during `sails.lift()`. Set up connections, validate credentials. |
| `fire(subscription, payload)` | Yes      | Deliver a notification to a single subscription/device.                      |
| `teardown()`                  | No       | Clean up resources on `sails.lower()`.                                       |

::: tip
Flare uses duck typing — no class inheritance required. Any object with `initialize()` and `fire()` methods qualifies as an adapter.
:::

## Scaffold a new adapter

Create a new package:

```
my-adapter/
  index.js
  package.json
```

```json
{
  "name": "@flare/my-channel",
  "version": "0.0.1",
  "main": "index.js"
}
```

## Example: SMS adapter

Here's a minimal SMS adapter using Twilio:

```js
class TwilioSmsAdapter {
  async initialize(config) {
    this.client = require('twilio')(config.accountSid, config.authToken)
    this.fromNumber = config.fromNumber
  }

  async fire(subscription, payload) {
    // subscription.phone is the user's phone number
    await this.client.messages.create({
      to: subscription.phone,
      from: this.fromNumber,
      body: `${payload.title}: ${payload.body}`
    })
  }

  async teardown() {
    // Twilio client is stateless — no cleanup needed
  }
}

module.exports = TwilioSmsAdapter
```

## How adapters are loaded

When Sails lifts, Flare loads adapters in this order:

1. **Built-in adapters**: Check if the adapter name matches a file in `lib/adapters/` (currently just `web-push`)
2. **External adapters**: If not built-in, resolve from the app's `node_modules` using `require()`

This means built-in adapters work with zero dependencies, while external adapters are installed as separate npm packages.

## Configuration flow

The adapter receives the full provider config object in `initialize()`:

```js
// config/notifications.js
module.exports.notifications = {
  providers: {
    sms: {
      adapter: '@flare/sms', // ← resolved via require()
      accountSid: '...', // ← passed to initialize()
      authToken: '...', // ← passed to initialize()
      fromNumber: '+1234567890' // ← passed to initialize()
    }
  }
}
```

Additionally, Flare injects:

- `config.appPath` — the absolute path to your Sails app
- `config.log` — the `sails.log` instance

## Subscription model

The `fire()` method receives a single subscription record from the `PushSubscription` model. For Web Push, this contains `{ endpoint, keys }`. For an SMS adapter, you might store phone numbers in a different model and override how subscriptions are queried.

Currently, Flare always queries `PushSubscription.find({ user: userId })`. Future versions may support adapter-specific subscription models.

## Using your adapter

Install it and add it to `config/notifications.js`:

```js
module.exports.notifications = {
  provider: 'sms',
  providers: {
    sms: {
      adapter: '@flare/sms',
      accountSid: process.env.TWILIO_SID,
      authToken: process.env.TWILIO_TOKEN,
      fromNumber: process.env.TWILIO_FROM
    }
  }
}
```

## Official adapters

| Adapter                           | Channel                    | Package  |
| --------------------------------- | -------------------------- | -------- |
| [Web Push](/sails-flare/web-push) | Browser push notifications | Built-in |

Check the [GitHub repository](https://github.com/sailscastshq/sails-hook-flare) for the latest list.
