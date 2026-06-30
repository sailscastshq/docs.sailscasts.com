---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Creating checkouts
titleTemplate: Sails Pay
description: Learn how to create payment checkouts with Sails Pay
prev:
  text: Bachs
  link: /sails-pay/bachs
next:
  text: Verify transaction
  link: /sails-pay/verify-transaction
editLink: true
---

# Creating checkouts

The `sails.pay.checkout()` method creates a payment checkout URL that you can redirect your users to for completing their payment.

::: info Adapter support

- [Lemon Squeezy](/sails-pay/lemonsqueezy)
- [Flutterwave](/sails-pay/flutterwave)
- [Paystack](/sails-pay/paystack)
- [Paga](/sails-pay/paga)
- [Bachs](/sails-pay/bachs)
  :::

## Basic usage

```js
const checkoutUrl = await sails.pay.checkout({
  amount: 5000,
  email: 'customer@example.com'
})
```

The method returns a URL string that you can redirect users to for payment.

## Example in an action

Here's a complete example using Actions2:

```js
module.exports = {
  friendlyName: 'Create checkout',

  description: 'Create a payment checkout and redirect the user.',

  inputs: {
    amount: {
      type: 'number',
      required: true,
      description: 'The amount to charge in the smallest currency unit.'
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true,
      description: 'The customer email address.'
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function ({ amount, email }) {
    const checkoutUrl = await sails.pay.checkout({
      amount,
      email
    })

    return checkoutUrl
  }
}
```

## Parameters

Parameters vary slightly between adapters. Below are the common parameters and adapter-specific options.

### Common parameters

| Parameter | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| `amount`  | Number | Yes      | Amount to charge         |
| `email`   | String | Yes      | Customer's email address |

### Paystack parameters

| Parameter           | Type   | Required | Description                                                                              |
| ------------------- | ------ | -------- | ---------------------------------------------------------------------------------------- |
| `amount`            | Number | Yes      | Amount in the smallest currency unit (kobo for NGN). E.g., 50000 = ₦500.00               |
| `email`             | String | Yes      | Customer's email address                                                                 |
| `currency`          | String | No       | Transaction currency. E.g., "NGN", "USD", "GHS"                                          |
| `reference`         | String | No       | Unique transaction reference                                                             |
| `callbackUrl`       | String | No       | URL to redirect to after payment                                                         |
| `plan`              | String | No       | Plan code for subscription payments                                                      |
| `invoiceLimit`      | Number | No       | Number of times to charge customer during subscription                                   |
| `metadata`          | String | No       | Stringified JSON object of custom data                                                   |
| `channels`          | Array  | No       | Payment channels to allow: `card`, `bank`, `ussd`, `qr`, `mobile_money`, `bank_transfer` |
| `splitCode`         | String | No       | Split code for transaction split                                                         |
| `subaccount`        | String | No       | Subaccount code that owns the payment                                                    |
| `transactionCharge` | Number | No       | Amount to override split configuration                                                   |
| `bearer`            | String | No       | Who bears transaction charges: `account` or `subaccount`                                 |

#### Paystack example

```js
module.exports = {
  friendlyName: 'Paystack checkout',

  inputs: {
    amount: {
      type: 'number',
      required: true
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function ({ amount, email }) {
    const checkoutUrl = await sails.pay.checkout({
      amount: amount * 100, // Convert to kobo
      email,
      currency: 'NGN',
      callbackUrl: `${sails.config.custom.baseUrl}/payment/verify`,
      channels: ['card', 'bank', 'ussd']
    })

    return checkoutUrl
  }
}
```

### Lemon Squeezy parameters

| Parameter         | Type    | Required | Description                                                |
| ----------------- | ------- | -------- | ---------------------------------------------------------- |
| `variant`         | String  | Yes      | The ID of the variant associated with this checkout        |
| `customPrice`     | Number  | No       | Custom price in cents                                      |
| `productOptions`  | Object  | No       | Override product options (name, description, redirect_url) |
| `checkoutOptions` | Object  | No       | Checkout display options (embed, media, logo, dark mode)   |
| `checkoutData`    | Object  | No       | Prefill data (email, name, billing_address, discount_code) |
| `preview`         | Boolean | No       | Return a preview of the checkout                           |
| `testMode`        | Boolean | No       | Create checkout in test mode                               |
| `expiresAt`       | String  | No       | ISO 8601 date-time when the checkout expires               |

