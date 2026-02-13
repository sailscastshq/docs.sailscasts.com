---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Dock
titleTemplate: Slipway
description: Database management for production. SQL console, schema diff, migrations, and table browser—all from the Slipway dashboard.
prev:
  text: Quest
  link: /slipway/quest
next:
  text: Auto-Deploy
  link: /slipway/auto-deploy
editLink: true
---

# Dock

Dock is your **database command center** for production. Run SQL queries, compare schemas, apply migrations, and browse data—all without external tools or SSH access.

## What is Dock?

Dock provides a web-based interface for managing your PostgreSQL or MySQL database:

- **SQL Console** - Run queries directly against your database
- **Table Browser** - View and navigate your data
- **Schema Viewer** - Inspect table structures and columns
- **Schema Diff** - Compare Waterline models with database schema
- **One-Click Migrations** - Generate and apply schema changes

No more switching to pgAdmin or DBeaver. Manage your production database from Slipway.

## Requirements

Dock is automatically available when your environment has a **PostgreSQL** or **MySQL** service attached:

```bash
slipway db:create main-db --type=postgresql
```

Once the service is running, the Dock icon appears in your environment's toolbar.

## Accessing Dock

### Via Dashboard

1. Go to your project in Slipway
2. Select an environment with a database service
3. Click the **Dock** icon (cyan database icon)
4. Start managing your database

### Via Direct URL

```
https://your-slipway-instance.com/projects/myapp/dock
```

Or with a specific environment:

```
https://your-slipway-instance.com/projects/myapp/environments/staging/dock
```

## SQL Console

The SQL Console lets you run queries directly against your production database.

### Running Queries

1. Enter your SQL in the query editor
2. Press **Cmd/Ctrl + Enter** or click **Run Query**
3. View results in the table below

```sql
SELECT * FROM users WHERE "createdAt" > '2024-01-01' LIMIT 50;
```

### Query Results

Results display in a formatted table with:

- Column headers
- Row count
- Query execution time
- Scrollable data view

### Safety Features

Dock blocks dangerous queries that could harm your database:

- `DROP DATABASE` statements
- `DROP SCHEMA` statements
- System table modifications

For destructive operations, use a dedicated migration or backup first.

## Table Browser

Browse your database tables without writing SQL.

### Viewing Tables

1. Click the **Tables** tab
2. Select a table from the list
3. View data with automatic pagination

Each table shows:

- Table name
- Row count
- Columns and their types

### Pagination

Large tables are paginated automatically:

- Default limit: 50 rows
- Navigate through pages
- Sort by any column

## Schema Viewer

Inspect your database schema at a glance.

### Table Structure

For each table, Dock shows:

| Column       | Info                       |
| ------------ | -------------------------- |
| **Name**     | Column identifier          |
| **Type**     | PostgreSQL/MySQL data type |
| **Nullable** | Whether NULL is allowed    |
| **Default**  | Default value, if set      |
| **PK**       | Primary key indicator      |

### Example

```
┌─────────────────────────────────────────────────────────────────┐
│ users                                                           │
├─────────────────────────────────────────────────────────────────┤
│ Column         Type                Nullable    Default     PK   │
│ id             integer             NO          auto        ✓    │
│ email          character varying   NO          -                │
│ fullName       character varying   YES         -                │
│ createdAt      timestamp           NO          now()            │
│ updatedAt      timestamp           NO          now()            │
└─────────────────────────────────────────────────────────────────┘
```

## Schema Diff & Migrations

The most powerful Dock feature: compare your Waterline models with the actual database schema.

### How It Works

1. Dock reads your Waterline model definitions from the running app
2. Queries the database's `information_schema`
3. Compares them and generates SQL to sync

### Viewing the Diff

1. Click the **Migrate** tab
2. Dock analyzes models vs database
3. See what changes are needed

### Status Indicators

| Status                   | Meaning                 |
| ------------------------ | ----------------------- |
| **Schema is up to date** | Database matches models |
| **X change(s) needed**   | Migration required      |

### Generated SQL

For each difference, Dock generates the appropriate SQL:

```sql
-- New table
CREATE TABLE "posts" (
  "id" SERIAL PRIMARY KEY,
  "title" character varying(255) NOT NULL,
  "body" text,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

-- New column
ALTER TABLE "users" ADD COLUMN "avatarUrl" character varying(255);
```

### Applying Migrations

1. Review the generated SQL
2. Click **Apply Migration**
3. Confirm the action
4. SQL executes against your database

::: warning
Migrations modify your production database. Always backup first and review the generated SQL carefully.
:::

## First-Time Schema Setup

When deploying a new Sails app, your database starts empty. Use Dock to initialize it:

