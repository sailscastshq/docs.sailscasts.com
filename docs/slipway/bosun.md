---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Bosun
titleTemplate: Slipway
description: Inspect and repair the Slipway instance itself with process health, live logs, SQLite and Helm consoles, schema migration, and activity history.
prev:
  text: Lookout
  link: /slipway/lookout
next:
  text: Team Management
  link: /slipway/team-management
editLink: true
---

# Bosun

Bosun is the self-administration surface for the Slipway instance. Project
tools such as Dock and Helm operate a deployed application; Bosun operates
Slipway itself.

That distinction matters. A Bosun SQL statement can change an internal SQLite
database, and Bosun Helm can call Slipway's own models and helpers. Use Bosun
for inspection, migrations, and deliberate repair—not as an everyday project
console.

## Open Bosun

Choose **Bosun** from the Slipway sidebar or open:

```text
/bosun
```

The selected tab and console target are reflected in the URL. For example:

```text
/bosun?tab=console&mode=helm
/bosun?tab=console&db=observability
/bosun?tab=migrate&db=cache
```

This makes a diagnostic view bookmarkable without placing query text or
returned data in the URL.

## Choose the right surface

| Need                                                                      | Surface                     |
| ------------------------------------------------------------------------- | --------------------------- |
| Inspect the Slipway process, internal databases, or instance logs         | Bosun                       |
| Run Sails-aware JavaScript inside a deployed application                  | [Helm](/slipway/helm)       |
| Query or migrate an attached PostgreSQL, MySQL, MongoDB, or Redis service | [Dock](/slipway/dock)       |
| Inspect application and container telemetry                               | [Lookout](/slipway/lookout) |

## Overview

The **Overview** tab is a compact health snapshot of the running Slipway
process.

| Area      | What it shows                                                      |
| --------- | ------------------------------------------------------------------ |
| Counts    | Projects, applications, deployments, and backups                   |
| Process   | Uptime, Node.js version, PID, platform, heap use, and RSS          |
| Databases | Current file size for `app.db`, `observability.db`, and `stash.db` |
| Logs      | Live stdout and stderr from the `slipway` Docker container         |

The counts are operational context, not billing analytics. Database size is the
file size on disk at page load; use the console for row-level investigation.

### Live instance logs

Open **Logs** to start an authenticated Server-Sent Events stream backed by:

```text
docker logs --follow --tail 200 --timestamps slipway
```

The browser keeps at most 2,000 lines and trims back to the latest 1,500 when
that bound is exceeded. Closing the disclosure stops the Docker follow process.
Auto-scroll disengages when you move away from the bottom so new output does
not pull you away from the line you are reading.

Instance logs are available only when Slipway can reach Docker and the
container is named `slipway`. A source checkout running directly on the host
shows a friendly unavailable state instead.

## Console

The **Console** tab has two modes that share the same full-height workspace:

- **SQL** operates one of Slipway's internal SQLite databases.
- **Helm** runs Sails-aware JavaScript against the Slipway application.

The SQL and Helm editors each keep up to 20 deduplicated entries in the current
page session. This is convenience history, not a durable audit log; refreshing
the page clears it.

### SQL mode

Select the database before running a statement:

| Selector        | File                  | Typical contents                                                                    |
| --------------- | --------------------- | ----------------------------------------------------------------------------------- |
| `app`           | `db/app.db`           | users, teams, projects, environments, apps, services, deployments, settings         |
| `observability` | `db/observability.db` | request spans, exceptions, application metrics, container metrics, collector health |
| `cache`         | `db/stash.db`         | persisted `sails-stash` cache entries                                               |

Run one SQLite statement at a time with **Run** or <kbd>Cmd/Ctrl Enter</kbd>.
Reader statements return columns and rows. A write returns its changed-row
count and last inserted row ID. The browser receives at most 1,000 rows and
marks a larger result as truncated. Results can be copied or downloaded as JSON
or CSV.

```sql
SELECT name
FROM sqlite_master
WHERE type = 'table'
ORDER BY name;
```

```sql
SELECT id, status, git_branch, created_at
FROM deployments
ORDER BY created_at DESC
LIMIT 20;
```

::: danger Bosun SQL can write
The database is opened normally, not in read-only mode. `INSERT`, `UPDATE`,
`DELETE`, schema statements, and other valid SQLite writes can execute. Bosun
does not infer intent or add an automatic transaction. Prefer **Migrate** for
generated schema work, take a backup, and use an explicit transaction when a
manual repair must be atomic.
:::

### Helm mode

Bosun Helm uses the same bounded parser and structured result viewer as project
Helm, but it boots Slipway itself:

```javascript
await User.find().select(['id', 'email', 'createdAt']).limit(10)
```

