---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Lemon Squeezy
titleTemplate: Sails Pay
description: Learn how to use the Lemon Squeezy adapter for Sails Pay
prev:
  text: Getting started
  link: /sails-pay/getting-started
next: false
editLink: true
---

# Lemon Squeezy

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
