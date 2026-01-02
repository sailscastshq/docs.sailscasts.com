---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Paystack
titleTemplate: Sails Pay
description: Learn how to use the Paystack adapter for Sails Pay
prev:
  text: Getting started
  link: /sails-pay/getting-started
next: false
editLink: true
---

# Paystack

### Specifying the adapter

In `config/pay.js` create a `default` payment provider and set the `adapter` property to `@sails-pay/paystack`.

```js
module.exports.pay = {
  providers: {
    default: {
      adapter: '@sails-pay/paystack'
    }
  }
}
```

::: tip
Do well to run `npm i @sails-pay/paystack` if you haven't installed the adapter previously.
:::

## Configuration

You can configure the Paystack adapter for both production and local development.

### Local development

In your `config/local.js` specify the following object:

```js
module.exports = {
  pay: {
    providers: {
      default: {
        apiKey: 'sk_test_xxxxxxxxxxxxxxxxxxxxxx'
      }
    }
  }
}
```

### Production

For production set same properties in the `default` provider but in `config/pay.js`:

```js
module.exports.pay = {
  providers: {
    default: {
      adapter: '@sails-pay/paystack',
      apiKey: process.env.PAYSTACK_SECRET_KEY
    }
  }
}
```

::: tip
Note we are using environment variables in production as you don't want to commit those credentials to source control.
:::

## Configuring values

If you're unsure how to obtain the configuration values shown above, please refer to the links and instructions provided below:

### **`apiKey`**

To get your Paystack API key:

1. Log in to your [Paystack Dashboard](https://dashboard.paystack.com)
2. Navigate to **Settings** → **Developers** → **API Keys & Webhooks**
3. Copy your **Secret Key** (starts with `sk_test_` for test mode or `sk_live_` for production)

::: warning
Keep your secret key secure! Never commit it to source control or expose it in client-side code.
:::

## Usage

### Creating a checkout

The `sails.pay.checkout()` method creates a payment checkout URL that you can redirect your users to for completing their payment.

#### Basic usage

```js
const checkoutUrl = await sails.pay.checkout({
  amount: 50000,
  email: 'customer@example.com'
})

return res.redirect(checkoutUrl)
```

#### With all options

```js
const checkoutUrl = await sails.pay.checkout({
  amount: 50000,
  email: 'customer@example.com',
  currency: 'NGN',
  reference: 'ORDER-12345',
  callbackUrl: 'https://yourdomain.com/payment/callback',
  plan: 'PLN_xxxxxxxxxx',
  invoiceLimit: 12,
  metadata: JSON.stringify({
    orderId: '12345',
    customerId: 'CUST-789'
  }),
  channels: ['card', 'bank', 'ussd'],
  splitCode: 'SPL_xxxxxxxxxx',
  subaccount: 'ACCT_xxxxxxxxxx',
  transactionCharge: 10000,
  bearer: 'account'
})

return res.redirect(checkoutUrl)
```

### Parameters

All parameters for `sails.pay.checkout()`:

| Parameter           | Type   | Required | Description                                                                                                        |
| ------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `amount`            | Number | Yes      | Amount in the smallest currency unit (kobo for NGN). E.g., 50000 = ₦500.00                                         |
| `email`             | String | Yes      | Customer's email address                                                                                           |
| `currency`          | String | No       | Transaction currency (defaults to your integration currency). E.g., "NGN", "USD", "GHS"                            |
| `reference`         | String | No       | Unique transaction reference. Only alphanumeric, hyphens, periods, and equal signs allowed                         |
| `callbackUrl`       | String | No       | URL to redirect to after payment. Overrides dashboard callback URL for this transaction                            |
| `plan`              | String | No       | Plan code for subscription payments. This invalidates the `amount` parameter                                       |
| `invoiceLimit`      | Number | No       | Number of times to charge customer during subscription                                                             |
| `metadata`          | String | No       | Stringified JSON object of custom data. See [Paystack metadata docs](https://paystack.com/docs/payments/metadata/) |
| `channels`          | Array  | No       | Payment channels to allow. Options: `card`, `bank`, `ussd`, `qr`, `mobile_money`, `bank_transfer`, `eft`           |
| `splitCode`         | String | No       | Split code for transaction split                                                                                   |
| `subaccount`        | String | No       | Subaccount code that owns the payment                                                                              |
| `transactionCharge` | Number | No       | Amount to override split configuration for single split payment                                                    |
| `bearer`            | String | No       | Who bears transaction charges: `account` or `subaccount` (defaults to `account`)                                   |

### Example in an action

```js
module.exports = {
  friendlyName: 'Checkout',
  description: 'Create a payment checkout',

  inputs: {
    amount: {
      type: 'number',
      required: true
    },
    email: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function ({ amount, email }) {
    const checkoutUrl = await sails.pay.checkout({
      amount: amount * 100,
      email,
      currency: 'NGN',
      callbackUrl: `${sails.config.custom.baseUrl}/payment/verify`
    })

    return checkoutUrl
  }
}
```

## Additional resources

- [Paystack API Documentation](https://paystack.com/docs/api/)
- [Transaction Initialize API](https://paystack.com/docs/api/transaction/#initialize)
- [Paystack Dashboard](https://dashboard.paystack.com)
- [Metadata Guide](https://paystack.com/docs/payments/metadata/)
