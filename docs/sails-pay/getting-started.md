---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Getting started
titleTemplate: Sails Pay
description: Getting started with Sails Pay in a Sails application
next:
  text: Lemon Squeezy
  link: '/sails-pay/lemonsqueezy'
editLink: true
---

# Introduction

Sails Pay simplifies payment integration for Sails.js developers, offering an intuitive interface to seamlessly incorporate payment processing into your applications. Say goodbye to tedious payment-related boilerplate code.

Sails Pay handles the heavy lifting of payment management, from basic transactions to advanced features like coupons, subscription swapping, and more.

With Sails Pay, you can focus on building great products while Sails Pay takes care of payment complexities.

## Getting started

Simply add the following dependency to your Sails project:

```sh
npm i sails-pay --save
```

## Add provider adapter

Sails Pay offers adapters for various payment providers. Simply install the adapter for your chosen payment provider.

::: code-group

```sh [Lemon Squeezy]
npm i @sails-pay/lemonsqueezy
```

:::

::: tip
If you can't find your payment provider, consider [sponsoring Kelvin's time](https://github.com/sponsors/DominusKelvin). He can work on an adapter for you. Visit .
:::

Next, follow the instructions below to setup your preferred payment provider.

- [Lemon Squeezy 🍋](/sails-pay/lemonsqueezy)
- PayPal <Badge type="warning" text="coming soon" />
- Stripe <Badge type="warning" text="coming soon" />

## Star the repo :star:

::: tip Star the Sails Pay repo on GitHub :star:
If you like Sails Pay, show it some love with [a star on GitHub](https://github.com/sailscastshq/sails-pay).
:::
