---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-sqlite-social.png
title: Deployment
titleTemplate: Sails SQLite
description: Sails SQLite is designed for production deployment with robust defaults and deployment-ready configurations.
prev:
  text: Performance optimization
  link: '/sails-sqlite/performance-optimization'
next:
  text: Monitoring
  link: '/sails-sqlite/monitoring'
editLink: true
---

# Deployment

Sails SQLite is designed for production deployment with robust defaults and deployment-ready configurations.

## Production Configuration

### Optimized Production Settings

```javascript
// config/env/production.js
module.exports = {
  datastores: {
    default: {
      adapter: 'sails-sqlite',
      url: process.env.DATABASE_URL || '/app/data/production.sqlite',

      // Production-optimized pragmas (already applied by default)
      pragmas: {
        journal_mode: 'WAL', // Better concurrency
        synchronous: 'NORMAL', // Balanced safety/performance
        cache_size: -524288, // 512MB cache for production
        mmap_size: 1073741824, // 1GB memory mapping
        busy_timeout: 30000, // 30 second timeout
        foreign_keys: 'ON' // Data integrity
      },

      // Production connection settings
      timeout: 30000, // 30 second connection timeout
      verbose: null // Disable query logging in production
    }
  },

  // Production model settings
  models: {
    migrate: 'safe', // Never auto-drop tables in production
    attributes: {
      createdAt: { type: 'number', autoCreatedAt: true },
      updatedAt: { type: 'number', autoUpdatedAt: true }
    }
  }
}
```

## Platform Deployment

### Railway

Railway provides excellent SQLite support with persistent volumes:

```dockerfile
# Dockerfile
FROM node:18-alpine

# Install native dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application
COPY . .

# Create data directory with proper permissions
RUN mkdir -p /app/data && chmod 755 /app/data

EXPOSE 1337

CMD ["node", "app.js"]
```

```javascript
// config/env/production.js (Railway)
module.exports = {
  datastores: {
    default: {
      adapter: 'sails-sqlite',
      url: '/app/data/production.sqlite' // Persistent volume path
    }
  }
}
```

### Render

Render supports SQLite with persistent disks:

```yaml
# render.yaml
services:
  - type: web
    name: my-sails-app
    env: node
    buildCommand: npm install
    startCommand: npm start
    disk:
      name: sqlite-data
      mountPath: /app/data
      sizeGB: 10
    envVars:
      - key: DATABASE_URL
        value: /app/data/production.sqlite
      - key: NODE_ENV
        value: production
```

### Docker Deployment

Complete Docker setup with volume mounting:

```dockerfile
# Dockerfile
FROM node:18-alpine

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create data directory
RUN mkdir -p /app/data

# Set proper permissions
RUN chown -R node:node /app

USER node

EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:1337/health || exit 1

CMD ["node", "app.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '1337:1337'
    volumes:
      - sqlite-data:/app/data
    environment:
      - NODE_ENV=production
      - DATABASE_URL=/app/data/production.sqlite
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:1337/health']
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  sqlite-data:
    driver: local
```

## File System Considerations

### Database File Location

Choose the right location for your SQLite file:

```javascript
// config/env/production.js
module.exports = {
  datastores: {
    default: {
      adapter: 'sails-sqlite',
      // Options in order of preference:
      url:
        process.env.DATABASE_URL || // Environment variable
        '/app/data/production.sqlite' || // Persistent volume
        './data/production.sqlite' || // Relative path
        '/tmp/production.sqlite' // Temporary (not recommended)
    }
  }
}
```

### Permissions and Security

Ensure proper file permissions:

```bash
# Set secure permissions
chmod 640 /app/data/production.sqlite
chown app:app /app/data/production.sqlite

# Directory permissions
chmod 755 /app/data
chown app:app /app/data
```

### File System Performance

For optimal performance:

