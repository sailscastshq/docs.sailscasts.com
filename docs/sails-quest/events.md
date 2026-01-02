---
title: Events
description: Monitor and respond to job lifecycle events
prev:
  text: Job Management
  link: /sails-quest/job-management
next:
  text: Examples
  link: /sails-quest/examples
---

# Events

Quest emits events throughout the job lifecycle, allowing you to monitor, log, and alert on job execution.

## Available Events

### `quest:job:start`

Emitted when a job begins execution.

```javascript
sails.on('quest:job:start', (data) => {
  console.log(`Job ${data.name} started at ${data.timestamp}`)
  // data = {
  //   name: 'cleanup-sessions',
  //   inputs: { daysOld: 30 },
  //   timestamp: Date
  // }
})
```

### `quest:job:complete`

Emitted when a job completes successfully.

```javascript
sails.on('quest:job:complete', (data) => {
  console.log(`Job ${data.name} completed in ${data.duration}ms`)
  // data = {
  //   name: 'cleanup-sessions',
  //   inputs: { daysOld: 30 },
  //   duration: 1234,  // milliseconds
  //   timestamp: Date
  // }
})
```

### `quest:job:error`

Emitted when a job fails with an error.

```javascript
sails.on('quest:job:error', (data) => {
  console.error(`Job ${data.name} failed:`, data.error)
  // data = {
  //   name: 'cleanup-sessions',
  //   inputs: { daysOld: 30 },
  //   error: {
  //     message: 'Database connection failed',
  //     code: 'E_DB_CONNECTION',
  //     stack: '...'
  //   },
  //   duration: 500,
  //   timestamp: Date
  // }
})
```

## Setting Up Event Listeners

The best place to set up event listeners is in your `bootstrap.js`:

```javascript
// config/bootstrap.js
module.exports.bootstrap = async function () {
  // Listen to all Quest events
  sails.on('quest:job:start', handleJobStart)
  sails.on('quest:job:complete', handleJobComplete)
  sails.on('quest:job:error', handleJobError)

  async function handleJobStart(data) {
    // Log to database
    await JobLog.create({
      job: data.name,
      event: 'start',
      timestamp: data.timestamp,
      inputs: data.inputs
    })
  }

  async function handleJobComplete(data) {
    // Update metrics
    await Metric.create({
      job: data.name,
      duration: data.duration,
      status: 'success',
      timestamp: data.timestamp
    })
  }

  async function handleJobError(data) {
    // Send alert
    await sendAlert({
      type: 'job_failure',
      job: data.name,
      error: data.error.message
    })
  }
}
```

## Integration Examples

### Slack Notifications

```javascript
sails.on('quest:job:error', async (data) => {
  const webhookUrl = sails.config.custom.slackWebhook

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🚨 Job Failed: ${data.name}`,
      attachments: [
        {
          color: 'danger',
          fields: [
            {
              title: 'Error',
              value: data.error.message,
              short: false
            },
            {
              title: 'Duration',
              value: `${data.duration}ms`,
              short: true
            },
            {
              title: 'Time',
              value: data.timestamp.toISOString(),
              short: true
            }
          ]
        }
      ]
    })
  })
})
```

### Discord Alerts

```javascript
sails.on('quest:job:error', async (data) => {
  const webhookUrl = sails.config.custom.discordWebhook

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [
        {
          title: 'Job Failure',
          description: `Job \`${data.name}\` failed`,
          color: 15158332, // Red
          fields: [
            {
              name: 'Error Message',
              value: data.error.message
            },
            {
              name: 'Duration',
              value: `${data.duration}ms`,
              inline: true
            }
          ],
          timestamp: data.timestamp
        }
      ]
    })
  })
})
```

### Telegram Notifications

```javascript
sails.on('quest:job:error', async (data) => {
  const botToken = sails.config.custom.telegramBotToken
  const chatId = sails.config.custom.telegramChatId

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: `❌ *Job Failed*\n\nJob: \`${data.name}\`\nError: ${data.error.message}\nDuration: ${data.duration}ms`,
      parse_mode: 'Markdown'
    })
  })
})
```

### Email Alerts

```javascript
sails.on('quest:job:error', async (data) => {
  await sails.helpers.sendEmail.with({
    to: sails.config.custom.adminEmail,
    subject: `Job Failure: ${data.name}`,
    template: 'job-error',
    templateData: {
      jobName: data.name,
      error: data.error,
      duration: data.duration,
      timestamp: data.timestamp
    }
  })
})
```

### Performance Monitoring

```javascript
// Track job performance
sails.on('quest:job:complete', async (data) => {
  // Alert if job takes too long
  const threshold = sails.config.custom.jobThresholds[data.name]
  if (threshold && data.duration > threshold) {
    console.warn(
      `Job ${data.name} exceeded threshold: ${data.duration}ms > ${threshold}ms`
    )

    // Send performance alert
    await sendPerformanceAlert({
      job: data.name,
      duration: data.duration,
      threshold
    })
  }
})
```

### Custom Dashboard

```javascript
// Track job statistics for dashboard
const jobStats = {}

sails.on('quest:job:start', (data) => {
  if (!jobStats[data.name]) {
    jobStats[data.name] = {
      runs: 0,
      successes: 0,
      failures: 0,
      totalDuration: 0
    }
  }
  jobStats[data.name].runs++
})

sails.on('quest:job:complete', (data) => {
  jobStats[data.name].successes++
  jobStats[data.name].totalDuration += data.duration
})

sails.on('quest:job:error', (data) => {
  jobStats[data.name].failures++
})

// Expose stats via API
// api/controllers/admin/get-job-stats.js
module.exports = {
  fn: async function () {
    return {
      stats: jobStats,
      summary: {
        totalRuns: Object.values(jobStats).reduce((sum, s) => sum + s.runs, 0),
        totalSuccesses: Object.values(jobStats).reduce(
          (sum, s) => sum + s.successes,
          0
        ),
        totalFailures: Object.values(jobStats).reduce(
          (sum, s) => sum + s.failures,
          0
        )
      }
    }
  }
}
```

## Best Practices

1. **Keep event handlers async/lightweight** - Don't block the main thread
2. **Use try/catch in handlers** - Don't let handler errors affect jobs
3. **Consider using a queue** - For heavy processing in event handlers
4. **Implement circuit breakers** - For external service notifications
5. **Log but don't crash** - Event handler errors shouldn't stop jobs

```javascript
sails.on('quest:job:error', async (data) => {
  try {
    // Send notification
    await sendNotification(data)
  } catch (err) {
    // Log but don't throw
    sails.log.error('Failed to send job error notification:', err)
  }
})
```
