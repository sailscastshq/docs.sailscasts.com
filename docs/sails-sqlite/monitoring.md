---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/sails-sqlite-social.png
title: Monitoring
titleTemplate: Sails SQLite
description: Comprehensive monitoring is essential for maintaining optimal performance and reliability of your Sails SQLite application in production.
prev:
  text: Deployment
  link: '/sails-sqlite/deployment'
editLink: true
---

# Monitoring

Comprehensive monitoring is essential for maintaining optimal performance and reliability of your Sails SQLite application in production.

## Health Monitoring

### Database Health Checks

Sails SQLite provides built-in health monitoring:

```javascript
// api/controllers/health/check.js
module.exports = {
  friendlyName: 'Health check',

  description: 'Check database health status.',

  exits: {
    success: {
      description: 'Database is healthy.'
    },
    unhealthy: {
      statusCode: 503,
      description: 'Database is unhealthy.'
    }
  },

  fn: async function () {
    try {
      const dsEntry = sails.datastores.default

      // Check database connection health
      const isHealthy = dsEntry.manager.isHealthy()

      if (!isHealthy) {
        throw {
          unhealthy: {
            status: 'unhealthy',
            database: 'disconnected',
            timestamp: Date.now()
          }
        }
      }

      // Test actual database responsiveness
      const testQuery = await sails.sendNativeQuery('SELECT 1 as test')

      return {
        status: 'healthy',
        database: 'connected',
        test_query_result: testQuery.rows[0].test,
        timestamp: Date.now()
      }
    } catch (error) {
      sails.log.error('Health check failed:', error)
      throw {
        unhealthy: {
          status: 'unhealthy',
          error: error.message,
          timestamp: Date.now()
        }
      }
    }
  }
}
```

```javascript
// api/controllers/health/detailed.js
module.exports = {
  friendlyName: 'Detailed health check',

  description: 'Get comprehensive database health information.',

  exits: {
    success: {
      description: 'Detailed health information retrieved successfully.'
    },
    serverError: {
      statusCode: 500,
      description: 'Server error occurred.'
    }
  },

  fn: async function () {
    try {
      const dsEntry = sails.datastores.default

      // Get comprehensive health status
      const health = dsEntry.manager.getHealthStatus()

      // Database file statistics
      const fs = require('fs')
      const dbPath = dsEntry.config.url
      const stats = fs.statSync(dbPath)

      // Query performance metrics
      const queryStats = await sails.sendNativeQuery(`
        PRAGMA compile_options;
      `)

      return {
        status: health.isHealthy ? 'healthy' : 'unhealthy',
        connection: {
          healthy: health.isHealthy,
          last_check: health.lastCheck,
          error_count: health.errorCount
        },
        database: {
          file_size_bytes: stats.size,
          file_size_mb: Math.round(stats.size / 1024 / 1024),
          modified: stats.mtime,
          wal_mode: true,
          compile_options: queryStats.rows
        },
        timestamp: Date.now()
      }
    } catch (error) {
      throw {
        serverError: {
          status: 'error',
          error: error.message,
          timestamp: Date.now()
        }
      }
    }
  }
}
```

### Automated Health Monitoring

Set up continuous health monitoring:

```javascript
// config/bootstrap.js
module.exports.bootstrap = async function () {
  // Start health monitoring in production
  if (process.env.NODE_ENV === 'production') {
    startHealthMonitoring()
  }

  return
}

function startHealthMonitoring() {
  const dsEntry = sails.datastores.default
  let consecutiveFailures = 0

  setInterval(() => {
    if (!dsEntry.manager.isHealthy()) {
      consecutiveFailures++

      sails.log.error(
        `Database health check failed (${consecutiveFailures} consecutive failures)`
      )

      // Send alert after 3 consecutive failures
      if (consecutiveFailures >= 3) {
        sendHealthAlert({
          type: 'database_unhealthy',
          failures: consecutiveFailures,
          timestamp: Date.now()
        })
      }
    } else {
      if (consecutiveFailures > 0) {
        sails.log.info('Database health restored')
        consecutiveFailures = 0
      }
    }
  }, 30000) // Check every 30 seconds
}

async function sendHealthAlert(alert) {
  // Implement your alerting logic
  console.error('HEALTH ALERT:', alert)

  // Example: Send to monitoring service
  // await fetch('https://your-monitoring-service.com/alerts', {
  //   method: 'POST',
  //   body: JSON.stringify(alert)
  // })
}
```