```javascript
// Mount database on fast storage
// Prefer SSD over HDD
// Consider using tmpfs for cache directories

// config/env/production.js
module.exports = {
  datastores: {
    default: {
      adapter: 'sails-sqlite',
      url: '/fast-ssd/data/production.sqlite', // SSD storage
      pragmas: {
        temp_store: 'MEMORY', // Keep temp files in memory
        mmap_size: 1073741824 // 1GB memory mapping
      }
    }
  }
}
```

## Database Migrations

### Safe Production Migrations

```javascript
// config/env/production.js
module.exports = {
  models: {
    migrate: 'safe' // Never drop tables automatically
  }
}
```

### Manual Migration Strategy

```javascript
// scripts/migrate.js
const sails = require('sails')

async function migrate() {
  await sails.lift({
    models: { migrate: 'alter' }, // Allow schema changes
    hooks: { grunt: false } // Skip grunt in migration
  })

  try {
    // Run your migrations
    console.log('Running migrations...')

    // Add new columns
    await sails.sendNativeQuery(`
      ALTER TABLE users ADD COLUMN phone_number TEXT
    `)

    // Create new indexes
    await sails.sendNativeQuery(`
      CREATE INDEX IF NOT EXISTS idx_users_phone 
      ON users(phone_number)
    `)

    console.log('Migrations completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  } finally {
    await sails.lower()
  }
}

migrate().catch(console.error)
```

Run migrations before deployment:

```bash
# Run migration script
node scripts/migrate.js

# Then deploy with safe mode
NODE_ENV=production node app.js
```

## Backup and Recovery

### Automated Backups

```javascript
// scripts/backup.js
const fs = require('fs').promises
const path = require('path')

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/:/g, '-')
  const backupPath = `/backups/db-backup-${timestamp}.sqlite`
  const sourcePath = '/app/data/production.sqlite'

  try {
    // Copy database file
    await fs.copyFile(sourcePath, backupPath)

    // Also backup WAL and SHM files if they exist
    try {
      await fs.copyFile(`${sourcePath}-wal`, `${backupPath}-wal`)
      await fs.copyFile(`${sourcePath}-shm`, `${backupPath}-shm`)
    } catch (walError) {
      // WAL files might not exist, which is fine
    }

    console.log(`Backup created: ${backupPath}`)

    // Clean old backups (keep last 7 days)
    await cleanOldBackups()
  } catch (error) {
    console.error('Backup failed:', error)
    throw error
  }
}

async function cleanOldBackups() {
  const backupDir = '/backups'
  const files = await fs.readdir(backupDir)
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days

  for (const file of files) {
    if (file.startsWith('db-backup-')) {
      const filePath = path.join(backupDir, file)
      const stats = await fs.stat(filePath)

      if (stats.mtime.getTime() < cutoff) {
        await fs.unlink(filePath)
        console.log(`Deleted old backup: ${file}`)
      }
    }
  }
}

// Run backup
createBackup().catch(console.error)
```

Set up automated backups:

```bash
# Add to crontab for daily backups at 2 AM
0 2 * * * /usr/bin/node /app/scripts/backup.js
```

### Point-in-Time Recovery

With WAL mode, you can implement point-in-time recovery:

```javascript
// scripts/restore.js
const fs = require('fs').promises

async function restoreFromBackup(backupPath) {
  const productionPath = '/app/data/production.sqlite'

  try {
    // Stop application first
    console.log('Restoring from backup:', backupPath)

    // Backup current database (safety)
    await fs.copyFile(productionPath, `${productionPath}.pre-restore`)

    // Restore from backup
    await fs.copyFile(backupPath, productionPath)

    // Restore WAL file if it exists
    try {
      await fs.copyFile(`${backupPath}-wal`, `${productionPath}-wal`)
    } catch (walError) {
      // WAL file might not exist
    }

    console.log('Restore completed successfully')
  } catch (error) {
    console.error('Restore failed:', error)
    throw error
  }
}
```

## Monitoring and Health Checks

### Application Health Check

