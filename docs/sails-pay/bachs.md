---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Bachs
titleTemplate: Sails Pay
description: Learn how to use the Bachs adapter for Sails Pay
prev:
  text: Paystack
  link: /sails-pay/paystack
next:
  text: Creating checkouts
  link: /sails-pay/checkout
editLink: true
---

# Bachs

[Bachs](https://bachs.io) is a billing and payments platform for hosted checkout, product-based payments, webhook-confirmed collections, refunds, and multi-currency payment flows.

The `@sails-pay/bachs` adapter lets Sails applications create Bachs hosted checkouts through the same `sails.pay.checkout()` API used by other Sails Pay providers.

## Provider capabilities

Relevant Bachs capabilities include:

- **Checkout Sessions**: Create hosted product checkouts from Bachs products or product collections.
- **Pure Checkout**: Create hosted checkouts from runtime amount and currency data.
- **Charge verification**: Retrieve charge status with `sails.pay.verify({ chargeId })`.
- **Checkout lookup**: Fetch checkout or checkout-session details after redirect or webhook delivery.
- **Customer portal sessions**: Create fresh, short-lived billing management URLs with `sails.pay.customer.portal({ customerId })`.
- **Webhook signatures**: Verify `X-Bachs-Timestamp` and `X-Bachs-Signature` using HMAC SHA-256.
- **Refunds**: Create full or partial refunds for completed charges.

## Getting started with Bachs

Before integrating Bachs with Sails Pay:

1. Create a Bachs account at [bachs.io](https://bachs.io).
2. Generate a sandbox or live secret API key.
3. Grant the API key `customers:write` if your application will create customer portal sessions.
4. Create products in Bachs if you want product-based checkout sessions.
5. Configure a webhook destination and copy its signing secret.
6. Add return and cancel URLs for your application.

::: tip
Use sandbox keys starting with `sk_sandbox_` during development. The adapter automatically uses `https://sandbox-api.bachs.io` for sandbox keys unless you provide `baseUrl`.
:::

## Installation

Install Sails Pay and the Bachs adapter:

```sh
npm i sails-pay @sails-pay/bachs
```

::: info
Customer portal sessions require `@sails-pay/bachs` 0.0.2 or later.
:::

## Specifying the adapter

In `config/pay.js`, create a payment provider and set the `adapter` property to `@sails-pay/bachs`.

```js
module.exports.pay = {
  provider: 'default',
  providers: {
    default: {
      adapter: '@sails-pay/bachs'
    }
  }
}
```

## Configuration

You can configure the Bachs adapter for both production and local development.

### Local development

In `config/local.js`, specify your sandbox values:

```js
module.exports = {
  pay: {
    providers: {
      default: {
        adapter: '@sails-pay/bachs',
        apiKey: 'sk_sandbox_xxxxxxxxxxxxxxxxxxxxxx',
        returnUrl: 'http://localhost:1337/payment/return',
        cancelUrl: 'http://localhost:1337/payment/cancel',
        webhookSecret: 'whsec_xxxxxxxxxxxxxxxxxxxxxx'
      }
    }
  }
}
```

### Production

For production, use environment variables in `config/pay.js`:

```js
module.exports.pay = {
  provider: 'default',
  providers: {
    default: {
      adapter: '@sails-pay/bachs',
      apiKey: process.env.BACHS_API_KEY,
      baseUrl: process.env.BACHS_BASE_URL,
      returnUrl: process.env.BACHS_RETURN_URL,
      cancelUrl: process.env.BACHS_CANCEL_URL,
      webhookSecret: process.env.BACHS_WEBHOOK_SECRET
    }
  }
}
```

::: tip
Do not commit live API keys or webhook secrets. Keep them in environment variables or your deployment platform's secret store.
:::

## Configuring values

### **`apiKey`** (required)

Your Bachs secret API key. Sandbox keys start with `sk_sandbox_`; live keys start with `sk_live_`.

### **`baseUrl`** (optional)

Override the Bachs API base URL.

When omitted, the adapter chooses the base URL from the API key:

| API key prefix | Base URL                       |
| -------------- | ------------------------------ |
| `sk_sandbox_`  | `https://sandbox-api.bachs.io` |
| anything else  | `https://api.bachs.io`         |

### **`returnUrl`** (optional)

The URL Bachs redirects to after a Checkout Session payment. Bachs appends `?checkout_id=<id>` to the return URL.

### **`successUrl`** (optional)

The URL Bachs redirects to after a Pure Checkout payment. You usually only need `returnUrl` when using product Checkout Sessions.

### **`cancelUrl`** (optional)

The URL Bachs redirects to when the customer cancels checkout.

### **`webhookSecret`** (required for webhook verification)

The signing secret for your Bachs webhook destination.

## Default environment variables

If you don't provide configuration values, the adapter will automatically look for these environment variables as fallbacks:

| Config Value    | Environment Variable   |
| --------------- | ---------------------- |
| `apiKey`        | `BACHS_API_KEY`        |
| `baseUrl`       | `BACHS_BASE_URL`       |
| `returnUrl`     | `BACHS_RETURN_URL`     |
| `successUrl`    | `BACHS_SUCCESS_URL`    |
| `cancelUrl`     | `BACHS_CANCEL_URL`     |
| `webhookSecret` | `BACHS_WEBHOOK_SECRET` |

## Product checkout sessions

Use product checkout sessions when your pricing lives in Bachs products.

```js
const checkoutUrl = await sails.pay.checkout({
  items: [{ product: 'prod_abc123', quantity: 1 }],
  customer: {
    email: loggedInUser.email,
    name: loggedInUser.fullName
  },
  reference: purchase.reference,
  metadata: {
    purchase: purchase.id.toString(),
    user: loggedInUser.id.toString()
  },
  returnUrl: `${sails.config.custom.baseUrl}/payment/return`,
  cancelUrl: `${sails.config.custom.baseUrl}/payment/cancel`,
  idempotencyKey: purchase.reference
})
```

The adapter keeps your Sails code camelCase and maps to Bachs snake case at the HTTP boundary:

| Sails Pay input             | Bachs request field            |
| --------------------------- | ------------------------------ |
| `items`                     | `product_cart`                 |
| `items[].product`           | `product_cart[].product_id`    |
| `productCollectionId`       | `product_collection_id`        |
| `billingCurrency`           | `billing_currency`             |
| `allowedPaymentMethodTypes` | `allowed_payment_method_types` |
| `returnUrl`                 | `return_url`                   |
| `cancelUrl`                 | `cancel_url`                   |
| `customer.customerId`       | `customer.customer_id`         |
| `customer.phoneNumber`      | `customer.phone_number`        |
| `idempotencyKey`            | `Idempotency-Key` header       |

::: tip
For product checkout sessions, Bachs requires exactly one of `items` or `productCollectionId`.
:::

## Selection-mode checkout

Use `productCollectionId` when you want customers to choose from a Bachs product collection.

```js
const checkoutUrl = await sails.pay.checkout({
  productCollectionId: 'pgrp_1a2b3c4d5e',
  customer: {
    email: loggedInUser.email,
    name: loggedInUser.fullName
  },
  returnUrl: `${sails.config.custom.baseUrl}/payment/return`,
  cancelUrl: `${sails.config.custom.baseUrl}/payment/cancel`
})
```

## Pure checkout

Use Pure Checkout when you do not want to pre-create Bachs products.

```js
const checkoutUrl = await sails.pay.checkout({
  amount: '50.00',
  currency: 'USD',
  customerEmail: 'customer@example.com',
  customerName: 'Jane Doe',
  successUrl: `${sails.config.custom.baseUrl}/payment/success`,
  cancelUrl: `${sails.config.custom.baseUrl}/payment/cancel`,
  reference: 'order_9876',
  metadata: {
    order: '9876'
  }
})
```

For Pure Checkout, the adapter maps `successUrl` to Bachs `success_url`.

## Checkout lookup

After a Checkout Session payment, Bachs redirects the customer to `returnUrl` with `checkout_id` in the query string.

```js
const checkout = await sails.pay.checkout.get({
  checkoutId: this.req.query.checkout_id
})
```

The checkout includes `charge` once the customer submits payment.

## Customer portal

Create a customer portal session when a customer wants to manage their Bachs billing.

When Bachs is your default provider:

```js
const portalUrl = await sails.pay.customer.portal({
  customerId: 'cust_1a2b3c4d5e6f'
})
```

When Bachs is configured as a named provider:

```js
const portalUrl = await sails.pay.provider('bachs').customer.portal({
  customerId: 'cust_1a2b3c4d5e6f'
})
```

The method calls `POST /v1/customers/{customer_id}/portal-sessions` without a request body and returns the hosted portal URL as a string.

### Required permission

The API key must include the `customers:write` permission. A key without that permission returns a normalized `403` error.

### Configuration

`customer.portal()` uses the same API key and base URL resolution as the other Bachs adapter methods:

- An `apiKey` or `baseUrl` passed to the method takes precedence.
- Otherwise, the method uses the configured Bachs provider values.
- An `sk_sandbox_` key automatically selects `https://sandbox-api.bachs.io`.
- An explicit `baseUrl` is always respected.

```js
const portalUrl = await sails.pay.customer.portal({
  customerId: 'cust_1a2b3c4d5e6f',
  apiKey: sails.config.pay.providers.default.apiKey,
  baseUrl: sails.config.pay.providers.default.baseUrl
})
```

In most applications, configure `apiKey` and `baseUrl` once in `config/pay.js` rather than passing them on every call.

### Create sessions on demand

Bachs customer portal sessions are short-lived. Create a new session whenever the customer asks to manage billing.

::: warning
Do not cache, persist, or reuse the returned portal URL. The adapter creates a fresh session for every call.
:::

A typical Sails action can redirect the customer immediately:

```js
module.exports = {
  friendlyName: 'Open billing portal',

  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function () {
    return sails.pay.customer.portal({
      customerId: this.req.me.bachsCustomerId
    })
  }
}
```

Portal session failures use the Bachs adapter's normalized error path, including `401`, `403`, `404`, `429`, `500`, and `503` responses. A successful response without a valid `url` also exits through `couldNotCreatePortalUrl`.

## Charge verification

Bachs verifies payments by `chargeId`, not by checkout reference.

```js
const charge = await sails.pay.verify({
  chargeId: 'chr_1a2b3c4d5e6f'
})
```

If your app only has `checkoutId`, fetch the checkout first with `sails.pay.checkout.get({ checkoutId })` and read `checkout.charge.charge_id`.

## Webhook signature verification

Bachs signs webhook deliveries with `X-Bachs-Timestamp` and `X-Bachs-Signature`.

```js
const isValid = await sails.pay.webhooks.verify({
  rawBody: this.req.rawBody,
  timestamp: this.req.get('X-Bachs-Timestamp'),
  signature: this.req.get('X-Bachs-Signature')
})
```

::: warning
Webhook verification requires the exact raw request body. If Sails or another body parser has already parsed and re-serialized the JSON body, the signature can fail even when the event is legitimate.
:::

Important payment events include:

- `collection.succeeded`
- `collection.failed`
- `collection.abandoned`
- `collection.underpaid`

Always grant access from webhook-confirmed payment state, not from the redirect URL alone.

For route handling, invalid signature responses, and idempotency guidance, see [Verifying webhooks](/sails-pay/webhooks).

## Refunds

Create a refund for a completed charge:

```js
const refund = await sails.pay.refund.create({
  chargeId: 'chr_1a2b3c4d5e6f',
  reference: 'refund_9876',
  amount: '25.00',
  reason: 'Customer request',
  idempotencyKey: 'refund_9876'
})
```

## Next steps

- [Creating checkouts](/sails-pay/checkout) - Redirect users to complete payment
- [Create a customer portal session](#customer-portal) - Let customers manage billing
- [Verify transaction](/sails-pay/verify-transaction) - Confirm charge status
- [Verifying webhooks](/sails-pay/webhooks) - Verify provider webhook deliveries

## Additional resources

- [Bachs Checkout Sessions](https://docs.bachs.io/guides/checkout/checkout-sessions)
- [Bachs Pure Checkout](https://docs.bachs.io/guides/checkout/pure-checkout)
- [Get Checkout Session](https://docs.bachs.io/api-reference/checkout-sessions/get-checkout-session)
- [Get Charge Status](https://docs.bachs.io/guides/payments/get-charge-status)
- [Bachs Webhooks](https://docs.bachs.io/guides/webhooks/overview)
- [Create Refund](https://docs.bachs.io/api-reference/refunds/create-refund)
- [Bachs Customer Portal](https://docs.bachs.io/guides/customer-portal/overview)
- [Create Portal Session](https://docs.bachs.io/guides/customer-portal/create-portal-session)
