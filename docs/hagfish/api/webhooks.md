---
title: Webhooks
titleTemplate: Hagfish API
description: Register, verify, rotate, inspect, and replay Hagfish webhooks.
prev: /hagfish/api/deliveries-and-billing
next: /hagfish/api/errors-and-local-testing
---

# Webhooks

Hagfish operates its own outbound webhook server. Domain changes write an event
and delivery record in the same database transaction; a separate worker signs
and delivers it afterward. A slow or failing customer endpoint never blocks an
invoice or billing transaction.

## Endpoint resources

| Method                     | Resource                                   | Purpose                    |
| -------------------------- | ------------------------------------------ | -------------------------- |
| `GET` / `POST`             | `/webhook-endpoints`                       | List or register endpoints |
| `GET` / `PATCH` / `DELETE` | `/webhook-endpoints/{id}`                  | Manage one endpoint        |
| `POST`                     | `/webhook-endpoints/{id}/secret-rotations` | Rotate its secret          |
| `POST`                     | `/webhook-endpoints/{id}/test-events`      | Queue a signed test        |
| `GET`                      | `/webhook-deliveries`                      | Inspect delivery history   |
| `POST`                     | `/webhook-deliveries/{id}/replays`         | Replay an event            |

Registration returns a `whsec_...` signing secret once. Production endpoints
must use HTTPS and resolve only to public addresses. Hagfish re-resolves and
pins the validated address for each attempt, does not follow redirects, and
blocks internal/private destinations to prevent SSRF.

## Events

- `client.created` and `client.updated`
- `invoice.created` and `invoice.updated`
- `invoice.delivery.scheduled`
- `invoice.sent`
- `invoice.delivery.failed`
- `webhook.test`

Events are deliberately thin. Read the current resource through the API after
receiving its ID.

## Verify a delivery

Hagfish implements the Standard Webhooks signature format and sends:

```text
webhook-id: evt_...
webhook-timestamp: 1787097600
webhook-signature: v1,BASE64_SIGNATURE
```

Using the exact raw request bytes, compute HMAC-SHA256 over:

```text
webhook-id.webhook-timestamp.raw-json-body
```

Decode the base64 part after `whsec_` as the HMAC key, compare signatures in
constant time, reject timestamps more than five minutes old, and deduplicate on
`webhook-id`. During the 24-hour rotation window the signature header contains
two space-separated `v1,...` signatures; accept either current secret.

Return any `2xx` promptly. Redirects are failures. `410 Gone` disables the
endpoint. Other failures retry over roughly three days using the Standard
Webhooks schedule, and `Retry-After` is honored within the retry cap. Exhausted
deliveries remain visible and can be replayed after the endpoint is fixed.
