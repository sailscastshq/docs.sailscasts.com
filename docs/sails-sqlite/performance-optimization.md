---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-sqlite-social.png
title: Performance optimization
titleTemplate: Sails SQLite
description: Sails SQLite comes with optimized defaults, but understanding these optimizations helps you get the best performance for your specific use case.
prev:
  text: Advanced features
  link: '/sails-sqlite/advanced-features'
next:
  text: Deployment
  link: '/sails-sqlite/deployment'
editLink: true
---

# Performance Optimization

Sails SQLite comes with optimized defaults, but understanding these optimizations helps you get the best performance for your specific use case.

## Built-in Optimizations

Sails SQLite automatically applies these performance optimizations:

### Write-Ahead Logging (WAL)

- **5x faster** concurrent reads and writes
- Zero-downtime for read operations during writes
- Better crash recovery

### Memory-Mapped I/O

- **3x faster** read operations
- 256MB default mapping size
- Automatic cache management

### Prepared Statement Caching

- **50% reduction** in memory usage
- Reuse compiled queries
- Automatic cache invalidation

### Optimized Batch Operations

- **10x faster** bulk inserts
- Single multi-value INSERT statements
- Automatic transaction wrapping

## Query Optimization

### Index Usage

Sails SQLite automatically creates indexes for:

```javascript
// Unique constraints get indexes
email: {
  type: 'string',
  unique: true  // Index created automatically
}

// Primary keys get indexes
id: {
  type: 'number',
  autoIncrement: true  // Primary key index
}

// Foreign keys get indexes
userId: {
  type: 'number',
  model: 'user'  // Foreign key index
}

// Timestamp fields get indexes
createdAt: {
  type: 'number',
  autoCreatedAt: true  // Timestamp index
}
```

### Manual Index Optimization

Add indexes for frequently queried fields:

```javascript
// api/models/Product.js
module.exports = {
  attributes: {
    name: 'string',
    category: 'string',
    price: 'number',
    isActive: 'boolean',
    createdAt: 'number'
  },

  indexes: [
    // Single column indexes
    { columns: ['category'] },
    { columns: ['price'] },

    // Composite indexes (order matters!)
    { columns: ['category', 'price'] }, // Good for: category + price queries
    { columns: ['isActive', 'createdAt'] }, // Good for: active + recent queries

    // Partial indexes (SQLite specific)
    {
      columns: ['price'],
      where: 'is_active = 1' // Index only active products
    }
  ]
}
```

### Query Analysis

Analyze query performance in development:

```javascript
// Enable query logging
// config/datastores.js
module.exports.datastores = {
  default: {
    adapter: 'sails-sqlite',
    url: 'db/development.sqlite',
    verbose: (sql, timing) => {
      if (timing > 100) {
        // Log queries slower than 100ms
        console.log(`SLOW QUERY (${timing}ms):`, sql)
      }
    }
  }
}
```

Use EXPLAIN to analyze queries:

```javascript
// Analyze query execution plan
const plan = await sails.sendNativeQuery(
  `
  EXPLAIN QUERY PLAN
  SELECT * FROM products 
  WHERE category = ? AND price < ?
  ORDER BY created_at DESC
`,
  ['electronics', 1000]
)

console.log('Query plan:', plan.rows)
```

## Memory Optimization

### Cache Size Tuning

Adjust cache size based on available memory:

```javascript
// config/datastores.js
module.exports.datastores = {
  default: {
    adapter: 'sails-sqlite',
    url: 'db/production.sqlite',
    pragmas: {
      // For servers with 8GB+ RAM
      cache_size: -1048576, // 1GB cache

      // For containers with limited memory
      cache_size: -131072, // 128MB cache

      // Default (recommended for most cases)
      cache_size: -262144 // 256MB cache
    }
  }
}
```

### Memory-Mapped I/O Tuning

```javascript
pragmas: {
  // For read-heavy workloads
  mmap_size: 1073741824,  // 1GB memory mapping

  // For write-heavy workloads
  mmap_size: 268435456,   // 256MB (default)

  // For memory-constrained environments
  mmap_size: 134217728    // 128MB
}
```

## Write Performance

### Batch Operations

Always use batch operations for multiple inserts:

```javascript
// ❌ Slow - individual inserts
for (const user of users) {
  await User.create(user)
}

// ✅ Fast - batch insert
await User.createEach(users)

// ✅ Even faster - direct batch insert with transaction
const dsEntry = sails.datastores.default
const insertUser = dsEntry.manager.prepare(`
  INSERT INTO users (name, email) VALUES (?, ?)
`)

const insertMany = dsEntry.manager.transaction((users) => {
  for (const user of users) {
    insertUser.run(user.name, user.email)
  }
})

insertMany(users)
```

### Transaction Optimization

Use transactions for related operations:

```javascript
// ❌ Slow - individual queries
const user = await User.create({ name: 'John' }).fetch()
await Profile.create({ userId: user.id, bio: 'Developer' })
await Settings.create({ userId: user.id, theme: 'dark' })

// ✅ Fast - single transaction
await sails.getDatastore().transaction(async (db) => {
  const user = await User.create({ name: 'John' }).fetch().usingConnection(db)
  await Profile.create({ userId: user.id, bio: 'Developer' }).usingConnection(
    db
  )
  await Settings.create({ userId: user.id, theme: 'dark' }).usingConnection(db)
})
```

## Read Performance

### Efficient Querying

