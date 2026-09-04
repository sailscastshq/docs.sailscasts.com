---
title: Getting started
titleTemplate: Hagfish API
description: Create and deliver your first invoice through Hagfish.
prev: /hagfish/api/
next: /hagfish/api/authentication
---

# Getting started

Create an API key from **Developers** in Hagfish. Choose only the scopes your
integration needs and copy the token immediately; Hagfish stores its digest and
cannot show the full token again.

Set the token in your server environment:

```sh
export HAGFISH_API_KEY=hf_live_REPLACE_ME
```

## Confirm the identity and entitlement

```sh
curl https://hagfish.app/api/v1/creator \
  -H "Authorization: Bearer $HAGFISH_API_KEY"
```

`GET /creator` returns the authenticated creator, the current plan/credit
entitlement, and the scopes granted to this key.

## Create a client

```sh
curl https://hagfish.app/api/v1/clients \
  -X POST \
  -H "Authorization: Bearer $HAGFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: client-acme-2026-08-19" \
  -d '{
    "name": "Acme Research",
    "email": "billing@acme.example",
    "address": "100 Market Street",
    "city_state_postal": "San Francisco, CA 94105",
    "country": "United States"
  }'
```

Save the returned client `id`.

## Create an invoice draft

```sh
curl https://hagfish.app/api/v1/invoices \
  -X POST \
  -H "Authorization: Bearer $HAGFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: invoice-acme-august-2026" \
  -d '{
    "client_id": "CLIENT_ID",
    "invoice_number": "ACME-2026-08",
    "currency": "USD",
    "items": [
      {"description": "Research sprint", "quantity": 2, "unit_price": "750.00"}
    ],
    "vat_rate": "0",
    "notes": "Thank you for your business."
  }'
```

Hagfish calculates line totals, subtotal, discount, VAT, WHT, and the final
total. Never send a client-calculated total.

## Deliver it

```sh
curl https://hagfish.app/api/v1/invoices/INVOICE_ID/deliveries \
  -X POST \
  -H "Authorization: Bearer $HAGFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: deliver-acme-august-2026" \
  -d '{}'
```

A `202` response means Hagfish atomically reserved the applicable plan quota or
credits and accepted the delivery. Register a webhook to receive the final
`invoice.sent` or `invoice.delivery.failed` event.