```javascript
// api/controllers/health/check.js
module.exports = {
  friendlyName: 'Health check',

  description: 'Check application and database health status.',

  exits: {
    success: {
      description: 'Application is healthy.'
    },
    unhealthy: {
      statusCode: 503,
      description: 'Application or database is unhealthy.'
    }
  },

  fn: async function () {
    try {
      const dsEntry = sails.datastores.default

      // Check database health
      const isHealthy = dsEntry.manager.isHealthy()

      if (!isHealthy) {
        throw {
          unhealthy: {
            status: 'unhealthy',
            database: 'disconnected'
          }
        }
      }

      // Test query to ensure database is responding
      await sails.sendNativeQuery('SELECT 1')

      return {
        status: 'healthy',
        timestamp: Date.now(),
        database: 'connected'
      }
    } catch (error) {
      throw {
        unhealthy: {
          status: 'unhealthy',
          error: error.message
        }
      }
    }
  }
}
```

### Database Metrics

```javascript
// api/controllers/metrics/database.js
module.exports = {
  friendlyName: 'Get database metrics',

  description: 'Retrieve database statistics and file information.',

  exits: {
    success: {
      description: 'Database metrics retrieved successfully.'
    },
    serverError: {
      statusCode: 500,
      description: 'Server error occurred while retrieving metrics.'
    }
  },

  fn: async function () {
    try {
      const dsEntry = sails.datastores.default

      // Get database statistics
      const stats = await sails.sendNativeQuery(`
        SELECT 
          name,
          (SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=m.name) as table_count,
          (SELECT COUNT(*) FROM sqlite_master WHERE type='index' AND tbl_name=m.name) as index_count
        FROM sqlite_master m WHERE type='table'
      `)

      // Get file size
      const fs = require('fs')
      const filePath = '/app/data/production.sqlite'
      const fileStats = fs.statSync(filePath)

      return {
        file_size_mb: Math.round(fileStats.size / 1024 / 1024),
        tables: stats.rows,
        wal_mode: true,
        cache_size_mb: 512,
        mmap_size_mb: 1024
      }
    } catch (error) {
      throw {
        serverError: {
          error: error.message
        }
      }
    }
  }
}
```

## Performance in Production

### Connection Monitoring

```javascript
// config/bootstrap.js
module.exports.bootstrap = async function () {
  // Monitor database performance in production
  if (process.env.NODE_ENV === 'production') {
    const dsEntry = sails.datastores.default

    // Log slow queries
    dsEntry.manager.onSlowQuery((sql, time) => {
      console.warn(`SLOW QUERY (${time}ms):`, sql.substring(0, 200))
    })

    // Periodic health checks
    setInterval(() => {
      if (!dsEntry.manager.isHealthy()) {
        console.error('Database health check failed!')
      }
    }, 60000) // Every minute

    // Periodic optimization
    setInterval(() => {
      dsEntry.manager.analyze() // Update statistics
    }, 3600000) // Every hour
  }

  return
}
```

## Security Considerations

### File System Security

```bash
# Secure the database file
chmod 600 /app/data/production.sqlite
chown app:app /app/data/production.sqlite

# Secure the data directory
chmod 700 /app/data
chown app:app /app/data
```

### Application Security

```javascript
// Ensure SQL injection protection
const users = await sails.sendNativeQuery(
  `
  SELECT * FROM users WHERE email = ?
`,
  [email]
) // Always use parameterized queries

// Never construct SQL with string concatenation
// ❌ DANGEROUS
const users = await sails.sendNativeQuery(`
  SELECT * FROM users WHERE email = '${email}'
`)
```

## Troubleshooting

### Common Production Issues

```javascript
// Database locked errors
pragmas: {
  busy_timeout: 60000  // Increase timeout to 60 seconds
}

// Memory issues
pragmas: {
  cache_size: -131072,  // Reduce cache to 128MB
  mmap_size: 134217728  // Reduce mmap to 128MB
}

// Disk space issues
// Implement regular VACUUM operations
setInterval(async () => {
  const dsEntry = sails.datastores.default
  dsEntry.manager.vacuum()
}, 86400000) // Daily vacuum
```
