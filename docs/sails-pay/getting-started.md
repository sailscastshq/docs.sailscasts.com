---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Getting started
titleTemplate: Sails Pay
description: Getting started with Sails Pay in a Sails application
next:
  text: Providers
  link: /sails-pay/providers
editLink: true
---

# Introduction

Sails Pay provides a payment integration layer for Sails.js applications.

It covers provider adapters, transactions, coupons, and subscription-related flows through one Sails-oriented API.

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

```sh [Flutterwave]
npm i @sails-pay/flutterwave
```

```sh [Paystack]
npm i @sails-pay/paystack
```

```sh [Paga]
npm i @sails-pay/paga
```

:::

::: tip
If you can't find your payment provider, consider [sponsoring Kelvin's time](https://github.com/sponsors/DominusKelvin). He can work on an adapter for you.
:::

Next, follow the instructions below to setup your preferred payment provider.

- [Lemon Squeezy](/sails-pay/lemonsqueezy)
- [Flutterwave](/sails-pay/flutterwave)
- [Paystack](/sails-pay/paystack)
- [Paga](/sails-pay/paga)
