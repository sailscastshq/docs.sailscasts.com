---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Providers
titleTemplate: Sails Pay
description: Learn how to configure and switch between payment providers in Sails Pay
prev:
  text: Getting started
  link: /sails-pay/getting-started
next:
  text: Lemon Squeezy
  link: /sails-pay/lemonsqueezy
editLink: true
---

# Providers

Sails Pay uses a provider-based architecture that lets you integrate with multiple payment gateways. Each provider is an adapter that connects Sails Pay to a specific payment service.

## Available providers

Sails Pay currently supports the following payment providers:

| Provider                                 | Adapter Package           |
| ---------------------------------------- | ------------------------- |
| [Lemon Squeezy](/sails-pay/lemonsqueezy) | `@sails-pay/lemonsqueezy` |
| [Flutterwave](/sails-pay/flutterwave)    | `@sails-pay/flutterwave`  |
| [Paystack](/sails-pay/paystack)          | `@sails-pay/paystack`     |
| [Paga](/sails-pay/paga)                  | `@sails-pay/paga`         |

## Configuring a provider

Configure your payment provider in `config/pay.js`:

```js
module.exports.pay = {
  providers: {
    default: {
      adapter: '@sails-pay/paystack'
    }
  }
}
```

Then use `sails.pay` to access your provider's methods:

```js
const checkoutUrl = await sails.pay.checkout({
  amount: 5000,
  email: 'customer@example.com'
})
```

## Multiple providers

You can configure multiple providers simultaneously. This is useful when you need to offer different payment options or operate in different regions:

```js
module.exports.pay = {
  provider: 'default', // The default provider to use
  providers: {
    default: {
      adapter: '@sails-pay/paystack'
    },
    lemonsqueezy: {
      adapter: '@sails-pay/lemonsqueezy'
    },
    flutterwave: {
      adapter: '@sails-pay/flutterwave'
    }
  }
}
```

## Switching providers

Use the `provider()` method to switch to a different configured provider. The method is chainable, so you can call any adapter method directly after it:

```js
// Switch to Lemon Squeezy
const checkoutUrl = await sails.pay.provider('lemonsqueezy').checkout({
  variant: '12345',
  checkoutData: {
    email: 'customer@example.com'
  }
})

// Switch to Flutterwave
const checkoutUrl = await sails.pay.provider('flutterwave').checkout({
  amount: 5000,
  email: 'customer@example.com',
  txRef: `TXN-${Date.now()}`
})
```

## Example: Region-based provider selection

Here's a practical example where you select a provider based on the customer's region:

```js
module.exports = {
  friendlyName: 'Create checkout',

  inputs: {
    amount: {
      type: 'number',
      required: true
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true
    },
    region: {
      type: 'string',
      required: true,
      isIn: ['nigeria', 'global']
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function ({ amount, email, region }) {
    let checkoutUrl

    if (region === 'nigeria') {
      // Use Paystack for Nigerian customers
      checkoutUrl = await sails.pay.provider('paystack').checkout({
        amount: amount * 100, // Convert to kobo
        email,
        currency: 'NGN'
      })
    } else {
      // Use Lemon Squeezy for global customers
      checkoutUrl = await sails.pay.provider('lemonsqueezy').checkout({
        variant: '12345',
        checkoutData: { email }
      })
    }

    return checkoutUrl
  }
}
```

## Example: Offering payment method choices

You can let users choose their preferred payment method:

```js
module.exports = {
  friendlyName: 'Create checkout',

  inputs: {
    amount: {
      type: 'number',
      required: true
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true
    },
    paymentMethod: {
      type: 'string',
      required: true,
      isIn: ['card', 'bank', 'mobile']
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function ({ amount, email, paymentMethod }) {
    // Use different providers based on payment method preference
    const providerMap = {
      card: 'paystack',
      bank: 'flutterwave',
      mobile: 'paga'
    }

    const provider = providerMap[paymentMethod]

    const checkoutUrl = await sails.pay.provider(provider).checkout({
      amount: amount * 100,
      email
    })

    return checkoutUrl
  }
}
```

::: tip
Remember to install and configure all the adapters you plan to use. Each provider requires its own adapter package and configuration values.
:::
