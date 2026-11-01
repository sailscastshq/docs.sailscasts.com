---
title: Credits and billing
titleTemplate: TemboAI Voice API
description: Prepaid TemboAI credits, per-started-second transcription rates and held reservations.
head:
  - - link
    - rel: canonical
      href: https://docs.sailscasts.com/tembo-ai/voice
editLink: true
---

# Credits and billing

::: info Compatibility URL
The canonical Credits and billing documentation is now at [Credits and billing](/tembo-ai/voice#credits-and-billing). Existing links and anchors on this page remain available.
:::

<!-- #region voice-billing -->

TemboAI API credits belong to an organisation and are separate from provider credits and your application's own prices. The configured face value is **20 kobo per credit**: **10,000 purchased credits cost ₦2,000**. They are not transferable or cashable out. A new organisation's promotional credit grant is a separate ledger bucket, not a purchased balance.

The current STT rate card covers `en`, `pcm`, `yo`, `ig` and `ha` at **5 credits per started audio second**. The measured recording duration is rounded up, independently for each recording:

```text
quoted credits = ceil(duration in milliseconds / 1000) × 5
```

| Validated duration | Credits | Face value |
| ------------------ | ------- | ---------- |
| 1 second           | 5       | ₦1         |
| 5 seconds          | 25      | ₦5         |
| 5.001 seconds      | 30      | ₦6         |
| 15 seconds         | 75      | ₦15        |
| 30 seconds         | 150     | ₦30        |

Durations above 30 seconds are rejected. Uploaded media is structurally validated; a forged filename or duration field cannot reduce the measured duration. The current rate-card version is `stt-ngn-20261029-v2`. Older Hausa-only quote snapshots retain their original rate version.

## Quote, reservation and settlement

`apiCredits` on a request is either `null` when there is no reservation, or an object containing:

```json
{
  "quoted": 30,
  "status": "reserved",
  "rateVersion": "stt-ngn-20261029-v2",
  "measure": "started_audio_second",
  "quantity": 6
}
```

This example represents a six-started-second reservation. Credits are reserved before a hosted submission; promotional credits are used first, then purchased credits. A successful request settles its original quote once. Safely known uncharged failures can release the reservation. Unknown or potentially charged provider outcomes remain held for reconciliation. A failed or cancelled request alone does not prove a release or refund: inspect `apiCredits.status` (`reserved`, `settled` or `released`).

Do not calculate customer charges from upstream `creditsReserved` or `creditsCharged`. Those are provider metering units, not the TemboAI tariff. Reservations, organisation balance, project allowance, concurrency and storage limits are separate controls.

## Funding and availability

In Console, open **Usage → Buy credits** as an organisation owner or admin. Choose **Bank transfer · Bachs** or your available **Cowries balance**, then review the server-issued quote before confirming. Purchases are in NGN; one Cowrie buys five API credits. USD checkout and automatic top-ups are not currently available. External payments fulfill credits only after a verified payment webhook; a browser redirect is not a credit receipt. Use **Refresh status** to check a pending payment. An interrupted checkout can recover the same purchase; do not start another payment when its outcome is unresolved. Cowrie purchases require funded eligible Cowries; do not treat unrelated contribution earnings as spendable API credit. Saved auto-topup settings are preferences only: automatic payments are unavailable and saving them creates no payment mandate.

Hosted processing and billing are enabled on the released service. Self-service activation creates no key, payment or credit grant. Its **10,000-operation allowance ceiling is separate from prepaid credits**: it is not a balance of 10,000 credits and does not pay for transcription. The project also has one concurrent request and a 64 MiB total retained-audio ceiling. Check Console readiness and project activation. Metadata language support and published pricing do not establish measured recognition quality for every language.

<!-- #endregion voice-billing -->
