---
title: External PostgreSQL
titleTemplate: Slipway
description: Connect, verify and back up an existing PostgreSQL database.
editLink: true
---

# External PostgreSQL

External PostgreSQL connects an existing database to a Slipway environment without provisioning or managing that database server. Existing managed PostgreSQL, MySQL, MongoDB and Redis services keep their current lifecycle and defaults.

## Connect and verify

An owner or administrator selects **External PostgreSQL** under **Add service**, names the connection, and enters a PostgreSQL URL. The normal form has a URL and TLS selection; a custom CA is under optional certificate settings. Select **Connect**, then **Verify connection** on the service page.

The service starts **Unverified**. Verification checks DNS/TCP access, the selected TLS policy, authentication, server version, and table/sequence read permissions from Slipway's client network. It reports **Reachable** or **Unreachable** with an actionable, credential-free error. Reachable records the last successful check; it is not continuous monitoring or a guarantee that a later dump will succeed. Row-level security, extensions, object ownership and concurrent database changes can still prevent a full dump. A successful backup confirms actual dump access.

This initial integration supports PostgreSQL 14–17, using a PostgreSQL 17 client resolved to an immutable Docker reference. External MySQL and MongoDB are not included. Verification needs Docker and access to the official PostgreSQL client image on first use.

## TLS and network access

Verified TLS (`verify-full`) is the default. The server hostname must match its certificate. Public roots use the client image's system CA bundle; paste a PEM CA for a provider using a private trust chain. Encryption without certificate verification (`require`) and plaintext (`disable`) require explicit acknowledgement. Use them only when appropriate for your trusted network.

Allow the **Slipway server's outbound address**, not your browser address, through the provider's database firewall. The client uses the `slipway` Docker network by default. Operators with custom routing can set `custom.externalDatabaseClientNetwork`. Private DNS and VPN routes must be reachable from that network. No inbound public database port is opened by this feature.

Only the `sslmode` URL parameter is accepted and it must match the selected TLS setting. Connection fields cannot contain line breaks. Other driver-specific options belong in application configuration.

## Application connection

Slipway creates a managed secret environment variable: `DATABASE_URL` if unused, otherwise `<SERVICE_NAME>_URL`. Existing variables are preserved; a name collision is rejected. The saved URL is encrypted and replaced by a placeholder in environment and application page responses. Editing unrelated variables preserves the real connection on the server.

A supplied CA is also available as `<CONNECTION_VARIABLE>_CA_CERT`. **The application must configure its own database driver's TLS/CA support** using that value; verification configures Slipway's backup client, not arbitrary application libraries. Readiness recognizes a verified connection only when the effective runtime URL matches the verified URL. The application's normal startup and HTTP health checks still apply.

To rotate credentials, select **Edit connection**. Blank URL and CA fields retain their saved values. Moving away from verified TLS removes the custom CA. Every saved change resets verification; verify again and redeploy apps to apply the changed environment. Saving settings does not restart a running application.

## Backups and recovery

Configure [private backup storage](backup-storage.md), verify the connection, then create a manual backup. Enabled instance schedules also include reachable external PostgreSQL services. Both paths use the same private storage, checksums, size/time bounds and retention handling as managed backups.

Each dump runs in a temporary, non-root PostgreSQL client with an immutable image reference, read-only root filesystem, private tmpfs credential files, dropped capabilities and bounded CPU, memory and process count. Credentials are streamed over stdin, not placed in command arguments or Docker environment values. This works when Slipway itself is containerized; it does not depend on a host bind mount of Slipway's temporary directory. Output files are private and removed after processing. Cancellation, timeout and size-limit failures remove the client. If Docker cleanup cannot be confirmed, the service retains a cleanup reference and the scheduler or next verification retries it.

Backups are PostgreSQL custom-format logical dumps of one database, not physical snapshots or point-in-time recovery. Provider roles, replication configuration and cluster-wide objects require separate recovery planning. Use a role that can read the required data; Slipway does not grant privileges.

**Restore into an external database is disabled in both UI and backend.** Recover through your provider or a reviewed `pg_restore` workflow into a separate database, verify its contents, and deliberately switch your application connection. Slipway does not expose stop, restart, upgrade, resource-limit or container-log controls for the external server. Removing the connection does not delete the provider database.
