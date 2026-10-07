---
title: Hagfish API
titleTemplate: Hagfish
description: Build invoice workflows with the Hagfish REST API and signed webhooks.
next:
  text: Getting started
  link: /hagfish/api/getting-started
---

# Hagfish API

Hagfish brings professional invoicing into your products and automations.
Create a client, create an invoice, and ask Hagfish to deliver it without
reimplementing invoice math, billing entitlement, PDF generation, or email.

::: info Available API
The client, invoice, template, delivery, usage and webhook API is available at the production base URL below. Use disposable accounts when testing. The client onboarding API expansion remains a separate release candidate.
:::

## Base URL

```text
https://hagfish.app/api/v1
```

The [OpenAPI 3.1 document](https://hagfish.app/api/openapi.json) is the
machine-readable reference for clients and tools.

## Core workflow

1. Create a scoped API key in Hagfish under **Settings → Developers**.
2. `POST /clients` to save the client.
3. `POST /invoices` to create a draft with Hagfish-calculated totals.
4. `GET /invoices/{id}/preview` to review the revision, totals, and applicable credits.
5. Generate a PDF or explicitly request a delivery with the reviewed revision and credit ceiling.
6. Subscribe to signed webhooks such as `invoice.sent`.

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
