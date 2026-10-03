---
title: Hagfish API
titleTemplate: Hagfish
description: Build invoice workflows with the Hagfish REST API and signed webhooks.
next:
  text: Getting started
  link: /hagfish/api/getting-started
---

# Hagfish API

Hagfish is an invoice transaction layer for products, automations, and agents.
Create a client, create an invoice, and ask Hagfish to deliver it without
reimplementing invoice math, billing entitlement, PDF generation, or email.

The same versioned resources are intended for ordinary backends today and for
Telegram, WhatsApp, banking, and agent integrations later.

## Base URL

```text
https://hagfish.app/api/v1
```

The [OpenAPI 3.1 document](https://hagfish.app/api/openapi.json) is the
machine-readable reference for clients and tools.

## Core workflow

1. Create a scoped API key in Hagfish under **Developers**.
2. `POST /clients` to save the payer.
3. `POST /invoices` to create a draft with Hagfish-calculated totals.
4. `POST /invoices/{id}/deliveries` to schedule or send it.
5. Subscribe to signed webhooks such as `invoice.sent`.

Every POST or PATCH uses `Idempotency-Key`, so a network retry cannot create a
second resource or billing reservation.

## Conventions

- Requests and responses use JSON with `snake_case` fields.
- Resource IDs are opaque strings. Store them; do not parse them.
- Monetary amounts in responses are decimal strings in the invoice's major
  currency unit.
- Lists use cursor pagination with `limit` and `after`.
- Errors use `application/problem+json` and include a `request_id`.
- Invoice deliveries return `202 Accepted` because sending is asynchronous.

Continue to [Getting started](/hagfish/api/getting-started) for a complete first
invoice.
