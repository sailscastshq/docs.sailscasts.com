---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-sqlite-social.png
title: Advanced features
titleTemplate: Sails SQLite
description: Sails SQLite provides powerful advanced features including transactions, batch operations, direct database access, and performance monitoring.
prev:
  text: Model definitions
  link: '/sails-sqlite/model-definitions'
next:
  text: Performance optimization
  link: '/sails-sqlite/performance-optimization'
editLink: true
---

# Advanced Features

Sails SQLite provides powerful advanced features including transactions, batch operations, direct database access, and performance monitoring.

## Transactions

### Automatic Transactions

Use the built-in transaction manager for atomic operations:

```javascript
// Using the database manager for transactions
const dsEntry = sails.datastores.default
const result = dsEntry.manager.runInTransaction(() => {
  // Multiple operations in a single transaction
  const user = dsEntry.manager
    .prepare('INSERT INTO users (name, email) VALUES (?, ?)')
    .run('John Doe', 'john@example.com')

  const profile = dsEntry.manager
    .prepare('INSERT INTO profiles (user_id, bio) VALUES (?, ?)')
    .run(user.lastInsertRowid, 'Software Developer')

  return { user, profile }
})

console.log('Transaction completed:', result)
```

### Manual Transaction Control

For more control over transaction boundaries:

```javascript
const dsEntry = sails.datastores.default
const db = dsEntry.manager

try {
  // Begin transaction
  db.prepare('BEGIN TRANSACTION').run()

  // Your operations
  const user = await User.create({
    name: 'Jane Doe',
    email: 'jane@example.com'
  }).fetch()

  await Profile.create({
    userId: user.id,
    bio: 'Product Manager'
  })

  // Commit transaction
  db.prepare('COMMIT').run()
} catch (error) {
  // Rollback on error
  db.prepare('ROLLBACK').run()
  throw error
}
```

## Batch Operations

### Optimized Batch Inserts

Sails SQLite automatically optimizes batch inserts:

```javascript
// This is automatically converted to a single multi-value INSERT
const users = await User.createEach([
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
  { name: 'Charlie', email: 'charlie@example.com' }
]).fetch()

console.log(`Created ${users.length} users efficiently`)
```

### Manual Batch Operations

For even more control over batch operations:

```javascript
const dsEntry = sails.datastores.default
const insert = dsEntry.manager.prepare(`
  INSERT INTO users (name, email) VALUES (?, ?)
`)

// Batch insert with transaction
const insertMany = dsEntry.manager.transaction((users) => {
  for (const user of users) {
    insert.run(user.name, user.email)
  }
})

// Execute batch insert
insertMany([
  { name: 'User 1', email: 'user1@example.com' },
  { name: 'User 2', email: 'user2@example.com' },
  { name: 'User 3', email: 'user3@example.com' }
])
```

## Direct Database Access

### Prepared Statements

Access prepared statements for better performance:

```javascript
const dsEntry = sails.datastores.default

// Create prepared statement
const getUserByEmail = dsEntry.manager.prepare(`
  SELECT * FROM users WHERE email = ?
`)

// Execute multiple times efficiently
const user1 = getUserByEmail.get('alice@example.com')
const user2 = getUserByEmail.get('bob@example.com')
```

### Raw SQL Queries

Execute complex SQL queries directly:

```javascript
// Complex aggregation query
const stats = await sails.sendNativeQuery(
  `
  SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users,
    AVG(CASE WHEN created_at > ? THEN 1 ELSE 0 END) as recent_signup_rate
  FROM users
`,
  [Date.now() - 30 * 24 * 60 * 60 * 1000]
) // Last 30 days

console.log('User statistics:', stats.rows[0])
```

### JSON Operations

Advanced JSON querying with SQLite's JSON functions:

```javascript
// Find products by nested JSON properties
const products = await sails.sendNativeQuery(
  `
  SELECT name, metadata
  FROM products
  WHERE JSON_EXTRACT(metadata, '$.specs.ram') >= ?
  AND JSON_EXTRACT(metadata, '$.brand') = ?
  ORDER BY JSON_EXTRACT(metadata, '$.price') ASC
`,
  ['16GB', 'Dell']
)

// Update JSON fields
await sails.sendNativeQuery(
  `
  UPDATE products 
  SET metadata = JSON_SET(metadata, '$.updated_at', ?)
  WHERE id = ?
`,
  [new Date().toISOString(), productId]
)
```

## Database Health Monitoring

### Connection Health Checks

Monitor database connectivity:

```javascript
const dsEntry = sails.datastores.default

// Check if database is healthy
if (dsEntry.manager.isHealthy()) {
  console.log('Database connection is healthy')
} else {
  console.error('Database connection issues detected')

  // Get detailed health info
  const health = dsEntry.manager.getHealthStatus()
  console.log('Health details:', health)
}
```

### Performance Monitoring

