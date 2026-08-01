---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Dock
titleTemplate: Slipway
description: Inspect, query, export, import, and migrate PostgreSQL, MySQL, MongoDB, and Redis services attached to a Slipway environment.
prev:
  text: Quest
  link: /slipway/quest
next:
  text: Lookout
  link: /slipway/lookout
editLink: true
---

# Dock

Dock is Slipway's database and cache workbench. It connects to a running
service attached to the selected environment and uses that service's real
credentials inside the private Docker network.

Dock is not an ORM abstraction. SQL, MongoDB expressions, Redis commands,
imports, and generated migrations execute against the selected live service.

## Supported services

| Service    | Console              | Browse                    | Schema              | Model diff                 | Import and export                   |
| ---------- | -------------------- | ------------------------- | ------------------- | -------------------------- | ----------------------------------- |
| PostgreSQL | SQL                  | tables and rows           | columns and indexes | full Waterline schema diff | SQL text and PostgreSQL custom dump |
| MySQL      | SQL                  | tables and rows           | columns and indexes | full Waterline schema diff | SQL text                            |
| MongoDB    | `mongosh` expression | collections and documents | collection metadata | missing collections        | JSON or compressed archive          |
| Redis      | `redis-cli` command  | —                         | —                   | —                          | —                                   |

Dock appears when the environment has at least one running service of these
types. If several services are running, the first screen is a service picker
and the selected service ID becomes part of the Dock URL.

## Open Dock

Choose **Dock** from an environment or from a database service action. The
production picker uses:

```text
/projects/:projectSlug/dock
```

Other environments include the environment slug:

```text
/projects/:projectSlug/environments/:environmentSlug/dock
```

After selecting a service, Slipway appends its ID. Every server request
rechecks that the service belongs to the environment, belongs to the signed-in
user's team, and is still running.

## Console

### PostgreSQL and MySQL

Write SQL and use **Run** or <kbd>Cmd/Ctrl Enter</kbd>. Dock executes the query
inside the service container with `psql` or `mysql`; it does not open the
database port to the public internet.

```sql
SELECT id, email, created_at
FROM users
ORDER BY created_at DESC
LIMIT 50;
```

Multi-statement SQL is split and presented as one ordered result per statement.
Each result identifies the command, status, duration, row count, affected-row
summary, rows, or error. When a later statement fails outside an explicit
transaction, earlier successful statements remain visible and may already be
committed.

```sql
BEGIN;
ALTER TABLE orders ADD COLUMN discount DECIMAL(10, 2);
ALTER TABLE orders ADD COLUMN discount_code VARCHAR(50);
COMMIT;
```

The server gives console execution 30 seconds and bounds captured process
output to 10 MB. Query history is kept only in the current browser page and is
capped at 20 deduplicated entries.

### MongoDB

MongoDB console input is a JavaScript expression evaluated by `mongosh`:

```javascript
db.users.find({ emailVerified: true }).limit(10).toArray()
```

Dock serializes the returned value into the same table or JSON result surface.
Use collection operations deliberately: this is a live shell, not a read-only
query builder.

### Redis

The Redis console sends one command to `redis-cli` and displays its raw output,
error, and duration:

```text
INFO memory
```

Quick actions are provided for common inspection commands such as `PING`,
`INFO server`, `DBSIZE`, and `CONFIG GET maxmemory`. Use the up and down arrow
keys to navigate the current-page history. The browser keeps at most 200
entries and trims older output after that bound.

::: danger Consoles can mutate data
Dock permits ordinary writes. It blocks only a narrow class of catastrophic
commands: dropping a PostgreSQL/MySQL database or schema, selected system-table
truncation, and MongoDB database/collection drop or shutdown expressions. This
is not a general read-only policy. `UPDATE`, `DELETE`, `FLUSHALL`, and many other
destructive operations can execute. Back up first and prefer a scoped,
reviewable statement.
:::

## Read results

Rowsets open as tables and can be viewed as JSON. A multi-statement query adds
keyboard-accessible result tabs. Dock keeps command summaries separate from
rowsets so an `ALTER TABLE` or `UPDATE` result does not look like an empty
`SELECT`.

Copy and export act on the selected result. CSV output quotes commas, quotes,
and newlines. Returned values are shown as data and do not execute as page HTML.

## Browse tables and collections

The **Tables** or **Collections** tab lists objects with an estimated or exact
row/document count. Select one to load a page of data.

The browse endpoint defaults to 50 rows, accepts 1–1,000, and supports offset,
order field, and ascending or descending order. SQL table and order identifiers
must be simple identifiers; Dock rejects names that could inject SQL. MongoDB
uses `_id` as its default order field, while SQL uses `id`.

Counts can be expensive on very large collections or tables. Use the console
with a purpose-built indexed query when the generic browser is not the right
tool.

## Inspect schema

PostgreSQL and MySQL schema views show the physical table definition, including
columns, database types, nullability, defaults, primary keys, and indexes. The
table filter is reflected in `?schemaTables=` so a focused schema view can be
bookmarked.

MongoDB is schemaless. Dock can list collections and compare whether the
collections expected by Waterline exist, but it does not infer a field schema
from sample documents. Redis has no schema tab.

## Compare Waterline models

The **Migrate** tab compares the selected service with the application's model
metadata.

1. When the app is running, Dock first introspects its loaded Waterline models.
2. If runtime introspection is unavailable, Dock falls back to statically
   reading model source from the pushed build context.
3. Dock reads the service's current schema.
4. It maps Waterline attributes to the physical types used by the selected
   adapter.
5. It presents grouped, selectable statements for review.