#### Lemon Squeezy example

```js
module.exports = {
  friendlyName: 'Lemon Squeezy checkout',

  inputs: {
    variantId: {
      type: 'string',
      required: true,
      description: 'The Lemon Squeezy variant ID'
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function ({ variantId, email }) {
    const checkoutUrl = await sails.pay.checkout({
      variant: variantId,
      checkoutData: {
        email
      },
      checkoutOptions: {
        dark: false,
        logo: true
      }
    })

    return checkoutUrl
  }
}
```

### Flutterwave parameters

| Parameter        | Type   | Required | Description                                                     |
| ---------------- | ------ | -------- | --------------------------------------------------------------- |
| `amount`         | Number | Yes      | Amount to charge (in major currency units). E.g., 5000 = ₦5,000 |
| `email`          | String | Yes      | Customer's email address                                        |
| `txRef`          | String | Yes      | Unique transaction reference                                    |
| `currency`       | String | No       | Transaction currency. Defaults to "NGN"                         |
| `redirectUrl`    | String | No       | URL to redirect to after payment                                |
| `customerName`   | String | No       | Customer's full name                                            |
| `customerPhone`  | String | No       | Customer's phone number                                         |
| `paymentOptions` | String | No       | Comma-separated payment methods: "card,banktransfer,ussd"       |
| `customizations` | Object | No       | Customize checkout: `title`, `description`, `logo`              |
| `meta`           | Object | No       | Custom metadata object                                          |

#### Flutterwave example

```js
module.exports = {
  friendlyName: 'Flutterwave checkout',

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
        title: 'My Store',
        description: 'Payment for your order'
      }
    })

    return checkoutUrl
  }
}
```

### Paga parameters

| Parameter          | Type   | Required | Description                                                                                  |
| ------------------ | ------ | -------- | -------------------------------------------------------------------------------------------- |
| `amount`           | Number | Yes      | Amount to charge in the smallest currency unit (kobo for NGN). E.g., 50000 = ₦500.00         |
| `email`            | String | Yes      | Customer's email address                                                                     |
| `currency`         | String | No       | Transaction currency. Defaults to "NGN"                                                      |
| `paymentReference` | String | No       | Unique payment identifier. If not provided, Paga will generate one                           |
| `chargeUrl`        | String | No       | URL to redirect the customer after payment completion                                        |
| `phoneNumber`      | String | No       | Customer's phone number                                                                      |
| `displayImage`     | String | No       | Merchant logo URL to display on checkout                                                     |
| `callbackUrl`      | String | No       | Webhook URL to receive payment notifications                                                 |
| `fundingSources`   | String | No       | Comma-separated list of allowed payment methods: `CARD`, `PAGA`, `TRANSFER`, `AGENT`, `USSD` |

#### Paga example

```js
module.exports = {
  friendlyName: 'Paga checkout',

  inputs: {
    amount: {
      type: 'number',
      required: true
    },
    email: {
      type: 'string',
      required: true,
      isEmail: true
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function ({ amount, email }) {
    const paymentReference = `ORD-${Date.now()}`

    const checkoutUrl = await sails.pay.checkout({
      amount: amount * 100, // Convert to kobo
      email,
      paymentReference,
      currency: 'NGN',
      chargeUrl: `${sails.config.custom.baseUrl}/payment/complete`,
      callbackUrl: `${sails.config.custom.baseUrl}/webhooks/paga`,
      fundingSources: 'CARD,TRANSFER,USSD'
    })

    return checkoutUrl
  }
}
```

### Bachs parameters

Bachs supports product Checkout Sessions and Pure Checkout through `sails.pay.checkout()`.

#### Product Checkout Session parameters

