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
npm install
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

## Run the integration suite

```sh
npm run test:api
```

It covers scopes, idempotency, tenant isolation, exact invoice totals, credit
reservation, insufficient entitlement, outbound signatures, retries, rotation,
and SSRF protection.
