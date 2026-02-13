---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Database Services
titleTemplate: Slipway
description: Provision and manage PostgreSQL, MySQL, Redis, and MongoDB databases with Slipway.
prev:
  text: File Uploads
  link: /slipway/file-uploads
next:
  text: Helm
  link: /slipway/helm
editLink: true
---

# Database Services

Slipway makes it easy to provision and manage databases for your Sails applications. No more manual Docker commands or connection string juggling.

## Supported Databases

| Database       | Type       | Use Case                        |
| -------------- | ---------- | ------------------------------- |
| **PostgreSQL** | Relational | Primary database for most apps  |
| **MySQL**      | Relational | Alternative relational database |
| **Redis**      | Key-Value  | Caching, sessions, queues       |
| **MongoDB**    | Document   | Document-based storage          |

## Creating a Database

### Via CLI

```bash
# Interactive (prompts for type)
slipway db:create mydb

# Explicit type
slipway db:create mydb --type=postgres
slipway db:create cache --type=redis
slipway db:create docs --type=mongodb
```

### Via Dashboard

1. Go to your project's **Services** tab
2. Click **Add Service**
3. Select the database type
4. Configure name and options
5. Click **Create**

## Linking Databases to Apps

The magic of Slipway's service linking: automatic environment variable injection.

### How It Works

When you link a database to an app, Slipway automatically sets the appropriate connection environment variable:

```bash
slipway db:link mydb myapp
```

This automatically sets:

| Database Type | Environment Variable                               |
| ------------- | -------------------------------------------------- |
| PostgreSQL    | `DATABASE_URL=postgres://user:pass@host:5432/mydb` |
| MySQL         | `DATABASE_URL=mysql://user:pass@host:3306/mydb`    |
| Redis         | `REDIS_URL=redis://host:6379`                      |
| MongoDB       | `DATABASE_URL=mongodb://user:pass@host:27017/mydb` |

### Sails Configuration

Your Sails app can read these directly in `config/datastores.js`:

```javascript
// config/datastores.js
module.exports.datastores = {
  default: {
    // Slipway sets DATABASE_URL automatically when you link a database
    url: process.env.DATABASE_URL
  }
}
```

For Redis (sessions, caching):

```javascript
// config/session.js
module.exports.session = {
  adapter: '@sailshq/connect-redis',
  url: process.env.REDIS_URL
}
```

### Unlinking

To remove a database link:

```bash
slipway db:unlink mydb myapp
```

This removes the environment variable. The database itself is not deleted.

## Connecting Directly

Need to run SQL queries or inspect data? Connect directly to your database:

```bash
# PostgreSQL - opens psql
slipway db:connect mydb

# MySQL - opens mysql client
slipway db:connect mysql-db

# Redis - opens redis-cli
slipway db:connect cache

# MongoDB - opens mongosh
slipway db:connect docs
```

### Example Session

```bash
$ slipway db:connect mydb

Connecting to PostgreSQL database 'mydb'...

psql (16.1)
Type "help" for help.

mydb=> \dt
         List of relations
 Schema |   Name   | Type  | Owner
--------+----------+-------+-------
 public | user     | table | slipway
 public | post     | table | slipway
 public | comment  | table | slipway
(3 rows)

mydb=> SELECT COUNT(*) FROM "user";
 count
-------
   156
(1 row)
```

## Database Management

### List All Databases

```bash
slipway db:list
```

Output:

```
NAME        TYPE        STATUS    LINKED TO       CREATED
mydb        postgres    running   myapp           2 days ago
cache       redis       running   myapp, api      5 days ago
analytics   postgres    running   -               1 week ago
```

### Get Connection URL

Retrieve the connection string for a database:

```bash
slipway db:url mydb
```

Output:

```
postgres://slipway_abc123:secretpass@mydb.internal:5432/mydb
```

::: warning Security
Connection strings contain credentials. Don't share them or commit them to version control.
:::

### Database Info

Get detailed information about a database:

```bash
slipway db:info mydb
```

Output:

```
Database: mydb
Type: PostgreSQL 16
Status: running
Container: slipway-db-mydb-abc123

Connection:
  Internal Host: mydb.internal
  Internal Port: 5432
  Database: mydb
  Username: slipway_abc123

Linked Apps:
  - myapp (DATABASE_URL)

Created: 2024-01-15 10:30:00
```

## Backups

### Create a Backup

```bash
slipway db:backup mydb
```

This creates a timestamped backup:

```
Creating backup of 'mydb'...
✓ Backup created: mydb-2024-01-20-143022.sql.gz (2.3 MB)
```

### Backup to S3-Compatible Storage

Store backups offsite in S3-compatible storage (R2, Spaces, S3):

**1. Configure global storage credentials:**

```bash
slipway config:set \
  R2_ACCESS_KEY=your-access-key \
  R2_SECRET_KEY=your-secret-key \
  R2_BUCKET=my-backups \
  R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com
```

**2. Backup directly to S3:**

