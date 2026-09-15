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

Invoices created through the API have `created_via: "api"`. Future Telegram,
WhatsApp, banking, and MCP adapters will use the same helper and identify their
own source without changing the resource contract.
