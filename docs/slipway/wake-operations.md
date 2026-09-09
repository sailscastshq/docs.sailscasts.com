---
title: Wake Operations
titleTemplate: Slipway
description: Operate Wake storage, retention, deletion, backups and failure recovery.
editLink: true
---

# Wake operations

## Storage, maintenance, and deletion

Wake uses `db/analytics.db` in Slipway's persistent database volume. It does not use Lookout's database, token, or failure budget. Ingest atomically commits raw events, daily totals, visitor membership, sessions, and first/last touches. Retries cannot double-count. Late accepted events update their original UTC partition. Existing foundation rows backfill in batches of 1,000; the UI flags incomplete backfill.

A non-overlapping Quest job runs every five minutes. It removes at most 5,000 rows per table per pass: raw events after thirty full UTC days, aggregates/membership/visitors/sessions/receipts after 396 days, and expired deletion suppression records. Raw rows are pruned only once reporting records committed. Busy systems may temporarily retain extra expired rows while bounded pruning catches up. Sessions/visitor metadata and diagnostics have retention bounds too.

Authorized visitor deletion removes raw events, membership, sessions, and touch history and detaches receipt attribution. Anonymous aggregate event totals and financial receipts remain. A hashed suppression identifier lasts ninety days to reject pending events for the deleted visitor; it carries no journey or identity details. Disabling is not deletion. App/environment/project cleanup removes all their Wake tables before marking cleanup complete; unavailable storage leaves cleanup retryable. Maintenance also removes orphaned app data.

Storage size is explicitly **host-wide**, not a per-app estimate. Settings show received/duplicate/rejected/dropped events, failed delivery, oldest raw activity, and last maintenance. Runtime counters are transmitted at the next successful registration; an abruptly lost process cannot report counters it never sent. SQLite FULL errors or unavailable storage return a retriable failure without acknowledging revenue; raw events and reporting updates roll back together. An unopenable/corrupt analytics file is left intact and the optional datastore is disabled so the primary app can still start. Repair the volume/database and restart to resume. No fallback memory database accepts analytics.

### Backup and restore

Keep `db/analytics.db` on persistent storage along with the main database. Treat analytics backups separately from application/service database backups. Use SQLite's online backup API or stop Slipway and copy a consistent database including outstanding WAL state; copying a live `.db` alone is not a safe backup. For example, on the Slipway host using its installed dependency:

```js
const Database = require('better-sqlite3')
const db = new Database('./db/analytics.db', { readonly: true })
await db.backup('/your/persistent/backups/analytics.db')
db.close()
```

Test restoration into an isolated instance. Stop Slipway before replacing its database, preserve the old file/WAL for recovery, and restore the matching main database when app IDs have changed. An analytics backup predating an acknowledged payment can lose that receipt; reconcile/replay from the app-owned payment source within the acceptance window. Reapply deletion requests after restoring an older backup. Storage or analytics failure never changes the authoritative payment outcome.

## Upgrade and troubleshoot

No manual SQL is required in Bosun to upgrade Slipway to v0.0.65. Startup adds missing app columns and analytics tables; a scheduled job backfills existing events. Keep production migration mode at `safe` and preserve the database volume. See [Updates](/slipway/updates).

| State                           | Next step                                                                                                                                           |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Disabled                        | Enable Wake in the app's Settings only when ready to collect.                                                                                       |
| Waiting for redeploy            | Redeploy after saving enabled collection settings.                                                                                                  |
| Hook update required            | Install `sails-hook-slipway@0.0.10` or later and redeploy.                                                                                          |
| No activity                     | Check consent, GPC/DNT, excluded paths and allowed origins; then visit a permitted page. Localhost and bots are excluded by default.                |
| Storage unavailable             | Inspect free space, permissions and the persistent analytics database; repair and restart Slipway. Do not delete the database to clear the message. |
| Incomplete historical reporting | Allow bounded backfill to finish; inspect last maintenance in Settings.                                                                             |

Saving enabled settings rotates the credential. Redeploy every running revision that needs to use the new configuration. If a payment delivery is unacknowledged, retry from the application's durable source using the original key and timestamp; see [revenue delivery](/slipway/wake-revenue).
