---
title: What’s New in v0.0.65
titleTemplate: Slipway
description: Wake analytics, read-only support views, custom services, storage, database and deployment improvements.
editLink: true
---

# What’s new in v0.0.65

Slipway v0.0.65 brings product analytics, read-only customer support, private backup providers, external database connections and reviewed custom-service operations. [Upgrade instructions](/slipway/updates#upgrading-to-v0-0-65) explain the automatic schema changes and app hook requirements.

## Wake product analytics

[Wake](/slipway/wake) shows acquisition, activity and revenue for each app through Overview, Journeys and Settings. It is separate from Lookout and off by default.

- [Collection and consent](/slipway/wake-collection): automatic pageviews and SPA navigation, consent withdrawal, GPC/DNT, custom `creatorId` sessions and anonymous sessionless apps.
- [Goals and revenue](/slipway/wake-revenue): authoritative server goals, encrypted checkout attribution, acknowledged payment receipts, idempotent replay and bounded refunds.
- [Operations](/slipway/wake-operations): thirty days of raw activity, 396 days of reporting and receipts, visitor deletion, automatic maintenance and isolated analytics storage failures.

Currencies remain separate. Sessionless first-party analytics can preserve anonymous continuity; cookieless mode does not claim persistent visitors, conversion or journeys. Payment delivery belongs in an app-owned durable workflow, with stable IDs and timestamps. Wake is not an accounting ledger.

## Bridge support views

Owners and administrators can choose **View as this user** from the declared identity model, confirm their password and reason, and open an approved read-only customer page. A separate support session preserves their normal login. The visible banner, fifteen-minute limit, revocation, write/export restrictions and durable audit delivery are described in [Support views](/slipway/bridge-support).

Apps must opt in and review exact safe paths. Configuration uses `bridge.impersonation`; the product calls the feature a support view. It is not a sandbox for arbitrary application side effects.

## Custom services

[Custom images](/slipway/custom-services) use pinned images, explicit private app connections, resource limits, health checks and logs.

- [Public HTTP access](/slipway/custom-services#public-http-access) publishes a reviewed hostname through Caddy and retains recoverable routing state. It does not add authentication or public TCP/UDP ports.
- [Stateless updates](/slipway/custom-services#reviewed-stateless-updates) review image and configuration changes, verify a candidate's Docker health check and retain the previous revision for recovery. Persistent services remain excluded from automated updates.

These services do not automatically receive Bridge, Helm, Quest or database schema tooling.

## Private storage and external PostgreSQL

[Private backup storage](/slipway/backup-storage) supports S3-compatible providers and Azure Blob independently of public uploads. Connection verification checks upload, download, checksum, anonymous-read rejection and deletion. Backups retain their original encrypted storage connection when settings change.

[External PostgreSQL](/slipway/external-postgresql) connects an existing PostgreSQL 14–17 database with verified TLS, connection checks and single-database logical backups. Slipway does not own that server's lifecycle. Restore into an external database is disabled; restore through your provider or a reviewed separate-database workflow.

## Database and deployment refinements

- [Dock](/slipway/dock#native-schema-and-semantic-differences) uses canonical physical schema, semantic comparisons, native preflight and server-owned reviewed plans. Only owners/admins can execute supported generated migrations.
- [Repository listing](/slipway/git-integration#repository-listing) follows every GitHub API page and scopes caches to the connection.
- CLI and dashboard use the same [Sails readiness report](/slipway/first-deploy#check-deployment-readiness).
- Failed domain updates preserve working routes where recovery succeeds, and report unresolved recovery explicitly. Route acceptance, DNS and TLS readiness remain distinct.
- Source uploads, deployment revisions, restore coordination and team permissions receive validation and recovery improvements.
- Slipway's asset pipeline moves to Shipwright 1.5.1 and Rsbuild 2, with development, HMR and production checks. This does not automatically change your app's build dependencies.

## UI polish

Warnings and errors use Klean alerts. Confirmation dialogs retain two actions. Compact dashed fields and dropdowns, breadcrumbs and the upstream toast overflow fix are restored.

## Deploy the release

Use `ghcr.io/sailscastshq/slipway:0.0.65`. The release passed unit, functional, browser, asset, private-storage, external PostgreSQL, custom-service and PostgreSQL/MySQL schema checks before image publication. Apps using Wake or support views need `sails-hook-slipway@0.0.10` or later, capability configuration and a redeploy.

See the [GitHub release](https://github.com/sailscastshq/slipway/releases/tag/v0.0.65) for the merged changes.
