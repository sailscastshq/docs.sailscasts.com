---
title: Instance maintenance and recovery
titleTemplate: Slipway
description: Inspect maintenance jobs, storage retention and SQLite recovery for the Slipway instance.
editLink: true
---

# Instance maintenance and recovery

Use **Bosun → Quest** to inspect Slipway's own maintenance jobs. Application jobs remain in [Quest](/slipway/quest); database services remain in [Dock](/slipway/dock).

## Inspect before running

Bosun shows UTC schedules, next runs and the latest retained history (up to 100 runs). Opening the page does not execute a job. Instance administrators can use **Run now** for allowlisted jobs after reviewing their defaults.

Maintenance history is bounded and redacted under `db/instance-quest/`. An unfinished run after restart may be marked interrupted or unknown. Inspect actual Docker effects before retrying an uncertain operation.

## Application image retention

Daily cleanup protects running and stopped containers, current images, verified rollback candidates and other retained deployment references. Unrecognized images, service images and uncertain ownership remain protected. Cleanup coordinates with deployment operations; it is not a general Docker prune.

`SLIPWAY_IMAGE_RETENTION_REMOVE=false` selects preview-only behavior. Unset or `true` allows eligible removal. Invalid settings fail closed. Review job output before drawing conclusions from disk usage: Docker's accounting and physical reclaimed bytes can differ.

## Build cache retention

The build-cache job runs hourly at minute 17 UTC. Its defaults retain cache unused for less than seven days, target 20 GiB of retained cache and bound a run to five minutes. The target is not a hard disk quota.

`SLIPWAY_BUILD_CACHE_RETENTION_REMOVE=false` selects preview-only behavior. An unknown or timed-out Docker outcome needs inspection; do not delete operation locks to force another prune.

These are startup environment settings. With the installer, use its `/etc/slipway/.env` configuration and recreate the management container through the supported update procedure. Custom Compose installations must propagate the setting when recreating the container. Editing Bosun's general environment overrides or merely restarting an unchanged container does not apply new Docker environment variables.

## Protect the instance database

Slipway manages four SQLite datastores in `/app/db`:

| File               | Role                                                     |
| ------------------ | -------------------------------------------------------- |
| `app.db`           | Control-plane configuration, users, apps and deployments |
| `observability.db` | Operational telemetry                                    |
| `analytics.db`     | Wake product analytics                                   |
| `stash.db`         | Persistent cache                                         |

These are separate from your deployed applications' PostgreSQL or other databases. Preserve encryption keys with the instance backup: encrypted configuration cannot be recovered from database files alone.

Use a consistent SQLite backup or stop all writers before copying the complete database set, including applicable WAL/SHM files. Copying only an actively written `.db` file is not a reliable backup.

## If startup reports corruption

Retain the original files and logs. Do not switch migration mode to `alter` or `drop`, delete `app.db`, or bypass integrity checks to make startup pass. A failed integrity check is a recovery task, not permission to reset the control plane.

Follow the [maintainer recovery runbook](https://github.com/sailscastshq/slipway/blob/main/docs/sqlite-recovery.md) with a snapshot and validation copies. Recovery must verify application tables and relationships before replacing live storage. Resetting observability history is a separate, explicit decision; it does not recover `app.db`.

See [Bosun](/slipway/bosun), [Wake recovery](/slipway/wake-operations#backup-and-restore) and [Updates](/slipway/updates).
