---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Lookout
titleTemplate: Slipway
description: Observability for your Sails applications. Monitor HTTP requests, exceptions, database queries, and cache performance from the Slipway dashboard.
prev:
  text: Dock
  link: /slipway/dock
next:
  text: Auto-Deploy
  link: /slipway/auto-deploy
editLink: true
---

# Lookout

Lookout is the **observability dashboard** for your Sails applications deployed on Slipway. It gives you visibility into HTTP requests, exceptions, database queries, and cache performance — all without any external monitoring tools.

## What Lookout Tracks

| Category       | What's captured                                   |
| -------------- | ------------------------------------------------- |
| **Requests**   | HTTP method, URL, status code, duration, p95      |
| **Exceptions** | Unhandled errors, promise rejections, stack trace |
| **Queries**    | Slow Waterline queries above threshold            |
| **Cache**      | Hit/miss rates, writes, deletes, top keys         |

## Getting Started

### 1. Install the hook

```bash
npm install sails-hook-slipway
```

### 2. Deploy your app

Slipway automatically injects `SLIPWAY_TELEMETRY_URL` and `SLIPWAY_TELEMETRY_TOKEN` into your container at deploy time. No manual configuration needed.

### 3. View the dashboard

Go to your project in Slipway, select an environment, and click the **Lookout** icon. Data appears within seconds of your first request.

## Infrastructure

The **Infrastructure** tab shows real-time resource usage for all running containers:

- **CPU and Memory** — current percentage with sparkline history
- **Network I/O** — bytes sent and received
- **Block I/O** — disk read/write activity
- **Process count** — number of running processes

Click a container to expand its 24-hour history chart.

### Collection and retention health

Lookout stores infrastructure samples and application telemetry in
`db/observability.db`. The host-health card shows the latest collector and
retention state, including:

- the last attempt and last successful run;
- the number of retained rows;
- a stale or failed state and the latest error.

Docker collection and storage maintenance are deliberately independent.
Container metrics are collected every 30 seconds, while the
`maintain-observability` Quest job checks disk health and removes expired rows
every 5 minutes. Retention therefore continues even when Docker is temporarily
unavailable or no application containers are running.

## Requests

The **Requests** tab shows HTTP traffic from the last hour:

- **Requests / hr** — total request count
- **Error rate** — percentage of 5xx responses
- **p95 latency** — 95th percentile response time
- **Avg latency** — mean response time

A table of recent requests shows method, URL, status code, duration, and time.

## Exceptions

The **Exceptions** tab groups errors by type and message:

- Unhandled exceptions and promise rejections
- Server errors (500 responses) with request context
- Stack traces for each exception group
- Count and last-seen time per group

## Queries

The **Queries** tab shows slow Waterline queries that exceed the configured threshold (default: 100ms):

- Model name and method
- Query criteria
- Duration and time

## Cache

The **Cache** tab provides visibility into [sails-stash](https://docs.sailscasts.com/sails-stash) cache operations. It tracks four operations:

| Operation  | Description                                   |
| ---------- | --------------------------------------------- |
| **Hit**    | A `get` or `fetch` found the key in the cache |
| **Miss**   | A `get` or `fetch` did not find the key       |
| **Write**  | A `set` stored a value in the cache           |
| **Delete** | A `delete` removed a key from the cache       |

### Requirements

Cache telemetry requires [sails-stash](https://docs.sailscasts.com/sails-stash) in your Sails app:

```bash
npm install sails-hook-stash
```

When `sails-hook-slipway` detects sails-stash, it automatically instruments cache operations. No additional configuration is needed.

### Key Metrics

- **Hit Rate** — percentage of `get`/`fetch` calls that returned cached data. A high hit rate (>80%) means your cache is working efficiently.
- **Total Ops / hr** — total number of cache operations in the last hour
- **Hits / Misses** — raw counts of cache hits and misses
- **Top Keys** — most frequently accessed cache keys with per-key hit rate
- **Recent Operations** — live feed of cache operations with duration

### Tips

- A **low hit rate** may indicate short TTLs, cache keys that don't match read patterns, or that `fetch` is being called with data that changes frequently
- Use the **Top Keys** table to identify which keys are most active and whether they have good hit ratios
- Cache operations are typically sub-millisecond — if you see high durations, check your cache store configuration

## Configuration

The hook uses sensible defaults. All telemetry features are enabled automatically. To customize behavior, create `config/slipway.js` in your Sails app:

```javascript
module.exports.slipway = {
  lookout: {
    enabled: true, // Enable/disable all telemetry
    batchSize: 50, // Metrics per batch
    flushInterval: 10000, // Flush every 10 seconds
    captureQueries: true, // Track Waterline queries
    captureExceptions: true, // Track exceptions
    captureQuestEvents: true, // Track Quest job lifecycle
    captureCache: true, // Track sails-stash cache operations
    slowQueryThreshold: 100 // Only record queries slower than 100ms
  }
}
```

::: tip
When deployed via Slipway, you don't need to set `telemetryUrl` or `telemetryToken` — they're injected automatically.
:::

## Data retention

Slipway keeps enough history for diagnosis without allowing observability data
to grow without a bound.

| Data                                              | Default  | Environment variable                           |
| ------------------------------------------------- | -------- | ---------------------------------------------- |
| Container CPU, memory, network, and I/O samples   | 24 hours | `SLIPWAY_CONTAINER_METRICS_RETENTION_HOURS`    |
| Requests, exceptions, queries, and app-level data | 7 days   | `SLIPWAY_APPLICATION_TELEMETRY_RETENTION_DAYS` |

Retention removes at most 500 rows per table in one batch and performs at most
20 batches per table during a maintenance run. Operators can tune those bounds
with:

```bash
SLIPWAY_OBSERVABILITY_PRUNE_BATCH_SIZE=500
SLIPWAY_OBSERVABILITY_MAX_PRUNE_BATCHES=20
```

Values must be positive. The prune batch is capped at 900 rows to stay within
SQLite's statement parameter limit.

### Existing installations

On startup, Slipway creates any missing observability tables and indexes. It
migrates legacy container samples from `db/app.db` in bounded, idempotent
batches, verifies the copied row count, and only then removes the legacy rows.
An interrupted migration safely resumes on the next startup.

## What's Next?

- Set up [sails-stash](https://docs.sailscasts.com/sails-stash) for application-level caching
- Use [Helm](/slipway/helm) for live debugging
- Configure [Auto-Deploy](/slipway/auto-deploy) for continuous deployment
