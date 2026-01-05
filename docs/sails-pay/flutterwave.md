---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Flutterwave
titleTemplate: Sails Pay
description: Learn how to use the Flutterwave adapter for Sails Pay
prev:
  text: Lemon Squeezy
  link: /sails-pay/lemonsqueezy
next:
  text: Paga
  link: /sails-pay/paga
editLink: true
---

# Flutterwave

[Flutterwave](https://flutterwave.com) is Africa's leading payment technology company, founded in 2016 and headquartered in San Francisco. The company provides payment infrastructure that enables businesses to accept payments from customers across Africa and globally.

## Why Flutterwave?

Flutterwave has established itself as a powerhouse in African fintech with impressive reach and capabilities:

- **Extensive Coverage**: Operates in 34+ African countries with regulatory licenses in the US, UK, EU, Canada, and India
- **Multi-Currency Support**: Accept payments in 30+ currencies
- **Multiple Payment Methods**: Cards, bank transfers, mobile money, USSD, and more
- **Proven Scale**: Processed $1 billion for East Asian merchants in H1 2025 alone
- **Enterprise Ready**: Used by global brands including Microsoft, Uber, and Booking.com

## Getting Started with Flutterwave

Before integrating Flutterwave with Sails Pay, you'll need a Flutterwave account:

1. **Create a sandbox account**: Sign up at [Flutterwave Sandbox](https://onboarding.flutterwave.com/signup/steps/670fd6ca31db5a18fd7d03a7) to get started with their v4 API
2. **Get API credentials**: Access your test API keys from the sandbox dashboard
3. **Test your integration**: Use the sandbox to explore APIs and test webhooks
4. **Go live**: Once ready, complete KYC verification for production access

### What you get with a Sandbox account

- **Test API Keys**: Explore and test Flutterwave APIs, and generate secret keys to securely grant your applications access to sensitive data and functions
- **Test Webhooks**: Securely test how your applications handle real-time data updates, ensuring everything works smoothly before going live

::: tip
Start with a [Sandbox account](https://onboarding.flutterwave.com/signup/steps/670fd6ca31db5a18fd7d03a7) to develop and test your integration. Test credentials start with `FLWPUBK_TEST-` and `FLWSECK_TEST-`.
:::

## Installation

### Specifying the adapter

In `config/pay.js` create a `default` payment provider and set the `adapter` property to `@sails-pay/flutterwave`.

```js
module.exports.pay = {
  providers: {
    default: {
      adapter: '@sails-pay/flutterwave'
    }
  }
}
```

::: tip
Do well to run `npm i @sails-pay/flutterwave` if you haven't installed the adapter previously.
:::

## Configuration

You can configure the Flutterwave adapter for both production and local development.

### Local development

In your `config/local.js` specify the following object:

```js
module.exports = {
  pay: {
    providers: {
      default: {
        clientId: 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxx',
        clientSecret: 'FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxxx',
        encryptionKey: 'FLWSECK_TESTxxxxxxxxxxxxxxxx'
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
      adapter: '@sails-pay/flutterwave',
      clientId: process.env.FLUTTERWAVE_CLIENT_ID,
      clientSecret: process.env.FLUTTERWAVE_SECRET,
      encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY
    }
  }
}
```

::: tip
Note we are using environment variables in production as you don't want to commit those credentials to source control.
:::

## Configuring values

If you're unsure how to obtain the configuration values shown above, please refer to the links and instructions provided below:

### **`clientId`**, **`clientSecret`**, and **`encryptionKey`**

To get your Flutterwave API credentials:

1. Log in to your [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Click on **Settings** from the left sidebar
3. Select **API Keys** under the Developers tab
4. Copy your **Public Key** (use as `clientId`), **Secret Key** (use as `clientSecret`), and **Encryption Key**
5. Use test mode keys for development (starting with `FLWPUBK_TEST-` and `FLWSECK_TEST-`)
6. Switch to live mode for production keys

::: warning
Keep your secret key and encryption key secure! Never commit them to source control or expose them in client-side code.
:::

## Default environment variables

If you don't provide configuration values, the adapter will automatically look for these environment variables as fallbacks:

| Config Value    | Environment Variable         |
| --------------- | ---------------------------- |
| `clientId`      | `FLUTTERWAVE_CLIENT_ID`      |
| `clientSecret`  | `FLUTTERWAVE_SECRET`         |
| `encryptionKey` | `FLUTTERWAVE_ENCRYPTION_KEY` |

This means you can simply set the environment variables and use a minimal configuration:

```js
module.exports.pay = {
  providers: {
    default: {
      adapter: '@sails-pay/flutterwave'
    }
  }
}
```

## Next steps

- [Creating checkouts](/sails-pay/checkout) - Redirect users to complete payment

## Additional resources

- [Flutterwave API Documentation](https://developer.flutterwave.com/)
- [Flutterwave Dashboard](https://dashboard.flutterwave.com)
- [Standard Payment Integration Guide](https://developer.flutterwave.com/docs/collecting-payments/standard)
- [API Reference](https://developer.flutterwave.com/reference)
