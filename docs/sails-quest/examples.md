---
title: Examples
description: Real-world examples of Quest in production
prev:
  text: Events
  link: /sails-quest/events
---

# Examples

Real-world examples of using Quest in production applications.

## Database Maintenance

### Clean Up Old Sessions

```javascript
// scripts/cleanup-sessions.js
module.exports = {
  friendlyName: 'Cleanup old sessions',
  description: 'Remove expired sessions from the database',

  quest: {
    cron: '0 2 * * *' // Run daily at 2 AM
    // withoutOverlapping defaults to true
  },

  inputs: {
    daysOld: {
      type: 'number',
      defaultsTo: 30
    }
  },

  fn: async function (inputs) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - inputs.daysOld)

    const deleted = await Session.destroy({
      expiresAt: { '<': cutoffDate }
    }).fetch()

    sails.log.info(`Deleted ${deleted.length} expired sessions`)

    return {
      deletedCount: deleted.length,
      cutoffDate
    }
  }
}
```

### Archive Old Records

```javascript
// scripts/archive-old-records.js
module.exports = {
  friendlyName: 'Archive old records',
  description: 'Move old records to archive table',

  quest: {
    cron: '0 3 * * SUN' // Weekly on Sunday at 3 AM
    // Overlapping prevented by default
  },

  fn: async function () {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    // Find old orders
    const oldOrders = await Order.find({
      status: 'completed',
      completedAt: { '<': sixMonthsAgo }
    })

    // Archive them
    for (const order of oldOrders) {
      await Archive.create({
        type: 'order',
        data: order,
        archivedAt: new Date()
      })

      await Order.destroyOne({ id: order.id })
    }

    return { archivedCount: oldOrders.length }
  }
}
```

## Email Automation

### Send Newsletter

```javascript
// scripts/send-newsletter.js
module.exports = {
  friendlyName: 'Send weekly newsletter',
  description: 'Send newsletter to all subscribed users',

  quest: {
    cron: '0 9 * * MON' // Every Monday at 9 AM
    // Concurrent runs prevented by default
  },

  fn: async function () {
    // Get subscribers
    const subscribers = await User.find({
      subscribed: true,
      emailVerified: true
    })

    // Get this week's content
    const articles = await Article.find({
      publishedAt: {
        '>=': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      status: 'published'
    })
      .sort('views DESC')
      .limit(5)

    let sent = 0
    const errors = []

    // Send to each subscriber
    for (const user of subscribers) {
      try {
        await sails.helpers.sendEmail.with({
          to: user.email,
          subject: 'Your Weekly Newsletter',
          template: 'newsletter',
          templateData: {
            userName: user.fullName,
            articles,
            unsubscribeToken: user.unsubscribeToken
          }
        })
        sent++
      } catch (err) {
        errors.push({ user: user.email, error: err.message })
      }
    }

    return {
      sent,
      failed: errors.length,
      errors
    }
  }
}
```

### Abandoned Cart Reminders

```javascript
// scripts/abandoned-cart-reminder.js
module.exports = {
  friendlyName: 'Send abandoned cart reminders',
  description: 'Email users who have items in cart for over 24 hours',

  quest: {
    interval: '6 hours'
    // Overlapping prevented by default
  },

  fn: async function() {
    const yesterday = new Date(Date.now() - 24*60*60*1000)
    const twoDaysAgo = new Date(Date.now() - 48*60*60*1000)

    // Find abandoned carts (24-48 hours old, not yet reminded)
    const abandonedCarts = await Cart.find({
      updatedAt: {
        '>': twoDaysAgo,
        '<': yesterday
      },
      reminderSent: false,
      items: { '!': [] }
    }).populate('user').populate('items')

    for (const cart of abandonedCarts) {
      if (!cart.user?.email) continue

      await sails.helpers.sendEmail.with({
        to: cart.user.email,
        subject: 'You left something in your cart!',
        template: 'abandoned-cart',
        templateData: {
          userName: cart.user.fullName,
          items: cart.items,
          cartUrl: `${sails.config.custom.baseUrl}/cart`
        }
      })

      await Cart.updateOne({ id: cart.id })
        .set({ reminderSent: true })
    }

    return { remindersS sent: abandonedCarts.length }
  }
}
```

## Data Processing

### Process Upload Queue