## Performance Monitoring

### Query Performance Tracking

Monitor query performance in real-time:

```javascript
// lib/performance-monitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      totalQueries: 0,
      slowQueries: 0,
      failedQueries: 0,
      totalQueryTime: 0,
      slowQueryThreshold: 100, // ms
      queryTypeStats: new Map()
    }

    this.recentQueries = []
    this.maxRecentQueries = 100
  }

  trackQuery(sql, time, error = null) {
    this.metrics.totalQueries++
    this.metrics.totalQueryTime += time

    // Track query type
    const queryType = this.getQueryType(sql)
    const typeStats = this.metrics.queryTypeStats.get(queryType) || {
      count: 0,
      totalTime: 0,
      avgTime: 0
    }
    typeStats.count++
    typeStats.totalTime += time
    typeStats.avgTime = typeStats.totalTime / typeStats.count
    this.metrics.queryTypeStats.set(queryType, typeStats)

    // Track slow queries
    if (time > this.metrics.slowQueryThreshold) {
      this.metrics.slowQueries++
      sails.log.warn(`SLOW QUERY (${time}ms):`, sql.substring(0, 200))
    }

    // Track failed queries
    if (error) {
      this.metrics.failedQueries++
      sails.log.error(`FAILED QUERY (${time}ms):`, sql.substring(0, 200), error)
    }

    // Store recent queries
    this.recentQueries.push({
      sql: sql.substring(0, 500),
      time,
      error: error ? error.message : null,
      timestamp: Date.now()
    })

    if (this.recentQueries.length > this.maxRecentQueries) {
      this.recentQueries.shift()
    }
  }

  getQueryType(sql) {
    const normalizedSql = sql.trim().toLowerCase()
    if (normalizedSql.startsWith('select')) return 'SELECT'
    if (normalizedSql.startsWith('insert')) return 'INSERT'
    if (normalizedSql.startsWith('update')) return 'UPDATE'
    if (normalizedSql.startsWith('delete')) return 'DELETE'
    if (normalizedSql.startsWith('create')) return 'CREATE'
    if (normalizedSql.startsWith('drop')) return 'DROP'
    if (normalizedSql.startsWith('pragma')) return 'PRAGMA'
    return 'OTHER'
  }

  getMetrics() {
    return {
      ...this.metrics,
      averageQueryTime:
        this.metrics.totalQueries > 0
          ? Math.round(
              (this.metrics.totalQueryTime / this.metrics.totalQueries) * 100
            ) / 100
          : 0,
      slowQueryPercentage:
        this.metrics.totalQueries > 0
          ? Math.round(
              (this.metrics.slowQueries / this.metrics.totalQueries) * 10000
            ) / 100
          : 0,
      errorRate:
        this.metrics.totalQueries > 0
          ? Math.round(
              (this.metrics.failedQueries / this.metrics.totalQueries) * 10000
            ) / 100
          : 0,
      queryTypeStats: Object.fromEntries(this.metrics.queryTypeStats)
    }
  }

  getRecentQueries(count = 10) {
    return this.recentQueries.slice(-count).reverse()
  }

  reset() {
    this.metrics = {
      totalQueries: 0,
      slowQueries: 0,
      failedQueries: 0,
      totalQueryTime: 0,
      slowQueryThreshold: 100,
      queryTypeStats: new Map()
    }
    this.recentQueries = []
  }
}

module.exports = new PerformanceMonitor()
```

Enable performance monitoring:

