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
- `invoices:read`, `invoices:write`, `invoices:pdf`, and `invoices:send`
- `usage:read`
- `webhooks:read` and `webhooks:write`

Use `GET /creator` to inspect the active key and its scopes. Revoking a key in
Hagfish takes effect immediately.

## Connected applications

Connected login is implemented in the private candidate and awaits public activation. On a configured issuer, a registered public application uses browser consent and S256 PKCE. Native CLI callbacks bind only to literal loopback; approved web applications use their registered exact HTTPS callback. There is no public dynamic application registration.

A Creator-approved OAuth access token can be sent in the same bearer header. It must target the API resource, such as `https://hagfish.app/api/v1`, and carry the existing scopes required by the operation. A token approved only for `/mcp` cannot access the API. The authenticated Creator remains the account boundary.

Access expires after 10 minutes; a connection can renew access for up to 7 days. Refresh tokens rotate and reuse revokes the token family. Revoke access in Connected applications or through CLI logout. API keys remain available independently. See [CLI account login](/hagfish/cli/#connect-your-account) and the [MCP preview](/hagfish/mcp).

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
- An unresolved operation: `409 operation_reconciliation_required`; inspect its resource and contact support before requesting another operation.
- Completed results older than 24 hours: `409 idempotency_key_expired`. An expired key does not execute again.

Do not generate a fresh key merely because a request timed out; doing so turns
a retry into a second operation.

## Request IDs and rate limits

Every response includes `X-Request-Id`, and JSON responses include
`request_id`. Retain it in logs and support reports. API keys are currently
limited to 600 requests per minute, with invoice delivery creation limited to
60 per minute. Creator-wide limits prevent multiple keys from bypassing the
guard. A `429` response includes `Retry-After`.