The response says whether model metadata came from `runtime` or `static`.
Runtime is preferable because it includes the application's effective loaded
model definitions. Static fallback allows first-time schema creation when the
app cannot lift against an empty database.

### What migrations generate

For PostgreSQL and MySQL, Dock can generate:

- table creation;
- column rename when an attribute name maps to a different column name;
- missing column creation;
- compatible column type or nullability changes; and
- missing indexes.

For MongoDB, it creates missing collections only. The generated diff does not
drop extra tables, collections, or columns automatically.

An explicit Waterline `columnType` is used as the desired physical type. Review
it carefully because it bypasses the normal logical type mapping.

### Apply a migration

Select the model groups, read every generated statement, choose **Apply
Migration**, and confirm the count. Dock executes statements sequentially and
stops on the first failure. The response reports each successful statement and
the failing one.

Dock does not automatically wrap the whole generated list in a transaction.
Earlier statements can remain applied if a later statement fails. Recompute
the diff before retrying.

::: warning Back up and stage schema changes
Generated SQL is a useful translation of model metadata, not a proof that the
data can satisfy a new constraint. Test the same change in staging, inspect
existing nulls and duplicates, and create a backup before production.
:::

## Initialize an empty database

An application can fail to lift when its production datastore has no tables.
Dock can still build a diff from pushed source:

1. push or deploy the application source;
2. create and start the database service;
3. open **Dock → Migrate** for that service;
4. verify that model source was loaded and review the generated tables;
5. apply the migration; and
6. redeploy or restart the application.

If Dock reports `modelsSourceNotFound`, push source before trying again.

## Export

The export action can include the full database, schema only, data only, or a
selected set of tables.

| Service    | Implementation                                                                      | Notes                                                |
| ---------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------- |
| PostgreSQL | `pg_dump --no-owner --no-acl`                                                       | supports table selection, schema-only, and data-only |
| MySQL      | `mysqldump --single-transaction --routines --triggers`                              | supports table selection, schema-only, and data-only |
| MongoDB    | `mongoexport` for one selected collection, otherwise compressed `mongodump` archive | schema-only does not apply                           |

The current export process has a five-minute timeout and a 100 MB captured
output buffer. Large production backups should use Slipway's backup workflow
instead of a browser download.

## Import

Paste text or upload a supported file, review the destructive confirmation,
and then import into the selected service.

| Service    | Text                                              | Binary/archive                                              |
| ---------- | ------------------------------------------------- | ----------------------------------------------------------- |
| PostgreSQL | `.sql` through `psql` with `ON_ERROR_STOP=1`      | `.dmp` custom dump through `pg_restore --clean --if-exists` |
| MySQL      | `.sql` through `mysql`                            | not supported                                               |
| MongoDB    | JSON array, optionally with `// collection: name` | gzip archive through `mongorestore --drop`                  |

Uploaded PostgreSQL custom dumps must begin with the `PGDMP` signature.
MongoDB archives must be gzip. Slipway rejects a mismatched file before calling
the native restore client.

Imports stream through a temporary file or process input so Slipway does not
buffer a 500 MB upload in application memory. Defaults are:

| Limit           | Default    |
| --------------- | ---------- |
| Maximum import  | 500 MB     |
| Import timeout  | 30 minutes |
| Captured stdout | 64 KB      |
| Captured stderr | 64 KB      |

The temporary upload is deleted after success or failure. Streaming controls
memory use, but the host still needs enough free disk for the temporary file
and database growth.

## Authenticated endpoints

The Dock UI uses the following session-authenticated routes. Add
`/environments/:environmentSlug` after the project slug for a non-production
environment, and pass `?service=:serviceId` when selecting a particular
service.

| Method | Path suffix                | Purpose                             |
| ------ | -------------------------- | ----------------------------------- |
| `POST` | `/dock/sql`                | execute SQL or a MongoDB expression |
| `GET`  | `/dock/tables`             | list tables or collections          |
| `GET`  | `/dock/tables/:table/data` | browse a page of data               |
| `GET`  | `/dock/schema`             | read physical schema                |
| `GET`  | `/dock/models`             | inspect application models          |
| `GET`  | `/dock/diff`               | generate the model/schema diff      |
| `POST` | `/dock/migrate`            | apply selected statements           |
| `POST` | `/dock/export`             | export data or schema               |
| `POST` | `/dock/import`             | import text or an uploaded dump     |

The common prefix is `/api/v1/projects/:projectSlug`. These endpoints use the
same team and environment authorization as the page; they are not public
database APIs.

## Troubleshooting

### No services appear

Confirm the service is PostgreSQL, MySQL, MongoDB, or Redis; belongs to the
selected environment; and has `running` status. A stopped service is removed
from the picker.

### A query times out

Console SQL and MongoDB execution has a 30-second timeout. Add a limit, inspect
the query plan, add an index, or use a dedicated reporting path for long work.

### The diff is empty or wrong

Check the reported model source. Restart the app after model changes so runtime
metadata is current, or push the new source so static fallback can read it.
Then verify `tableName`, `columnName`, `columnType`, and datastore assignment in
the model.

### An import is rejected

Check the service, file signature, 500 MB default bound, and available host
disk. A PostgreSQL plain SQL file belongs in text mode; `.dmp` expects the
custom `pg_dump` format.

### A migration partially applies

Do not resubmit the old statement list blindly. Reload the diff against the
current database, inspect which changes remain, and restore from backup if the
partial state is unsafe.

## What's next?

- Use [Backups](/slipway/database-services#backups) before destructive database
  work.
- Use [Helm](/slipway/helm) when the repair is clearer through application
  models and helpers.
- Use [Lookout](/slipway/lookout) to correlate database work with application
  latency and errors.
