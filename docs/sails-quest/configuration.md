---
title: Configuration
description: Configure Sails Quest for your application
prev:
  text: Getting Started
  link: /sails-quest/getting-started
next:
  text: Creating Jobs
  link: /sails-quest/creating-jobs
---

# Configuration

Quest can be configured through the `config/quest.js` file in your Sails application.

## Basic Configuration

```javascript
// config/quest.js
module.exports.quest = {
  // Start jobs automatically when Sails lifts
  autoStart: true,

  // Path to Sails executable
  sailsPath: './node_modules/.bin/sails',

  // Environment to run jobs in
  environment: 'console',

  // Timezone for cron expressions
  timezone: 'UTC',

  // Prevent overlapping runs by default
  withoutOverlapping: true,

  // Jobs defined in config (optional)
  jobs: []
}
```

## Configuration Options

### autoStart

Controls whether jobs start automatically when Sails lifts.

```javascript
autoStart: true // Default: true
```

Set to `false` if you want to manually control when jobs start:

```javascript
// config/bootstrap.js
module.exports.bootstrap = async function () {
  // Do some setup...

  // Manually start jobs
  await sails.quest.start()
}
```

### environment

Specifies the environment jobs run in.

```javascript
environment: 'console' // Default: 'console'
```

The `console` environment is a minimal Sails lift that loads models and services but skips unnecessary hooks like views and sockets.

### sailsPath

Path to the Sails executable.

```javascript
sailsPath: './node_modules/.bin/sails' // Default
```

Usually you don't need to change this unless you have a custom setup.

### timezone

Timezone for cron expressions.

```javascript
timezone: 'UTC' // Default: 'UTC'
```

You can set it to your local timezone:

```javascript
timezone: 'America/New_York'
```

### withoutOverlapping

Global default for preventing concurrent job runs.

```javascript
withoutOverlapping: true // Default: true
```

This can be overridden per job in the job definition.

## Environment Configuration

Create a `console` environment configuration to optimize job execution:

```javascript
// config/env/console.js
module.exports = {
  // Disable unnecessary hooks for faster boot
  hooks: {
    views: false,
    sockets: false,
    pubsub: false,
    shipwright: false,
    dev: false,
    session: false
  },

  // Set appropriate log level
  log: {
    level: 'info'
  }
}
```

## Production Configuration

For production environments:

```javascript
// config/env/production.js
module.exports = {
  quest: {
    autoStart: true,
    withoutOverlapping: true
  }
}
```

::: info
The above are already set by default by Quest.
:::

## Development Configuration

For development, you might want to disable certain jobs:

```javascript
// config/env/development.js
module.exports = {
  quest: {
    autoStart: false, // Manual control during development
    withoutOverlapping: false // Allow testing concurrent runs
  }
}
```

## Defining Jobs in Configuration

You can define job schedules in your config while keeping your scripts pure and reusable. This approach separates scheduling concerns from business logic:

```javascript
// config/quest.js
module.exports.quest = {
  jobs: [
    {
      name: 'health-check', // MUST match scripts/health-check.js
      interval: '5 minutes',
      inputs: {
        url: process.env.HEALTH_CHECK_URL
      }
    },
    {
      name: 'daily-backup', // MUST match scripts/daily-backup.js
      cron: '0 3 * * *'
      // withoutOverlapping defaults to true, no need to specify
    },
    {
      name: 'process-queue', // MUST match scripts/process-queue.js
      interval: '30 seconds',
      withoutOverlapping: false // Only set to false when needed
    }
  ]
}
```

::: tip
**Important:** The `name` property must exactly match your script filename (without the .js extension).
:::

### Benefits of Config-Based Scheduling

1. **Keep scripts pure** - Your scripts remain standard Sails scripts without Quest-specific code
2. **Centralized scheduling** - All schedules in one place for easy overview
3. **Environment-specific schedules** - Different schedules for development vs production
4. **Reusable scripts** - Same script can be scheduled differently or run manually

### Example: Pure Script + Config Schedule

```javascript
// scripts/cleanup-sessions.js - Pure Sails script, no Quest config!
module.exports = {
  friendlyName: 'Cleanup sessions',
  description: 'Remove expired sessions',

  inputs: {
    daysOld: {
      type: 'number',
      defaultsTo: 30
    }
  },

  fn: async function ({ daysOld }) {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - daysOld)

    const deleted = await Session.destroy({
      expiresAt: { '<': cutoff }
    }).fetch()

    return { deleted: deleted.length }
  }
}

// config/quest.js - Schedule defined separately
module.exports.quest = {
  jobs: [
    {
      name: 'cleanup-sessions', // Matches scripts/cleanup-sessions.js
      interval: '1 hour',
      inputs: {
        daysOld: 7 // Override default from 30 to 7
      }
    }
  ]
}
```

This separation means:

- You can run `sails.quest.run('cleanup-sessions', { daysOld: 90 })` manually anytime
- The script has no dependency on Quest
- You can easily change the schedule without touching the script
- Different environments can have different schedules

## Configuration Merge Behavior

When a job is defined in both the script (via `quest` property) and `config/quest.js`, Quest merges them with the following priority:

- **Scheduling options** (interval, cron, timeout, date): Script takes priority
- **Inputs**: Config inputs serve as base, script quest inputs override

```javascript
// config/quest.js
module.exports.quest = {
  jobs: [
    {
      name: 'sync-data',
      interval: '1 hour', // Will be overridden by script
      inputs: {
        batchSize: 100, // Preserved as base
        verbose: false // Will be overridden by script
      }
    }
  ]
}
```

```javascript
// scripts/sync-data.js
module.exports = {
  friendlyName: 'Sync data',

  quest: {
    interval: '5 minutes', // Takes priority over config's '1 hour'
    inputs: {
      verbose: true // Overrides config's false
    }
  },

  inputs: {
    batchSize: {
      type: 'number',
      defaultsTo: 50
    },
    verbose: {
      type: 'boolean',
      defaultsTo: false
    }
  },

  fn: async function (inputs) {
    // ...
  }
}
```

**Result:**

- `interval`: `'5 minutes'` (from script)
- `inputs.batchSize`: `100` (from config, script quest didn't specify)
- `inputs.verbose`: `true` (from script quest, overrides config)

This allows you to:

- Set base configuration in `config/quest.js` for environment-specific settings
- Override scheduling in the script itself when the job has a "canonical" schedule
- Keep config inputs as defaults that scripts can selectively override

## Environment Variables

Quest respects standard Node.js environment variables:

```bash
# Run with custom environment
NODE_ENV=production npm start

# The jobs will run with NODE_ENV=console by default
# unless you change the environment setting
```

## Logging

Quest uses Sails' built-in logging system. Job activity is logged at different levels:

- `info` - Job starts and completions
- `verbose` - Detailed scheduling information
- `warn` - Skipped jobs (already running or paused)
- `error` - Job failures and errors

To see verbose logs during development:

```javascript
// config/env/development.js
module.exports = {
  log: {
    level: 'verbose'
  }
}
```