| Parameter                   | Type   | Required | Description                                                 |
| --------------------------- | ------ | -------- | ----------------------------------------------------------- |
| `items`                     | Array  | Yes      | Product cart items. Each item uses `product` or `productId` |
| `productCollectionId`       | String | Yes      | Product collection ID for selection-mode checkout           |
| `customer`                  | Object | Yes      | Customer details or an existing Bachs customer ID           |
| `billingCurrency`           | String | No       | Currency used to select the product price row               |
| `allowedPaymentMethodTypes` | Array  | No       | Payment method allowlist, such as `bank_transfer` or `card` |
| `returnUrl`                 | String | No       | URL Bachs redirects to after checkout-session payment       |
| `cancelUrl`                 | String | No       | URL Bachs redirects to when checkout is cancelled           |
| `reference`                 | String | No       | Unique merchant reference                                   |
| `metadata`                  | Object | No       | Metadata returned in webhook payloads                       |
| `idempotencyKey`            | String | No       | Value sent as the `Idempotency-Key` header                  |

Provide exactly one of `items` or `productCollectionId`.

#### Pure Checkout parameters

| Parameter          | Type   | Required | Description                                        |
| ------------------ | ------ | -------- | -------------------------------------------------- |
| `amount`           | String | Yes      | Decimal amount string, such as `"50.00"`           |
| `currency`         | String | Yes      | Currency code, such as `"USD"` or `"NGN"`          |
| `currencyOptions`  | Object | No       | Per-currency amount overrides                      |
| `customerEmail`    | String | Yes      | Customer email address                             |
| `customerName`     | String | No       | Customer full name                                 |
| `successUrl`       | String | No       | URL Bachs redirects to after Pure Checkout payment |
| `cancelUrl`        | String | No       | URL Bachs redirects to when checkout is cancelled  |
| `reference`        | String | No       | Unique merchant reference                          |
| `metadata`         | Object | No       | Metadata returned in webhook payloads              |
| `expiresInMinutes` | Number | No       | Minutes until the checkout expires                 |

#### Bachs product checkout example

```js
module.exports = {
  friendlyName: 'Bachs checkout',

  inputs: {
    productId: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    }
  },

  fn: async function ({ productId }) {
    const loggedInUser = await User.findOne({
      id: this.req.session.userId
    }).select(['email', 'fullName'])

    const purchase = await Purchase.create({
      reference: `ORD-${Date.now()}`,
      user: loggedInUser.id
    }).fetch()

    const checkoutUrl = await sails.pay.checkout({
      items: [{ product: productId, quantity: 1 }],
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

    return checkoutUrl
  }
}
```

The adapter keeps your Sails code camelCase and maps to Bachs snake case internally:

| Sails Pay input             | Bachs request field            |
| --------------------------- | ------------------------------ |
| `items`                     | `product_cart`                 |
| `items[].product`           | `product_cart[].product_id`    |
| `productCollectionId`       | `product_collection_id`        |
| `billingCurrency`           | `billing_currency`             |
| `allowedPaymentMethodTypes` | `allowed_payment_method_types` |
| `returnUrl`                 | `return_url`                   |
| `idempotencyKey`            | `Idempotency-Key` header       |

## Using a specific provider

If you have multiple payment providers configured, you can specify which one to use:

```js
// Use the default provider
const checkoutUrl = await sails.pay.checkout({ ... })

// Use a specific provider
const checkoutUrl = await sails.pay.provider('paystack').checkout({ ... })
```

## Error handling

The checkout method may throw an error if the checkout URL cannot be created. Handle errors appropriately:

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
    }
  },

  exits: {
    success: {
      responseType: 'redirect'
    },
    paymentError: {
      responseType: 'view',
      viewTemplatePath: 'pages/payment-error'
    }
  },

  fn: async function ({ amount, email }) {
    try {
      const checkoutUrl = await sails.pay.checkout({
        amount,
        email
      })

      return checkoutUrl
    } catch (error) {
      sails.log.error('Payment checkout error:', error)
      throw 'paymentError'
    }
  }
}
```