```javascript
// config/datastores.js
const performanceMonitor = require('../lib/performance-monitor')

module.exports.datastores = {
  default: {
    adapter: 'sails-sqlite',
    url: process.env.DATABASE_URL || 'db/production.sqlite',

    // Enable query performance tracking
    verbose:
      process.env.NODE_ENV === 'development'
        ? console.log
        : (sql, timing) => {
            performanceMonitor.trackQuery(sql, timing)
          }
  }
}
```

### Performance Metrics Endpoint

Expose performance metrics via API:

```javascript
// api/controllers/metrics/performance.js
const performanceMonitor = require('../../../lib/performance-monitor')

module.exports = {
  friendlyName: 'Get performance metrics',

  description: 'Retrieve database performance metrics and recent queries.',

  exits: {
    success: {
      description: 'Performance metrics retrieved successfully.'
    }
  },

  fn: async function () {
    const metrics = performanceMonitor.getMetrics()
    const recentQueries = performanceMonitor.getRecentQueries(20)

    return {
      performance: metrics,
      recent_queries: recentQueries,
      timestamp: Date.now()
    }
  }
}
```

```javascript
// api/controllers/metrics/stats.js
module.exports = {
  friendlyName: 'Get database statistics',

  description:
    'Retrieve comprehensive database statistics including table info and file sizes.',

  exits: {
    success: {
      description: 'Database statistics retrieved successfully.'
    },
    serverError: {
      statusCode: 500,
      description: 'Server error occurred while retrieving stats.'
    }
  },

  fn: async function () {
    try {
      // Table statistics
      const tableStats = await sails.sendNativeQuery(`
        SELECT 
          name as table_name,
          (SELECT COUNT(*) FROM sqlite_master WHERE type='index' AND tbl_name=m.name) as index_count
        FROM sqlite_master m 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
      `)

      // Get row counts for each table
      const tablesWithCounts = []
      for (const table of tableStats.rows) {
        try {
          const countResult = await sails.sendNativeQuery(`
            SELECT COUNT(*) as row_count FROM "${table.table_name}"
          `)
          tablesWithCounts.push({
            ...table,
            row_count: countResult.rows[0].row_count
          })
        } catch (error) {
          tablesWithCounts.push({
            ...table,
            row_count: 'error',
            error: error.message
          })
        }
      }

      // Database file info
      const fs = require('fs')
      const dsEntry = sails.datastores.default
      const dbPath = dsEntry.config.url
      const fileStats = fs.statSync(dbPath)

      // WAL file info
      let walStats = null
      try {
        const walPath = `${dbPath}-wal`
        walStats = fs.statSync(walPath)
      } catch (error) {
        // WAL file might not exist
      }

      return {
        database: {
          file_size_mb: Math.round(fileStats.size / 1024 / 1024),
          wal_size_mb: walStats ? Math.round(walStats.size / 1024 / 1024) : 0,
          last_modified: fileStats.mtime,
          table_count: tableStats.rows.length
        },
        tables: tablesWithCounts,
        timestamp: Date.now()
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

```javascript
// api/controllers/metrics/system.js
module.exports = {
  friendlyName: 'Get system metrics',

  description: 'Retrieve system resource usage including memory and CPU.',

  exits: {
    success: {
      description: 'System metrics retrieved successfully.'
    },
    serverError: {
      statusCode: 500,
      description: 'Server error occurred while retrieving system metrics.'
    }
  },

  fn: async function () {
    try {
      const process = require('process')

      // Memory usage
      const memUsage = process.memoryUsage()

      // Return metrics synchronously (CPU sampling would complicate actions2 pattern)
      return {
        memory: {
          rss_mb: Math.round(memUsage.rss / 1024 / 1024),
          heap_used_mb: Math.round(memUsage.heapUsed / 1024 / 1024),
          heap_total_mb: Math.round(memUsage.heapTotal / 1024 / 1024),
          external_mb: Math.round(memUsage.external / 1024 / 1024)
        },
        uptime_seconds: Math.round(process.uptime()),
        pid: process.pid,
        timestamp: Date.now()
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

## Database Maintenance Monitoring

### Automated Maintenance Tasks

```javascript
// lib/maintenance-monitor.js
class MaintenanceMonitor {
  constructor() {
    this.lastMaintenance = {
      analyze: null,
      vacuum: null,
      optimize: null,
      checkpoint: null
    }

    this.maintenanceSchedule = {
      analyze: 60 * 60 * 1000, // 1 hour
      checkpoint: 10 * 60 * 1000, // 10 minutes
      vacuum: 24 * 60 * 60 * 1000, // 24 hours
      optimize: 7 * 24 * 60 * 60 * 1000 // 7 days
    }

    this.startScheduler()
  }

  startScheduler() {
    // Analyze statistics regularly
    setInterval(() => {
      this.runMaintenance('analyze')
    }, this.maintenanceSchedule.analyze)

    // Checkpoint WAL regularly
    setInterval(() => {
      this.runMaintenance('checkpoint')
    }, this.maintenanceSchedule.checkpoint)

    // Vacuum daily (during low traffic hours)
    setInterval(
      () => {
        const hour = new Date().getHours()
        if (hour >= 2 && hour <= 4) {
          // 2-4 AM
          this.runMaintenance('vacuum')
        }
      },
      60 * 60 * 1000
    ) // Check every hour

    // Full optimize weekly
    setInterval(
      () => {
        const now = new Date()
        if (now.getDay() === 0 && now.getHours() === 3) {
          // Sunday 3 AM
          this.runMaintenance('optimize')
        }
      },
      60 * 60 * 1000
    ) // Check every hour
  }

  async runMaintenance(type) {
    const start = Date.now()

    try {
      const dsEntry = sails.datastores.default

      switch (type) {
        case 'analyze':
          dsEntry.manager.analyze()
          break

        case 'checkpoint':
          dsEntry.manager.checkpoint()
          break

        case 'vacuum':
          dsEntry.manager.vacuum()
          break

        case 'optimize':
          dsEntry.manager.optimize()
          break

        default:
          throw new Error(`Unknown maintenance type: ${type}`)
      }

      const duration = Date.now() - start
      this.lastMaintenance[type] = {
        timestamp: Date.now(),
        duration,
        success: true
      }

      sails.log.info(
        `Maintenance ${type} completed successfully in ${duration}ms`
      )
    } catch (error) {
      const duration = Date.now() - start
      this.lastMaintenance[type] = {
        timestamp: Date.now(),
        duration,
        success: false,
        error: error.message
      }

      sails.log.error(`Maintenance ${type} failed after ${duration}ms:`, error)
    }
  }

  getStatus() {
    return {
      last_maintenance: this.lastMaintenance,
      schedule: this.maintenanceSchedule,
      next_scheduled: this.getNextScheduledMaintenance()
    }
  }

  getNextScheduledMaintenance() {
    const now = Date.now()
    const next = {}

    for (const [type, interval] of Object.entries(this.maintenanceSchedule)) {
      const last = this.lastMaintenance[type]
      if (last) {
        next[type] = new Date(last.timestamp + interval)
      } else {
        next[type] = new Date(now + interval)
      }
    }

    return next
  }
}

module.exports = new MaintenanceMonitor()
```

## Error Monitoring and Alerting

### Error Tracking

```javascript
// lib/error-monitor.js
class ErrorMonitor {
  constructor() {
    this.errors = []
    this.maxErrors = 1000
    this.alertThresholds = {
      error_rate: 5, // Alert if error rate > 5%
      consecutive_errors: 10 // Alert after 10 consecutive errors
    }
    this.consecutiveErrors = 0
  }

  logError(error, context = {}) {
    const errorEntry = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: Date.now()
    }

    this.errors.push(errorEntry)
    this.consecutiveErrors++

    // Trim old errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    // Check for alert conditions
    this.checkAlertConditions()

    // Log error
    sails.log.error('Database error:', error, context)
  }

  logSuccess() {
    this.consecutiveErrors = 0
  }

  checkAlertConditions() {
    // Check consecutive errors
    if (this.consecutiveErrors >= this.alertThresholds.consecutive_errors) {
      this.sendAlert({
        type: 'consecutive_errors',
        count: this.consecutiveErrors,
        recent_errors: this.errors.slice(-5)
      })
    }

    // Check error rate (last 100 operations)
    if (this.errors.length >= 20) {
      const recentErrors = this.errors.slice(-100)
      const errorRate = (recentErrors.length / 100) * 100

      if (errorRate > this.alertThresholds.error_rate) {
        this.sendAlert({
          type: 'high_error_rate',
          rate: errorRate,
          recent_errors: recentErrors.slice(-5)
        })
      }
    }
  }

  async sendAlert(alert) {
    // Implement your alerting logic here
    console.error('DATABASE ALERT:', alert)

    // Example integrations:
    // - Send to Slack
    // - Email notification
    // - PagerDuty
    // - Datadog
  }

  getErrorStats() {
    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000
    const oneDayAgo = now - 24 * 60 * 60 * 1000

    const recentErrors = this.errors.filter((e) => e.timestamp > oneHourAgo)
    const dailyErrors = this.errors.filter((e) => e.timestamp > oneDayAgo)

    return {
      total_errors: this.errors.length,
      recent_errors_1h: recentErrors.length,
      recent_errors_24h: dailyErrors.length,
      consecutive_errors: this.consecutiveErrors,
      last_error:
        this.errors.length > 0 ? this.errors[this.errors.length - 1] : null
    }
  }
}

module.exports = new ErrorMonitor()
```

## Logging and Observability

### Structured Logging

```javascript
// lib/db-logger.js
const winston = require('winston')

const dbLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'sails-sqlite' },
  transports: [
    new winston.transports.File({
      filename: 'logs/database-error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/database-combined.log'
    })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  dbLogger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
}

module.exports = dbLogger
```

### Integration with Monitoring Services

```javascript
// lib/monitoring-integration.js
class MonitoringIntegration {
  // DataDog integration
  static sendToDataDog(metrics) {
    if (!process.env.DATADOG_API_KEY) return

    const StatsD = require('node-statsd')
    const client = new StatsD({
      host: process.env.DATADOG_HOST || 'localhost',
      port: process.env.DATADOG_PORT || 8125
    })

    // Send database metrics
    client.gauge('database.query.avg_time', metrics.averageQueryTime)
    client.gauge('database.query.slow_percentage', metrics.slowQueryPercentage)
    client.gauge('database.query.error_rate', metrics.errorRate)
    client.increment('database.query.total', metrics.totalQueries)
  }

  // Prometheus integration
  static exposePrometheusMetrics() {
    const prometheus = require('prom-client')

    const queryDuration = new prometheus.Histogram({
      name: 'sqlite_query_duration_seconds',
      help: 'Duration of SQLite queries',
      labelNames: ['query_type']
    })

    const queryCounter = new prometheus.Counter({
      name: 'sqlite_queries_total',
      help: 'Total number of SQLite queries',
      labelNames: ['query_type', 'status']
    })

    return { queryDuration, queryCounter }
  }

  // Generic webhook integration
  static async sendWebhook(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.statusText}`)
      }
    } catch (error) {
      sails.log.error('Webhook send failed:', error)
    }
  }
}

module.exports = MonitoringIntegration
```

This comprehensive monitoring setup provides:

1. **Health Monitoring**: Real-time database health checks
2. **Performance Tracking**: Query performance and system metrics
3. **Error Monitoring**: Error tracking and alerting
4. **Maintenance Monitoring**: Automated maintenance task scheduling
5. **Observability**: Structured logging and monitoring service integration

The monitoring system is designed to be production-ready and can be easily integrated with popular monitoring and alerting platforms.