```javascript
// scripts/process-uploads.js
module.exports = {
  friendlyName: 'Process upload queue',
  description: 'Process pending file uploads',

  quest: {
    interval: '2 minutes'
    // Concurrent execution prevented by default
  },

  fn: async function () {
    // Get pending uploads
    const pending = await Upload.find({
      status: 'pending'
    })
      .limit(10)
      .sort('createdAt ASC')

    const results = {
      processed: 0,
      failed: 0,
      errors: []
    }

    for (const upload of pending) {
      try {
        // Process based on type
        if (upload.type === 'image') {
          await sails.helpers.processImage(upload)
        } else if (upload.type === 'document') {
          await sails.helpers.processDocument(upload)
        } else if (upload.type === 'video') {
          await sails.helpers.processVideo(upload)
        }

        await Upload.updateOne({ id: upload.id }).set({
          status: 'processed',
          processedAt: new Date()
        })

        results.processed++
      } catch (err) {
        await Upload.updateOne({ id: upload.id }).set({
          status: 'failed',
          error: err.message
        })

        results.failed++
        results.errors.push({
          uploadId: upload.id,
          error: err.message
        })
      }
    }

    return results
  }
}
```

### Generate Reports

```javascript
// scripts/generate-monthly-report.js
module.exports = {
  friendlyName: 'Generate monthly report',
  description: 'Generate and email monthly business reports',

  quest: {
    cron: '0 6 1 * *' // First day of month at 6 AM
    // Long-running job, overlapping prevented by default
  },

  fn: async function () {
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    const startOfMonth = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      1
    )
    const endOfMonth = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth() + 1,
      0
    )

    // Gather metrics
    const metrics = {
      revenue: await Order.sum('total', {
        status: 'completed',
        completedAt: {
          '>=': startOfMonth,
          '<=': endOfMonth
        }
      }),

      newUsers: await User.count({
        createdAt: {
          '>=': startOfMonth,
          '<=': endOfMonth
        }
      }),

      orders: await Order.count({
        createdAt: {
          '>=': startOfMonth,
          '<=': endOfMonth
        }
      })
    }

    // Generate PDF report
    const reportPath = await sails.helpers.generatePdfReport(metrics, {
      month: lastMonth.getMonth() + 1,
      year: lastMonth.getFullYear()
    })

    // Email to stakeholders
    const stakeholders = await User.find({ role: 'admin' })

    for (const user of stakeholders) {
      await sails.helpers.sendEmail.with({
        to: user.email,
        subject: `Monthly Report - ${lastMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
        template: 'monthly-report',
        attachments: [
          {
            filename: 'monthly-report.pdf',
            path: reportPath
          }
        ],
        templateData: metrics
      })
    }

    return {
      metrics,
      sentTo: stakeholders.length
    }
  }
}
```

## External Integrations

### Sync with External API

```javascript
// scripts/sync-inventory.js
module.exports = {
  friendlyName: 'Sync inventory',
  description: 'Sync inventory levels with external warehouse API',

  quest: {
    interval: '30 minutes'
    // External API sync - overlapping prevented by default
  },

  fn: async function () {
    const apiUrl = sails.config.custom.warehouseApiUrl
    const apiKey = sails.config.custom.warehouseApiKey

    // Fetch inventory from external API
    const response = await fetch(`${apiUrl}/inventory`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }

    const externalInventory = await response.json()

    let updated = 0
    let created = 0

    // Sync with local database
    for (const item of externalInventory) {
      const existing = await Product.findOne({
        sku: item.sku
      })

      if (existing) {
        await Product.updateOne({ id: existing.id }).set({
          stock: item.quantity,
          lastSyncedAt: new Date()
        })
        updated++
      } else {
        await Product.create({
          sku: item.sku,
          name: item.name,
          stock: item.quantity,
          lastSyncedAt: new Date()
        })
        created++
      }
    }

    return { updated, created }
  }
}
```

### Health Checks

```javascript
// scripts/health-check.js
module.exports = {
  friendlyName: 'Health check',
  description: 'Monitor application and external service health',

  quest: {
    interval: '5 minutes'
  },

  fn: async function () {
    const checks = {
      database: false,
      redis: false,
      externalApi: false,
      storage: false
    }

    // Check database
    try {
      await User.count()
      checks.database = true
    } catch (err) {
      sails.log.error('Database health check failed:', err)
    }

    // Check Redis
    try {
      await sails.helpers.redis.ping()
      checks.redis = true
    } catch (err) {
      sails.log.error('Redis health check failed:', err)
    }

    // Check external API
    try {
      const response = await fetch(sails.config.custom.apiHealthUrl)
      checks.externalApi = response.ok
    } catch (err) {
      sails.log.error('External API health check failed:', err)
    }

    // Check storage
    try {
      const testFile = `.health-check-${Date.now()}.txt`
      await sails.helpers.fs.writeFile(testFile, 'test')
      await sails.helpers.fs.deleteFile(testFile)
      checks.storage = true
    } catch (err) {
      sails.log.error('Storage health check failed:', err)
    }

    // Alert if any checks failed
    const failed = Object.entries(checks)
      .filter(([_, status]) => !status)
      .map(([service]) => service)

    if (failed.length > 0) {
      await sails.helpers.sendAlert({
        type: 'health_check_failure',
        services: failed,
        timestamp: new Date()
      })
    }

    return checks
  }
}
```