```javascript
// ❌ Inefficient - loading unnecessary data
const users = await User.find().populate('posts').populate('comments')

// ✅ Efficient - selective loading
const users = await User.find({
  select: ['id', 'name', 'email'],
  where: { isActive: true },
  limit: 50
})

// ✅ More efficient - raw query for specific needs
const activeUsers = await sails.sendNativeQuery(`
  SELECT id, name, email 
  FROM users 
  WHERE is_active = 1 
  ORDER BY created_at DESC 
  LIMIT 50
`)
```

### Connection Reuse

```javascript
// ❌ Multiple connection overhead
const user = await User.findOne({ id: userId })
const posts = await Post.find({ authorId: userId })
const comments = await Comment.find({ authorId: userId })

// ✅ Single connection for related queries
await sails.getDatastore().transaction(async (db) => {
  const user = await User.findOne({ id: userId }).usingConnection(db)
  const posts = await Post.find({ authorId: userId }).usingConnection(db)
  const comments = await Comment.find({ authorId: userId }).usingConnection(db)

  return { user, posts, comments }
})
```

## Storage Optimization

### Database Maintenance

Regular maintenance keeps performance optimal:

```javascript
// In a scheduled job or bootstrap
const dsEntry = sails.datastores.default

// Update query planner statistics (lightweight, run frequently)
dsEntry.manager.analyze()

// Reclaim unused space (heavier, run less frequently)
if (shouldRunVacuum()) {
  dsEntry.manager.vacuum()
}

// Comprehensive optimization (run monthly)
if (shouldRunFullOptimization()) {
  dsEntry.manager.optimize()
}
```

### Data Archiving

Archive old data to keep working set small:

```javascript
// Archive old records
const cutoffDate = Date.now() - 365 * 24 * 60 * 60 * 1000 // 1 year ago

// Move to archive table
await sails.sendNativeQuery(
  `
  INSERT INTO users_archive 
  SELECT * FROM users 
  WHERE created_at < ? AND is_active = 0
`,
  [cutoffDate]
)

// Remove from main table
await User.destroy({
  createdAt: { '<': cutoffDate },
  isActive: false
})

// Update statistics after bulk changes
const dsEntry = sails.datastores.default
dsEntry.manager.analyze()
```

## Performance Monitoring

### Benchmark Queries

```javascript
// Utility function to benchmark operations
async function benchmark(name, operation) {
  const start = Date.now()
  const result = await operation()
  const time = Date.now() - start
  console.log(`${name}: ${time}ms`)
  return result
}

// Usage
const users = await benchmark('User creation', () => User.createEach(userData))

const posts = await benchmark('Post query', () =>
  Post.find({ limit: 100 }).populate('author')
)
```

### Performance Metrics

Track key performance indicators:

```javascript
// In your application
class PerformanceTracker {
  constructor() {
    this.metrics = {
      queryCount: 0,
      slowQueries: 0,
      totalQueryTime: 0
    }
  }

  trackQuery(sql, time) {
    this.metrics.queryCount++
    this.metrics.totalQueryTime += time

    if (time > 100) {
      // Queries slower than 100ms
      this.metrics.slowQueries++
      console.warn(`Slow query (${time}ms):`, sql.substring(0, 100))
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      averageQueryTime: this.metrics.totalQueryTime / this.metrics.queryCount,
      slowQueryPercentage:
        (this.metrics.slowQueries / this.metrics.queryCount) * 100
    }
  }
}

const tracker = new PerformanceTracker()

// Hook into query logging
// config/datastores.js
module.exports.datastores = {
  default: {
    adapter: 'sails-sqlite',
    url: 'db/production.sqlite',
    verbose: tracker.trackQuery.bind(tracker)
  }
}
```

## Production Optimizations

### Environment-Specific Settings

```javascript
// config/env/production.js
module.exports = {
  datastores: {
    default: {
      adapter: 'sails-sqlite',
      url: process.env.DATABASE_URL || '/app/data/production.sqlite',

      // Production-optimized pragmas
      pragmas: {
        journal_mode: 'WAL',
        synchronous: 'NORMAL', // FULL is safer but slower
        cache_size: -524288, // 512MB cache
        mmap_size: 1073741824, // 1GB memory mapping
        temp_store: 'MEMORY',
        busy_timeout: 30000,
        foreign_keys: 'ON'
      },

      // Extended timeout for production
      timeout: 30000
    }
  }
}
```

### Health Monitoring

```javascript
// Monitor database health
setInterval(async () => {
  const dsEntry = sails.datastores.default

  if (!dsEntry.manager.isHealthy()) {
    console.error('Database unhealthy!')

    // Send alert to monitoring system
    await sendAlert({
      type: 'database_health',
      message: 'SQLite database health check failed',
      timestamp: Date.now()
    })
  }
}, 60000) // Check every minute
```

## Common Performance Pitfalls

### Avoid These Patterns

```javascript
// ❌ N+1 queries
const posts = await Post.find()
for (const post of posts) {
  post.author = await User.findOne({ id: post.authorId })
}

// ✅ Use populate or joins
const posts = await Post.find().populate('author')

// ❌ Inefficient counting
const count = (await User.find()).length

// ✅ Use count query
const count = await User.count()

// ❌ Loading everything then filtering
const users = await User.find()
const activeUsers = users.filter((u) => u.isActive)

// ✅ Filter in database
const activeUsers = await User.find({ isActive: true })
```

### Index Misuse

```javascript
// ❌ Wrong index order
indexes: [
  { columns: ['createdAt', 'category'] } // Inefficient for category queries
]

// ✅ Correct index order (most selective first)
indexes: [
  { columns: ['category', 'createdAt'] } // Efficient for both queries
]
```
