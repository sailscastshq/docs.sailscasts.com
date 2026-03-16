---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/social.png
title: Firing Notifications
titleTemplate: Sails Flare
description: Sending push notifications to users with sails.flare.fire()
prev:
  text: Configuration
  link: /sails-flare/configuration
next:
  text: Web Push Adapter
  link: /sails-flare/web-push
editLink: true
---

# Firing Notifications

The `fire()` method sends a notification to all of a user's subscribed devices. It queries the `PushSubscription` model, delivers to each device in parallel, and auto-cleans expired subscriptions.

## Basic usage

```js
await sails.flare.fire(userId, {
  title: 'Credits added!',
  body: '200 credits have been added to your account.',
  url: '/chat',
  tag: 'credits'
})
```

## Payload

The payload object is passed directly to the adapter's `fire()` method. For the built-in Web Push adapter, the payload is JSON-serialized and sent to the browser's push service.

| Field   | Type   | Description                                                                   |
| ------- | ------ | ----------------------------------------------------------------------------- |
| `title` | string | Notification title (shown as the heading)                                     |
| `body`  | string | Notification body text                                                        |
| `url`   | string | URL to open when the notification is clicked                                  |
| `icon`  | string | URL of the notification icon (defaults to app icon in the service worker)     |
| `badge` | string | URL of the badge icon (small monochrome icon on mobile)                       |
| `tag`   | string | Groups notifications — new notifications with the same tag replace older ones |

::: tip
Use `tag` to prevent notification spam. For example, multiple credit purchases use `tag: 'credits'` so only the latest one shows.
:::

## Multi-device delivery

A single `fire()` call delivers to **every** device the user has subscribed from — phone, laptop, tablet. Under the hood:

1. Query `PushSubscription.find({ user: userId })`
2. Call `adapter.fire()` for each subscription in parallel via `Promise.allSettled`
3. If a device returns 410 (Gone) or 404 (Not Found), the subscription is automatically destroyed

This means one failed device never blocks delivery to others, and stale subscriptions clean themselves up.

## Using a specific channel

If you have multiple channels configured, use `channel()` to target one:

```js
// Uses the default channel
await sails.flare.fire(userId, { title: 'Hello', body: '...' })

// Uses the SMS channel
await sails.flare.channel('sms').fire(userId, { title: 'Hello', body: '...' })
```

## Return value

`fire()` returns an array of `Promise.allSettled` results — one per device subscription:

```js
const results = await sails.flare.fire(userId, { title: 'Hello', body: '...' })
// [
//   { status: 'fulfilled', value: { endpoint: '...', status: 'sent' } },
//   { status: 'fulfilled', value: { endpoint: '...', status: 'expired' } }
// ]
```

Most of the time you don't need to inspect the results — fire and forget.

## Real-world examples

### After a credit purchase (webhook)

```js
// api/controllers/webhook/paystack.js
await sails.flare.fire(userId, {
  title: 'Credits added!',
  body: `${credits} credits have been added to your account.`,
  url: '/chat',
  tag: 'credits'
})
```

### When a contribution is validated

```js
// api/controllers/contribution/vote-contribution.js
await sails.flare.fire(contribution.contributor, {
  title: 'Contribution validated!',
  body: `Your ${contribution.type} contribution in ${contribution.language} was validated.`,
  url: '/contributions',
  tag: 'contribution'
})
```

### Reward credits for validated contribution

```js
// api/helpers/contributions/award-credits.js
if (meta.reason === 'contribution-validated') {
  await sails.flare.fire(userId, {
    title: 'Credits earned!',
    body: `Your contribution was validated! +${credits} credits.`,
    url: '/contributions',
    tag: 'credits'
  })
}
```

## When NOT to fire

Push notifications should be reserved for events the user would want to know about when **not on the site**:

- **Do fire:** Payment received, contribution validated, account milestones
- **Don't fire:** In-app actions the user just triggered (use WebSocket/toasts instead)
- **Don't fire:** Low-value rewards (e.g. +1 credit for casting a vote)
