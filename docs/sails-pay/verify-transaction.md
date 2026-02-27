---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Verify transaction
titleTemplate: Sails Pay
description: Learn how to verify payment transactions with Sails Pay
prev:
  text: Creating checkouts
  link: /sails-pay/checkout
next:
  text: Retrieving subscriptions
  link: /sails-pay/subscriptions
editLink: true
---

# Verify transaction

The `sails.pay.verify()` method verifies the status of a payment transaction by its reference. This is useful for confirming payment status directly with the provider, independent of webhooks.

::: info Adapter support

- [Paystack](/sails-pay/paystack)
  :::

## Basic usage

```js
const transaction = await sails.pay.verify({
  reference: 'TXN-1708963200000-ABC123'
})
```

The method returns the full transaction object from the payment provider, including `status`, `amount`, `currency`, and `metadata`.

## Example in an action

Here's a complete example using Actions2:

```js
module.exports = {
  friendlyName: 'Verify payment',

  description: 'Verify a payment transaction by its reference.',

  inputs: {
    reference: {
      type: 'string',
      required: true,
      description: 'The transaction reference to verify.'
    }
  },

  exits: {
    success: {
      description: 'Transaction verified successfully.'
    },
    paymentError: {
      description: 'Could not verify the transaction.',
      responseType: 'serverError'
    }
  },

  fn: async function ({ reference }) {
    try {
      const transaction = await sails.pay.verify({ reference })

      return {
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        paidAt: transaction.paid_at
      }
    } catch (error) {
      sails.log.error('Payment verification error:', error)
      throw 'paymentError'
    }
  }
}
```

## Parameters

### Paystack parameters

| Parameter   | Type   | Required | Description                                                |
| ----------- | ------ | -------- | ---------------------------------------------------------- |
| `reference` | String | Yes      | The transaction reference used to initiate the transaction |
| `secretKey` | String | No       | Override the configured secret key                         |

## Response

The response contains the full transaction object from Paystack. Here's an example of the data structure:

```js
{
  id: 5875134045,
  domain: 'live',
  status: 'success',
  reference: 'TXN-1708963200000-ABC123',
  amount: 450000,
  message: null,
  gateway_response: 'Successful',
  paid_at: '2026-02-26T10:30:00.000Z',
  created_at: '2026-02-26T10:29:53.000Z',
  channel: 'card',
  currency: 'NGN',
  ip_address: '143.105.174.31',
  metadata: {
    context: 'credit-purchase',
    userId: 1,
    credits: 50,
    packs: 1,
    paymentReference: 'TXN-1708963200000-ABC123'
  },
  fees: 16750,
  authorization: {
    authorization_code: 'AUTH_xxx',
    bin: '408408',
    last4: '4081',
    channel: 'card',
    card_type: 'visa',
    bank: 'TEST BANK',
    country_code: 'NG',
    brand: 'visa',
    reusable: true
  },
  customer: {
    id: 342381770,
    email: 'customer@example.com',
    customer_code: 'CUS_xxx'
  },
  plan: null,
  requested_amount: 450000
}
```

::: tip Transaction statuses
Paystack transactions can have the following statuses:

- **`success`** — Payment was completed successfully
- **`abandoned`** — Customer started checkout but didn't complete payment
- **`failed`** — Payment attempt failed
  :::

## Common use cases

### Payment reconciliation

Use `verify()` in a background job to catch payments that webhooks may have missed:

```js
// In a scheduled script (e.g. scripts/reconcile-purchases.js)
const pending = await CreditTransaction.find({
  type: 'purchase',
  status: 'pending',
  createdAt: { '>=': Date.now() - 48 * 60 * 60 * 1000 }
})

for (const txn of pending) {
  const paystackTxn = await sails.pay
    .provider('paystack')
    .verify({ reference: txn.paymentReference })

  if (paystackTxn.status === 'success') {
    // Fulfill the purchase
  }
}
```

### Callback page verification

Verify a transaction when the user returns from the Paystack checkout page:

```js
module.exports = {
  friendlyName: 'Payment callback',

  inputs: {
    reference: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function ({ reference }) {
    const transaction = await sails.pay.verify({ reference })

    if (transaction.status === 'success') {
      return '/payment/success'
    }

    return '/payment/failed'
  }
}
```

## Using a specific provider

If you have multiple payment providers configured, you can specify which one to use:

```js
// Use the default provider
const transaction = await sails.pay.verify({ reference: '...' })

// Use a specific provider
const transaction = await sails.pay
  .provider('paystack')
  .verify({ reference: '...' })
```

## Additional resources

- [Paystack Verify Transaction API](https://paystack.com/docs/api/transaction/#verify)
