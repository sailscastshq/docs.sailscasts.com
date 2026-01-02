---
title: Job Management
description: Programmatically manage your scheduled jobs
prev:
  text: Job Inputs
  link: /sails-quest/job-inputs
next:
  text: Events
  link: /sails-quest/events
---

# Job Management

Quest provides a simple API to manage your scheduled jobs programmatically.

## Starting Jobs

Jobs start automatically by default when Sails lifts. You can also start them manually:

```javascript
// Start all jobs
await sails.quest.start()

// Start a specific job
await sails.quest.start('weekly-report')

// Start multiple jobs
await sails.quest.start(['cleanup', 'backup', 'reports'])
```

## Stopping Jobs

Stop jobs from running on their schedule:

```javascript
// Stop all jobs
await sails.quest.stop()

// Stop a specific job
await sails.quest.stop('heavy-processing')

// Stop multiple jobs
await sails.quest.stop(['job1', 'job2'])
```

## Running Jobs Manually

Execute a job immediately, regardless of its schedule:

```javascript
// Run with default inputs
await sails.quest.run('send-newsletter')

// Run with custom inputs
await sails.quest.run('cleanup-sessions', {
  daysOld: 7,
  verbose: true
})

// Run multiple jobs
await sails.quest.run(['job1', 'job2'])
```

### Running Any Sails Script

Quest can run ANY Sails script, not just ones with quest configuration:

```javascript
// This script has NO quest metadata - just a regular Sails script
// scripts/migrate-data.js
module.exports = {
  friendlyName: 'Migrate data',

  inputs: {
    dryRun: {
      type: 'boolean',
      defaultsTo: true
    }
  },

  fn: async function ({ dryRun }) {
    // Migration logic...
    return { migrated: 100, dryRun }
  }
}

// You can still run it with Quest!
await sails.quest.run('migrate-data', { dryRun: false })
```

This is perfect for:

- One-time administrative tasks
- Scripts triggered by user actions
- Testing scripts before scheduling them
- Running maintenance scripts from the console

## Pausing and Resuming

Temporarily pause a job without removing its schedule:

```javascript
// Pause a job (won't execute but keeps schedule)
sails.quest.pause('resource-intensive-job')

// Resume a paused job
sails.quest.resume('resource-intensive-job')

// Check if a job is paused
const job = sails.quest.get('resource-intensive-job')
if (job.paused) {
  console.log('Job is currently paused')
}
```

## Listing Jobs

Get information about registered jobs:

```javascript
// List all jobs
const jobs = sails.quest.list()
console.log(jobs)
// [{
//   name: 'cleanup',
//   interval: '1 hour',
//   paused: false,
//   withoutOverlapping: true
// }, ...]

// Get a specific job
const job = sails.quest.get('weekly-report')
console.log(job.friendlyName) // "Weekly Report Generator"
```

## Checking Job Status

```javascript
// Check if a job is currently running
if (sails.quest.isRunning('data-import')) {
  console.log('Import is in progress...')
}

// Get all running jobs
const runningJobs = sails.quest
  .list()
  .filter((job) => sails.quest.isRunning(job.name))
```

## Dynamic Job Management

Add or remove jobs at runtime:

```javascript
// Add a new job dynamically
await sails.quest.add({
  name: 'temporary-task',
  interval: '10 minutes',
  inputs: { mode: 'production' }
})

// Add multiple jobs
await sails.quest.add([
  { name: 'job1', interval: '5 minutes' },
  { name: 'job2', cron: '0 * * * *' }
])

// Remove a job
sails.quest.remove('temporary-task')

// Remove multiple jobs
sails.quest.remove(['job1', 'job2'])
```

## Auto-Start Configuration

Control whether jobs start automatically:

```javascript
// config/quest.js
module.exports.quest = {
  autoStart: false // Don't start jobs on lift
}

// Then start manually in bootstrap.js
// config/bootstrap.js
module.exports.bootstrap = async function () {
  // Do some setup...

  // Now start the jobs
  await sails.quest.start()
}
```

## Job Configuration in Config

Define jobs directly in your config:

```javascript
// config/quest.js
module.exports.quest = {
  jobs: [
    {
      name: 'health-check',
      interval: '5 minutes',
      inputs: {
        url: 'https://api.example.com/health'
      }
    },
    {
      name: 'daily-backup',
      cron: '0 3 * * *',
      withoutOverlapping: true
    }
  ]
}
```

## Practical Examples

### Maintenance Mode

```javascript
// Enter maintenance mode - pause all jobs
const jobs = sails.quest.list()
jobs.forEach((job) => sails.quest.pause(job.name))

// Exit maintenance mode - resume all jobs
jobs.forEach((job) => sails.quest.resume(job.name))
```

### Conditional Job Execution

```javascript
// In your script
module.exports = {
  friendlyName: 'Conditional job',

  quest: {
    interval: '1 hour'
  },

  fn: async function () {
    // Check conditions
    const settings = await Settings.findOne({ key: 'jobs_enabled' })
    if (!settings.value) {
      console.log('Jobs are disabled, skipping...')
      return { skipped: true }
    }

    // Proceed with job logic
    // ...
  }
}
```

### Rate Limiting

```javascript
// Only allow one instance to run
quest: {
  interval: '1 minute',
  withoutOverlapping: true  // Prevents concurrent runs
}
```
