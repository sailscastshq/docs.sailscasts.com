---
title: Wake Collection and Consent
titleTemplate: Slipway
description: Configure collection, consent, custom session identity and anonymous sessionless analytics.
editLink: true
---

# Collection, consent and identity

The collector is part of [Wake](wake.md), with public Overview, Journeys, and Settings, durable payment receipts, retention, and deletion. Wake remains off by default.

## Configuration

App-owned `wakeSettings` are managed on Slipway. Defaults are first-party mode, consent required, and GPC/DNT respected. Allowed origins come from the environment's configured/generated HTTPS domains plus explicit normalized overrides. Paths can be excluded exactly or with a trailing wildcard. Internal settings changes rotate the app credential and require redeployment.

The runtime requests protocol 3 (protocol 2 collection remains compatible) and receives a two-minute configuration lease, refreshed every minute. Revocation rejects ingest immediately, and the hook clears queued events on revocation, failed refresh, settings changes, or expired lease. Protocol 1 registration remains compatible and cannot claim collection readiness.

## Browser installation and consent

The hook injects one external same-origin script into eligible HTML. It preserves restrictive CSP, streamed and already-compressed responses, and existing manual script tags. HTML conditional requests are not reused before a body transformation; static asset caching is untouched. Privacy checks occur at the configuration and event endpoints, so the HTML does not vary between consenting and nonconsenting visitors.

When automatic injection is unavailable, place this tag in the host app's layout, including its route prefix where applicable:

```html
<script async data-slipway-wake src="/_slipway/wake.js"></script>
```

Integrate the app's existing consent UI:

```js
window.slipway.wake.consent(true) // grant
window.slipway.wake.consent(false) // withdraw and clear analytics identifiers
```

Before the external script loads, calls can be placed in `window.slipway.wake.q` as arrays such as `['consent', true]` or `['track', 'start-checkout']`. Startup calls are bounded; goal calls are discarded when initial consent/configuration does not permit collection. No history of pre-consent pageviews is replayed.

The consent preference is stored separately from analytics identifiers. Explicit withdrawal stays effective after refresh even if the app does not require a consent prompt; consent changes are synchronized between tabs. Withdrawal aborts the current browser send, discards local events, requests removal of the signed analytics cookie, and discards still-queued events for that visitor on the host. Already accepted/delivered events are not retroactively deleted; authorized visitor deletion is a separate operation in Journeys.

## Events and privacy

Initial pageviews and History API/popstate navigation are captured once per pathname transition. Query/hash-only changes do not add a pageview. Optional click goals use `data-slipway-goal`, or `window.slipway.wake.track('goal-name')`. Browser goals carry browser provenance and are not authoritative signup/payment events.

The collector includes a normalized path, safe referrer, bounded allowlisted UTM fields, and coarse viewport device class. Other queries/fragments are omitted before sending. Country remains Unknown until a trusted enrichment integration is available. It never reads forms, DOM contents, host credentials, or user identity.

GPC/DNT, recognizable bots, localhost, configured exclusions, and explicit support-session markers suppress collection. Local/headless tests use the server-side `slipway.wake.allowTestTraffic: true` override; it does not bypass consent, origin checks, or privacy signals.

Browser POSTs require an allowed exact origin, reject cross-site fetch metadata, and accept only the fixed event shape. They cannot submit user IDs, visitor/session IDs, application scope, arbitrary properties, or revenue. The route has a narrow CSRF exemption; the host's other routes keep their existing CSRF behavior. JSON and JSON-in-text beacon bodies are bounded to 16 KiB before the ordinary host parser runs. Custom parsers must honor the standard `req._body` flag.

## Visitor and session identity

First-party mode uses an app-scoped, HMAC-signed HttpOnly cookie, with SameSite=Lax, the app route path, and Secure on HTTPS origins. It has a fixed 90-day visitor lifetime and renews the session after 30 minutes of inactivity. It is separate from the application's login session.

Identity resolves after application middleware, using `User`/`session.userId`, a declared custom mapping such as `creatorId`, or a server-verified principal helper. The helper returns only an ID; email/name are not collected. An application can stay sessionless and retain anonymous analytics continuity without a User model or login session.

### Custom sessions

The default is `User` and `req.session.userId`. For a `Creator` model stored in `req.session.creatorId`, declare the mapping in the application's configuration:

```js
// config/slipway.js
module.exports.slipway = {
  identity: { model: 'creator', sessionKey: 'creatorId' }
}
```

Shared `slipway.identity` is inherited. A Wake-specific `slipway.wake.identity` takes precedence; the legacy `slipway.bridge.identity` mapping remains a fallback. The model must match the actual session reference.

### Sessionless apps and verified principals

A public app needs no User model or login session: permitted first-party analytics identifiers provide anonymous continuity. If existing authentication middleware verifies a principal outside a session, declare a server helper:

```js
module.exports.slipway = {
  wake: { identity: { helper: 'analytics.identity' } }
}
```

The helper receives `{ req }` and returns `{ id }` for a server-verified principal or `null` for anonymous traffic. Never return an identity supplied directly by browser input. An explicit `null` does not fall back to session lookup. Failures become anonymous with bounded diagnostics; no email or name is returned.

### Login transitions

A first login retains eligible anonymous visitor continuity. A switch from one authenticated subject to another, or observed logout, rotates visitor/session identifiers and discards the transition batch. The browser then records the current page under the new identity. Signed cookies cannot be moved between app names or modified to choose a visitor.

Cookieless mode performs no identity lookup and persists no visitor/session IDs or host-user link. Slipway also strips such identifiers on ingest when current settings are cookieless, covering in-flight events from an older lease. Distinct visitors, persistent journeys, and visitor conversion must not be claimed from cookieless events.

## Bounds and failure behavior

The browser batches 10 events/five seconds and holds at most 100 events in memory. The hook holds at most 1,000, discards oldest pageviews/goals under pressure, sends at most 100 per batch with one active send, and never awaits Slipway network ingestion on a page response. Requests have an absolute three-second transport deadline; browser sends have a four-second deadline. Events older than five minutes are rejected at the host collector.

Host event processing admits at most 1,200 requests/minute and 16 concurrent operations. Identity lookups have a 500 ms response deadline and at most 16 outstanding operations, including timed-out lookups until they settle. No raw IP is retained to implement these bounds. Existing app-scoped Slipway ingestion budgets still apply.

Runtime diagnostics expose bounded received/delivered/rejected/dropped counters and queue length. Delivery is best-effort with no unbounded retries. This transport is explicitly unsuitable for revenue; use [committed revenue receipts and replay](/slipway/wake-revenue) for payments.

## Verification

Real TBJS/Sails browser trials cover consent, creator identity transitions, sessionless modes, SPA deduplication, scoped HttpOnly cookies, hostile payloads/origins, CSRF isolation, GPC, withdrawal persistence, CSP/manual installation, streams, and revocation. Unit trials cover cookie tampering/scope/expiry, inactivity, logout, queue pressure, and lease expiry. Existing Bridge/Bearing and foundation contracts remain in the regression suite.
