---
title: Getting Started
description: Learn how to install, configure, and run your first scheduled job with Sails Quest in a Sails.js application. This guide covers prerequisites, installation steps, creating a simple job script, and customizing Quest's configuration for optimal performance.
prev:
  text: How Quest Works
  link: /sails-quest/how-it-works
next:
  text: Configuration
  link: /sails-quest/configuration
---

# Getting Started

This guide will walk you through installing and configuring Sails Quest in your Sails.js application.

## Prerequisites

- A Sails.js application (v1.x or higher)
- Node.js 12+

## Installation

Install Sails Quest using npm:

```bash
npm install sails-hook-quest
```

That's it! Sails will automatically load the hook when your app lifts.

## Your First Scheduled Job

### 1. Create a Script

Create a new script in your `scripts/` directory:

```javascript
// scripts/hello-world.js
module.exports = {
  friendlyName: 'Hello World',
  description: 'A simple job that logs a greeting',

  // Add Quest scheduling configuration
  quest: {
    interval: '30 seconds' // Run every 30 seconds
  },

  fn: async function () {
    sails.log('Hello from Quest! The time is:', new Date().toISOString())

    // You have full access to Sails here
    // const users = await User.count()
    // console.log(`Total users: ${users}`)

    return { success: true }
  }
}
```

### 2. Lift Your App

```bash
sails lift
```

You should see your job start running every 30 seconds:

```
info: Initializing Quest job scheduler
info: Quest started with 1 scheduled job(s)
...
Hello from Quest! The time is: 2024-01-01T10:00:00.000Z
```

## Configuration

Create a `config/quest.js` file to customize Quest:

```javascript
// config/quest.js
module.exports.quest = {
  // Auto-start jobs when Sails lifts
  autoStart: true,

  // Timezone for cron expressions
  timezone: 'America/New_York',

  // Run jobs in console environment for better performance
  environment: 'console',

  // Prevent jobs from overlapping by default
  withoutOverlapping: true
}
```

### Console Environment

For better performance, create a minimal environment for jobs:

```javascript
// config/env/console.js
module.exports = {
  hooks: {
    // Disable unnecessary hooks for jobs
    views: false,
    sockets: false,
    pubsub: false,
    grunt: false
  }
}
```

## Next Steps

- Learn about [scheduling options](/sails-quest/scheduling)
- Explore [job management](/sails-quest/job-management)
- Set up [monitoring with events](/sails-quest/events)
- See [real-world examples](/sails-quest/examples)
