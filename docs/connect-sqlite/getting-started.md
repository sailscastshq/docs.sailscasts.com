---
prev: false
next:
  text: 'Configuration'
  link: '/connect-sqlite/configuration'
---

# Getting Started

Connect SQLite is a SQLite session store for Sails.js applications. It uses [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) for fast, synchronous database operations.

## Installation

```bash
npm install @sailscastshq/connect-sqlite
```

## Basic Setup

Configure your session store in `config/session.js`:

```javascript
module.exports.session = {
  secret: process.env.SESSION_SECRET,
  adapter: '@sailscastshq/connect-sqlite',
  url: './db/sessions.db',

  cookie: {
    secure: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}
```

That's it! Sails will automatically use SQLite to store sessions.

## URL Formats

Connect SQLite accepts any valid file path:

```javascript
// Relative path (recommended)
url: './db/sessions.db'

// Absolute path
url: '/var/data/sessions.db'

// In-memory database (for testing)
url: ':memory:'
```

::: tip
The parent directory will be created automatically if it doesn't exist.
:::

## Why SQLite for Sessions?

- **No external dependencies** - No Redis or Memcached server to manage
- **Persistent storage** - Sessions survive server restarts
- **Low memory footprint** - Perfect for single-instance deployments
- **Fast** - better-sqlite3 is one of the fastest SQLite bindings for Node.js

## Next Steps

- [Configuration Options](/connect-sqlite/configuration) - Customize TTL, table name, and more
- [API Reference](/connect-sqlite/api) - Available methods and their usage
