---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-pay-social.png
title: Bachs Connect
titleTemplate: Sails Pay
description: Onboard recipients and pay contributors with Bachs Connect and Sails Pay
prev:
  text: Bachs
  link: /sails-pay/bachs
next:
  text: Creating checkouts
  link: /sails-pay/checkout
editLink: true
---

# Bachs Connect

[Bachs Connect](https://docs.bachs.io/connect) lets a platform onboard sellers,
creators, contractors, or contributors as connected accounts, transfer money to
their balances, and withdraw those balances to approved bank accounts or wallets.

`@sails-pay/bachs` exposes the Connect operations through a camelCase Sails Pay
API. The adapter maps those inputs to Bachs request bodies, adds authentication
and connected-account headers, encodes resource identifiers, and normalizes Bachs
errors.

::: info Version requirement
The Connect methods on this page require `@sails-pay/bachs` 0.0.4 or later.
:::

## What the adapter supports

```text
bachs.account.create()              bachs.account.get()
bachs.account.link.create()
bachs.transfer.create()             bachs.transfer.get()
bachs.balance.get()
bachs.payout.bank.list()            bachs.payout.bank.resolve()
bachs.payout.destination.create()   bachs.payout.destination.get()
bachs.payout.create()               bachs.payout.get()
bachs.webhooks.verify()
```

This is the minimum surface for a same-currency contributor payout flow:

```text
Platform ledger
    ↓ reserve a contributor's earnings
Connected account
    ↓ hosted identity onboarding
Platform balance
    ↓ transfer.create()
Connected-account available balance
    ↓ payout.create()
Approved bank or wallet destination
    ↓ payout webhook or payout.get()
Platform marks the withdrawal settled
```

The first Connect release does not expose every Bachs endpoint. In particular,
it does not yet provide payout quote creation for cross-currency withdrawals,
payout schedules, account listing, transfer listing, or direct connected-account
charge helpers. Use a single currency for the flow on this page.

## Configure a named provider

Applications commonly use one provider for incoming payments and Bachs Connect
for outgoing marketplace or contributor payouts. Configure Bachs as a named
provider so each call makes the payment direction explicit.

```js
// config/pay.js
module.exports.pay = {
  provider: 'paystack',
  providers: {
    paystack: {
      adapter: '@sails-pay/paystack',
      secretKey: process.env.PAYSTACK_SECRET_KEY
    },
    bachs: {
      adapter: '@sails-pay/bachs',
      apiKey: process.env.BACHS_API_KEY,
      baseUrl: process.env.BACHS_BASE_URL,
      webhookSecret: process.env.BACHS_WEBHOOK_SECRET
    }
  }
}
```

Select it once in application code:

```js
const bachs = sails.pay.provider('bachs')
```

Use a sandbox key beginning with `sk_sandbox_` while developing. The adapter
selects `https://sandbox-api.bachs.io` for sandbox keys unless `baseUrl` is
configured explicitly.

## Bachs account setup

Before creating connected accounts:

1. Ask Bachs to enable Connect for the platform account.
2. Use an API key with the connected-account, transfer, balance, and payout
   permissions needed by your application.
3. Register a webhook destination with an event source of `connect` or `all`.
4. Store the webhook signing secret as `BACHS_WEBHOOK_SECRET`.

For a contributor who receives money but never accepts customer payments,
request only the recipient capabilities:

- `transfers`, so the account can receive money from the platform.
- `payouts`, so the account can withdraw its available balance.

This avoids imposing merchant requirements on a recipient-only account.

## Create a recipient account

Create one connected account for each contributor and persist the returned
account ID against that contributor.

```js
const account = await bachs.account.create({
  contactEmail: contributor.email,
  displayName: contributor.fullName,
  country: 'NG',
  entityType: 'individual',
  capabilities: {
    transfers: true,
    payouts: true
  },
  idempotencyKey: `connect-contributor-${contributor.id}`
})
```

The adapter sends the recipient configuration expected by Bachs:

```js
{
  contact_email: contributor.email,
  display_name: contributor.fullName,
  country: 'NG',
  entity_type: 'individual',
  configuration: {
    recipient: {
      capabilities: {
        transfers: { requested: true },
        payouts: { requested: true }
      }
    }
  }
}
```

Use a stable idempotency key derived from your contributor ID. A network retry
must not create a second financial identity.

Read the latest account and capability state with:

```js
const account = await bachs.account.get({
  accountId: contributor.bachsAccountId
})
```

Do not enable withdrawals because `setup_status` is `complete` alone. Require
both the `transfers` and `payouts` capabilities to be `active`.

## Hosted onboarding

Create a short-lived hosted link when the contributor is ready to onboard:

```js
const onboarding = await bachs.account.link.create({
  accountId: contributor.bachsAccountId,
  type: 'onboarding',
  refreshUrl: `${sails.config.custom.baseUrl}/payouts/connect/refresh`,
  returnUrl: `${sails.config.custom.baseUrl}/payouts/connect/return`
})

return onboarding.url
```

Use `type: 'update'` when an existing account needs to provide additional
information.

Create a link on demand. Creating a new hosted link supersedes the previous
one, so do not generate one during every page render or store it as a permanent
URL.

The browser returning to `returnUrl` is not proof that onboarding completed.
Treat it as a cue to show a status page. Confirm the result from
`account.updated` and `capability.updated` webhooks, then refresh the account
with `account.get()`.

## Move platform funds to a contributor

A connected account can only withdraw money already in its Bachs available
balance. Transfer the reserved payout amount from the platform balance:

```js
const transfer = await bachs.transfer.create({
  destination: contributor.bachsAccountId,
  amount: '1600.00',
  currency: 'NGN',
  transferGroup: 'creator-payrun-2026-08',
  description: 'August contributor payout',
  idempotencyKey: 'creator-payrun-2026-08-contributor-42'
})
```

Amounts are decimal strings. A transfer uses `available_balance`; unsettled
funds cannot be moved. It transfers one currency without conversion and cannot
take the source balance below zero.

Bachs does not provide a batch transfer endpoint. Create one transfer per
recipient. Derive each `idempotencyKey` from the payout run and recipient so one
failed call can be retried without paying the entire run twice.

If a timeout or `5xx` leaves the outcome ambiguous, do not assume the transfer
failed. Retry with the same idempotency key or reconcile an existing provider
ID:

```js
const transfer = await bachs.transfer.get({
  transferId: payout.bachsTransferId
})
```

To recover money that is still in a connected account, act as that account and
transfer to the platform:

```js
const recovery = await bachs.transfer.create({
  accountId: contributor.bachsAccountId,
  destination: 'self',
  amount: '50.00',
  currency: 'NGN',
  idempotencyKey: 'recover-overpayment-42'
})
```

The adapter maps `accountId` to Bachs' connected-account header. A recovery only
succeeds while the connected account still has the available balance.

## Check available balances

Read the platform balance before starting a payout run:

```js
const platformBalances = await bachs.balance.get()
```

Read a contributor's connected-account balance by passing `accountId`:

```js
const contributorBalances = await bachs.balance.get({
  accountId: contributor.bachsAccountId
})
```

Use the currency's `available_balance` for transfer and withdrawal decisions.
Do not count `pending_balance` as spendable.

## Resolve a Nigerian bank account

Fetch the currently supported banks and routing codes:

```js
const banks = await bachs.payout.bank.list({
  country: 'NG',
  currency: 'NGN',
  accountId: contributor.bachsAccountId
})
```

Resolve the account holder's name before registering the destination:

```js
const resolved = await bachs.payout.bank.resolve({
  accountNumber: '0123456789',
  bankCode: '058',
  currency: 'NGN',
  accountId: contributor.bachsAccountId
})
```

Show the resolved account name to the contributor for confirmation. Never infer
bank ownership from a matching name alone; the provider's identity and
destination review remain authoritative.

## Register a payout destination

Create the destination while acting as the connected account:

```js
const destination = await bachs.payout.destination.create({
  type: 'bank_account',
  currency: 'NGN',
  name: 'Contributor payout account',
  accountNumber: '0123456789',
  bankCode: '058',
  metadata: {
    contributor: contributor.id.toString()
  },
  accountId: contributor.bachsAccountId,
  idempotencyKey: `bank-destination-${contributor.id}`
})
```

`destination.create()` also supports `mobile_money` and `crypto_wallet`. Their
fields differ from a bank destination:

| Type            | Relevant fields                             |
| --------------- | ------------------------------------------- |
| `bank_account`  | `accountNumber`, `bankCode`, `currency`     |
| `mobile_money`  | `phoneNumber`, `mobileProvider`, `currency` |
| `crypto_wallet` | `walletAddress`, `network`, `currency`      |

A new destination can require review. Only a destination with
`is_usable: true` should receive a payout. Refresh it with:

```js
const destination = await bachs.payout.destination.get({
  destinationId: contributor.bachsDestinationId,
  accountId: contributor.bachsAccountId
})
```

Avoid retaining raw bank or wallet credentials after destination creation.
Persist the provider destination ID, its review status, a fingerprint, and
masked display information.

## Create the withdrawal

Once the connected account is funded and the destination is usable, create the
withdrawal while acting as that account:

```js
const payout = await bachs.payout.create({
  destination: contributor.bachsDestinationId,
  amount: '1500.00',
  reference: 'creator-payout-42',
  metadata: {
    payout: localPayout.id.toString(),
    contributor: contributor.id.toString()
  },
  idempotencyKey: 'creator-payout-42-attempt-1',
  accountId: contributor.bachsAccountId
})
```

`amount` is what the destination receives. The Bachs withdrawal fee is charged
on top, so the connected account's available balance must cover
`amount + fee`. If your product promises that a contributor receives a fixed
net amount, fund the connected account with that amount plus the expected fee.

Withdrawals are asynchronous. Do not mark a local payout paid because
`payout.create()` returned successfully. Wait for `payout.paid`, handle
`payout.failed`, or reconcile the current state:

```js
const payout = await bachs.payout.get({
  payoutId: localPayout.bachsPayoutId,
  accountId: contributor.bachsAccountId
})
```

There is no cancellation endpoint. Validate the contributor, destination,
amount, currency, and available balance before creating the withdrawal.

## Verify Connect webhooks

Connect webhooks use the same Bachs signature verifier as collection events.
Pass the exact raw body and the two signature headers:

```js
await bachs.webhooks.verify({
  rawBody: this.req.rawBody,
  timestamp: this.req.get('X-Bachs-Timestamp'),
  signature: this.req.get('X-Bachs-Signature')
})
```

Useful events for this flow include:

| Event                | Application response                                      |
| -------------------- | --------------------------------------------------------- |
| `account.updated`    | Fetch and store the latest onboarding state               |
| `capability.updated` | Fetch and store the latest transfer and payout capability |
| `transfer.created`   | Reconcile the platform-to-account movement                |
| `payout.paid`        | Settle the local payout and release its ledger hold       |
| `payout.failed`      | Keep or restore the local hold according to retry policy  |

Webhooks can be delivered more than once. Persist the provider event ID and
make each event transition idempotent. Return `200` for a verified event you
have processed or intentionally ignored, and return a non-2xx status for a
temporary failure that Bachs should retry.

See [Verifying webhooks](/sails-pay/webhooks) for raw-body and route setup.

## Keep an application ledger

Bachs moves real money; it does not replace your product's earnings ledger.
Your application remains responsible for:

- Deciding who is allowed to earn and withdraw.
- Recording the source and intended use of every funded amount.
- Reserving earnings before starting a payout.
- Preventing two payout requests from spending the same balance.
- Keeping provider transfers and withdrawals idempotent.
- Holding changed destinations for fraud review when appropriate.
- Reconciling ambiguous network outcomes before retrying.
- Marking money paid only after a terminal provider result.
- Preserving an audit trail without storing raw bank credentials.

A safe local payout state machine can use:

```text
requested
  → reserved
  → funding
  → funded
  → submitted
  → processing
  → settled

Any provider mismatch → risk-hold
Definitive withdrawal failure → withdrawal-failed → reviewed retry
```

Use separate idempotency keys for the connected-account transfer and the bank
withdrawal. They are two distinct money movements.

## Method reference

### `account.create(inputs)`

| Input            | Required | Description                                      |
| ---------------- | -------- | ------------------------------------------------ |
| `contactEmail`   | Yes      | Recipient's contact email                        |
| `displayName`    | No       | Recipient's display name                         |
| `country`        | No       | ISO country code; defaults to `NG`               |
| `entityType`     | No       | Defaults to `individual`                         |
| `capabilities`   | No       | Defaults to transfers and payouts requested      |
| `idempotencyKey` | No       | Stable key that prevents duplicate account calls |

### `account.link.create(inputs)`

| Input        | Required | Description                          |
| ------------ | -------- | ------------------------------------ |
| `accountId`  | Yes      | Connected account ID                 |
| `type`       | No       | `onboarding` or `update`             |
| `refreshUrl` | Yes      | Destination for expired or used link |
| `returnUrl`  | Yes      | Destination after the hosted flow    |

### `transfer.create(inputs)`

| Input            | Required | Description                                      |
| ---------------- | -------- | ------------------------------------------------ |
| `destination`    | Yes      | Connected account ID, or `self` for recovery     |
| `amount`         | Yes      | Positive decimal string                          |
| `currency`       | Yes      | Currency held by both balances                   |
| `transferGroup`  | No       | Reconciliation group                             |
| `description`    | No       | Transfer description                             |
| `idempotencyKey` | No       | Retry-safe request key                           |
| `accountId`      | No       | Connected-account source; omit for platform fund |

### `payout.destination.create(inputs)`

| Input                                | Required | Description                      |
| ------------------------------------ | -------- | -------------------------------- |
| `type`                               | Yes      | Destination type                 |
| `currency`                           | Yes      | Destination currency             |
| `accountNumber`, `bankCode`          | Bank     | Bank destination details         |
| `phoneNumber`, `mobileProvider`      | Mobile   | Mobile-money destination details |
| `walletAddress`, `network`           | Crypto   | Crypto destination details       |
| `name`, `metadata`, `idempotencyKey` | No       | Display and reconciliation data  |
| `accountId`                          | No       | Connected account to act as      |

### `payout.create(inputs)`

| Input            | Required | Description                              |
| ---------------- | -------- | ---------------------------------------- |
| `destination`    | Yes      | Approved provider destination ID         |
| `amount`         | Yes      | Decimal amount the destination receives  |
| `reference`      | No       | Your payout reference                    |
| `metadata`       | No       | Application reconciliation metadata      |
| `idempotencyKey` | No       | Retry-safe withdrawal key                |
| `accountId`      | No       | Connected account whose balance is drawn |

Every method also accepts optional `apiKey` and `baseUrl` overrides. Configure
those values once on the provider unless you have a deliberate per-call reason
to override them.

## Additional resources

- [Bachs Connect](https://docs.bachs.io/connect)
- [Create an account](https://docs.bachs.io/connect/guides/create-an-account)
- [Hosted onboarding](https://docs.bachs.io/connect/guides/hosted-onboarding)
- [Creator and contractor payouts](https://docs.bachs.io/connect/payout-networks)
- [Transfers](https://docs.bachs.io/connect/transfers)
- [Withdrawals](https://docs.bachs.io/connect/withdrawals)
