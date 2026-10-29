---
title: Credits and billing
titleTemplate: Tembo Voice API
description: Prepaid Tembo credits, per-started-second transcription rates and held reservations.
editLink: true
---

# Credits and billing

Tembo API credits belong to an organisation and are separate from provider credits and your application's own prices. The configured face value is **20 kobo per credit**: **10,000 purchased credits cost ₦2,000**. They are not transferable or cashable out. A new organisation's promotional credit grant is a separate ledger bucket, not a purchased balance.

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

Do not calculate customer charges from upstream `creditsReserved` or `creditsCharged`. Those are provider metering units, not the Tembo tariff. Reservations, organisation balance, project allowance, concurrency and storage limits are separate controls.

## Funding and availability

Use Console's credit-purchase flow and review its quote before confirming. External payments fulfill credits only after a verified payment webhook; a browser redirect is not a credit receipt. Cowrie purchases require funded eligible Cowries; do not treat unrelated contribution earnings as spendable API credit. Saved auto-topup settings are preferences only: automatic payments are unavailable and saving them creates no payment mandate.

The repository's default configuration leaves API funding and usage charging disabled until both are explicitly enabled for the deployment. A rate card in source does not prove that every live project can submit or fund credits. Check Console readiness and project activation. Metadata language support and published pricing do not establish measured recognition quality for every language.
