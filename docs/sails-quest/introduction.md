---
title: Introduction to Job Scheduling
description: Understanding job scheduling, background tasks, and why your application needs them
prev:
  text: Sails Quest
  link: /sails-quest/
next:
  text: How Quest Works
  link: /sails-quest/how-it-works
---

# Introduction to Job Scheduling

If you're coming from frontend JavaScript or even basic Node.js development, job scheduling might be a new concept. Let's explore what it is, why you need it, and how it transforms your application's capabilities.

## What is Job Scheduling?

Job scheduling is the practice of running code automatically at specific times or intervals, without user interaction. Think of it as setting multiple alarms for your code - each alarm triggers a specific task to run.

In the simplest terms:

- A **job** is a piece of code that performs a specific task
- **Scheduling** means running that job automatically based on time rules
- The **scheduler** is the system that manages when jobs run

## Why Do Applications Need Job Scheduling?

As applications grow, you'll encounter tasks that shouldn't run immediately during a user request. Here's why:

### 1. Performance and User Experience

Imagine a user uploading a video to your platform. Processing that video (transcoding, generating thumbnails, extracting metadata) might take minutes. You can't make the user wait - instead, you accept the upload and schedule the processing as a background job.

```javascript
// api/controllers/videos/upload.js
// Without job scheduling (BAD - user waits)
module.exports = {
  friendlyName: 'Upload video',

  files: ['video'],

  fn: async function ({ video }) {
    const savedVideo = await Video.create({
      filename: video.filename,
      size: video.size
    }).fetch()

    await sails.helpers.transcodeVideo(savedVideo.id) // Takes 5 minutes!
    await sails.helpers.generateThumbnails(savedVideo.id) // Takes 2 minutes!
    await sails.helpers.extractMetadata(savedVideo.id) // Takes 1 minute!

    return { success: true } // User waited 8 minutes!
  }
}

// With job scheduling (GOOD - user gets instant response)
module.exports = {
  friendlyName: 'Upload video',

  files: ['video'],

  fn: async function ({ video }) {
    const savedVideo = await Video.create({
      filename: video.filename,
      size: video.size,
      status: 'processing'
    }).fetch()

    // Queue the processing job
    await sails.quest.run('process-video', {
      videoId: savedVideo.id
    })

    return { success: true, videoId: savedVideo.id } // Instant response!
  }
}
```

### 2. Recurring Maintenance Tasks

Every application needs housekeeping. Old logs need deletion, expired sessions need cleanup, backups need creation. These tasks should run automatically without manual intervention.

```javascript
// scripts/cleanup-sessions.js
module.exports = {
  friendlyName: 'Cleanup expired sessions',

  quest: {
    cron: '0 2 * * *' // Runs automatically at 2 AM daily
  },

  fn: async function () {
    const deleted = await Session.destroy({
      expiresAt: { '<': new Date() }
    }).fetch()

    return { deleted: deleted.length }
  }
}
```

### 3. Time-Based Business Logic

Many business requirements are inherently time-based:

- Send weekly newsletters every Monday
- Generate monthly invoices on the 1st
- Check for abandoned shopping carts every hour
- Send reminder emails 24 hours before appointments

### 4. External API Synchronization

APIs have rate limits and availability windows. Job scheduling lets you:

- Sync data with external services at optimal times
- Respect API rate limits by spreading requests
- Retry failed API calls without blocking users

## Common Job Scheduling Patterns

### Periodic Tasks

Tasks that run at regular intervals:

```javascript
// scripts/check-orders.js
module.exports = {
  friendlyName: 'Check pending orders',

  quest: {
    interval: '5 minutes' // Check for new orders every 5 minutes
  },

  fn: async function () {
    const orders = await Order.find({ status: 'pending' })
    // Process orders...
    return { processed: orders.length }
  }
}
```

### Scheduled Tasks

Tasks that run at specific times:

```javascript
// scripts/weekly-newsletter.js
module.exports = {
  friendlyName: 'Send weekly newsletter',

  quest: {
    cron: '0 9 * * MON' // Every Monday at 9 AM
  },

  fn: async function () {
    const subscribers = await User.find({ subscribed: true })
    for (const user of subscribers) {
      await sails.helpers.sendEmail.with({
        template: 'newsletter',
        to: user.email
      })
    }
    return { sent: subscribers.length }
  }
}
```

## How Job Scheduling Works

### The Event Loop vs Background Jobs

JavaScript's event loop handles asynchronous operations, but it's not designed for scheduling. The event loop processes what's ready NOW, while job schedulers manage what should run WHEN.

```javascript
// Event loop (immediate or as soon as possible)
setTimeout(() => console.log('Run once after 5 seconds'), 5000)

// Job scheduler (recurring, persistent, managed)
// scripts/heartbeat.js
module.exports = {
  friendlyName: 'Heartbeat',

  quest: {
    interval: '5 seconds' // Runs forever, every 5 seconds
    // withoutOverlapping defaults to true for managed execution
  },

  fn: async function () {
    await Health.create({ timestamp: new Date() })
    return { beat: 'alive' }
  }
}
```

### Process Isolation

Jobs often run in separate processes to:

- Prevent memory leaks from affecting your main app
- Allow jobs to fail without crashing your server
- Enable parallel execution of multiple jobs
- Provide clean startup/shutdown for each job

## Real-World Examples

### E-commerce Platform

