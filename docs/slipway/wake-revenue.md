---
title: Wake Goals and Revenue
titleTemplate: Slipway
description: Record authoritative goals, checkout attribution, idempotent payments and refunds.
editLink: true
---

# Goals and revenue

[Enable Wake](/slipway/wake) and install the supported hook before calling these helpers. Pageviews and browser goals are best-effort; payments use a committed receipt and an app-owned durable retry workflow.

## Goals

Browser goals are interaction signals. Server goals are explicitly emitted business events:

```js
await sails.helpers.wake.track.with({
  req: this.req,
  name: 'signup',
  eventId: `signup_${record.id}`, // stable, 8–128 safe identifier characters
  properties: { plan: 'pro' }
})
```

Call this after successful signup; Wake does not infer signup from record creation. Emit a business event once from the authoritative server rather than also calling the browser goal with the same meaning. Provenance remains visible in Overview and Journeys. Properties allow at most ten bounded scalar values; sensitive field names are rejected. Do not put personal information into otherwise innocuous property values.

Goals use the bounded best-effort analytics queue. `{ accepted: true }` means queued, not durable delivery. In consent-gated first-party mode a permitted analytics cookie must already exist. A missing/invalid cookie or privacy/support-session exclusion suppresses the goal. In cookieless mode, server goals can be emitted only when the server's configured collection policy does not require a browser consent proof; browser goals continue to honor their consent gate. Do not weaken an app's privacy choice merely to emit server goals.

## Checkout attribution and committed revenue

At checkout creation, obtain an opaque attribution token from the existing permitted analytics cookie:

```js
const attributionId = await sails.helpers.wake.attribution.with({
  req: this.req
})
// Put attributionId in the payment provider's checkout metadata, for example
// customData.slipwayWake when using your sails-pay checkout integration.
```

This works without an application login. The token is encrypted/authenticated, scoped to one app, valid for thirty days, and exposes no visitor ID. Missing, expired, tampered, or credential-rotation-invalidated attribution produces an **unattributed** payment; it does not discard valid revenue. Cookieless mode issues no persistent attribution token.

After verified payment processing, the app's durable payment record/job delivers analytics:

```js
const receipt = await sails.helpers.wake.revenue.with({
  transactionId: String(payment.id),
  amount: payment.amountInMinorUnits,
  currency: payment.currency.toUpperCase(),
  occurredAt: payment.paidAt, // original payment timestamp, milliseconds
  attributionId: payment.customData.slipwayWake || undefined
})
// Persist receipt/analytics-delivered state in the app's durable job or record.
```

`occurredAt` is required and must remain unchanged on replay. Amounts are nonnegative safe integers up to 1,000,000,000,000 in the currency's minor unit; supported ISO currency codes are validated. A receipt is returned only after SQLite commits with FULL synchronous durability. An identical replay returns `{ receipt, duplicate: true }`. Conflicting amount/currency/time or transaction identity under the same key returns HTTP 409; it never overwrites a payment.

Revenue bypasses the disposable pageview queue. A timeout, 429, 503, network error, or revoked credential does not acknowledge a receipt. Retry the **same transaction ID, original timestamp, amount, and currency** from the app-owned durable source, with bounded backoff. Reconcile unacknowledged payments periodically. Treat validation/conflict failures as permanent until corrected; inspect the original helper error's status/retriable fields (Sails may wrap it in `raw`). Keep analytics out of the customer checkout response path, and never reverse a successful payment because Wake is unavailable. No payment provider is monkey-patched.

Refunds use a separate idempotent adjustment key:

```js
await sails.helpers.wake.revenue.with({
  transactionId: String(payment.id),
  adjustmentId: String(refund.id),
  amount: refund.amountInMinorUnits,
  currency: payment.currency.toUpperCase(),
  occurredAt: refund.refundedAt
})
```

The original receipt must exist. Currency must match, refund time cannot precede payment, and cumulative refunds cannot exceed the payment. Gross, refunds, and net remain separate. Different currencies are never summed or converted. Retrying an adjustment uses its same original timestamp.

The fixed reporting/receipt window is 396 days (thirteen months for this release). Events older than that window, or over five minutes in the future, are rejected. Old receipts are pruned; an old payment replay cannot become a new payment after pruning because its original timestamp is outside acceptance. Refunds against a pruned original receipt are rejected. This is analytics retention, not an accounting ledger.
