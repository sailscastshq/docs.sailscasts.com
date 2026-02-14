---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Bosun
titleTemplate: Slipway
description: Self-administration dashboard for your Slipway instance. Monitor system health, query databases, manage environment variables, and track activity.
prev:
  text: Lookout
  link: /slipway/lookout
next:
  text: Team Management
  link: /slipway/team-management
editLink: true
---

# Bosun

Bosun is the **self-administration dashboard** for your Slipway instance. It gives you system-level visibility and management tools — entity counts, process health, a SQLite console, environment variable management, and an activity feed — all from one page.

## Accessing Bosun

Click **Bosun** in the sidebar or navigate to `/bosun`.

## Overview

The **Overview** tab shows the current state of your Slipway instance:

| Section       | What's shown                                                         |
| ------------- | -------------------------------------------------------------------- |
| **Stats**     | Counts of projects, apps, deployments, backups                       |
| **Process**   | Uptime, memory usage (RSS, heap), Node.js version, PID               |
| **Databases** | File sizes for the three SQLite databases: app, observability, cache |

## Environment

The **Environment** tab shows the instance-level environment variables that configure your Slipway process itself — values from `/etc/slipway/.env` and any custom overrides you add through the UI.

- **View** all configured variables (values are masked by default)
- **Add** custom instance variables with key-value inputs
- **Remove** custom variables you no longer need
- **Reveal** masked values by clicking the eye icon

Known instance variables (`SESSION_SECRET`, `DATA_ENCRYPTION_KEY`, `SLIPWAY_URL`, `NODE_ENV`, `PORT`, `SLIPWAY_SSL`) are read directly from the running process.

::: tip
These are **instance** variables that configure Slipway itself. For variables injected into deployed applications, use [Global Environment Variables](/slipway/global-environment-variables).
:::

## Console

The **Console** tab provides a read-only SQLite REPL for querying Slipway's internal databases directly.

### Available databases

| Database          | File                  | Contents                                                             |
| ----------------- | --------------------- | -------------------------------------------------------------------- |
| **app**           | `db/app.db`           | Projects, environments, apps, services, deployments, users, settings |
| **observability** | `db/observability.db` | Telemetry spans, exceptions, metrics, container metrics              |
| **cache**         | `db/stash.db`         | Cached helper results                                                |

### Usage

1. Select a database from the pill selector in the actions bar
2. Write a SQL query (SELECT, PRAGMA, or EXPLAIN)
3. Press **Cmd+Enter** (or click **Run**) to execute
4. Results appear in a table below the query input

You can toggle between **table** and **JSON** views, and export results as JSON or CSV.

### Examples

```sql
-- List all tables in the app database
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;

-- Recent deployments with status
SELECT id, status, git_branch, created_at FROM deployments ORDER BY created_at DESC LIMIT 20;

-- Check database page size and journal mode
PRAGMA page_size;
PRAGMA journal_mode;

-- Count records per table
SELECT 'projects' as tbl, COUNT(*) as cnt FROM projects
UNION ALL SELECT 'environments', COUNT(*) FROM environments
UNION ALL SELECT 'deployments', COUNT(*) FROM deployments;
```

::: warning
Only **read-only** queries are allowed. INSERT, UPDATE, DELETE, DROP, and other destructive statements are blocked. The database is opened in read-only mode as an additional safety layer.
:::

## Activity

The **Activity** tab shows a unified feed of recent events across your instance:

| Type            | What's shown                                                   |
| --------------- | -------------------------------------------------------------- |
| **Deployments** | Status, git branch/commit, trigger type, environment, duration |
| **Backups**     | Status, service name, size, type (manual/scheduled)            |
| **Audit logs**  | Action performed, resource type, user, IP address              |

Use the filter buttons (All, Deploys, Backups, Audit) to narrow the feed.

## What's Next?

- Use [Lookout](/slipway/lookout) for application-level observability
- Configure [Global Environment Variables](/slipway/global-environment-variables) in detail
- Set up [Notifications](/slipway/notifications) for deployment alerts