```javascript
// scripts/archive-orders.js - Daily at 2 AM
module.exports = {
  friendlyName: 'Archive old orders',
  quest: { cron: '0 2 * * *' },
  fn: async function () {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const archived = await Order.update(
      { completedAt: { '<': sixMonthsAgo }, status: 'completed' },
      { archived: true }
    ).fetch()

    return { archived: archived.length }
  }
}

// scripts/abandoned-carts.js - Every hour
module.exports = {
  friendlyName: 'Send abandoned cart reminders',
  quest: { interval: '1 hour' },
  fn: async function () {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const carts = await Cart.find({
      updatedAt: { '<': yesterday },
      reminderSent: false
    }).populate('user')

    for (const cart of carts) {
      await sails.helpers.sendEmail.with({
        template: 'abandoned-cart',
        to: cart.user.email,
        templateData: { items: cart.items }
      })
      await Cart.updateOne({ id: cart.id }).set({ reminderSent: true })
    }

    return { sent: carts.length }
  }
}
```

### SaaS Application

```javascript
// scripts/calculate-usage.js - Daily
module.exports = {
  friendlyName: 'Calculate usage metrics',
  quest: { cron: '0 1 * * *' },
  fn: async function () {
    const accounts = await Account.find()

    for (const account of accounts) {
      const usage = await ApiCall.count({
        accountId: account.id,
        createdAt: { '>': new Date(Date.now() - 24 * 60 * 60 * 1000) }
      })

      await Account.updateOne({ id: account.id }).set({
        dailyUsage: usage,
        monthlyUsage: account.monthlyUsage + usage
      })
    }

    return { processed: accounts.length }
  }
}

// scripts/check-trials.js - Every hour
module.exports = {
  friendlyName: 'Check for expired trials',
  quest: { interval: '1 hour' },
  fn: async function () {
    const expiredTrials = await Account.find({
      plan: 'trial',
      trialEndsAt: { '<': new Date() },
      notified: false
    })

    for (const account of expiredTrials) {
      await sails.helpers.sendEmail.with({
        template: 'trial-expired',
        to: account.email
      })
      await Account.updateOne({ id: account.id }).set({ notified: true })
    }

    return { notified: expiredTrials.length }
  }
}
```

## Common Misconceptions

### "I can just use setTimeout/setInterval"

While `setTimeout` and `setInterval` work for simple cases, they have limitations:

- They don't persist across server restarts
- They don't prevent overlapping executions
- They provide no error recovery
- They can't handle complex scheduling patterns
- They run in the main process, potentially blocking

### "Cron is too complicated"

Cron expressions look cryptic at first:

```
0 2 * * * = "At 2:00 AM every day"
```

But Quest also supports human-readable intervals:

```javascript
quest: {
  interval: '2 hours',       // Clear and simple
  interval: '30 minutes',    // No cron needed
  cron: '0 2 * * *'         // Still supported for precision
}
```

### "Jobs are only for big applications"

Even small applications benefit from jobs:

- A blog needs to generate RSS feeds
- A portfolio site needs to purge old contact form submissions
- A small e-commerce site needs to send order confirmations

## Job Scheduling vs Queues

These are related but different concepts:

**Job Scheduling**: WHEN to run tasks

- "Run cleanup every night at 2 AM"
- Time-based triggering
- Recurring or one-time
- Example: Quest, node-cron

**Message Queues**: WHAT tasks to process

- "Process these 1000 emails"
- Event-based triggering
- Work distribution
- Example: Bull, RabbitMQ

Often used together:

```javascript
// scripts/process-email-queue.js
module.exports = {
  friendlyName: 'Process email queue',

  quest: {
    interval: '5 minutes' // Scheduler: WHEN to check
  },

  fn: async function () {
    // Queue: WHAT to process
    const emails = await EmailQueue.find({
      status: 'pending'
    }).limit(100)

    for (const email of emails) {
      await sails.helpers.sendEmail.with(email.data)
      await EmailQueue.updateOne({ id: email.id }).set({
        status: 'sent',
        sentAt: new Date()
      })
    }

    return { processed: emails.length }
  }
}
```

## When You Need Job Scheduling

You need job scheduling when you have:

- Tasks that take too long for HTTP requests (>5 seconds)
- Recurring maintenance or cleanup needs
- Time-sensitive business logic
- External API integrations
- Report generation
- Email campaigns
- Data synchronization
- Backup requirements
- Media processing
- Cache warming/clearing

## The Quest Approach

Quest brings job scheduling to Sails.js with a philosophy of simplicity and power:

1. **Full Sails Context**: Jobs have access to all your models, helpers, and services
2. **Simple API**: Define jobs like any other Sails script using actions2
3. **Flexible Scheduling**: Use cron or human-readable intervals
4. **Event-Driven**: Monitor jobs with built-in events
5. **No External Dependencies**: No separate job server needed

```javascript
// scripts/example-job.js
module.exports = {
  friendlyName: 'Example job',
  description: 'Shows the simplicity of Quest',

  quest: {
    interval: '1 hour'
    // Overlapping prevented by default
  },

  inputs: {
    limit: {
      type: 'number',
      defaultsTo: 100
    }
  },

  fn: async function ({ limit }) {
    // Full access to Sails
    const records = await MyModel.find().limit(limit)

    // Use helpers
    await sails.helpers.processRecords(records)

    // Return meaningful data
    return { processed: records.length }
  }
}
```

## Next Steps

Now that you understand job scheduling, you're ready to:

1. [Get Started](/sails-quest/getting-started) with Quest installation
2. [Create your first job](/sails-quest/creating-jobs)
3. [Learn scheduling patterns](/sails-quest/scheduling)
4. [Manage jobs programmatically](/sails-quest/job-management)

Job scheduling transforms your application from reactive (responding to requests) to proactive (automatically maintaining and improving itself). It's a fundamental pattern for building robust, production-ready applications.
