---
title: Job Inputs
description: Pass dynamic inputs to your Quest jobs
prev:
  text: Scheduling
  link: /sails-quest/scheduling
next:
  text: Job Management
  link: /sails-quest/job-management
---

# Job Inputs

Quest jobs can accept inputs, allowing you to create flexible, reusable jobs that adapt to different scenarios.

## Defining Inputs

Define inputs in your job using the standard Sails script format:

```javascript
// scripts/cleanup-data.js
module.exports = {
  friendlyName: 'Cleanup old data',

  quest: {
    interval: '1 day'
  },

  inputs: {
    daysOld: {
      type: 'number',
      required: true,
      description: 'Delete records older than this many days'
    },

    dryRun: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Preview what would be deleted without actually deleting'
    },

    model: {
      type: 'string',
      isIn: ['orders', 'sessions', 'logs'],
      defaultsTo: 'logs',
      description: 'Which type of data to clean up'
    }
  },

  fn: async function (inputs) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - inputs.daysOld)

    const Model = sails.models[inputs.model]

    if (inputs.dryRun) {
      const count = await Model.count({
        createdAt: { '<': cutoffDate }
      })
      sails.log.info(`Would delete ${count} ${inputs.model}`)
      return { wouldDelete: count, dryRun: true }
    }

    const deleted = await Model.destroy({
      createdAt: { '<': cutoffDate }
    }).fetch()

    return { deleted: deleted.length, model: inputs.model }
  }
}
```

## Input Types

Quest supports all Sails input types:

```javascript
inputs: {
  // String input
  email: {
    type: 'string',
    isEmail: true,
    required: true
  },

  // Number input
  limit: {
    type: 'number',
    min: 1,
    max: 100,
    defaultsTo: 10
  },

  // Boolean input
  verbose: {
    type: 'boolean',
    defaultsTo: false
  },

  // JSON input
  config: {
    type: 'json',
    defaultsTo: {}
  },

  // Ref (any type)
  data: {
    type: 'ref',
    description: 'Arbitrary data'
  }
}
```

## Default Values

Inputs can have default values that are used when not specified:

```javascript
// scripts/send-notifications.js
module.exports = {
  friendlyName: 'Send notifications',

  quest: {
    interval: '1 hour'
  },

  inputs: {
    channel: {
      type: 'string',
      isIn: ['email', 'sms', 'push'],
      defaultsTo: 'email'
    },

    priority: {
      type: 'string',
      isIn: ['high', 'normal', 'low'],
      defaultsTo: 'normal'
    },

    batchSize: {
      type: 'number',
      defaultsTo: 50
    }
  },

  fn: async function (inputs) {
    const notifications = await Notification.find({
      status: 'pending',
      channel: inputs.channel,
      priority: inputs.priority
    }).limit(inputs.batchSize)

    // Send notifications...

    return { sent: notifications.length }
  }
}
```

## Configuring Inputs in Config

You can set input values in your Quest configuration:

```javascript
// config/quest.js
module.exports.quest = {
  jobs: [
    {
      name: 'cleanup-data',
      interval: '1 day',
      inputs: {
        daysOld: 90,
        model: 'logs',
        dryRun: false
      }
    },
    {
      name: 'cleanup-data',
      interval: '1 week',
      inputs: {
        daysOld: 30,
        model: 'sessions',
        dryRun: false
      }
    }
  ]
}
```

## Input Priority

Quest merges inputs from four sources, with later sources taking priority over earlier ones:

1. **Config inputs** (lowest) - `inputs` in `config/quest.js`
2. **Script quest inputs** - `inputs` in script's `quest` property
3. **Script input defaults** - `defaultsTo` values from script's `inputs` definition
4. **Runtime inputs** (highest) - Passed to `sails.quest.run()`

```javascript
// config/quest.js
module.exports.quest = {
  jobs: [
    {
      name: 'cleanup-data',
      interval: '1 day',
      inputs: {
        daysOld: 90, // 1. Config inputs (base)
        model: 'logs',
        verbose: false,
        format: 'json'
      }
    }
  ]
}
```

```javascript
// scripts/cleanup-data.js
module.exports = {
  quest: {
    interval: '5 minutes', // Overrides config scheduling
    inputs: {
      model: 'sessions' // 2. Script quest inputs (overrides config)
    }
  },

  inputs: {
    daysOld: {
      type: 'number',
      defaultsTo: 30 // 3. Script defaults (overrides quest inputs)
    },
    verbose: {
      type: 'boolean',
      defaultsTo: true // 3. Script defaults (overrides config)
    },
    format: {
      type: 'string',
      defaultsTo: 'csv' // 3. Script defaults (overrides config)
    }
  },

  fn: async function (inputs) {
    // ...
  }
}
```

