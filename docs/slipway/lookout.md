---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Lookout
titleTemplate: Slipway
description: Understand host health, application requests, exceptions, database queries, cache behavior, jobs, and release flags from one Slipway observability surface.
prev:
  text: Dock
  link: /slipway/dock
next:
  text: Auto-Deploy
  link: /slipway/auto-deploy
editLink: true
---

# Lookout

Lookout is Slipway's built-in observability surface. It joins two different
sources of operational data:

- **infrastructure telemetry** collected by the Slipway host from managed
  Docker containers; and
- **application telemetry** emitted by `sails-hook-slipway` from a deployed
  Sails application.

You can therefore start with a host or container problem, move into a slow
request or exception, and inspect the exact application environment without
maintaining a separate monitoring stack.

## Choose the right Lookout view

| View                | Use it for                                                    | Data source             |
| ------------------- | ------------------------------------------------------------- | ----------------------- |
| Global Lookout      | Host disk, every managed running container, collector health  | Slipway host and Docker |
| Environment Lookout | Apps and services in one project environment                  | Slipway host and Docker |
| Application tabs    | Requests, exceptions, queries, cache, Quest, and flag cohorts | `sails-hook-slipway`    |

The global view is available at `/lookout`. A project production environment
uses `/projects/:projectSlug/lookout`; other environments include
`/environments/:environmentSlug` in the URL.

Lookout only includes containers managed by Slipway. Unrelated Docker
containers on the same host do not appear in project views.

## Enable application telemetry

Install the hook in the target Sails application:

```bash
npm install sails-hook-slipway
```

Deploy the application through Slipway. During deployment, Slipway injects a
private telemetry URL and environment token into the container:

```text
SLIPWAY_TELEMETRY_URL
SLIPWAY_TELEMETRY_TOKEN
```

The token is scoped to the environment and sent as a bearer credential to the
ingest endpoint. It never becomes a browser prop. No public database port or
third-party analytics account is required.

Infrastructure monitoring works without the target-app hook. The application
tabs require the hook and begin filling after the app serves requests or emits
instrumented events.

## Infrastructure

Slipway samples managed app and service containers every 30 seconds. The
environment view shows current CPU, memory, network I/O, block I/O, process
count, container state, and recent history.

Select a container to inspect up to 24 hours of samples. Long histories are
downsampled to at most 200 points before they reach the browser. The global
view adds host disk usage and a summary of running containers.

### Container lifecycle and alerts

Lookout reconciles the database with Docker so a container that disappears or
stops does not remain falsely healthy in the dashboard. Recovery is recorded
when it returns.

CPU or memory usage above 90% for three consecutive samples produces a resource
alert. At the default collection interval that is approximately 90 seconds,
which avoids treating a brief build spike as an incident. A 15-minute cooldown
prevents repeated notifications for the same sustained condition.

### Application logs

Slipway periodically captures recent logs from managed application containers
and keeps them in the observability store for seven days. This is useful for
correlating a container or request failure with surrounding application output.
Secrets can still be exposed by application logging, so do not print tokens,
passwords, raw session objects, or sensitive records.

## Requests

The Requests tab is built from server spans emitted by the hook. It shows
request volume, error rate, average and p95 latency, plus recent request rows.
Each span can contain:

- HTTP method, URL or route, status, duration, and start time;
- request and response content lengths;
- user agent, client IP, referrer, and accepted content types; and
- release-flag values evaluated during that request.

Health checks and common static assets are skipped so they do not distort
application traffic. Lookout does not capture request or response bodies.

::: warning Treat observability as sensitive operational data
URLs, client IPs, user agents, query summaries, cache keys, and stack traces can
still reveal user or system context. Keep sensitive values out of URLs and
cache keys, and limit dashboard access to the team members who operate the app.
:::

### Release-flag cohorts

When the app evaluates [release flags](/slipway/release-flags), Lookout compares
request count, average latency, and 5xx rate for each flag's on and off cohorts.
The comparison remains hidden until at least one request evaluates that flag.
Expand a request to see the values that affected it.

## Exceptions

The hook captures:

- errors passed through `res.serverError()`;
- uncaught exceptions; and
- unhandled promise rejections.

Lookout groups them by type and message and shows counts, last-seen time,
handled state, request context when available, and stack traces. An exception
buffer is flushed aggressively so important failures do not wait for a full
normal telemetry batch.

Telemetry delivery is deliberately best effort. A network or ingest failure is
silently tolerated by the hook so observability can never take down the target
application.

## Database queries

Lookout instruments common Waterline model methods such as `find`, `findOne`,
`create`, `update`, `destroy`, `count`, `sum`, and `avg`.

Successful queries are recorded only when they meet the slow-query threshold,
which defaults to 100 ms. Failed queries are recorded regardless of duration.
The event contains the model, method, duration, error state, and a bounded
summary of criteria keys—not returned records or raw SQL.

