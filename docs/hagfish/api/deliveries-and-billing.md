---
title: Deliveries and billing
titleTemplate: Hagfish API
description: Understand asynchronous invoice delivery and atomic Hagfish billing.
prev: /hagfish/api/resources
next: /hagfish/api/webhooks
---

# Deliveries and billing

Review `GET /invoices/{id}/preview` before requesting an export or send. Both POST operations require `expected_revision`, `max_credits`, and an `Idempotency-Key`. A stale revision or a cost above your ceiling returns `409` without committing a reservation.

## Existing plans and credits

| Workflow                                    | Credits or entitlement                                             |
| ------------------------------------------- | ------------------------------------------------------------------ |
| First PDF unlock on a credit account        | 20 credits                                                         |
| Repeat PDF generation or artifact retrieval | Free after invoice unlock                                          |
| Email first, including PDF unlock           | 40 credits total                                                   |
| Email after PDF unlock                      | 20 credits                                                         |
| Creator                                     | 25 monthly emails and included PDFs; additional emails use credits |
| Pro                                         | Unlimited emails and included PDFs                                 |

PDF unlock belongs to the invoice. Editing its draft does not create another PDF unlock fee. A generated artifact preserves the bytes of that revision; retrieving it never changes those bytes. Generating a PDF for the latest revision creates a new artifact using the existing unlock.

`GET /usage` lists usage and refunds with cursor pagination. `GET /creator` returns the current entitlement. These endpoints do not purchase credits or change subscriptions.

## PDF artifacts

`POST /invoices/{id}/pdf-artifacts` renders and stores a private PDF artifact. The response includes its public ID, revision, size, and authenticated download path. `GET /pdf-artifacts/{id}` returns the existing bytes. Another creator cannot retrieve it.

A rendering or storage failure rolls back the charge and operation result. Retry the identical request with its original key. A changed invoice requires a fresh review, revision, and key.

## Durable deliveries

`POST /invoices/{id}/deliveries` accepts `recipient_emails` and an optional `send_at` with an explicit timezone. Omitted recipients use the invoice’s saved recipient list first, then the saved client email. An explicitly empty recipient list fails validation. Omitted schedule means send now. Review the returned normalized recipients and actual `scheduled_at`.

The `202` response includes the delivery ID, invoice revision, reservation, and status. It preserves the invoice content approved for that operation. `GET /deliveries/{id}` returns its current state.

| Status                    | Meaning                                                                        |
| ------------------------- | ------------------------------------------------------------------------------ |
| `scheduled`               | Reserved and waiting for processing                                            |
| `rendering`               | Preparing the approved invoice PDF                                             |
| `sending`                 | Provider contact has started; outcome may be uncertain                         |
| `accepted`                | Provider acceptance recorded; final bookkeeping pending                        |
| `sent`                    | Provider acceptance and bookkeeping completed; inbox receipt is not guaranteed |
| `failed`                  | Known failure after allowed attempts; reservation released                     |
| `cancelled`               | Cancelled before sending; reservation released                                 |
| `reconciliation_required` | Provider outcome needs investigation; automatic resend is blocked              |

Known permanent failures release the reservation once. An ambiguous timeout or interrupted send stays reserved while being reconciled, since refunding and sending again could duplicate an accepted invoice. Retain the request and delivery IDs and contact support; do not replace the operation key to force a retry.

Repeated requests with the same key replay their original response. Repeated compatible reservations for the same pending invoice return its existing delivery. Changing the recipients or schedule of a pending delivery produces `409 delivery_conflict`.
