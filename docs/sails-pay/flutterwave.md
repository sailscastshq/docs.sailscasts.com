---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Flutterwave
titleTemplate: Sails Pay
description: Learn how to use the Flutterwave adapter for Sails Pay
prev:
  text: Getting started
  link: /sails-pay/getting-started
next: false
editLink: true
---

# Flutterwave

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
        publicKey: 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxx',
        secretKey: 'FLWSECK_TEST-xxxxxxxxxxxxxxxxxxxxxx'
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
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY,
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY
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

To get your Flutterwave API keys:

1. Log in to your [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Click on **Settings** from the left sidebar
3. Select **API Keys** under the Developers tab
4. Copy your **Public Key** and **Secret Key**
5. Use test mode keys for development (starting with `FLWPUBK_TEST-` and `FLWSECK_TEST-`)
6. Switch to live mode for production keys

::: warning
Keep your secret key secure! Never commit it to source control or expose it in client-side code.
:::

## Usage

### Creating a checkout

The `sails.pay.checkout()` method creates a payment checkout URL that you can redirect your users to for completing their payment.

#### Basic usage

```js
const checkoutUrl = await sails.pay.checkout({
  amount: 5000,
  email: 'customer@example.com',
  txRef: 'ORDER-12345'
})

return res.redirect(checkoutUrl)
```

#### With all options

```js
const checkoutUrl = await sails.pay.checkout({
  amount: 5000,
  email: 'customer@example.com',
  txRef: 'ORDER-12345',
  currency: 'NGN',
  redirectUrl: 'https://yourdomain.com/payment/callback',
  customerName: 'John Doe',
  customerPhone: '08012345678',
  paymentOptions: 'card,banktransfer,ussd',
  customizations: {
    title: 'My Store',
    description: 'Payment for order #12345',
    logo: 'https://yourdomain.com/logo.png'
  },
  meta: {
    orderId: '12345',
    customerId: 'CUST-789'
  }
})

return res.redirect(checkoutUrl)
```

### Parameters

All parameters for `sails.pay.checkout()`:

| Parameter        | Type   | Required | Description                                                                          |
| ---------------- | ------ | -------- | ------------------------------------------------------------------------------------ |
| `amount`         | Number | Yes      | Amount to charge (in major currency units). E.g., 5000 = ₦5,000.00                   |
| `email`          | String | Yes      | Customer's email address                                                             |
| `txRef`          | String | Yes      | Unique transaction reference. Use only alphanumeric characters                       |
| `currency`       | String | No       | Transaction currency. Defaults to "NGN". Supports 30+ currencies                     |
| `redirectUrl`    | String | No       | URL to redirect to after payment. Defaults to your dashboard callback URL            |
| `customerName`   | String | No       | Customer's full name                                                                 |
| `customerPhone`  | String | No       | Customer's phone number                                                              |
| `paymentOptions` | String | No       | Comma-separated payment methods to allow. E.g., "card,banktransfer,ussd,mobilemoney" |
| `customizations` | Object | No       | Customize checkout page with `title`, `description`, and `logo` (URL)                |
| `meta`           | Object | No       | Custom metadata object for your records                                              |

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
    const txRef = `TXN-${Date.now()}`

    const checkoutUrl = await sails.pay.checkout({
      amount,
      email,
      customerName,
      txRef,
      currency: 'NGN',
      redirectUrl: `${sails.config.custom.baseUrl}/payment/verify`,
      paymentOptions: 'card,banktransfer,ussd',
      customizations: {
        title: 'My Shop',
        description: 'Purchase from My Shop'
      }
    })

    return checkoutUrl
  }
}
```

## About Flutterwave

Flutterwave is Africa's leading payment technology company that provides a payment infrastructure for global merchants and payment service providers. Key features:

- **Multi-currency support**: Accept payments in 30+ currencies
- **Multiple payment methods**: Cards, bank transfers, mobile money, USSD, and more
- **Global reach**: Process payments across 150+ countries
- **High security**: PCI DSS compliant with ISO 27001 & 22301 certification
- **Developer-friendly**: Comprehensive APIs, SDKs, and documentation
- **Instant settlement**: Fast payment processing and settlement

## Additional resources

- [Flutterwave API Documentation](https://developer.flutterwave.com/)
- [Flutterwave Dashboard](https://dashboard.flutterwave.com)
- [Standard Payment Integration Guide](https://developer.flutterwave.com/docs/collecting-payments/standard)
- [API Reference](https://developer.flutterwave.com/reference)
