---
title: Errors and local testing
titleTemplate: Hagfish API
description: Handle Hagfish API problems and test the full integration locally.
prev: /hagfish/api/webhooks
---

# Errors and local testing

## Problem responses

Hagfish uses RFC 9457 problem details:

```json
{
  "type": "https://hagfish.app/problems/validation_failed",
  "title": "Validation failed",
  "status": 422,
  "code": "validation_failed",
  "detail": "The client_id field is required.",
  "instance": "/api/v1/invoices",
  "request_id": "...",
  "errors": [{ "field": "client_id", "message": "is invalid" }]
}
```

Common statuses are `401` for a missing/invalid key, `403` for a missing scope,
`402` for insufficient billing entitlement, `404` for an absent or foreign
resource, `409` for state/idempotency conflicts, `422` for invalid input, and
`429` for rate limiting.

## Run Hagfish locally

```sh
npm ci
npm run dev
```

Sign in at `http://localhost:1337`, open `/developers`, create a key, and call:

```sh
curl http://localhost:1337/api/v1/creator \
  -H "Authorization: Bearer $HAGFISH_API_KEY"
```

The local OpenAPI document is at
`http://localhost:1337/api/openapi.json`.

## Test webhooks locally

Run Hagfish's included loopback receiver in another terminal:

```sh
npm run dev:webhook-receiver
```

Register `http://127.0.0.1:4040` as an endpoint. Plain HTTP loopback
destinations are enabled only in development/test; other private networks stay
blocked. Restart it with the endpoint secret to verify signatures:

```sh
HAGFISH_WEBHOOK_SECRET=whsec_REPLACE_ME npm run dev:webhook-receiver
```

Queue a test event, watch the verified payload, then inspect it through
`GET /webhook-deliveries`.

## Recovery and troubleshooting

- `401`: check the active key and its revocation state. Keep tokens out of screenshots and support messages.
- `403`: add only the scope the operation requires, such as `invoices:pdf` or `usage:read`.
- `402`: inspect `/creator` and the invoice preview. No reservation was committed.
- `409 invoice_revision_conflict`: fetch and review the latest revision.
- `409 credit_ceiling_exceeded`: review the current estimate before increasing your explicit ceiling.
- `429`: wait for `Retry-After`, retaining the original body and operation key.
- Network timeout after a write: replay the same key and body, then inspect the resource. A new key can create a second operation.
- `reconciliation_required`: inspect the delivery and retain its ID and request ID for support. Do not force another send.

The CLI sends machine-readable output to stdout with `--json`, and diagnostics to stderr. See [CLI commands and exit codes](/hagfish/cli/).

## Test an integration safely

Use an isolated development database and disposable fixtures. Stub email delivery locally before requesting a send. Never use a real client email or production API key for a test.

```sh
npm run test:api
node --test --test-concurrency=1 tests/functional/api/workflow-safety.test.js
npm test --prefix packages/cli
```

The suites exercise tenant isolation, scopes, revisions, fixed-point totals, quota and credit races, rollback, immutable PDFs, repeated operation keys, and uncertain email recovery.
