---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Connect
titleTemplate: Sails Pay
description: Onboard recipients, fund their balances, and let them withdraw with sails.pay.connect
prev:
  text: Creating checkouts
  link: /sails-pay/checkout
next:
  text: Verify transaction
  link: /sails-pay/verify-transaction
editLink: true
---

# Connect

`sails.pay.connect` is for platforms that hold money for other people: creators, maintainers, contractors, sellers. Each person gets a **connected account** with a balance of its own. Their share reaches that balance either as a split at checkout or as a transfer you make later, and they withdraw to their bank.

The API is the same for every provider that supports Connect, so your application code never changes when a provider is added.

::: info Version requirement
`sails.pay.connect` requires `sails-pay` 0.2.3 and `@sails-pay/bachs` 0.0.4 or later. [Splitting a checkout](#split-a-checkout) requires `sails-pay` 0.2.4 and `@sails-pay/bachs` 0.0.5 or later.
:::

## Provider support

| Provider      | Connect |
| ------------- | ------- |
| Bachs         | ✅      |
| Lemon Squeezy | ❌      |
| Paystack      | ❌      |
| Paga          | ❌      |
| Flutterwave   | ❌      |

Touching `sails.pay.connect` on a provider without Connect throws:

```
The "paystack" provider does not support Connect yet.
```

## How money moves

There are two ways money reaches a connected account.

**Split at checkout.** Use this when a sale belongs to one account. The provider moves the account's share when the charge settles and records your platform fee.

```text
Customer pays          sails.pay.checkout({ connect: { destination, platformFee } })
      ↓                (charge settles)
Connected account balance   +   your platform fee stays with you
      ↓                sails.pay.connect.payout.create()
Their bank account
```

**Collect, then transfer.** Use this when money has no single owner at checkout time, such as a shared pool paid out monthly, or when the recipient has no account yet.

```text
Customer pays          sails.pay.checkout()
      ↓                (webhook confirms the collection)
Platform balance
      ↓                sails.pay.connect.transfer.create()
Connected account balance
      ↓                sails.pay.connect.payout.create()
Their bank account
```

With collect-then-transfer, your platform fee is whatever stays in your platform balance after the transfer: if a customer pays ₦10,500 and you transfer ₦10,000, the ₦500 left over is yours.

## Methods

```js
sails.pay.connect.account.create()
sails.pay.connect.account.link()
sails.pay.connect.account.get()
sails.pay.connect.transfer.create()
sails.pay.connect.balance.get()
sails.pay.connect.payout.create()
```

The connected account is always passed as `account`, amounts are always decimal strings such as `'10000.00'`, and every create method accepts an `idempotencyKey`.

### `account.create`

Creates a recipient account that can receive transfers and withdraw.

```js
const account = await sails.pay.connect.account.create({
  email: maintainer.email,
  name: maintainer.fullName,
  country: 'NG',
  capabilities: ['transfers', 'payouts'],
  idempotencyKey: `maintainer-${maintainer.id}`
})

await Maintainer.updateOne({ id: maintainer.id }).set({
  connectAccount: account.id
})
```

| Input            | Required | Default                    |
| ---------------- | -------- | -------------------------- |
| `email`          | Yes      |                            |
| `name`           | No       |                            |
| `country`        | No       | `'NG'`                     |
| `capabilities`   | No       | `['transfers', 'payouts']` |
| `idempotencyKey` | No       |                            |

Store `account.id`. Every other method needs it.

### `account.link`

Creates a short-lived hosted link that collects whatever the account still owes: identity details and a payout destination.

```js
const { url } = await sails.pay.connect.account.link({
  account: maintainer.connectAccount,
  type: 'onboarding',
  returnUrl: `${sails.config.custom.baseUrl}/payouts`,
  refreshUrl: `${sails.config.custom.baseUrl}/payouts/onboard`
})

return url // redirect
```

Use `type: 'update'` to let an onboarded account edit its details. Links expire, and creating one replaces the previous one, so create it at the moment you redirect.

::: warning
Arriving at `returnUrl` does not mean onboarding is complete. Read the account with `account.get` before letting someone withdraw.
:::

### `account.get`

```js
const account = await sails.pay.connect.account.get({
  account: maintainer.connectAccount
})

account.capabilities.payouts // 'active' | 'pending' | 'inactive'
account.requirements // still due, e.g. ['payout_destination']
```

A capability is only usable when its status is `'active'`.

### `transfer.create`

Moves money from your platform balance into the account's balance.

```js
const transfer = await sails.pay.connect.transfer.create({
  account: maintainer.connectAccount,
  amount: '10000.00',
  currency: 'NGN',
  group: 'payrun-2026-09',
  idempotencyKey: `sponsorship-${sponsorship.reference}`
})
```

- The funds must be **available** in your platform balance. Pending collections can't be transferred yet.
- Transfers can't be cancelled. Use a deterministic `idempotencyKey` so a retried job never pays twice.
- `group` ties related transfers together, e.g. every transfer in one monthly payrun.

### `balance.get`

```js
const balances = await sails.pay.connect.balance.get({
  account: maintainer.connectAccount
})
// [
//   { currency: 'NGN', available: '10000.00', pending: '0.00' },
//   { currency: 'USD', available: '25.00', pending: '0.00' }
// ]
```

### `payout.create`

Withdraws from the account's balance to its bank account.

```js
const payout = await sails.pay.connect.payout.create({
  account: maintainer.connectAccount,
  amount: '9000.00',
  currency: 'NGN',
  reference: withdrawal.reference,
  idempotencyKey: withdrawal.reference
})
```

When `destination` is omitted, Sails Pay uses the account's default destination for `currency`. Pass `destination` to choose a specific one.

Payouts are asynchronous: `status` starts as `'pending'`. Treat the provider's payout webhook as the final answer.

The provider's withdrawal fee is charged **on top**, and `payout.fee` tells you how much it was. A ₦9,000 withdrawal with a ₦50 fee debits ₦9,050 from the balance.

#### Exits

| Exit                   | When                                                                        |
| ---------------------- | --------------------------------------------------------------------------- |
| `noDestination`        | No `destination` was given and the account has no usable one for `currency` |
| `couldNotCreatePayout` | The provider rejected the payout, e.g. insufficient balance                 |

```js
const payout = await sails.pay.connect.payout
  .create({ account, amount, currency, idempotencyKey })
  .intercept('noDestination', () => 'needsOnboarding')
```

## Return shapes

Every provider returns these shapes. The provider's untouched response is on `raw` for reconciliation.

```js
// account.create, account.get
{ id, email, name, country,
  capabilities: { transfers: 'active' | 'pending' | 'inactive', payouts: ... },
  requirements: ['payout_destination'],
  raw }

// account.link
{ url, expiresAt, raw }

// transfer.create
{ id, account, amount, currency, group, status: 'pending' | 'paid', raw }

// balance.get
[{ currency, available, pending }]

// payout.create
{ id, account, amount, currency, fee, destination,
  status: 'pending' | 'paid' | 'failed', raw }
```

## Split a checkout

When a sale belongs to one connected account, pass `connect` to `sails.pay.checkout`:

```js
const checkoutUrl = await sails.pay.checkout({
  items: [{ product: productId, amount: '10500.00' }],
  reference: order.reference,
  metadata: { order: order.reference },
  connect: {
    destination: seller.connectAccount,
    platformFee: '500.00'
  }
})
```

- `destination` is the connected account that receives the rest of the sale.
- `platformFee` is what your platform keeps, as a positive decimal string. It is an amount, not a percentage: compute it yourself.
- `connect` works on product checkout sessions (`items` or `productCollectionId`), not pure checkout.
- The account's share moves when the charge settles, so there is no transfer to make and nothing to retry.

Invalid `connect` input exits `invalidRequest` before any request is sent.

## A complete flow

A creator platform that keeps 5% on top of each purchase:

```js
// 1. Checkout: the customer pays the price plus the platform fee,
//    split with the creator's connected account
const checkoutUrl = await sails.pay.checkout({
  items: [{ product: productId, amount: '10500.00' }],
  reference: purchase.reference,
  connect: {
    destination: creator.connectAccount,
    platformFee: '500.00'
  }
})

// 2. The charge settles: ₦10,000 lands in the creator's balance,
//    ₦500 stays with the platform

// 3. Later, the creator withdraws
await sails.pay.connect.payout.create({
  account: creator.connectAccount,
  amount: '10000.00',
  currency: 'NGN',
  idempotencyKey: withdrawal.reference
})
```

A monthly shared pool uses collect-then-transfer instead:

```js
// Each contribution is a plain checkout into the platform balance
await sails.pay.checkout({
  items: [{ product: productId, amount: '10500.00' }],
  reference: contribution.reference
})

// On payout day, transfer each member's share
await sails.pay.connect.transfer.create({
  account: member.connectAccount,
  amount: share,
  currency: 'NGN',
  group: 'pool-2026-09',
  idempotencyKey: `pool-2026-09-${member.id}`
})
```

## What your application owns

Sails Pay moves the money. Your application is the source of truth for:

- **The ledger:** what each person earned, what was transferred, what was withdrawn.
- **Authorization:** only the owner of a connected account may withdraw from it.
- **Webhook idempotency:** providers retry deliveries, so apply each event once.
- **Reconciliation:** compare your ledger against `raw` responses and webhooks.

## Bachs

With Bachs as your provider, each method maps to these requests:

| Method            | Bachs request                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| `account.create`  | `POST /v1/accounts` with the `recipient` configuration                                                     |
| `account.link`    | `POST /v1/accounts/{id}/account-links`                                                                     |
| `account.get`     | `GET /v1/accounts/{id}`                                                                                    |
| `transfer.create` | `POST /v1/transfers`                                                                                       |
| `balance.get`     | `GET /v1/balances` acting as the account                                                                   |
| `payout.create`   | `GET /v1/payouts/destinations` (when resolving the default), then `POST /v1/payouts` acting as the account |

`checkout({ connect })` creates a Bachs [destination charge](https://docs.bachs.io/connect/split-payments/destination): `connect.destination` becomes `transfer_data.destination` and `connect.platformFee` becomes `platform_fee`. Bachs keeps a platform fee record for every split, readable at `GET /v1/platform_fees`.

Before creating accounts, request the **`connect`** capability for your Bachs organization from the Bachs dashboard. You use your existing organization; no new Bachs account is needed.

::: warning
Requesting `connect` converts a Bachs organization from an individual to a company, immediately and permanently. Bachs then asks for business registration, ownership documents, and a bank account in the business name.
:::

Bachs Connect webhook events to handle:

| Event                           | Use it for                                              |
| ------------------------------- | ------------------------------------------------------- |
| `capability.updated`            | `data.status === 'active'` unlocks transfers or payouts |
| `account.updated`               | Requirements changed                                    |
| `transfer.created`              | A transfer landed                                       |
| `payout.paid` / `payout.failed` | A withdrawal finished                                   |

Bachs' processing fee comes out of your platform balance unless your organization's fee handling is set to have the customer pay it. If your platform fee should arrive intact, set that in the Bachs dashboard.

## Additional resources

- [Bachs Connect](https://docs.bachs.io/connect/overview)
- [Creator and contractor payouts](https://docs.bachs.io/connect/payout-networks)
- [Platform fees](https://docs.bachs.io/connect/platform-fees)
- [Transfers](https://docs.bachs.io/connect/transfers)
- [Payouts](https://docs.bachs.io/connect/payouts)
- [Hosted onboarding](https://docs.bachs.io/connect/guides/hosted-onboarding)