You can use Slipway models, helpers, and config, run a selection, inspect
intermediate values with `// @inspect`, trace queries with
`// @trace queries`, stop an execution, and view table, tree, raw, and console
output where applicable. Sails-aware completion is loaded from the running
Slipway application.

The shared runtime applies the same default 30-second timeout and bounded
source, logs, result, query trace, and inspection output described in
[Helm](/slipway/helm). It also prevents a late response from an older run from
replacing the current result.

::: danger Bosun Helm is privileged
Project Helm resolves and audits a project target and applies the production
write-arm heuristic. Bosun Helm is an instance repair console and does not use
that project production guard. Code can mutate Slipway records, call helpers,
and produce external side effects. Review the selected source and return
bounded data.
:::

## Migrate

The **Migrate** tab compares Slipway's current Waterline model metadata with one
of its three internal SQLite schemas. It is the production path for bringing an
existing Slipway database forward when a release adds tables, columns, renamed
attributes, or indexes.

The workflow is:

1. select `app`, `observability`, or `cache`;
2. let Bosun read the Waterline models assigned to that datastore;
3. review the schema summary and every generated SQLite statement;
4. select the affected model groups you intend to apply;
5. confirm the exact statement count; and
6. apply, then let Bosun compute the diff again.

SQLite cannot perform every column alteration in place. When required, the
generated migration rebuilds a table, copies compatible data, replaces the old
table, and recreates indexes.

Statements are executed in order. Bosun stops on the first error and reports
which statements succeeded. It attempts `ROLLBACK` when an error occurs, but
the whole list is not automatically wrapped in one transaction; statements
that committed before the failure can remain applied. Re-run the diff before
deciding what to do next.

::: warning Back up before migrating
The Migrate tab is safer than pasting generated SQL blindly because it derives
and previews the diff, but it still modifies the live internal database. Keep a
copy of the relevant `db/*.db` file or a current server backup before applying
a release migration.
:::

## Environment

The **Environment** tab displays a merged view of:

- selected variables from the running process—`SESSION_SECRET`,
  `DATA_ENCRYPTION_KEY`, `SLIPWAY_URL`, `NODE_ENV`, `PORT`, and `SLIPWAY_SSL`;
  and
- key-value overrides saved in Slipway's `Setting` model under
  `instanceEnvVars`.

Values are masked until revealed. Adding or removing a value updates the saved
settings object immediately.

::: warning Saved does not mean applied to the process
The Environment tab does not rewrite `/etc/slipway/.env`, mutate
`process.env`, or restart the container. Existing process variables remain in
effect until the server environment is changed and Slipway is restarted. Use
the installer or server configuration for boot-time settings. The UI-stored
values are available to features that explicitly read `instanceEnvVars`.
:::

For variables injected into deployed applications, use
[Global Environment Variables](/slipway/global-environment-variables) or the
environment and application settings instead.

## Activity

The **Activity** tab combines three sources into a newest-first operational
feed:

| Filter      | Details                                                         |
| ----------- | --------------------------------------------------------------- |
| Deployments | status, app, branch, commit, trigger, environment, and duration |
| Backups     | status, service, size, backup type, and duration                |
| Audit       | action, actor, resource, request IP, and bounded action details |

Choose **All**, **Deployments**, **Backups**, or **Audit**. A filtered request
returns up to 30 records by default; the endpoint accepts 1–100. The combined
view takes a bounded share from each source and sorts the result, so use a
specific filter when you need a deeper chronological list of one activity
type.

## Safe operating workflow

1. Start with **Overview** and live logs to identify the affected subsystem.
2. Use a bounded `SELECT` or `PRAGMA` in SQL mode to verify database state.
3. Use **Migrate** when the problem is model/schema drift.
4. Use Bosun Helm only when a Sails model or helper is the clearest repair
   boundary.
5. Verify the result with another read and review **Activity** or the audit log
   where the operation emits one.

## Troubleshooting

### Logs are unavailable

Confirm Slipway is running in Docker as a container named `slipway` and that
the process can invoke the configured Docker binary.

### SQL reports `no such table` or `no such column`

Confirm the selected database. Then open **Migrate** and inspect its diff. Do
not create an empty replacement table manually unless the generated migration
cannot represent the required change.

### A migration partially fails

Read the per-statement results, take a fresh backup or copy before further
changes, and recompute the diff. Earlier successful statements may already be
present.

### An environment change has no effect

The UI saved the setting but did not restart or reconfigure the process. Apply
the value to the server's actual environment and restart Slipway.

## What's next?

- Use [Lookout](/slipway/lookout) for application and container observability.
- Use [Helm](/slipway/helm) for a deployed application's Sails runtime.
- Use [Dock](/slipway/dock) for attached database and cache services.
