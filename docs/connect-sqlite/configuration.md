---
prev:
  text: 'Getting Started'
  link: '/connect-sqlite/getting-started'
next:
  text: 'API Reference'
  link: '/connect-sqlite/api'
---

# Configuration

Connect SQLite provides several configuration options to customize its behavior.

## Options

| Option         | Default      | Description                                |
| -------------- | ------------ | ------------------------------------------ |
| `url`          | `:memory:`   | Database path (e.g. `./db/sessions.db`)    |
| `client`       | -            | Existing better-sqlite3 Database instance  |
| `table`        | `'sessions'` | Table name for sessions                    |
| `prefix`       | `'sess:'`    | Key prefix for session IDs                 |
| `ttl`          | `86400`      | Default TTL in seconds (1 day)             |
| `disableTTL`   | `false`      | Disable TTL expiration                     |
| `disableTouch` | `false`      | Disable touch updates                      |
| `serializer`   | `JSON`       | Custom serializer with `parse`/`stringify` |
| `wal`          | `true`       | Enable WAL mode for better concurrency     |

## Example Configurations

### Production Setup

```javascript
// config/session.js
module.exports.session = {
  secret: process.env.SESSION_SECRET,
  adapter: '@sailscastshq/connect-sqlite',
  url: './db/sessions.db',

  // Custom TTL (7 days)
  ttl: 7 * 24 * 60 * 60,

  cookie: {
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}
```

### Development Setup

```javascript
// config/env/development.js
module.exports.session = {
  adapter: '@sailscastshq/connect-sqlite',
  url: ':memory:', // In-memory for fast development

  cookie: {
    secure: false
  }
}
```

### Custom Table Name

```javascript
module.exports.session = {
  adapter: '@sailscastshq/connect-sqlite',
  url: './db/sessions.db',
  table: 'user_sessions', // Custom table name
  prefix: 'myapp:' // Custom prefix
}
```

## Auto-Create Directory

Connect SQLite automatically creates the parent directory if it doesn't exist. For example, with `url: './db/sessions.db'`, the `./db` directory will be created if needed.

## WAL Mode

WAL (Write-Ahead Logging) mode is enabled by default for file-based databases. This provides better concurrent read/write performance.

To disable WAL mode:

```javascript
module.exports.session = {
  adapter: '@sailscastshq/connect-sqlite',
  url: './db/sessions.db',
  wal: false
}
```

::: tip
WAL mode is automatically disabled for in-memory databases (`:memory:`).
:::

## Session Cleanup

Expired sessions are automatically pruned:

- **On startup** - Cleans up any expired sessions from previous runs
- **Hourly** - Runs a background cleanup job every hour

The cleanup job uses `setInterval().unref()` so it won't prevent your process from exiting.