Track query performance:

```javascript
// Enable query timing in development
if (process.env.NODE_ENV === 'development') {
  const dsEntry = sails.datastores.default

  // Log slow queries
  dsEntry.manager.onSlowQuery((sql, time) => {
    console.log(`Slow query (${time}ms):`, sql)
  })
}
```

## Database Optimization

### Manual Optimization

Optimize database performance periodically:

```javascript
const dsEntry = sails.datastores.default

// Run comprehensive optimization
dsEntry.manager.optimize()

// Or run specific optimizations
dsEntry.manager.analyze() // Update query planner statistics
dsEntry.manager.vacuum() // Reclaim unused space
dsEntry.manager.reindex() // Rebuild indexes
```

### Automatic Optimization

Set up automatic optimization:

```javascript
// In config/bootstrap.js
module.exports.bootstrap = async function () {
  // Optimize database every hour in production
  if (process.env.NODE_ENV === 'production') {
    setInterval(
      () => {
        const dsEntry = sails.datastores.default
        dsEntry.manager.analyze() // Light optimization
      },
      60 * 60 * 1000
    ) // 1 hour
  }

  return
}
```

## Full-Text Search

SQLite's built-in FTS (Full-Text Search) capabilities:

```javascript
// Create FTS virtual table
await sails.sendNativeQuery(`
  CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts 
  USING fts5(title, content, tokenize = 'unicode61')
`)

// Populate FTS table
await sails.sendNativeQuery(`
  INSERT INTO posts_fts(rowid, title, content)
  SELECT id, title, content FROM posts
`)

// Full-text search
const searchResults = await sails.sendNativeQuery(
  `
  SELECT posts.*, rank
  FROM posts_fts
  JOIN posts ON posts.id = posts_fts.rowid
  WHERE posts_fts MATCH ?
  ORDER BY rank
`,
  ['javascript sails']
)
```

## Custom SQL Functions

Add custom functions for complex operations:

```javascript
// In datastore configuration
module.exports.datastores = {
  default: {
    adapter: 'sails-sqlite',
    url: 'db/production.sqlite',

    onConnect: (db) => {
      // Add custom REGEXP function
      db.function('REGEXP', (pattern, text) => {
        return new RegExp(pattern, 'i').test(text) ? 1 : 0
      })

      // Add custom UUID function
      db.function('UUID', () => {
        return require('crypto').randomUUID()
      })

      // Add custom JSON validation
      db.function('JSON_VALID', (text) => {
        try {
          JSON.parse(text)
          return 1
        } catch {
          return 0
        }
      })
    }
  }
}
```

Usage:

```javascript
// Use custom functions in queries
const users = await sails.sendNativeQuery(
  `
  SELECT * FROM users 
  WHERE email REGEXP ?
`,
  ['^[a-zA-Z0-9._%+-]+@company\\.com$']
)

// Generate UUIDs
await sails.sendNativeQuery(
  `
  INSERT INTO sessions (id, user_id, data) 
  VALUES (UUID(), ?, ?)
`,
  [userId, sessionData]
)
```

## Backup and Restore

### Database Backup

Create database backups:

```javascript
const dsEntry = sails.datastores.default
const fs = require('fs').promises

// Create backup
const backup = dsEntry.manager.backup()
await fs.writeFile(`backup-${Date.now()}.sqlite`, backup)

// Or use SQLite's built-in backup
await sails.sendNativeQuery(
  `
  VACUUM INTO ?
`,
  [`backup-${Date.now()}.sqlite`]
)
```

### Point-in-Time Recovery

With WAL mode, you can implement point-in-time recovery:

```javascript
// Create checkpoint before critical operations
const dsEntry = sails.datastores.default
dsEntry.manager.checkpoint()

// Later, if needed, you can restore from WAL files
// This requires file system level operations
```

## Connection Pooling

While SQLite doesn't need traditional connection pooling, you can manage multiple database files:

```javascript
// config/datastores.js
module.exports.datastores = {
  default: {
    adapter: 'sails-sqlite',
    url: 'db/main.sqlite'
  },

  analytics: {
    adapter: 'sails-sqlite',
    url: 'db/analytics.sqlite',
    pragmas: {
      synchronous: 'OFF', // Less durability, more speed
      journal_mode: 'MEMORY'
    }
  },

  cache: {
    adapter: 'sails-sqlite',
    url: ':memory:' // In-memory cache database
  }
}
```

Access different databases:

```javascript
// Write to analytics database
await sails.getDatastore('analytics').sendNativeQuery(
  `
  INSERT INTO events (type, data, timestamp) VALUES (?, ?, ?)
`,
  ['page_view', JSON.stringify(data), Date.now()]
)

// Query cache database
const cached = await sails.getDatastore('cache').sendNativeQuery(
  `
  SELECT data FROM cache WHERE key = ?
`,
  [cacheKey]
)
```