```javascript
// Running the job
await sails.quest.run('cleanup-data', {
  daysOld: 7 // 4. Runtime inputs (highest priority)
})

// Final merged inputs:
// {
//   daysOld: 7,          <- runtime (overrides script default 30)
//   model: 'sessions',   <- script quest.inputs (overrides config 'logs')
//   verbose: true,       <- script defaults (overrides config false)
//   format: 'csv'        <- script defaults (overrides config 'json')
// }
```

This priority system allows you to:

- Set environment-specific base values in `config/quest.js`
- Override config values in script's `quest.inputs` for job-specific settings
- Define sensible defaults in script's `inputs` definition
- Pass custom values at runtime for one-off executions

## Running Jobs with Custom Inputs

When running jobs manually, you can override inputs:

```javascript
// Run with custom inputs
await sails.quest.run('cleanup-data', {
  daysOld: 7,
  model: 'orders',
  dryRun: true
})

// Run with default inputs
await sails.quest.run('cleanup-data')
```

## Environment-Based Inputs

Use environment variables for sensitive inputs:

```javascript
// scripts/backup-to-s3.js
module.exports = {
  friendlyName: 'Backup to S3',

  quest: {
    cron: '0 3 * * *' // Daily at 3 AM
  },

  inputs: {
    bucket: {
      type: 'string',
      defaultsTo: process.env.S3_BACKUP_BUCKET || 'my-backups'
    },

    region: {
      type: 'string',
      defaultsTo: process.env.AWS_REGION || 'us-east-1'
    },

    encrypt: {
      type: 'boolean',
      defaultsTo: process.env.NODE_ENV === 'production'
    }
  },

  fn: async function (inputs) {
    // Use AWS SDK with inputs
    const s3 = new AWS.S3({
      region: inputs.region
    })

    // Perform backup...

    return { bucket: inputs.bucket, encrypted: inputs.encrypt }
  }
}
```

## Validation

Inputs are automatically validated before the job runs:

```javascript
// scripts/process-payments.js
module.exports = {
  friendlyName: 'Process payments',

  quest: {
    interval: '10 minutes'
  },

  inputs: {
    minAmount: {
      type: 'number',
      min: 0,
      required: true
    },

    maxAmount: {
      type: 'number',
      custom: function (value) {
        // Custom validation
        if (value <= this.minAmount) {
          return 'maxAmount must be greater than minAmount'
        }
        return true
      }
    },

    currency: {
      type: 'string',
      isIn: ['USD', 'EUR', 'GBP'],
      required: true
    }
  },

  fn: async function (inputs) {
    const payments = await Payment.find({
      amount: {
        '>=': inputs.minAmount,
        '<=': inputs.maxAmount
      },
      currency: inputs.currency,
      status: 'pending'
    })

    // Process payments...

    return { processed: payments.length }
  }
}
```

## Dynamic Inputs Example

Create flexible jobs that adapt based on inputs:

```javascript
// scripts/flexible-reporter.js
module.exports = {
  friendlyName: 'Flexible reporter',

  quest: {
    interval: '1 hour'
  },

  inputs: {
    reportType: {
      type: 'string',
      isIn: ['sales', 'users', 'inventory'],
      required: true
    },

    timeframe: {
      type: 'string',
      isIn: ['hour', 'day', 'week', 'month'],
      defaultsTo: 'day'
    },

    format: {
      type: 'string',
      isIn: ['json', 'csv', 'pdf'],
      defaultsTo: 'json'
    },

    recipients: {
      type: 'json',
      defaultsTo: [],
      description: 'Email addresses to send report to'
    }
  },

  fn: async function (inputs) {
    // Generate report based on type
    let data
    switch (inputs.reportType) {
      case 'sales':
        data = await generateSalesReport(inputs.timeframe)
        break
      case 'users':
        data = await generateUserReport(inputs.timeframe)
        break
      case 'inventory':
        data = await generateInventoryReport(inputs.timeframe)
        break
    }

    // Format report
    let report
    switch (inputs.format) {
      case 'csv':
        report = await formatAsCSV(data)
        break
      case 'pdf':
        report = await formatAsPDF(data)
        break
      default:
        report = data
    }

    // Send to recipients if specified
    if (inputs.recipients.length > 0) {
      for (const email of inputs.recipients) {
        await sails.helpers.sendEmail.with({
          to: email,
          subject: `${inputs.reportType} Report`,
          attachments: [report]
        })
      }
    }

    return {
      type: inputs.reportType,
      format: inputs.format,
      sentTo: inputs.recipients.length
    }
  }
}
```

## Best Practices

1. **Use descriptive names** - Make input purposes clear
2. **Provide defaults** - Make jobs work out-of-the-box
3. **Validate thoroughly** - Use type checking and custom validation
4. **Document inputs** - Add descriptions for clarity
5. **Use environment variables** - For sensitive configuration
6. **Keep inputs simple** - Complex logic belongs in the fn, not inputs
