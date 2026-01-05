---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Lemon Squeezy
titleTemplate: Sails Pay
description: Learn how to use the Lemon Squeezy adapter for Sails Pay
prev:
  text: Providers
  link: /sails-pay/providers
next:
  text: Flutterwave
  link: /sails-pay/flutterwave
editLink: true
---

# Lemon Squeezy

[Lemon Squeezy](https://www.lemonsqueezy.com) is an all-in-one platform designed specifically for selling digital products and software. Founded in 2020 and acquired by Stripe in 2024, Lemon Squeezy acts as your merchant of record—handling payments, merchant fees, fraud prevention, and sales tax compliance so you can focus on building your product.

## Why Lemon Squeezy?

Lemon Squeezy stands out as the ideal choice for digital product creators and SaaS businesses:

- **Merchant of Record**: Lemon Squeezy handles all tax compliance, fraud prevention, and legal responsibilities
- **Global Reach**: Accept payments from 135+ countries with zero additional setup
- **No Monthly Fees**: Simple 5% + 50¢ per transaction pricing with no subscription costs
- **16 Payment Methods**: Including PayPal, credit cards, and regional payment options out of the box
- **Built for Digital**: Native support for software licenses, subscriptions, digital downloads, and courses
- **AI Fraud Detection**: Real-time fraud prevention across signups, refunds, and transactions

## Getting Started with Lemon Squeezy

Before integrating Lemon Squeezy with Sails Pay, you'll need a Lemon Squeezy account:

1. **Create an account**: Sign up at [app.lemonsqueezy.com](https://app.lemonsqueezy.com)
2. **Set up your store**: Create a store and configure your business details
3. **Create products**: Add your digital products, subscriptions, or software licenses
4. **Get API credentials**: Generate an API key from your dashboard settings
5. **Configure webhooks**: Set up webhook endpoints and obtain your signing secret

::: tip
Lemon Squeezy uses test mode by default for new stores. You can build and test your integration completely before enabling live payments.
:::

## Installation

### Specifying the adapter

In `config/pay.js` create a `default` payment provider and set the `adapter` property to `@sails-pay/lemonsqueezy`.

```js
module.exports.pay = {
  providers: {
    default: {
      adapter: '@sails-pay/lemonsqueezy'
    }
  }
}
```

::: tip
Do well to run `npm i @sails-pay/lemonsqueezy` if you haven't installed the adapter previously.
:::

## Configuration

You can configure the Lemon Squeezy adapter for both production and local development.

### Local development

In your `config/local.js` specify the following object:

```js
module.exports = {
  pay: {
    providers: {
      default: {
        apiKey: 'iQtuubSnpmDLj62HjyjCSbvPIv2AixLKkG4cWGudptk_LT',
        store: '12055',
        redirectUrl: 'http://localhost:1337',
        signingSecret: '8WCUCGNLi+2mqc+AF/QT6DidAA8GhV8='
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
      adapter: '@sails-pay/lemonsqueezy',
      store: process.env.LEMON_SQUEEZY_STORE,
      apiKey: process.env.LEMON_SQUEEZY_API_KEY,
      redirectUrl: process.env.LEMON_SQUEEZY_REDIRECT_URL,
      signingSecret: process.env.LEMON_SQUEEZY_SIGNING_SECRET
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

Check out how to [create an API key](https://docs.lemonsqueezy.com/guides/developer-guide/getting-started#create-an-api-key) on your Lemon Squeezy dashboard.

### **`store`**

To find your Lemon Squeezy Store ID, go to your Lemon Squeezy dashboard's [Stores settings page](https://app.lemonsqueezy.com/settings/stores).

The ID is the number next to your store's name.

### **`redirectUrl`**

Redirect URL is a custom URL to redirect to after a successful purchase.

You can set this to redirect users to any page within your app after they've successfully completed their purchase.

### **`signingSecret`**

This is a secret (usually a random string) between 6 and 40 characters that will be used to sign each request.

You should validate against this secret on each incoming webhook so you can verify that the request came from Lemon Squeezy.

## Default environment variables

If you don't provide configuration values, the adapter will automatically look for these environment variables as fallbacks:

| Config Value    | Environment Variable           |
| --------------- | ------------------------------ |
| `apiKey`        | `LEMON_SQUEEZY_API_KEY`        |
| `store`         | `LEMON_SQUEEZY_STORE`          |
| `redirectUrl`   | `LEMON_SQUEEZY_REDIRECT_URL`   |
| `signingSecret` | `LEMON_SQUEEZY_SIGNING_SECRET` |

This means you can simply set the environment variables and use a minimal configuration:

```js
module.exports.pay = {
  providers: {
    default: {
      adapter: '@sails-pay/lemonsqueezy'
    }
  }
}
```

## Next steps

- [Creating checkouts](/sails-pay/checkout) - Redirect users to complete payment
- [Retrieving subscriptions](/sails-pay/subscriptions) - Get subscription details

## Additional resources

- [Lemon Squeezy Documentation](https://docs.lemonsqueezy.com/)
- [Lemon Squeezy Dashboard](https://app.lemonsqueezy.com)
- [API Reference](https://docs.lemonsqueezy.com/api)
- [Developer Guide](https://docs.lemonsqueezy.com/guides/developer-guide/getting-started)
