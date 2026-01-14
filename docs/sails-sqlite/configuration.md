---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-sqlite-social.png
title: Configuration
titleTemplate: Sails SQLite
description: Sails SQLite comes pre-configured with performance-optimized defaults with full control over advanced settings.
prev:
  text: Getting started
  link: '/sails-sqlite/getting-started'
next:
  text: Model definitions
  link: '/sails-sqlite/model-definitions'
editLink: true
---

# Configuration

Sails SQLite comes pre-configured with performance-optimized defaults, so you can get started quickly while still having full control over advanced settings.

## Basic Configuration

The minimal configuration is all you need to get started with optimized performance:

```javascript
// config/datastores.js
module.exports.datastores = {
  default: {
    adapter: 'sails-sqlite',
    url: 'db/production.sqlite'
  }
}
```

**That's it!** Sails SQLite automatically applies production-ready defaults including WAL mode, optimized caching, and memory-mapped I/O.

## Default Performance Settings

Sails SQLite automatically applies these optimized pragmas:

| Pragma         | Default Value | Benefit                            |
| -------------- | ------------- | ---------------------------------- |
| `journal_mode` | 'WAL'         | Better concurrency and performance |
| `synchronous`  | 'NORMAL'      | Balanced safety and speed          |
| `cache_size`   | -262144       | 256MB cache for faster queries     |
| `mmap_size`    | 268435456     | 256MB memory-mapped I/O            |
| `foreign_keys` | 'ON'          | Data integrity enforcement         |
| `busy_timeout` | 30000         | 30-second wait for locked database |
| `temp_store`   | 'MEMORY'      | Temporary tables in memory         |

## Custom Configuration

You can override the defaults if needed for specific use cases:

```javascript
// config/datastores.js
module.exports.datastores = {
  default: {
    adapter: 'sails-sqlite',
    url: 'db/production.sqlite',

    // Override specific pragmas
    pragmas: {
      cache_size: -524288, // 512MB cache instead of 256MB
      busy_timeout: 60000 // 60 seconds instead of 30
    },

    // Connection options
    timeout: 15000, // 15 second connection timeout (default: 10000)
    verbose: true // Enable SQL query logging
  }
}
```

## Connection Options

| Option          | Type             | Default  | Description                          |
| --------------- | ---------------- | -------- | ------------------------------------ |
| `url`           | String           | Required | Path to SQLite database file         |
| `timeout`       | Number           | 10000    | Connection timeout in milliseconds   |
| `readonly`      | Boolean          | false    | Open database in read-only mode      |
| `fileMustExist` | Boolean          | false    | Require database file to exist       |
| `verbose`       | Boolean/Function | false    | Enable SQL query logging (see below) |

## SQL Query Logging

The `verbose` option allows you to log all SQL queries executed by the adapter. This is useful for debugging and performance analysis.

```javascript
// Use console.log for SQL logging
verbose: true

// Or provide a custom logging function
verbose: (sql) => sails.log.debug('SQL:', sql)
```

::: warning
SQL logging is disabled by default. Enable it only when needed, as it can impact performance and clutter logs in production.
:::

## Environment-Specific Configuration

### Development

Enable query logging for debugging:

```javascript
development: {
  adapter: 'sails-sqlite',
  url: 'db/development.sqlite',
  verbose: true // Log all SQL queries to console
  // All performance defaults still apply
}
```

### Testing

Use in-memory database for faster tests:

```javascript
test: {
  adapter: 'sails-sqlite',
  url: ':memory:', // In-memory database
  pragmas: {
    synchronous: 'OFF' // Even faster for tests (less durability)
  }
}
```

### Production

The defaults are already optimized for production, but you might want to adjust cache size based on available memory:

```javascript
production: {
  adapter: 'sails-sqlite',
  url: process.env.DATABASE_URL || 'db/production.sqlite',

  pragmas: {
    cache_size: -1048576  // 1GB cache if you have lots of RAM
  },

  timeout: 15000 // Longer timeout for production
}
```

## Understanding the Defaults

### Why WAL Mode?

WAL (Write-Ahead Logging) mode is enabled by default because it:

- Allows concurrent reads while writing
- Improves performance for most applications
- Provides better crash recovery

### Why These Cache Settings?

The default 256MB cache and memory-mapped I/O are chosen because they:

- Significantly improve read performance
- Work well on most modern systems
- Balance memory usage with performance gains

### Why Foreign Keys ON?

Foreign key enforcement is enabled by default to ensure data integrity, which is crucial for production applications.

## Performance Tips

1. **Trust the Defaults**: The pre-configured settings are optimized for most use cases
2. **Monitor Performance**: Use `verbose: console.log` in development to identify slow queries
3. **Adjust Cache Size**: Only increase cache size if you have abundant RAM and heavy read workloads
4. **Use Transactions**: For multiple related operations, use the built-in transaction support
5. **Database Location**: Place the database file on fast storage (SSD) for best performance

## Custom Initialization

For advanced use cases, you can run custom initialization:

```javascript
module.exports.datastores = {
  default: {
    adapter: 'sails-sqlite',
    url: 'db/production.sqlite',

    // Custom initialization function
    onConnect: (db) => {
      // Add custom SQL function
      db.function('REGEXP', (pattern, text) => {
        return new RegExp(pattern).test(text) ? 1 : 0
      })

      // Run custom pragma
      db.pragma('analysis_limit=1000')
    }
  }
}
```
