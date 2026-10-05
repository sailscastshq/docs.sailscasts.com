---
title: Clients and invoices
titleTemplate: Hagfish API
description: Work with client and invoice resources through Hagfish.
prev: /hagfish/api/authentication
next: /hagfish/api/deliveries-and-billing
---

# Clients and invoices

## Clients

| Method  | Resource        | Purpose                 |
| ------- | --------------- | ----------------------- |
| `GET`   | `/clients`      | List and search clients |
| `POST`  | `/clients`      | Create a client         |
| `GET`   | `/clients/{id}` | Retrieve a client       |
| `PATCH` | `/clients/{id}` | Update supplied fields  |

Client and invoice IDs are tenant-bound. Hagfish returns `404` when the ID does
not belong to the authenticated creator, rather than revealing another
creator's resource.

Lists accept `limit` from 1 to 100. Pass the previous response's
`meta.next_cursor` as `after` until `meta.has_more` is false.

## Invoice drafts

| Method  | Resource         | Purpose                                   |
| ------- | ---------------- | ----------------------------------------- |
| `GET`   | `/invoices`      | List invoices; filter by status or client |
| `POST`  | `/invoices`      | Create a draft                            |
| `GET`   | `/invoices/{id}` | Retrieve an invoice                       |
| `PATCH` | `/invoices/{id}` | Update a draft or failed invoice          |

`client_id` is required when creating a draft. `issue_date` defaults to today,
`due_date` defaults to 14 days later, and `currency` defaults to `USD`.

Line-item `unit_price` values use the currency's major unit. Hagfish uses fixed
point arithmetic internally and returns values such as `"1500.00"`. It
calculates, in order:

1. Line totals and subtotal.
2. Percentage discount.
3. VAT added to the discounted subtotal.
4. WHT deducted when enabled.

Invoice mutation supports `USD` and other valid ISO 4217 currencies, including
currencies with zero fraction digits. The OpenAPI document is the full field
and validation reference.

## Revision checks

Invoice responses include `revision`. PATCH requires `expected_revision` from the latest invoice. A concurrent edit returns `409 invoice_revision_conflict`; retrieve and review the new version before trying again. Only draft or failed invoices can be edited.

`GET /invoices/{id}/preview` returns the invoice, missing fields, and current PDF and delivery billing estimates. It is read-only and does not reserve an entitlement. The commit-time check remains authoritative.

All API resource IDs are opaque public IDs. Client and invoice list filters are documented in the [OpenAPI reference](https://hagfish.app/api/openapi.json). Malformed limits or empty cursors return `400 invalid_pagination`. A well-formed cursor that does not identify a resource in your account returns `400 invalid_cursor`.