1. Deploy your app (it will fail to connect to empty database)
2. Open Dock → Migrate tab
3. See all tables that need to be created
4. Click **Apply Migration**
5. Redeploy or restart your app

This is much easier than manually running `sails lift` with `migrate: alter` in production.

## Waterline Type Mapping

Dock uses the same type mappings as the actual Sails database adapters:

### PostgreSQL

| Waterline | PostgreSQL         | Notes                                 |
| --------- | ------------------ | ------------------------------------- |
| `string`  | `TEXT`             | Not VARCHAR - PostgreSQL prefers TEXT |
| `text`    | `TEXT`             | Long text content                     |
| `number`  | `REAL` / `INTEGER` | REAL for floats, INTEGER for PKs      |
| `boolean` | `BOOLEAN`          | Native PostgreSQL boolean             |
| `json`    | `JSON`             | Native JSON type                      |
| `ref`     | `TEXT`             | Arbitrary references                  |

Auto-increment columns use `SERIAL` type.

### MySQL

| Waterline | MySQL              | Notes                              |
| --------- | ------------------ | ---------------------------------- |
| `string`  | `VARCHAR(255)`     | Length-limited strings             |
| `text`    | `TEXT`             | Long text content                  |
| `number`  | `REAL` / `INTEGER` | REAL for floats, INTEGER for PKs   |
| `boolean` | `TINYINT(1)`       | MySQL boolean representation       |
| `json`    | `LONGTEXT`         | For compatibility with older MySQL |
| `ref`     | `LONGTEXT`         | Arbitrary references               |

Auto-increment columns use `AUTO_INCREMENT` flag.

### Custom Column Types

If you specify `columnType` in your model, Dock uses it directly:

```javascript
attributes: {
  uuid: {
    type: 'string',
    columnType: 'UUID DEFAULT uuid_generate_v4()'
  },
  metadata: {
    type: 'json',
    columnType: 'JSONB'  // Use JSONB instead of JSON
  }
}
```

## API Endpoints

Dock provides REST API endpoints for automation:

### Execute SQL

```bash
POST /api/v1/projects/:projectSlug/dock/sql

{
  "query": "SELECT * FROM users LIMIT 10"
}
```

### Get Schema

```bash
GET /api/v1/projects/:projectSlug/dock/schema
```

### Get Schema Diff

```bash
GET /api/v1/projects/:projectSlug/dock/diff
```

### Apply Migration

```bash
POST /api/v1/projects/:projectSlug/dock/migrate

{
  "statements": [
    {"sql": "ALTER TABLE users ADD COLUMN bio TEXT;"}
  ]
}
```

### List Tables

```bash
GET /api/v1/projects/:projectSlug/dock/tables
```

### Browse Table Data

```bash
GET /api/v1/projects/:projectSlug/dock/tables/:table/data?limit=50&offset=0
```

## Best Practices

### 1. Backup Before Migrations

Always create a backup before applying schema changes:

```bash
slipway backup:create myapp postgresql
```

### 2. Test in Staging First

Use a staging environment to test migrations. Apply via the Dock UI in your staging environment first, verify it works, then apply to production.

### 3. Review Generated SQL

Always review the SQL that Dock generates. While it handles most cases correctly, complex migrations may need manual adjustment.

### 4. Use Transactions for Multiple Changes

When applying multiple related changes, consider wrapping them in a transaction via the SQL Console:

```sql
BEGIN;
ALTER TABLE orders ADD COLUMN discount DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN discountCode VARCHAR(50);
COMMIT;
```

### 5. Keep Models and Database in Sync

Run schema diff regularly to catch drift between your models and database. Ideally, your CI/CD pipeline should verify this.

## Troubleshooting

### Dock Not Appearing

If the Dock icon doesn't show:

1. Verify you have a PostgreSQL or MySQL service attached
2. Check the service is running (`status: running`)
3. The icon only appears when service is active

### Query Timeout

For long-running queries:

1. Default timeout is 30 seconds
2. Optimize your query (add indexes, limit results)
3. For complex reports, consider using a read replica

### Migration Fails

If migration fails:

1. Check the error message in the result
2. The database may have constraints preventing the change
3. Try running individual statements via SQL Console
4. Check for dependent objects (foreign keys, views)

### Schema Diff Shows Incorrect Results

If diff seems wrong:

1. Ensure your app is running (models are read from running container)
2. Check that model file syntax is correct
3. Custom `columnType` may not match expected patterns

## What's Next?

- Use [Helm](/slipway/helm) for debugging app issues
- Configure [Auto-Deploy](/slipway/auto-deploy) for continuous deployment
