---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Paystack
titleTemplate: Sails Pay
description: Learn how to use the Paystack adapter for Sails Pay
prev:
  text: Paga
  link: /sails-pay/paga
next:
  text: Creating checkouts
  link: /sails-pay/checkout
editLink: true
---

# Paystack

[Paystack](https://paystack.com) is a Nigerian fintech company that provides online and offline payment solutions for businesses across Africa. Founded in 2015 by Shola Akinlade and Ezra Olubi, Paystack was accepted into Y Combinator in 2016 as the accelerator's first Nigerian startup. In 2020, Paystack was acquired by Stripe for over $200 million—the largest startup acquisition from Nigeria at the time.

## Why Paystack?

Paystack has become the go-to payment gateway for African businesses with compelling advantages:

- **Market Leader**: Processes more than half of all online transactions in Nigeria
- **Trusted by 60,000+ Businesses**: From startups to enterprises like FedEx, UPS, MTN, and AXA Mansard
- **Stripe-Backed**: Benefits from Stripe's global infrastructure and continued investment
- **Developer-First**: Known for excellent documentation, robust APIs, and developer tools
- **Comprehensive Tools**: Includes fraud detection, detailed dashboards, subscription billing, and identity verification

## Getting Started with Paystack

Before integrating Paystack with Sails Pay, you'll need a Paystack account:

1. **Create an account**: Sign up at [dashboard.paystack.com](https://dashboard.paystack.com)
2. **Verify your business**: Complete the KYC process with required documents
3. **Get API credentials**: Access your test and live secret keys from Settings → API Keys
4. **Test your integration**: Use test mode keys (starting with `sk_test_`) during development

::: tip
Paystack provides a robust test environment. Use test credentials to thoroughly test your payment flows before switching to live keys.
:::

## Installation

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

## Default environment variables

If you don't provide configuration values, the adapter will automatically look for these environment variables as fallbacks:

| Config Value | Environment Variable  |
| ------------ | --------------------- |
| `apiKey`     | `PAYSTACK_SECRET_KEY` |

This means you can simply set the environment variables and use a minimal configuration:

```js
module.exports.pay = {
  providers: {
    default: {
      adapter: '@sails-pay/paystack'
    }
  }
}
```

## Next steps

- [Creating checkouts](/sails-pay/checkout) - Redirect users to complete payment

## Additional resources

- [Paystack API Documentation](https://paystack.com/docs/api/)
- [Transaction Initialize API](https://paystack.com/docs/api/transaction/#initialize)
- [Paystack Dashboard](https://dashboard.paystack.com)
- [Metadata Guide](https://paystack.com/docs/payments/metadata/)
