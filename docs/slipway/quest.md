---
head:
  - - meta
    - property: 'og:image'
      content: https://docs.sailscasts.com/slipway-social.png
title: Quest
titleTemplate: Slipway
description: Manage scheduled jobs in your Sails applications. View, run, pause, and resume jobs from the Slipway dashboard.
prev:
  text: Content
  link: /slipway/content
next:
  text: Dock
  link: /slipway/dock
editLink: true
---

# Quest

Quest is a **job scheduler dashboard** for your [sails-hook-quest](https://docs.sailscasts.com/sails-quest) powered applications. View scheduled jobs, trigger manual runs, and control job execution—all from the Slipway dashboard.

## What is Quest?

Quest provides a web-based interface for managing your scheduled jobs:

- **View all jobs** - See every scheduled job with its schedule and status
- **Run jobs manually** - Trigger immediate execution of any job
- **Pause/Resume** - Control which jobs are running
- **Monitor status** - See if jobs are currently executing

No SSH access needed—manage your background jobs from the dashboard.

## Requirements

Quest is available when your app uses [sails-hook-quest](https://docs.sailscasts.com/sails-quest):

```bash
npm install sails-hook-quest
```

Slipway automatically detects `sails-hook-quest` during deployment and enables the Quest feature.

## Accessing Quest

### Via Dashboard

1. Go to your project in Slipway
2. Select an environment and click the app name from the Apps list
3. Click the ellipsis dropdown menu and select **Quest**
4. View and manage your jobs

### Via Direct URL

```
https://your-slipway-instance.com/projects/myapp/quest
```

Or with a specific environment:

```
https://your-slipway-instance.com/projects/myapp/environments/staging/quest
```

## Job Dashboard

The Quest dashboard shows all scheduled jobs:

```
┌─────────────────────────────────────────────────────────────────┐
│ Quest                                      sails-hook-quest     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ cleanup-sessions                           Active    no overlap │
│ Remove expired sessions from the database                       │
│ ⏱ every 1 hour                                                  │
│                                        [Run now]  [Pause]       │
│                                                                 │
│ send-newsletter                            Paused               │
│ Send weekly newsletter to subscribers                           │
│ ⏱ cron: 0 9 * * MON                                             │
│                                        [Run now]  [Resume]      │
│                                                                 │
│ process-uploads                            Running              │
│ Process pending file uploads                                    │
│ ⏱ every 2 minutes                                               │
│                                        [Running...]             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Job Information

Each job displays:

| Field           | Description                                  |
| --------------- | -------------------------------------------- |
| **Name**        | The job's friendly name or script name       |
| **Description** | What the job does                            |
| **Schedule**    | Cron expression or interval                  |
| **Status**      | Active, Paused, or Running                   |
| **No overlap**  | Badge shown if concurrent runs are prevented |

### Job Status

| Status      | Description                                              |
| ----------- | -------------------------------------------------------- |
| **Active**  | Job is scheduled and will run at its next scheduled time |
| **Paused**  | Job won't run until resumed                              |
| **Running** | Job is currently executing                               |

## Actions

### Run Now

Trigger immediate execution of a job:

1. Click **Run now** on any job
2. The job starts executing in your app
3. Status updates to "Running" while executing

::: tip
Running a job manually doesn't affect its regular schedule. The job will still run at its next scheduled time.
:::

### Pause

Stop a job from running on schedule:

1. Click **Pause** on an active job
2. Status changes to "Paused"
3. Job won't run until resumed

Pausing is useful for:

- Temporarily stopping resource-intensive jobs
- Debugging job-related issues
- Maintenance windows

### Resume

Re-enable a paused job:

1. Click **Resume** on a paused job
2. Status changes to "Active"
3. Job resumes normal scheduling

## Creating Jobs

Jobs are defined in your Sails app's `scripts/` directory with a `quest` property:

```javascript
// scripts/cleanup-sessions.js
module.exports = {
  friendlyName: 'Cleanup old sessions',
  description: 'Remove expired sessions from the database',

  quest: {
    interval: '1 hour',
    withoutOverlapping: true
  },

  fn: async function () {
    const deleted = await Session.destroy({
      lastActive: {
        '<': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }).fetch()

    sails.log.info(`Cleaned up ${deleted.length} sessions`)
    return { deletedCount: deleted.length }
  }
}
```

### Schedule Options

#### Intervals (Human-Readable)

```javascript
quest: {
  interval: '30 seconds'
  interval: '5 minutes'
  interval: '2 hours'
  interval: '7 days'
}
```

#### Cron Expressions

```javascript
quest: {
  cron: '0 2 * * *' // Daily at 2 AM
  cron: '*/5 * * * *' // Every 5 minutes
  cron: '0 9 * * MON' // Every Monday at 9 AM
}
```

#### One-Time Execution

```javascript
quest: {
  timeout: '10 minutes' // Run once after 10 minutes
}
```

### Overlap Prevention

Prevent concurrent runs of the same job:

```javascript
quest: {
  interval: '5 minutes',
  withoutOverlapping: true  // Skip if already running
}
```

## API Endpoints

Quest provides REST API endpoints for programmatic control:

### List Jobs

```bash
GET /api/v1/projects/:projectSlug/quest/jobs
```

Response:

```json
{
  "jobs": [
    {
      "name": "cleanup-sessions",
      "friendlyName": "Cleanup old sessions",
      "description": "Remove expired sessions",
      "schedule": "1 hour",
      "scheduleType": "interval",
      "paused": false,
      "withoutOverlapping": true,
      "isRunning": false
    }
  ]
}
```

### Run a Job

```bash
POST /api/v1/projects/:projectSlug/quest/jobs/:name/run
```

Optional body:

```json
{
  "inputs": {
    "daysOld": 7
  }
}
```

### Pause a Job

```bash
POST /api/v1/projects/:projectSlug/quest/jobs/:name/pause
```

### Resume a Job

```bash
POST /api/v1/projects/:projectSlug/quest/jobs/:name/resume
```

## Job Examples

### Database Cleanup

```javascript
// scripts/cleanup-old-data.js
module.exports = {
  friendlyName: 'Cleanup old data',
  description: 'Remove records older than 90 days',

  quest: {
    cron: '0 3 * * *', // Daily at 3 AM
    withoutOverlapping: true
  },

  fn: async function () {
    const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

    await AuditLog.destroy({ createdAt: { '<': cutoff } })
    await TempFile.destroy({ createdAt: { '<': cutoff } })

    sails.log.info('Old data cleanup complete')
  }
}
```

### Email Digest

```javascript
// scripts/send-daily-digest.js
module.exports = {
  friendlyName: 'Send daily digest',
  description: 'Send summary email to active users',

  quest: {
    cron: '0 8 * * *', // Daily at 8 AM
    withoutOverlapping: true
  },

  fn: async function () {
    const users = await User.find({
      digestEnabled: true,
      emailVerified: true
    })

    for (const user of users) {
      await sails.helpers.mail.sendDigest(user)
    }

    return { sent: users.length }
  }
}
```

### Queue Processing

```javascript
// scripts/process-queue.js
module.exports = {
  friendlyName: 'Process job queue',
  description: 'Process pending background jobs',

  quest: {
    interval: '30 seconds',
    withoutOverlapping: true
  },

  fn: async function () {
    const pending = await Job.find({
      status: 'pending'
    }).limit(10)

    for (const job of pending) {
      try {
        await sails.helpers.jobs.process(job)
        await Job.updateOne({ id: job.id }).set({ status: 'completed' })
      } catch (err) {
        await Job.updateOne({ id: job.id }).set({
          status: 'failed',
          error: err.message
        })
      }
    }

    return { processed: pending.length }
  }
}
```

## Best Practices

### 1. Always Use `withoutOverlapping`

For jobs that shouldn't run concurrently:

```javascript
quest: {
  interval: '5 minutes',
  withoutOverlapping: true
}
```

### 2. Keep Jobs Idempotent

Jobs should be safe to run multiple times:

```javascript
// Good - checks before acting
const unprocessed = await Order.find({ processed: false })
for (const order of unprocessed) {
  await processOrder(order)
  await Order.updateOne({ id: order.id }).set({ processed: true })
}

// Bad - might double-process
const orders = await Order.find()
for (const order of orders) {
  await processOrder(order) // Might run twice!
}
```

### 3. Add Logging

Log job progress for debugging:

```javascript
fn: async function () {
  sails.log.info('Starting cleanup job')

  const count = await Record.destroy({ old: true }).fetch()

  sails.log.info(`Cleanup complete: ${count.length} records removed`)
  return { removed: count.length }
}
```

### 4. Handle Errors Gracefully

Jobs should catch and log errors:

```javascript
fn: async function () {
  try {
    await riskyOperation()
  } catch (err) {
    sails.log.error('Job failed:', err)
    // Optionally notify admins
    await sails.helpers.mail.sendAlert({
      subject: 'Job failed: cleanup',
      error: err.message
    })
    throw err // Re-throw to mark job as failed
  }
}
```

## Troubleshooting

### Jobs Not Appearing

If jobs don't show in the dashboard:

1. Verify `sails-hook-quest` is in `package.json`
2. Deploy your app (detection happens during deployment)
3. Ensure the app is running
4. Check that scripts have a `quest` property

### Jobs Not Running

If scheduled jobs aren't executing:

1. Check if the job is paused
2. Verify the schedule syntax
3. Check container logs for errors
4. Ensure `autoStart: true` in quest config

### Manual Run Fails

If "Run now" fails:

1. Check the app is running
2. Look at container logs for errors
3. Verify the script exists and has no syntax errors

## What's Next?

- Learn about [sails-hook-quest](https://docs.sailscasts.com/sails-quest) for setting up jobs
- Use [Helm](/slipway/helm) for debugging
- Set up [Auto-Deploy](/slipway/auto-deploy) for continuous deployment
