---
title: Deliveries and billing
titleTemplate: Hagfish API
description: Understand asynchronous invoice delivery and atomic Hagfish billing.
prev: /hagfish/api/resources
next: /hagfish/api/webhooks
---

# Deliveries and billing

Create a delivery with:

```http
POST /invoices/{id}/deliveries
```

An empty JSON body sends to the invoice's saved recipient immediately. Supply
`recipient_emails` to override the recipients or an ISO 8601 `send_at` to
schedule it.

The `202 Accepted` response is an `invoice_delivery` resource containing its
status, scheduled time, billing reservation, and invoice snapshot. It does not
mean the email has already reached the recipient; use webhooks for the outcome.

## Atomic entitlement checks

The API and Hagfish web app use exactly the same billing helper. Creating a
delivery atomically reserves, in order:

1. Available quota from an active plan.
2. An unlimited-plan entitlement, when applicable.
3. The configured send-invoice credit cost.

If none is available, Hagfish returns `402 billing_required` and leaves the
invoice, quota, and credit ledger unchanged. Retrying with the same
`Idempotency-Key` cannot reserve twice.

A successful send consumes the reservation. If Hagfish exhausts its email
attempts without completing delivery, it releases the reservation exactly once
and emits `invoice.delivery.failed`.

## PDF-only exports

The first-paid-export idea is not part of API v1 yet. Its safe billing unit is a
generated PDF artifact for one invoice content version: charge once when the
artifact is first generated, allow repeat downloads of that immutable artifact,
and create a new billable artifact only after invoice content changes. HTTP
socket completion alone cannot prove that a person received a download.
