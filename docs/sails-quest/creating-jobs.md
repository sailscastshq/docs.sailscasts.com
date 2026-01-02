---
title: Creating Jobs
description: Learn how to create scheduled jobs with Quest
prev:
  text: Configuration
  link: /sails-quest/configuration
next:
  text: Scheduling
  link: /sails-quest/scheduling
---

# Creating Jobs

Quest jobs are Sails scripts that run on a schedule. They have full access to your models, helpers, and configurations.

## Creating a New Job

Use the Sails CLI to generate a new script:

```bash
npx sails generate script cleanup-sessions
```

This creates a new file at `scripts/cleanup-sessions.js` with the basic structure:

```javascript
module.exports = {
  friendlyName: 'Cleanup sessions',
  description: '',
  inputs: {},
  fn: async function (inputs) {
    // Your code here
  }
}
```

Then add the `quest` configuration to make it a scheduled job:

## Basic Job Structure

Here's a complete Quest job:

```javascript
// scripts/cleanup-sessions.js
module.exports = {
  friendlyName: 'Cleanup old sessions',
  description: 'Remove expired sessions from the database',

  // Quest configuration
  quest: {
    interval: '1 hour'
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

## Quest Configuration Block

The `quest` object in your script defines the scheduling:

```javascript
quest: {
  // Run every 30 minutes
  interval: '30 minutes',

  // Or use a cron expression
  cron: '0 */2 * * *',

  // Allow concurrent runs (default is prevented)
  withoutOverlapping: false
}
```

## Using Models and Helpers

Jobs have full access to Sails features:

```javascript
// scripts/send-weekly-newsletter.js
module.exports = {
  friendlyName: 'Send weekly newsletter',

  quest: {
    cron: '0 9 * * MON' // Every Monday at 9 AM
  },

  fn: async function () {
    // Use models
    const subscribers = await User.find({
      subscribed: true,
      emailVerified: true
    })

    // Use helpers
    for (const user of subscribers) {
      await sails.helpers.sendEmail.with({
        to: user.email,
        template: 'newsletter',
        subject: 'Weekly Newsletter',
        templateData: {
          userName: user.fullName
        }
      })
    }

    return { sent: subscribers.length }
  }
}
```

## Job Inputs

Jobs can accept inputs with default values:

```javascript
// scripts/process-uploads.js
module.exports = {
  friendlyName: 'Process upload queue',

  quest: {
    interval: '5 minutes'
    // withoutOverlapping defaults to true, preventing concurrent runs
  },

  inputs: {
    batchSize: {
      type: 'number',
      defaultsTo: 10,
      description: 'Number of uploads to process'
    },

    priority: {
      type: 'string',
      isIn: ['high', 'normal', 'low'],
      defaultsTo: 'normal'
    }
  },

  fn: async function (inputs) {
    const uploads = await Upload.find({
      status: 'pending',
      priority: inputs.priority
    })
      .limit(inputs.batchSize)
      .sort('createdAt ASC')

    // Process uploads...

    return { processed: uploads.length }
  }
}
```

## Error Handling

Jobs should handle errors gracefully:

```javascript
// scripts/sync-inventory.js
module.exports = {
  friendlyName: 'Sync inventory with external API',

  quest: {
    interval: '30 minutes'
    // Concurrent runs are prevented by default
  },

  fn: async function () {
    try {
      const response = await fetch(sails.config.custom.inventoryApiUrl, {
        headers: {
          Authorization: `Bearer ${sails.config.custom.apiKey}`
        }
      })

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }

      const data = await response.json()

      // Process data...

      return { synced: data.length }
    } catch (error) {
      sails.log.error('Inventory sync failed:', error)

      // Optionally send alert
      await sails.helpers.sendAlert({
        type: 'sync_failure',
        error: error.message
      })

      throw error // Re-throw to trigger quest:job:error event
    }
  }
}
```

## Conditional Execution

Skip job execution based on conditions:

```javascript
// scripts/backup-database.js
module.exports = {
  friendlyName: 'Backup database',

  quest: {
    cron: '0 3 * * *' // Daily at 3 AM
  },

  fn: async function () {
    // Check if backups are enabled
    const settings = await Settings.findOne({ key: 'backups_enabled' })
    if (!settings?.value) {
      sails.log.info('Backups disabled, skipping...')
      return { skipped: true }
    }

    // Check if it's the weekend (skip on weekends)
    const day = new Date().getDay()
    if (day === 0 || day === 6) {
      return { skipped: true, reason: 'weekend' }
    }

    // Proceed with backup
    const result = await sails.helpers.performBackup()

    return result
  }
}
```

## Long-Running Jobs

For jobs that take a long time:

```javascript
// scripts/generate-reports.js
module.exports = {
  friendlyName: 'Generate monthly reports',

  quest: {
    cron: '0 2 1 * *' // First day of month at 2 AM
    // withoutOverlapping defaults to true - essential for long-running jobs
  },

  fn: async function () {
    const startTime = Date.now()

    // Process in batches to avoid memory issues
    const BATCH_SIZE = 100
    let processed = 0
    let hasMore = true

    while (hasMore) {
      const users = await User.find().skip(processed).limit(BATCH_SIZE)

      if (users.length === 0) {
        hasMore = false
        break
      }

      for (const user of users) {
        await generateUserReport(user)
      }

      processed += users.length
      sails.log.info(`Processed ${processed} users...`)
    }

    return {
      processed,
      duration: Date.now() - startTime
    }
  }
}
```

## Running Scripts Without Scheduling

Quest can run ANY Sails script programmatically, even without quest metadata:

```javascript
// scripts/one-time-task.js - No quest config needed!
module.exports = {
  friendlyName: 'One-time task',

  inputs: {
    userId: {
      type: 'number',
      required: true
    }
  },

  fn: async function ({ userId }) {
    const user = await User.findOne({ id: userId })
    // Do something with user...
    return { processed: user.email }
  }
}

// Run it programmatically from anywhere in your app:
await sails.quest.run('one-time-task', { userId: 123 })
```

This is useful for:

- Running scripts from controllers or helpers
- Triggering tasks based on user actions
- Testing scripts before adding scheduling
- One-time administrative tasks

## Best Practices

1. **Generate scripts with CLI** - Use `sails generate script <name>` for consistency

2. **Use descriptive names** - Name your job files clearly (e.g., `cleanup-old-sessions.js`)

3. **Add friendly names and descriptions** - Help future developers understand the job's purpose

4. **Use withoutOverlapping** - Prevent concurrent runs for jobs that shouldn't overlap

5. **Return meaningful data** - Return statistics or results for monitoring

6. **Handle errors gracefully** - Log errors and optionally send alerts

7. **Keep jobs focused** - Each job should do one thing well

8. **Consider performance** - Use pagination for large datasets

9. **Test locally** - Run jobs manually with `sails.quest.run('job-name')` before deploying
