---
title: Wake
titleTemplate: Slipway
description: Understand acquisition, activity and revenue with app-scoped product analytics.
editLink: true
---

# Wake

Wake is optional, app-scoped product analytics for TBJS applications. It stays separate from Lookout and is off by default. It supports conventional Sails sessions, declared custom sessions, and anonymous sessionless apps. Custom containers do not gain analytics merely by being attached to Slipway.

## Install and enable

Use Slipway **v0.0.65 or later** and install the supported hook in your application:

```sh
npm install sails-hook-slipway@0.0.10
```

Open the app's **More → Wake → Settings**, choose collection settings, save, and redeploy once. Normal deployment and rollback both receive app-scoped Wake credentials. The dashboard shows waiting for redeploy, update-required, disabled, or unavailable states instead of implying that an old hook collects data. Protocol 3 adds goals/revenue helpers and delivery diagnostics; protocol 2 collection remains compatible but requires an update for the full feature.

First-party mode, a consent gate, and respect for GPC/Do Not Track are the defaults. App HTTPS domains are allowed automatically; additional exact origins and excluded paths are explicit settings. Each save while enabled rotates the credential and requires redeployment. Disabling rejects new ingest immediately. Hosts refresh configuration every minute and fail closed after a two-minute lease. Neither ordinary page responses nor app startup wait for network ingestion.

See [collection and consent](wake-collection.md) for the browser API, manual same-origin script fallback, SPA navigation, CSP/streaming boundaries, identity mapping, and privacy controls. No email/name is collected. Country remains **Unknown** until a trusted enrichment integration is provided; raw IP is not retained. Analytics identifiers are not authentication cookies or a claim of consent compliance.

For a custom `creatorId` session or an anonymous sessionless app, follow the [identity examples](/slipway/wake-collection#visitor-and-session-identity). No login session is required for anonymous analytics.

## Find your way around

| Tab      | What you can do                                                                                |
| -------- | ---------------------------------------------------------------------------------------------- |
| Overview | Filter UTC dates and currency; compare visitors, goals, sources and committed revenue.         |
| Journeys | Inspect an anonymous visitor timeline and delete linkable visitor history.                     |
| Settings | Enable collection, choose privacy controls, set origins/exclusions and inspect runtime health. |

![Wake Overview with visitors, goals and revenue](/slipway/wake-overview.png)

This screenshot uses test data. Install and enable collection before expecting your own activity.

Start with [collection and consent](/slipway/wake-collection), add [goals and revenue](/slipway/wake-revenue), and review [storage and recovery](/slipway/wake-operations) before relying on retained reports. Lookout remains the place for request latency, exceptions and infrastructure health.

## Reporting definitions

Dates, selected currency, tabs, and visitor selection belong to the URL. Dates use UTC days, inclusive From/Through controls, and an exclusive next-day bound internally. Any active team member can read their app's analytics; only owners/admins can change settings or delete visitor history. Bridge-only invited users cannot access Wake.

- **Visitors:** distinct permitted visitor IDs active in the range. Exact daily membership is retained; daily unique totals are never added together.
- **Sessions:** sessions beginning in the range. The browser identity contract uses a thirty-minute inactivity timeout.
- **Signup conversion:** visitors active in the range with a server signup in that same range, divided by the range's distinct visitors. Browser signup signals do not count as authoritative signups.
- **Goals:** event counts and distinct converting visitors, separated by browser/server provenance.
- **Revenue:** committed payments/refunds whose occurrence falls in the range, filtered to one currency. Unattributed net remains included and is also shown separately.
- **Paying visitors:** distinct attributed visitors with a payment in the range. This cannot count unattributed customers or deduplicate across devices.
- **Revenue per visitor:** net revenue in the range attributed to its active visitor cohort divided by that cohort's visitors, in one currency.
- **Sources/campaigns:** event-touch dimensions, labeled as such. First/last touch and first landing pages are separately preserved. No multi-touch attribution model is implied.

Cookieless mode reports event and revenue totals, with persistent visitors/conversion/journeys unavailable. Journeys use anonymous IDs, list the latest fifty matching visitors, and bound selected timelines to two hundred raw events and two hundred receipts. Raw timelines stop after thirty days. Historical event counts, exact retained membership, and receipts remain available within the reporting window. Currency totals beyond JavaScript's safe integer range are refused rather than rounded silently.
