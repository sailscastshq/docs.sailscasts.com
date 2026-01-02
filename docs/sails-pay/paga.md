---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Paga
titleTemplate: Sails Pay
description: Learn how to use the Paga adapter for Sails Pay
prev:
  text: Getting started
  link: /sails-pay/getting-started
next: false
editLink: true
---

# Paga

### Specifying the adapter

In `config/pay.js` create a `default` payment provider and set the `adapter` property to `@sails-pay/paga`.

```js
module.exports.pay = {
  providers: {
    default: {
      adapter: '@sails-pay/paga'
    }
  }
}
```

::: tip
Do well to run `npm i @sails-pay/paga` if you haven't installed the adapter previously.
:::

## Configuration

You can configure the Paga adapter for both production and local development.

### Local development

In your `config/local.js` specify the following object:

```js
module.exports = {
  pay: {
    providers: {
      default: {
        publicKey: 'test_xxxxxxxxxxxxxxxxxxxxxx',
        secretKey: 'test_xxxxxxxxxxxxxxxxxxxxxx'
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
      adapter: '@sails-pay/paga',
      publicKey: process.env.PAGA_PUBLIC_KEY,
      secretKey: process.env.PAGA_SECRET_KEY
    }
  }
}
```

::: tip
Note we are using environment variables in production as you don't want to commit those credentials to source control.
:::

## Configuring values

If you're unsure how to obtain the configuration values shown above, please refer to the links and instructions provided below:

### **`publicKey`** and **`secretKey`**

To get your Paga API keys:

1. Log in to your [Paga Business Dashboard](https://www.mypaga.com/paga-business/)
2. Navigate to **Settings** → **Developers** → **API Keys**
3. Copy your **Public Key** and **Secret Key**
4. Use test keys for development and live keys for production

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
  email: 'customer@example.com',
  reference: 'ORDER-12345'
})

return res.redirect(checkoutUrl)
```

#### With all options

```js
const checkoutUrl = await sails.pay.checkout({
  amount: 50000,
  email: 'customer@example.com',
  reference: 'ORDER-12345',
  currency: 'NGN',
  callbackUrl: 'https://yourdomain.com/payment/callback',
  customerName: 'John Doe',
  customerPhone: '+2348012345678',
  metadata: JSON.stringify({
    orderId: '12345',
    customerId: 'CUST-789'
  })
})

return res.redirect(checkoutUrl)
```

### Parameters

All parameters for `sails.pay.checkout()`:

| Parameter       | Type   | Required | Description                                                                |
| --------------- | ------ | -------- | -------------------------------------------------------------------------- |
| `amount`        | Number | Yes      | Amount in the smallest currency unit (kobo for NGN). E.g., 50000 = ₦500.00 |
| `email`         | String | Yes      | Customer's email address                                                   |
| `reference`     | String | Yes      | Unique transaction reference for your records                              |
| `currency`      | String | No       | Transaction currency. Defaults to "NGN". Supports "NGN" and "USD"          |
| `callbackUrl`   | String | No       | URL to redirect to after payment completion                                |
| `customerName`  | String | No       | Customer's full name                                                       |
| `customerPhone` | String | No       | Customer's phone number in international format                            |
| `metadata`      | String | No       | Stringified JSON object of custom data for your records                    |

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
    },
    customerName: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function ({ amount, email, customerName }) {
    const reference = `ORD-${Date.now()}`

    const checkoutUrl = await sails.pay.checkout({
      amount: amount * 100,
      email,
      customerName,
      reference,
      currency: 'NGN',
      callbackUrl: `${sails.config.custom.baseUrl}/payment/verify`
    })

    return checkoutUrl
  }
}
```

## About Paga

Paga is Nigeria's leading mobile payment platform trusted by over 30 million users. It offers:

- **Mobile-first approach**: Perfect for Nigeria's mobile-centric market
- **Multiple payment channels**: Bank transfers, mobile wallets, cards, and USSD
- **Competitive rates**: 1.5% on local transactions with same-day settlement
- **Wide reach**: 17m+ users and 27,000+ financial service access points
- **Regulatory compliance**: Licensed by the Central Bank of Nigeria (CBN)

## Additional resources

- [Paga Business API Documentation](https://www.mypaga.com/pagabusiness.html)
- [Paga Business Dashboard](https://www.mypaga.com/paga-business/)
- [API Integration Guide](https://developer.mypaga.com/)
