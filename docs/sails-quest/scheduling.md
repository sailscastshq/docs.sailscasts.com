---
title: Scheduling
description: Learn different ways to schedule jobs with Quest
prev:
  text: Creating Jobs
  link: /sails-quest/creating-jobs
next:
  text: Job Inputs
  link: /sails-quest/job-inputs
---

# Scheduling

Quest supports multiple scheduling formats to fit your needs. You can use human-readable intervals, cron expressions, or specific dates.

## Human-Readable Intervals

The most intuitive way to schedule jobs:

```javascript
quest: {
  interval: '5 seconds'
  interval: '10 minutes'
  interval: '2 hours'
  interval: '7 days'
  interval: '1 week'
  interval: '3 months'
}
```

### Supported Units

- `second` / `seconds`
- `minute` / `minutes`
- `hour` / `hours`
- `day` / `days`
- `week` / `weeks`
- `month` / `months`
- `year` / `years`

## Cron Expressions

For precise scheduling, use standard cron expressions:

```javascript
quest: {
  cron: '0 2 * * *' // Daily at 2:00 AM
  cron: '*/5 * * * *' // Every 5 minutes
  cron: '0 9 * * MON' // Every Monday at 9:00 AM
  cron: '0 0 1 * *' // First day of every month at midnight
  cron: '0 */6 * * *' // Every 6 hours
}
```

### Cron Format

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 7) (0 or 7 is Sunday)
│ │ │ │ │
* * * * *
```

### Common Patterns

| Pattern        | Description                  |
| -------------- | ---------------------------- |
| `0 0 * * *`    | Daily at midnight            |
| `0 */2 * * *`  | Every 2 hours                |
| `0 9-17 * * *` | Every hour from 9 AM to 5 PM |
| `0 0 * * 1-5`  | Weekdays at midnight         |
| `0 0 * * 0`    | Weekly on Sunday             |
| `0 0 1,15 * *` | 1st and 15th of each month   |

### Cron Options

You can pass additional options to the cron parser:

```javascript
quest: {
  cron: '0 9 * * *',
  cronOptions: {
    startDate: new Date('2024-01-01'),  // Don't schedule before this date
    endDate: new Date('2024-12-31'),    // Don't schedule after this date
    currentDate: new Date()              // Reference date for calculations
  }
}
```

| Option        | Type | Description                     |
| ------------- | ---- | ------------------------------- |
| `startDate`   | Date | Don't return dates before this  |
| `endDate`     | Date | Don't return dates after this   |
| `currentDate` | Date | Reference date for calculations |

## One-Time Execution

### Timeout

Run a job once after a delay:

```javascript
quest: {
  timeout: '10 minutes' // Run once after 10 minutes
  timeout: '2 hours' // Run once after 2 hours
  timeout: '1 day' // Run once after 1 day
}
```

### Specific Date

Schedule a job for a specific date and time:

```javascript
quest: {
  date: new Date('2024-12-25 00:00:00') // Christmas midnight
  date: new Date(Date.now() + 86400000) // 24 hours from now
}
```

::: warning
You cannot combine `date` and `timeout`. Use one or the other for one-time execution.
:::

## Combining Schedules

You can combine different scheduling options:

```javascript
quest: {
  // Start after 1 hour, then run every 30 minutes
  timeout: '1 hour',
  interval: '30 minutes'
}
```

## Preventing Overlaps

Prevent a job from running if the previous execution is still in progress:

```javascript
quest: {
  interval: '5 minutes',
  withoutOverlapping: true  // Don't start if still running
}
```

## Timezone Support

Specify timezone for cron expressions:

```javascript
// In config/quest.js
module.exports.quest = {
  timezone: 'America/New_York'  // All cron jobs use this timezone
}

// Or per job
quest: {
  cron: '0 9 * * *',
  timezone: 'Europe/London'  // This job uses London time
}
```

## Manual Execution

Regardless of schedule, you can always run a job manually:

```javascript
// In your action or helper
await sails.quest.run('cleanup-sessions')

// With custom inputs
await sails.quest.run('send-email', {
  recipient: 'user@example.com',
  template: 'welcome'
})
```