```bash
slipway db:backup mydb --to-s3
```

Output:

```
Creating backup of 'mydb'...
✓ Backup created: mydb-2024-01-20-143022.sql.gz (2.3 MB)
✓ Uploaded to S3: s3://my-backups/slipway/backups/mydb-2024-01-20-143022.sql.gz
```

**3. Configure automatic S3 backups:**

```bash
# Enable automatic daily backups to S3
slipway db:update mydb --backup-to-s3=true --backup-schedule="0 3 * * *"
```

::: info Backup Schedule Format
The schedule uses cron format: `minute hour day month weekday`

- `0 3 * * *` - Daily at 3 AM
- `0 3 * * 0` - Weekly on Sundays at 3 AM
- `0 */6 * * *` - Every 6 hours
  :::

### List Backups

```bash
slipway db:backups mydb
```

Output:

```
BACKUP                           SIZE      LOCATION    CREATED
mydb-2024-01-20-143022.sql.gz   2.3 MB    s3          2 hours ago
mydb-2024-01-19-100000.sql.gz   2.1 MB    s3          1 day ago
mydb-2024-01-18-100000.sql.gz   2.0 MB    local       2 days ago
```

### Restore from Backup

```bash
# Restore from local backup
slipway db:restore mydb mydb-2024-01-20-143022.sql.gz

# Restore from S3 backup
slipway db:restore mydb mydb-2024-01-20-143022.sql.gz --from-s3
```

::: danger Destructive Operation
Restoring a backup will **replace all data** in the database. Make sure you have a recent backup before restoring.
:::

### Download Backup

Download a backup to your local machine:

```bash
# From local storage
slipway db:backup:download mydb mydb-2024-01-20-143022.sql.gz

# From S3
slipway db:backup:download mydb mydb-2024-01-20-143022.sql.gz --from-s3
```

### Backup Retention

Configure how long to keep backups:

```bash
# Keep backups for 30 days
slipway db:update mydb --backup-retention=30d

# Keep last 10 backups
slipway db:update mydb --backup-retention=10
```

## Database Versions

### Supported Versions

| Database   | Versions                 |
| ---------- | ------------------------ |
| PostgreSQL | 16 (default), 15, 14, 13 |
| MySQL      | 8.0 (default), 5.7       |
| Redis      | 7 (default), 6           |
| MongoDB    | 7 (default), 6, 5        |

### Specifying Version

```bash
slipway db:create mydb --type=postgres --version=15
```

## Connection Pooling

For high-traffic applications, Slipway automatically configures connection pooling:

- **PostgreSQL**: PgBouncer (optional)
- **MySQL**: ProxySQL (optional)

Enable pooling when creating a database:

```bash
slipway db:create mydb --type=postgres --pooling
```

## Best Practices

### 1. Use Meaningful Names

```bash
# Good - descriptive names
slipway db:create myapp-production --type=postgres
slipway db:create myapp-cache --type=redis

# Avoid - generic names
slipway db:create db1 --type=postgres
```

### 2. Separate Databases per Environment

```bash
# Production
slipway db:create myapp-prod-db --type=postgres
slipway db:link myapp-prod-db myapp --env=production

# Staging
slipway db:create myapp-staging-db --type=postgres
slipway db:link myapp-staging-db myapp --env=staging
```

### 3. Regular Backups

Set up automated backups (coming soon) or run manual backups before major changes:

```bash
# Before a migration
slipway db:backup mydb
slipway slide --message "Run migrations"
```

### 4. Use Redis for Sessions in Production

```bash
# Create Redis for sessions
slipway db:create sessions --type=redis
slipway db:link sessions myapp
```

Then configure Sails:

```javascript
// config/env/production.js
module.exports = {
  session: {
    adapter: '@sailshq/connect-redis',
    url: process.env.REDIS_URL
  }
}
```

## Troubleshooting

### Connection Refused

If your app can't connect to the database:

1. Verify the database is running:

   ```bash
   slipway db:info mydb
   ```

2. Check if the database is linked:

   ```bash
   slipway db:list
   ```

3. Verify environment variables:
   ```bash
   slipway env:list myapp
   ```

### Database Won't Start

Check the database logs:

```bash
slipway db:logs mydb
```

Common issues:

- **Out of disk space**: Free up space or resize your server
- **Out of memory**: Reduce `max_connections` or upgrade server
- **Corrupted data**: Restore from backup

### Slow Queries

1. Connect to the database:

   ```bash
   slipway db:connect mydb
   ```

2. For PostgreSQL, check slow queries:
   ```sql
   SELECT query, calls, mean_time
   FROM pg_stat_statements
   ORDER BY mean_time DESC
   LIMIT 10;
   ```

## What's Next?

- Learn about [Helm](/slipway/helm) for querying your database via the Sails REPL
- Set up [Environment Variables](/slipway/environment-variables) for other configuration
- Configure [Auto-Deploy](/slipway/auto-deploy) for continuous deployment