Use this tab to find patterns, then use [Helm](/slipway/helm) or
[Dock](/slipway/dock) for a deliberate investigation.

## Cache

When `sails-hook-stash` is present, `sails-hook-slipway` instruments
`sails.cache.get`, `fetch`, `set`, and `delete` after the stash hook loads.

```bash
npm install sails-hook-stash
```

The Cache tab reports hits, misses, writes, deletes, duration, hit rate, active
keys, and recent operations. A low hit rate can mean TTLs are too short, keys
do not match the read pattern, or cached inputs change too frequently.

Cache keys are sent as telemetry. Use identifiers that are useful to operators
without embedding credentials or private user data.

## Quest jobs

When Quest instrumentation is enabled, the hook listens for job start,
completion, and error events. Lookout stores duration and job inputs with the
event. Job errors also become exceptions and can trigger the configured job
failure notification.

The [Quest](/slipway/quest) page is the primary place to run, pause, resume, and
inspect jobs. Lookout supplies the cross-application operational context.

## Configure the hook

Defaults are intentionally usable without app configuration:

```js
// config/slipway.js
module.exports.slipway = {
  lookout: {
    enabled: true,
    batchSize: 50,
    flushInterval: 10000,
    captureQueries: true,
    captureExceptions: true,
    captureQuestEvents: true,
    captureCache: true,
    slowQueryThreshold: 100
  }
}
```

| Option               | Default | Meaning                                           |
| -------------------- | ------: | ------------------------------------------------- |
| `enabled`            |  `true` | Disable all target-app telemetry when false       |
| `batchSize`          |    `50` | Flush when a buffer reaches this many events      |
| `flushInterval`      | `10000` | Periodic flush interval in milliseconds           |
| `captureQueries`     |  `true` | Instrument common Waterline methods               |
| `captureExceptions`  |  `true` | Capture server and process-level errors           |
| `captureQuestEvents` |  `true` | Capture Quest lifecycle events                    |
| `captureCache`       |  `true` | Instrument `sails.cache` when available           |
| `slowQueryThreshold` |   `100` | Minimum successful query duration in milliseconds |

Normally, do not set `telemetryUrl` or `telemetryToken` in the app. Slipway
injects and rotates the environment-specific values during deployment.

Configuration takes effect in a new app process, so redeploy after changing
`config/slipway.js`.

## Storage, retention, and maintenance

Lookout stores its data in `db/observability.db`, separate from Slipway's main
application database.

| Data                                                     | Default retention | Setting                                        |
| -------------------------------------------------------- | ----------------: | ---------------------------------------------- |
| Container CPU, memory, network, and I/O samples          |          24 hours | `SLIPWAY_CONTAINER_METRICS_RETENTION_HOURS`    |
| Requests, exceptions, queries, cache, jobs, and app logs |            7 days | `SLIPWAY_APPLICATION_TELEMETRY_RETENTION_DAYS` |

The `maintain-observability` Quest job runs every five minutes. It checks disk
health and deletes expired rows in bounded batches. Defaults are 500 rows per
batch and at most 20 batches per table per run:

```bash
SLIPWAY_OBSERVABILITY_PRUNE_BATCH_SIZE=500
SLIPWAY_OBSERVABILITY_MAX_PRUNE_BATCHES=20
```

The batch must be positive and is capped at 900 rows to remain within SQLite's
statement parameter limit. If a large backlog cannot be removed in one run,
later runs continue from the remaining oldest data.

The host-health card reports the last collector and retention attempt, last
success, retained row counts, stale state, and latest error. A job becomes
stale after three expected intervals, which distinguishes an idle host from a
collector that has stopped making progress.

### Existing installations

Slipway creates missing observability tables and indexes at lift. Older
container samples in `db/app.db` are copied into `db/observability.db` in
bounded, idempotent batches. Slipway verifies the copied count before deleting
legacy rows, so an interrupted migration resumes on the next start.

## Troubleshooting

### Infrastructure is empty

Confirm Docker is reachable and that the app or service was created by Slipway.
The collector intentionally ignores unrelated containers.

### Application tabs are empty

Confirm `sails-hook-slipway` is installed in the deployed revision, then
redeploy so the telemetry URL and token are injected. Generate a request or job
event after the new container becomes healthy.

### Query telemetry is missing

Only failed queries and successful queries at or above
`slowQueryThreshold` are recorded. Lower the threshold deliberately and
redeploy if you need a wider sample.

### Health says retention is stale

Open [Bosun](/slipway/bosun), inspect the observability database and Slipway
logs, and confirm the maintenance Quest job is running. Increasing retention
does not fix a maintenance job that has stopped.

## What's next?

- Use [Helm](/slipway/helm) for Sails-aware application diagnosis.
- Use [Dock](/slipway/dock) for direct database and cache inspection.
- Use [Quest](/slipway/quest) for job operations and run history.
