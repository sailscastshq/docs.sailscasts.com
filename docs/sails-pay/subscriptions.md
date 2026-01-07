---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Retrieving subscriptions
titleTemplate: Sails Pay
description: Learn how to retrieve and manage subscriptions with Sails Pay
prev:
  text: Creating checkouts
  link: /sails-pay/checkout
next: false
editLink: true
---

# Retrieving subscriptions

Sails Pay provides methods to retrieve and inspect subscription details from your payment provider.

::: info Adapter support

- [Lemon Squeezy](/sails-pay/lemonsqueezy)
  :::

## Getting a subscription

The `sails.pay.subscription.get()` method retrieves details about a specific subscription by its ID.

### Basic usage

```js
const subscription = await sails.pay.subscription.get({
  id: '12345'
})
```

The method returns the full subscription object from the payment provider.

### Example in an action

Here's a complete example using Actions2:

```js
module.exports = {
  friendlyName: 'Get subscription',

  description: 'Retrieve subscription details by ID.',

  inputs: {
    subscriptionId: {
      type: 'string',
      required: true,
      description: 'The subscription ID to retrieve.'
    }
  },

  exits: {
    success: {
      description: 'Subscription details retrieved successfully.'
    },
    notFound: {
      description: 'Subscription not found.',
      responseType: 'notFound'
    }
  },

  fn: async function ({ subscriptionId }) {
    try {
      const subscription = await sails.pay.subscription.get({
        id: subscriptionId
      })

      return subscription
    } catch (error) {
      sails.log.error('Error retrieving subscription:', error)
      throw 'notFound'
    }
  }
}
```

### Parameters

| Parameter | Type   | Required | Description                       |
| --------- | ------ | -------- | --------------------------------- |
| `id`      | String | Yes      | The ID of the subscription to get |
| `apiKey`  | String | No       | Override the configured API key   |

### Response

The response contains the full subscription object from Lemon Squeezy. Here's an example of the data structure:

```js
{
  data: {
    type: 'subscriptions',
    id: '12345',
    attributes: {
      store_id: 1,
      customer_id: 1,
      order_id: 1,
      order_item_id: 1,
      product_id: 1,
      variant_id: 1,
      product_name: 'Pro Plan',
      variant_name: 'Monthly',
      user_name: 'John Doe',
      user_email: 'john@example.com',
      status: 'active',
      status_formatted: 'Active',
      card_brand: 'visa',
      card_last_four: '4242',
      pause: null,
      cancelled: false,
      trial_ends_at: null,
      billing_anchor: 1,
      renews_at: '2024-02-01T00:00:00.000000Z',
      ends_at: null,
      created_at: '2024-01-01T00:00:00.000000Z',
      updated_at: '2024-01-01T00:00:00.000000Z',
      test_mode: false
    }
  }
}
```

## Common use cases

### Check subscription status

```js
module.exports = {
  friendlyName: 'Check subscription status',

  inputs: {
    subscriptionId: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Returns the subscription status.'
    }
  },

  fn: async function ({ subscriptionId }) {
    const subscription = await sails.pay.subscription.get({
      id: subscriptionId
    })

    const status = subscription.data.attributes.status

    return {
      isActive: status === 'active',
      status,
      renewsAt: subscription.data.attributes.renews_at
    }
  }
}
```

### Verify user has active subscription

```js
module.exports = {
  friendlyName: 'Verify subscription',

  description: 'Check if a user has an active subscription.',

  inputs: {
    userId: {
      type: 'number',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Returns subscription verification result.'
    }
  },

  fn: async function ({ userId }) {
    // Get the user's subscription ID from your database
    const user = await User.findOne({ id: userId })

    if (!user.subscriptionId) {
      return { hasActiveSubscription: false }
    }

    try {
      const subscription = await sails.pay.subscription.get({
        id: user.subscriptionId
      })

      const status = subscription.data.attributes.status
      const isActive = ['active', 'on_trial'].includes(status)

      return {
        hasActiveSubscription: isActive,
        status,
        plan: subscription.data.attributes.variant_name
      }
    } catch (error) {
      sails.log.error('Subscription check failed:', error)
      return { hasActiveSubscription: false }
    }
  }
}
```

## Additional resources

- [Lemon Squeezy Subscriptions API](https://docs.lemonsqueezy.com/api/subscriptions)
- [Subscription Object Reference](https://docs.lemonsqueezy.com/api/subscriptions#the-subscription-object)
