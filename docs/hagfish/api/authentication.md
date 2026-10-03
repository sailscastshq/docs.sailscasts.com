---
title: Authentication and idempotency
titleTemplate: Hagfish API
description: Secure Hagfish API keys and make safe retryable mutations.
prev: /hagfish/api/getting-started
next: /hagfish/api/resources
---

# Authentication and idempotency

## Bearer API keys

Send a Hagfish API key in the `Authorization` header:

```http
Authorization: Bearer hf_live_...
```

API keys are server credentials. Do not embed them in browser JavaScript,
mobile apps, Telegram clients, or repositories. Store them in a secret manager
or encrypted environment variable and create a separate key per integration
and environment.

Available scopes are:

- `clients:read` and `clients:write`
- `invoices:read`, `invoices:write`, and `invoices:send`
- `webhooks:read` and `webhooks:write`

Use `GET /creator` to inspect the active key and its scopes. Revoking a key in
Hagfish takes effect immediately.

## Idempotency

Every POST and PATCH request requires an `Idempotency-Key` header. Generate the
key once for a logical operation and retain it when retrying that same request.

```http
Idempotency-Key: order_874_invoice_create
```

Hagfish retains the result for 24 hours:

- Same key and same JSON body: the original status and response are replayed,
  with `Idempotent-Replayed: true`.
- Same key and different body: `409 idempotency_key_reused`.
- A concurrent call while the first is processing: `409 request_in_progress`.

Do not generate a fresh key merely because a request timed out; doing so turns
a retry into a second operation.

## Request IDs and rate limits

Every response includes `X-Request-Id`, and JSON responses include
`request_id`. Retain it in logs and support reports. API keys are currently
limited to 600 requests per minute, with invoice delivery creation limited to
60 per minute. Creator-wide limits prevent multiple keys from bypassing the
guard. A `429` response includes `Retry-After`.
