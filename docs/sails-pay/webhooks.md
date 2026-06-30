---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Verifying webhooks
titleTemplate: Sails Pay
description: Learn how to verify and handle payment webhooks with Sails Pay
prev:
  text: Verify transaction
  link: /sails-pay/verify-transaction
next:
  text: Retrieving subscriptions
  link: /sails-pay/subscriptions
editLink: true
---

# Verifying webhooks

Payment redirects are useful for user experience, but webhooks are the server-to-server confirmation your application should trust for granting access, marking invoices paid, and reconciling orders.

Sails Pay exposes webhook verification through the provider namespace:

```js
await sails.pay.webhooks.verify({
  // provider-specific signing inputs
})
```

The public API stays the same, while each adapter maps the provider's headers and signing rules internally.

::: info Adapter support

- [Bachs](/sails-pay/bachs)
  :::

## Basic Bachs verification

Bachs signs webhook deliveries with `X-Bachs-Timestamp` and `X-Bachs-Signature`.

```js
const isValid = await sails.pay.webhooks.verify({
  rawBody: this.req.rawBody,
  timestamp: this.req.get('X-Bachs-Timestamp'),
  signature: this.req.get('X-Bachs-Signature')
})
```

The Bachs adapter verifies the HMAC SHA-256 signature, checks the timestamp tolerance, and returns `true` when the delivery is valid.

## Webhook action example

A webhook action should verify the request before it reads the event as trusted payment state.

```js
// api/controllers/webhooks/bachs.js
module.exports = {
  friendlyName: 'Handle Bachs webhook',

  exits: {
    success: {
      statusCode: 200
    },
    unauthorized: {
      statusCode: 401
    }
  },

  fn: async function () {
    try {
      await sails.pay.webhooks.verify({
        rawBody: this.req.rawBody,
        timestamp: this.req.get('X-Bachs-Timestamp'),
        signature: this.req.get('X-Bachs-Signature')
      })
    } catch (error) {
      if (error.exit === 'invalidSignature') {
        throw 'unauthorized'
      }

      throw error
    }

    const event =
      typeof this.req.body === 'string'
        ? JSON.parse(this.req.body)
        : this.req.body

    switch (event.type) {
      case 'collection.succeeded':
        // Mark the order as paid, grant access, or activate the purchase.
        break

      case 'collection.failed':
      case 'collection.abandoned':
      case 'collection.underpaid':
        // Keep the order pending or mark it as failed.
        break

      default:
        sails.log.info(`Unhandled Bachs webhook event: ${event.type}`)
    }

    return { received: true }
  }
}
```

## Route configuration

Webhook endpoints must be publicly reachable by the payment provider.

```js
// config/routes.js
module.exports.routes = {
  'POST /webhooks/bachs': {
    action: 'webhooks/bachs',
    csrf: false
  }
}
```

If your app uses route policies, make sure the webhook endpoint is not behind user authentication.

```js
// config/policies.js
module.exports.policies = {
  'webhooks/*': true
}
```

## Raw request body

Signature verification must use the exact raw request body sent by the provider. If the JSON body has already been parsed and re-serialized, the signature can fail even when the event is legitimate.

Pass the raw body into `sails.pay.webhooks.verify()`:

```js
await sails.pay.webhooks.verify({
  rawBody: this.req.rawBody,
  timestamp: this.req.get('X-Bachs-Timestamp'),
  signature: this.req.get('X-Bachs-Signature')
})
```

## Provider inputs

The method name stays standard, but the signing inputs depend on the active provider.

| Provider | Inputs                                                                                     |
| -------- | ------------------------------------------------------------------------------------------ |
| Bachs    | `rawBody`, `timestamp`, `signature`, optional `webhookSecret`, optional `toleranceSeconds` |

For Bachs, `timestamp` should come from `X-Bachs-Timestamp` and `signature` should come from `X-Bachs-Signature`.

## Response codes

Return `200` after the event is processed or acknowledged. Return `401` when signature verification fails.

| Status | When                                                                    |
| ------ | ----------------------------------------------------------------------- |
| `200`  | Event processed successfully, or an unknown event type was acknowledged |
| `401`  | Missing, stale, or invalid webhook signature                            |

Returning a non-2xx status tells the payment provider to retry delivery. That is useful for temporary failures, but noisy for event types you intentionally do not handle.

## Idempotency

Payment providers can deliver the same webhook more than once. Your handler should be idempotent: processing the same event twice should leave your database in the same final state.

Use provider event IDs, checkout IDs, charge IDs, or your own payment reference to find the existing local record before creating or granting access.

```js
const payment = await Payment.findOne({
  provider: 'bachs',
  chargeId: event.data.charge_id
})

if (payment && payment.status === 'paid') {
  return { received: true }
}
```
