---
title: CI resource budgets and download reuse
titleTemplate: Slipway
description: Supported Slipway CI limits, scoped npm download reuse and resource diagnostics.
editLink: true
---

# CI resource budgets and download reuse

This guide describes execution profile `sails-sqlite-no-egress-v4` in Slipway server **0.0.131** and CLI **0.0.5**. Its executor and configuration digests differ from the previous profile. Review the new app policy and approve devices for that revision again; old receipts cannot satisfy it. Installation alone does not migrate a policy.

See [Slipway CI setup](/slipway/ci) for the policy and local/server execution flow.

## Supported budget

| Resource                                      | Limit                               |
| --------------------------------------------- | ----------------------------------- |
| Server concurrency                            | One CI job across the instance      |
| CPU                                           | Two CPUs                            |
| Container memory                              | 4 GiB; no additional swap allowance |
| Processes                                     | 256                                 |
| Executable workspace                          | 1.5 GiB tmpfs                       |
| Temporary mount                               | 256 MiB, no-exec tmpfs              |
| Execution deadline                            | Twenty minutes                      |
| Available host memory before server admission | At least 5 GiB                      |

The workspace and temporary mount are bounded separately. tmpfs data counts against the container memory limit; these are not extra memory allocations. Free host disk does not rule out a full mount, exhausted inodes or a memory limit. Uncertain cleanup holds capacity for inspection rather than deleting unrelated containers.

Jobs remain non-root with a read-only root filesystem, dropped capabilities and no host checkout, Docker socket or production credentials. Installation can access the network; lint, tests and asset build run after network disconnection. The runtime is an immutable official Linux Node image, with an explicit supported architecture. A pinned runtime already present on the server can be reused after verification.

Fresh `npm ci`, development dependencies, installation lifecycle scripts and the required lint/test/build stages remain part of every execution. npm audit, funding and update chatter are disabled for installation; native build jobs are capped at two. Dependency-integrity checks remain enabled. Separate vulnerability review is still necessary.

## Npm download cache

The npm cache uses the bounded executable workspace rather than the smaller temporary mount. This avoids filling `/tmp` with package tarballs but does not increase either quota.

The server retains one private download-cache archive, at most **64 MiB**, plus at most one **64 MiB** replacement while writing. An entry expires after seven days and is evicted on the next admitted run. A different app or cache key replaces the previous slot, so multi-app instances can see frequent misses.

Cache keys bind the app, repository, reviewed branch and policy revision, exact lockfile bytes, immutable runtime, platform, Node/npm versions and execution configuration. Different apps, branches, policies, locks or runtimes do not share an entry. Archives retain npm download-cache files, not source, `node_modules`, credentials or build output.

Restore is a hint, not passing-check evidence. npm still checks integrity against the lockfile. Reuse is disabled for dependency graphs with Git, file, link or workspace packages, or non-root packages without HTTPS resolution and SHA-512 integrity. Those graphs still receive a fresh cold install.

Invalid or expired archives become misses; oversized exports are discarded. Validation rejects links, devices, traversal, non-cache paths, paths longer than 512 characters and archives with more than 10,000 entries. Archives are not extracted on the management host. Large graphs can remain cold, and identical warm downloads do not eliminate installation lifecycle work.

## Inspect resource evidence

Runs retain step outcomes, timings, cleanup status, cache outcomes and numeric resource measurements. Use them to distinguish limits:

- Cgroup CPU is cumulative; differences between samples include intervening setup and measurement overhead.
- Peak memory is cumulative for the run, not an independent peak per step.
- Mount bytes and inodes are samples of occupied capacity, not peak disk usage or I/O volume.
- Local full logs stay local. Server failure diagnostics retain a bounded redacted tail; raw temporary evidence is removed.

Inspect the reported mount capacity and inode availability when installation reports `ENOSPC`. A cold cache, browser download or native dependency build can exhaust the workspace or temporary mount even when the host has free disk. Keep credentials and private raw logs out of public reports.

## Receipt admission and retention

An app can have at most ten unexpired, unfinished local submission challenges and ten non-revoked local runners. Source-run admission is limited to 200 submissions per app per hour. Reuse an existing matching report rather than creating a burst of new submissions.

During local challenge admission, old expired source records are pruned in bounded batches, preserving the latest 200 and records linked to deployment verification. The runs view shows a bounded recent list; it is not a promise to expose every retained record. Receipt freshness, challenge expiry, retained evidence and container cleanup are separate lifecycles.

## What this profile does not provide

It does not provide unlimited caches, a reusable application workspace, a general service matrix, arbitrary custom runtime images or a quota-enforced disk volume. Replacing tmpfs with an unbounded Docker volume would remove an existing storage safeguard.

Source-check build output is discarded. Deployment separately builds and verifies its candidate image; a source-check pass is not an image attestation. Download-cache reuse does not establish reproducible installation or a production performance improvement. Compare identical source and runtime conditions before claiming a speedup.
