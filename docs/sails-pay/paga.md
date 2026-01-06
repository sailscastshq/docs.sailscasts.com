---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Paga
titleTemplate: Sails Pay
description: Learn how to use the Paga adapter for Sails Pay
prev:
  text: Flutterwave
  link: /sails-pay/flutterwave
next:
  text: Paystack
  link: /sails-pay/paystack
editLink: true
---

# Paga

[Paga](https://www.mypaga.com) is Nigeria's pioneering mobile payment platform, founded in 2009 by Tayo Oviosu. What started as an agency banking platform has evolved into a comprehensive financial ecosystem serving over 29 million users. Paga is licensed by the Central Bank of Nigeria (CBN) and insured by the Nigeria Deposit Insurance Corporation (NDIC).

## Why Paga?

Paga offers unique advantages for businesses targeting the Nigerian market:

- **Massive User Base**: 29+ million registered users across Nigeria
- **Proven Track Record**: Processed ₦8.7 trillion ($5.6 billion) in transactions in 2024
- **Extensive Agent Network**: 27,000+ financial service access points nationwide
- **Mobile-First**: Designed for Nigeria's mobile-centric market with USSD, bank transfers, and mobile wallet support
- **Regulatory Compliance**: Fully licensed by the Central Bank of Nigeria
- **Remittance Leader**: Partners with 18+ international remittance companies

## Getting Started with Paga

Before integrating Paga with Sails Pay, you'll need a Paga Business account:

1. **Create a business account**: Sign up at [mypaga.com/paga-business](https://www.mypaga.com/paga-business/)
2. **Complete verification**: Submit required business documents for approval
3. **Get API credentials**: Access your test and live API keys from the developer settings
4. **Test your integration**: Use test keys during development before going live

::: tip
Paga provides test credentials for development. Always test thoroughly in the sandbox environment before processing live transactions.
:::

## Installation

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
        secretKey: 'test_xxxxxxxxxxxxxxxxxxxxxx',
        callbackUrl: 'http://localhost:1337/webhooks/paga'
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
      secretKey: process.env.PAGA_SECRET_KEY,
      callbackUrl: process.env.PAGA_CALLBACK_URL
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

### **`callbackUrl`**

The callback URL is a webhook endpoint in your application that Paga will send payment notifications to. This URL will receive POST requests when a payment is completed, failed, or cancelled.

Set this to your webhook handler endpoint, e.g., `https://yourdomain.com/webhooks/paga`.

## Local development

Paga does not accept localhost URLs for `callbackUrl` or `chargeUrl`. To test webhooks and redirects during local development, you'll need to expose your local server using a tunneling service:

- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) - Free, requires a Cloudflare account
- [ngrok](https://ngrok.com/) - Free tier available

Once you have a public URL (e.g., `https://myapp.ngrok.io`), use it for your `callbackUrl` and `chargeUrl` in development:

```js
// config/local.js
module.exports = {
  pay: {
    providers: {
      default: {
        publicKey: 'your_test_public_key',
        secretKey: 'your_test_secret_key',
        callbackUrl: 'https://myapp.ngrok.io/webhooks/paga'
      }
    }
  }
}
```

## Default environment variables

If you don't provide configuration values, the adapter will automatically look for these environment variables as fallbacks:

| Config Value  | Environment Variable |
| ------------- | -------------------- |
| `publicKey`   | `PAGA_PUBLIC_KEY`    |
| `secretKey`   | `PAGA_SECRET_KEY`    |
| `callbackUrl` | `PAGA_CALLBACK_URL`  |

This means you can simply set the environment variables and use a minimal configuration:

```js
module.exports.pay = {
  providers: {
    default: {
      adapter: '@sails-pay/paga'
    }
  }
}
```

## Handling redirect response

After payment completion, Paga redirects the customer to your `chargeUrl` (if provided) with query parameters containing the payment result. Here's what Paga sends:

| Parameter          | Type   | Description                                                                 |
| ------------------ | ------ | --------------------------------------------------------------------------- |
| `charge_reference` | String | Your `paymentReference` (or a Paga-generated one if you didn't provide one) |
| `status_message`   | String | `"success"` for successful payments                                         |
| `status_code`      | String | `"0"` indicates a successful payment                                        |

### Example redirect URL

```
https://yoursite.com/store?charge_reference=ORD-123456&status_message=success&status_code=0
```

### Handling the redirect in your action

```js
module.exports = {
  friendlyName: 'View store',

  inputs: {
    charge_reference: {
      type: 'string'
    },
    status_code: {
      type: 'string'
    },
    status_message: {
      type: 'string'
    }
  },

  exits: {
    success: {
      responseType: 'inertia' // or 'view'
    }
  },

  fn: async function ({ charge_reference, status_code, status_message }) {
    // Check if this is a redirect from Paga
    const hasPaymentResponse = !!charge_reference
    const paymentSuccess = hasPaymentResponse && status_code === '0'

    if (paymentSuccess) {
      // Payment was successful
      // You can look up the order using charge_reference
    }

    return {
      page: 'store/index',
      props: {
        paymentReference: hasPaymentResponse ? charge_reference : null,
        statusCode: hasPaymentResponse ? status_code : null,
        statusMessage: hasPaymentResponse ? status_message : null
      }
    }
  }
}
```

::: tip
The redirect response is for displaying immediate feedback to the user. Always verify payments via the webhook callback for updating order status in your database, as the redirect URL can be manipulated by users.
:::

## Next steps

- [Creating checkouts](/sails-pay/checkout) - Redirect users to complete payment

## Additional resources

- [Paga Business API Documentation](https://www.mypaga.com/pagabusiness.html)
- [Paga Business Dashboard](https://www.mypaga.com/paga-business/)
- [API Integration Guide](https://developer.mypaga.com/)
