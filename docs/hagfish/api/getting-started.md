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

## Accounts, clients and applications

Your Hagfish account owns its invoices, billing entitlements and API keys. The API calls this account a `creator`; it is the tenant boundary for every request.

A `client` is the person or business paying an invoice. Creating a Client record does not create a Hagfish account or grant access. A third-party application is software connecting to the API on your account’s behalf; it is separate from a payer Client. Its API key can access only the resources and scopes you approve.

The current CLI uses `HAGFISH_API_KEY` and `auth status`. Browser login and device authorization are being prepared; they are not available in this release candidate.

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

## Review before committing

```sh
curl https://hagfish.app/api/v1/invoices/INVOICE_ID/preview \
  -H "Authorization: Bearer $HAGFISH_API_KEY"
```

Check `data.invoice.revision`, the calculated total, and `data.billing`. Previewing does not generate a PDF, reserve credits, or send an email.

## Export a PDF

```sh
curl https://hagfish.app/api/v1/invoices/INVOICE_ID/pdf-artifacts \
  -X POST \
  -H "Authorization: Bearer $HAGFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: pdf-acme-august-2026" \
  -d '{"expected_revision":1,"max_credits":20}'
```

Download the returned `data.download_path` with the same bearer key. Retrieving an existing artifact does not render again or charge credits.

## Request a delivery deliberately

Only send after reviewing the recipient, schedule, revision, and cost. The following example reserves up to 20 credits after PDF unlock:

```sh
curl https://hagfish.app/api/v1/invoices/INVOICE_ID/deliveries \
  -X POST \
  -H "Authorization: Bearer $HAGFISH_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: deliver-acme-august-2026" \
  -d '{"expected_revision":1,"max_credits":20,"recipient_emails":["billing@acme.example"]}'
```

A `202` response means the reservation and durable delivery were accepted. It does not mean the message arrived. Poll `GET /deliveries/DELIVERY_ID` or subscribe to signed outcome webhooks. Store the delivery ID and original operation key.
